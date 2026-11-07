"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import type { FlatScene as FlatSceneData } from "@/data/tour";

type Props = {
  scene: FlatSceneData;
  calibrate: boolean;
  onNavigate: (target: string) => void;
  onPick: (text: string) => void;
};

type Size = { w: number; h: number };

/**
 * Imagen fija (exterior) con hotspots. La imagen se ajusta como "cover" y los
 * hotspots se calculan sobre la imagen real, asi siempre quedan sobre la torre
 * aunque cambie el tamano de la pantalla.
 */
export default function FlatScene({ scene, calibrate, onNavigate, onPick }: Props) {
  const boxRef = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState<Size>({ w: 0, h: 0 });
  const [natural, setNatural] = useState<Size | null>(null);

  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      setBox({ w: entry.contentRect.width, h: entry.contentRect.height });
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Donde queda realmente la imagen dentro del recuadro (object-fit: cover)
  let cover: { w: number; h: number; dx: number; dy: number } | null = null;
  if (natural && box.w > 0 && box.h > 0) {
    const scale = Math.max(box.w / natural.w, box.h / natural.h);
    const w = natural.w * scale;
    const h = natural.h * scale;
    cover = { w, h, dx: (box.w - w) / 2, dy: (box.h - h) / 2 };
  }

  const clamp = (value: number, max: number) => Math.min(Math.max(value, 28), max - 28);

  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    if (!calibrate || !cover) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left - cover.dx) / cover.w) * 100;
    const y = ((event.clientY - rect.top - cover.dy) / cover.h) * 100;
    onPick(`x: ${x.toFixed(1)}, y: ${y.toFixed(1)}`);
  };

  return (
    <div
      ref={boxRef}
      onClick={handleClick}
      className={`absolute inset-0 overflow-hidden bg-black ${calibrate ? "cursor-crosshair" : ""}`}
    >
      <Image
        src={scene.src}
        alt={`${scene.title}: vista exterior`}
        fill
        priority
        unoptimized
        sizes="100vw"
        onLoad={(event) =>
          setNatural({
            w: event.currentTarget.naturalWidth,
            h: event.currentTarget.naturalHeight,
          })
        }
        className="object-cover"
      />
      <span aria-hidden className="absolute inset-0 bg-linear-to-t from-black/45 via-transparent to-black/30" />

      {cover &&
        scene.hotspots.map((spot, index) => (
          <div
            key={`${spot.target}-${index}`}
            className="tour-fhs"
            data-side={spot.side}
            style={{
              left: clamp(cover.dx + (spot.x / 100) * cover.w, box.w),
              top: clamp(cover.dy + (spot.y / 100) * cover.h, box.h),
              animationDelay: `${0.5 + index * 0.18}s`,
            }}
          >
            <button
              type="button"
              aria-label={spot.label}
              onClick={(event) => {
                event.stopPropagation();
                onNavigate(spot.target);
              }}
              className="tour-dot-btn"
            >
              <span className="tour-arrow" data-dir={spot.arrow ?? "up"}>
                <svg viewBox="0 0 48 48" aria-hidden="true">
                  <path d="M24 5 41 25H30v18H18V25H7z" />
                </svg>
              </span>
            </button>
            <span aria-hidden className="tour-line" />
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onNavigate(spot.target);
              }}
              className="tour-label"
            >
              {spot.kicker && <span className="tour-tag-kicker">{spot.kicker}</span>}
              <span className="tour-tag-title">{spot.label}</span>
            </button>
          </div>
        ))}
    </div>
  );
}