"use client";

import Image from "next/image";
import { AnimatePresence } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  firstSceneId,
  sceneById,
  tourIntro,
  tourScenes,
  type FlatScene as FlatSceneData,
  type PanoScene,
} from "@/data/tour";
import FlatScene from "@/components/tour/FlatScene";
import PanoViewer, { type PanoApi } from "@/components/tour/PanoViewer";
import TourHud from "@/components/tour/TourHud";
import TourPoster from "@/components/tour/TourPoster";
import "./tour.css";

const FLAT = tourScenes.find((scene): scene is FlatSceneData => scene.kind === "flat");

/**
 * Showroom virtual: portada con "Cargando realidad virtual", exterior con
 * hotspots y recorrido 360 (Photo Sphere Viewer) entre escenas.
 */
export default function TourShowroom() {
  const deviceRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const zoomApi = useRef<PanoApi | null>(null);
  const nativeFs = useRef(false);

  const [ready, setReady] = useState(false);
  const [started, setStarted] = useState(false);
  const [sceneId, setSceneId] = useState(firstSceneId);
  const [panoId, setPanoId] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [panoLoading, setPanoLoading] = useState(false);
  const [errorSrc, setErrorSrc] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [calibrate, setCalibrate] = useState(false);
  const [pick, setPick] = useState<string | null>(null);

  const scene = sceneById[sceneId];
  const panoScene = panoId ? (sceneById[panoId] as PanoScene) : null;

  /* ---- 1. Carga inicial: libreria 360 + imagen del exterior ---- */
  useEffect(() => {
    let alive = true;

    const minimum = new Promise<void>((resolve) => window.setTimeout(resolve, 1600));
    const library = Promise.all([
      import("@photo-sphere-viewer/core"),
      import("@photo-sphere-viewer/markers-plugin"),
    ]).catch(() => undefined);
    const poster = new Promise<void>((resolve) => {
      const image = new window.Image();
      image.onload = () => resolve();
      image.onerror = () => resolve();
      image.src = tourIntro.poster;
    });

    Promise.all([minimum, library, poster]).then(() => {
      if (alive) setReady(true);
    });

    return () => {
      alive = false;
    };
  }, []);

  /* ---- 2. Modo calibrar: /tour-360#calibrar ---- */
  useEffect(() => {
    const check = () => setCalibrate(window.location.hash === "#calibrar");
    const timer = window.setTimeout(check, 0);
    window.addEventListener("hashchange", check);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("hashchange", check);
    };
  }, []);

  /* ---- 3. Pantalla completa (nativa si existe, si no ocupa toda la ventana) ---- */
  const collapse = useCallback(() => {
    setExpanded(false);
    if (nativeFs.current && document.fullscreenElement) {
      void document.exitFullscreen().catch(() => undefined);
    }
    nativeFs.current = false;
  }, []);

  const toggleExpand = useCallback(() => {
    if (expanded) {
      collapse();
      return;
    }
    setExpanded(true);
    const stage = stageRef.current;
    if (stage?.requestFullscreen) {
      stage
        .requestFullscreen()
        .then(() => {
          nativeFs.current = true;
        })
        .catch(() => undefined);
    }
  }, [expanded, collapse]);

  useEffect(() => {
    if (!expanded) return;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") collapse();
    };
    const onFullscreen = () => {
      if (nativeFs.current && !document.fullscreenElement) {
        nativeFs.current = false;
        setExpanded(false);
      }
    };
    window.addEventListener("keydown", onKey);
    document.addEventListener("fullscreenchange", onFullscreen);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("fullscreenchange", onFullscreen);
    };
  }, [expanded, collapse]);

  /* ---- 4. Navegacion entre escenas ---- */
  const go = useCallback((id: string) => {
    const target = sceneById[id];
    if (!target) return;
    setMenuOpen(false);
    setErrorSrc(null);
    setPick(null);
    if (target.kind === "pano") setPanoId(id);
    setSceneId(id);
  }, []);

  const start = useCallback(
    (id?: string) => {
      setStarted(true);
      if (id) go(id);
    },
    [go],
  );

  const openFromCard = (id: string) => {
    start(id);
    deviceRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const copyPick = (text: string) => {
    setPick(text);
    void navigator.clipboard?.writeText(text).catch(() => undefined);
  };

  const showPano = started && scene.kind === "pano";

  return (
    <div>
      {/* ============================ Dispositivo ============================ */}
      <div ref={deviceRef} className="tour-wrap relative">
        <span aria-hidden className="tour-glow" />
        <div className="tour-device">
          <div className="tour-screen">
            <div
              ref={stageRef}
              data-expanded={expanded}
              className="tour-stage force-dark"
            >
              {/* Capa 1: exterior con hotspots */}
              {started && FLAT && (
                <div
                  className={`absolute inset-0 transition-opacity duration-700 ${
                    scene.kind === "flat" ? "opacity-100" : "pointer-events-none opacity-0"
                  }`}
                  aria-hidden={scene.kind !== "flat"}
                >
                  <FlatScene
                    scene={FLAT}
                    calibrate={calibrate && scene.kind === "flat"}
                    onNavigate={go}
                    onPick={copyPick}
                  />
                </div>
              )}

              {/* Capa 2: recorrido 360 */}
              {started && panoScene && (
                <div
                  className={`absolute inset-0 transition-opacity duration-700 ${
                    showPano ? "opacity-100" : "pointer-events-none opacity-0"
                  }`}
                  aria-hidden={!showPano}
                >
                  <PanoViewer
                    scene={panoScene}
                    active={showPano}
                    calibrate={calibrate && showPano}
                    apiRef={zoomApi}
                    onNavigate={go}
                    onLoading={setPanoLoading}
                    onError={setErrorSrc}
                    onPick={copyPick}
                  />
                </div>
              )}

              {/* Cargando escena / error */}
              {started && showPano && (panoLoading || errorSrc) && (
                <div className="tour-overlay" role="status" aria-live="polite">
                  {errorSrc ? (
                    <p className="tour-kicker text-center">
                      No se pudo cargar la escena
                      <span className="mt-2 block text-white/60 normal-case tracking-normal">
                        Revisa que exista public{errorSrc} y que sea una foto 360 (2:1)
                      </span>
                    </p>
                  ) : (
                    <p className="tour-kicker">
                      Cargando realidad virtual
                      <span className="tour-dots" aria-hidden />
                    </p>
                  )}
                </div>
              )}

              {/* Interfaz */}
              {started && (
                <TourHud
                  scene={scene}
                  expanded={expanded}
                  menuOpen={menuOpen}
                  zoomApi={zoomApi}
                  onGo={go}
                  onMenu={setMenuOpen}
                  onToggleExpand={toggleExpand}
                />
              )}

              {/* Panel de calibracion */}
              {started && calibrate && (
                <div className="tour-calibrate">
                  <b>Modo calibrar</b> · escena: {scene.id}
                  <br />
                  Haz clic donde quieres el hotspot.
                  {pick && (
                    <>
                      <br />
                      <code>{pick}</code> (copiado)
                    </>
                  )}
                </div>
              )}

              {/* Portada */}
              <AnimatePresence>
                {!started && <TourPoster ready={ready} onStart={() => start()} />}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* =========================== Debajo del visor =========================== */}
      <div className="mt-10 text-center">
        <p className="font-body text-xl font-medium tracking-tight text-white sm:text-2xl">
          ¿Prefieres verlo en grande?
        </p>
        <button
          type="button"
          onClick={() => {
            if (!started) start();
            toggleExpand();
          }}
          className="tour-btn tour-btn--accent mx-auto mt-5"
        >
          Abrir en pantalla completa
        </button>
      </div>

      <div className="mt-16 pb-20 md:mt-24">
        <p className="tour-kicker mb-6">
          <span className="h-px w-8 bg-gold-400" />
          Lo que trae cada recorrido
        </p>
        <ul className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {tourScenes.map((item, index) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => openFromCard(item.id)}
                className="tour-card group"
              >
                <Image
                  src={item.src}
                  alt=""
                  fill
                  sizes="(min-width: 768px) 25vw, 50vw"
                  className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110"
                />
                <span aria-hidden className="absolute inset-0 bg-linear-to-t from-black/85 via-black/20 to-transparent" />
                <span className="absolute inset-x-0 bottom-0 p-3 text-left">
                  <span className="block font-mono text-[10px] uppercase tracking-[0.2em] text-gold-400">
                    {String(index + 1).padStart(2, "0")} · {item.zone}
                  </span>
                  <span className="mt-1 block font-body text-base font-medium leading-tight tracking-tight text-white">
                    {item.title}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}