"use client";

import { useEffect, useRef, type RefObject } from "react";
import type { Viewer } from "@photo-sphere-viewer/core";
import type { MarkerConfig, MarkersPlugin } from "@photo-sphere-viewer/markers-plugin";
import "@photo-sphere-viewer/core/index.css";
import "@photo-sphere-viewer/markers-plugin/index.css";
import type { Hotspot, PanoScene } from "@/data/tour";

export type PanoApi = { zoomIn: () => void; zoomOut: () => void };

type Props = {
  scene: PanoScene;
  /** true cuando esta capa es la que se esta viendo */
  active: boolean;
  calibrate: boolean;
  apiRef: RefObject<PanoApi | null>;
  onNavigate: (target: string) => void;
  onLoading: (loading: boolean) => void;
  onError: (src: string | null) => void;
  onPick: (text: string) => void;
};

const ESCAPES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};
const escapeHtml = (value: string) => value.replace(/[&<>"']/g, (c) => ESCAPES[c]);

/** Flecha del hotspot (la misma que se usa sobre la imagen del exterior) */
const ARROW = `<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M24 5 41 25H30v18H18V25H7z"/></svg>`;

/** Convierte un hotspot de nuestros datos en un marcador de Photo Sphere Viewer */
function toMarker(scene: PanoScene, spot: Hotspot, index: number): MarkerConfig {
  const kicker = spot.kicker
    ? `<span class="tour-tag-kicker">${escapeHtml(spot.kicker)}</span>`
    : "";

  return {
    id: `${scene.id}:${index}`,
    position: { yaw: `${spot.yaw}deg`, pitch: `${spot.pitch}deg` },
    html:
      `<span class="tour-hs"><span class="tour-arrow" data-dir="${spot.arrow ?? "up"}">${ARROW}</span>` +
      `<span class="tour-tag">${kicker}<span class="tour-tag-title">${escapeHtml(spot.label)}</span></span></span>`,
    size: { width: 44, height: 44 },
    anchor: "center center",
    className: "tour-marker",
    data: { target: spot.target },
  };
}

const radToDeg = (value: number) => {
  const deg = (value * 180) / Math.PI;
  return Math.round(((((deg + 180) % 360) + 360) % 360) - 180);
};

/** Visor 360 (Photo Sphere Viewer) con hotspots que cambian de escena. */
export default function PanoViewer({
  scene,
  active,
  calibrate,
  apiRef,
  onNavigate,
  onLoading,
  onError,
  onPick,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<Viewer | null>(null);
  const markersRef = useRef<MarkersPlugin | null>(null);
  const loadedRef = useRef<string | null>(null);
  const tokenRef = useRef(0);
  const syncRef = useRef<() => void>(() => {});

  // Siempre la ultima version de las props, sin recrear el visor
  const live = useRef({ scene, active, calibrate, onNavigate, onLoading, onError, onPick });

  useEffect(() => {
    live.current = { scene, active, calibrate, onNavigate, onLoading, onError, onPick };
    syncRef.current();
  });

  useEffect(() => {
    let disposed = false;
    let viewer: Viewer | null = null;

    /** Carga en el visor la escena que pide la pagina (si cambio) */
    const sync = () => {
      const current = viewerRef.current;
      const markers = markersRef.current;
      const { scene: target, active: visible } = live.current;
      if (!current || !markers || loadedRef.current === target.id) return;

      loadedRef.current = target.id;
      const token = ++tokenRef.current;
      markers.clearMarkers();
      live.current.onError(null);
      live.current.onLoading(true);

      current
        .setPanorama(target.src, {
          position: {
            yaw: `${target.start.yaw}deg`,
            pitch: `${target.start.pitch}deg`,
          },
          zoom: target.start.zoom ?? 35,
          transition: visible ? { speed: 1400, rotation: true, effect: "fade" } : false,
          showLoader: false,
        })
        .then(() => {
          if (token !== tokenRef.current) return;
          markers.setMarkers(target.hotspots.map((spot, i) => toMarker(target, spot, i)));
          live.current.onLoading(false);
        })
        .catch(() => {
          if (token !== tokenRef.current) return;
          live.current.onLoading(false);
          live.current.onError(target.src);
        });
    };
    syncRef.current = sync;

    const init = async () => {
      const [core, markersModule] = await Promise.all([
        import("@photo-sphere-viewer/core"),
        import("@photo-sphere-viewer/markers-plugin"),
      ]);
      const container = containerRef.current;
      if (disposed || !container) return;

      const first = live.current.scene;
      viewer = new core.Viewer({
        container,
        panorama: first.src,
        navbar: false,
        loadingTxt: "",
        mousewheel: false,
        touchmoveTwoFingers: false,
        moveInertia: true,
        minFov: 35,
        maxFov: 100,
        defaultYaw: `${first.start.yaw}deg`,
        defaultPitch: `${first.start.pitch}deg`,
        defaultZoomLvl: first.start.zoom ?? 35,
        plugins: [[markersModule.MarkersPlugin, { markers: [] }]],
      });
      viewerRef.current = viewer;

      const markers = viewer.getPlugin<MarkersPlugin>(markersModule.MarkersPlugin);
      markersRef.current = markers;
      loadedRef.current = first.id;
      live.current.onLoading(true);

      viewer.addEventListener(
        "ready",
        () => {
          markers.setMarkers(first.hotspots.map((spot, i) => toMarker(first, spot, i)));
          live.current.onLoading(false);
          sync();
        },
        { once: true },
      );

      viewer.addEventListener("panorama-error", () => {
        live.current.onLoading(false);
        live.current.onError(live.current.scene.src);
      });

      markers.addEventListener("select-marker", ({ marker }) => {
        const target = (marker.data as { target?: string } | undefined)?.target;
        if (target) live.current.onNavigate(target);
      });

      // Modo calibrar: clic en la escena = coordenadas para site/tour.ts
      viewer.addEventListener("click", ({ data }) => {
        if (!live.current.calibrate) return;
        const text = `yaw: ${radToDeg(data.yaw)}, pitch: ${radToDeg(data.pitch)}`;
        live.current.onPick(text);
      });

      const instance = viewer;
      apiRef.current = {
        zoomIn: () => instance.zoomIn(18),
        zoomOut: () => instance.zoomOut(18),
      };
    };

    void init();

    return () => {
      disposed = true;
      syncRef.current = () => {};
      apiRef.current = null;
      viewer?.destroy();
      viewerRef.current = null;
      markersRef.current = null;
      loadedRef.current = null;
    };
  }, [apiRef]);

  return <div ref={containerRef} className="tour-pano absolute inset-0" />;
}