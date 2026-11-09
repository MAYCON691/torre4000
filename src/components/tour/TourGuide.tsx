"use client";

import { motion } from "motion/react";
import { tourScenes } from "@/data/tour";

/* ==========================================================================
   Torre guia: una torre semitransparente al costado derecho del visor.
   Un punto rojo marca en que recorrido estas:
   - al cambiar de recorrido sube o baja a ese nivel
   - dentro del mismo recorrido solo se mueve de izquierda a derecha
   Para mover un nivel cambia su "y" (0 = punta, 100 = suelo).
   ========================================================================== */
const LEVELS = [
  { zone: "Mirador 1", y: 15 },
  { zone: "Mirador 2", y: 37 },
  { zone: "Restaurante", y: 58 },
  { zone: "Planta baja", y: 80 },
  { zone: "Exterior", y: 96 },
];

type Props = {
  sceneId: string;
  onGo: (id: string) => void;
};

/** Ancho de la torre a una altura y (en un lienzo de 52 de ancho) */
function half(y: number) {
  return 4 + Math.max(0, y - 10) * 0.19;
}

export default function TourGuide({ sceneId, onGo }: Props) {
  const scene = tourScenes.find((item) => item.id === sceneId) ?? tourScenes[0];
  const level = LEVELS.find((item) => item.zone === scene.zone) ?? LEVELS[LEVELS.length - 1];

  // Dentro de un mismo nivel el punto solo se mueve de izquierda a derecha
  const sameZone = tourScenes.filter((item) => item.zone === scene.zone);
  const pos = sameZone.length > 1 ? sameZone.indexOf(scene) / (sameZone.length - 1) : 0.5;
  const y = level.y;
  const reach = half(level.y) + 3; // mitad del ancho de la plataforma
  const x = ((26 + (pos - 0.5) * 2 * reach) / 52) * 100;

  return (
    <nav
      aria-label="Dónde estás en la torre"
      className="pointer-events-none absolute bottom-20 right-2 top-[84px] z-20 w-[150px] sm:right-5 sm:top-[96px] sm:w-[190px]"
    >
      {/* ---------------- Torre semitransparente ---------------- */}
      <svg
        aria-hidden
        viewBox="0 0 52 100"
        preserveAspectRatio="none"
        className="absolute right-0 top-0 h-full w-[46px] overflow-visible sm:w-[54px]"
        style={{ filter: "drop-shadow(0 0 4px rgba(0,0,0,0.7))" }}
      >
        {/* Aguja */}
        <line x1="26" y1="0" x2="26" y2="12" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
        {/* Cuerpo */}
        <path
          d={`M${26 - half(12)} 12 L${26 + half(12)} 12 L${26 + half(96)} 96 L${26 - half(96)} 96 Z`}
          fill="rgba(255,255,255,0.08)"
          stroke="rgba(255,255,255,0.55)"
          strokeWidth="1.2"
          vectorEffect="non-scaling-stroke"
        />
        {/* Cruces del armazon */}
        <path
          d={`M${26 - half(12)} 12 L${26 + half(37)} 37 M${26 + half(12)} 12 L${26 - half(37)} 37 M${26 - half(37)} 37 L${26 + half(58)} 58 M${26 + half(37)} 37 L${26 - half(58)} 58 M${26 - half(58)} 58 L${26 + half(80)} 80 M${26 + half(58)} 58 L${26 - half(80)} 80`}
          fill="none"
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />
        {/* Plataformas de cada nivel */}
        {LEVELS.slice(0, 4).map((item) => (
          <rect
            key={item.zone}
            x={26 - half(item.y) - 5}
            y={item.y - 1.6}
            width={half(item.y) * 2 + 10}
            height={3.2}
            fill={item.zone === level.zone ? "rgba(212,175,106,0.55)" : "rgba(255,255,255,0.18)"}
            stroke={item.zone === level.zone ? "#d4af6a" : "rgba(255,255,255,0.6)"}
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
        ))}
        {/* Suelo */}
        <line x1="-4" y1="97.5" x2="56" y2="97.5" stroke="rgba(255,255,255,0.6)" strokeWidth="1.2" vectorEffect="non-scaling-stroke" />
      </svg>

      {/* ---------------- Nombres de los niveles ---------------- */}
      {LEVELS.map((item) => {
        const active = item.zone === level.zone;
        const target = tourScenes.find((s) => s.zone === item.zone);
        return (
          <button
            key={item.zone}
            type="button"
            onClick={() => target && onGo(target.id)}
            aria-label={`Ir a ${item.zone}`}
            aria-current={active}
            style={{ top: `${item.y}%` }}
            className={`pointer-events-auto absolute right-[56px] -translate-y-1/2 whitespace-nowrap px-1 text-right font-mono text-[9px] uppercase tracking-[0.18em] transition-colors sm:right-[66px] sm:text-[10px] ${
              active ? "text-gold-300" : "text-white/50 hover:text-white max-sm:hidden"
            }`}
            data-active={active}
          >
            <span className="[text-shadow:0_1px_6px_rgba(0,0,0,0.9)]">{item.zone}</span>
          </button>
        );
      })}

      {/* ---------------- Punto rojo ---------------- */}
      <div aria-hidden className="absolute inset-y-0 right-0 w-[46px] sm:w-[54px]">
        <motion.div
          initial={false}
          animate={{ top: `${y}%`, left: `${x}%` }}
          transition={{ type: "spring", stiffness: 90, damping: 16, mass: 0.9 }}
          className="absolute h-0 w-0"
        >
          <svg width="28" height="28" viewBox="0 0 28 28" className="absolute -left-[14px] -top-[14px] overflow-visible">
            {/* Onda al cambiar de escena */}
            <motion.circle
              key={sceneId}
              cx="14"
              cy="14"
              fill="none"
              stroke="#ff3b30"
              strokeWidth="2"
              initial={{ r: 4, opacity: 0.9 }}
              animate={{ r: 16, opacity: 0 }}
              transition={{ duration: 1.1, ease: "easeOut" }}
            />
            {/* Latido continuo */}
            <motion.circle
              cx="14"
              cy="14"
              fill="#ff3b30"
              initial={false}
              animate={{ r: [8, 12], opacity: [0.35, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
            />
            <circle cx="14" cy="14" r="5" fill="#ff3b30" stroke="#ffffff" strokeWidth="1.5" />
          </svg>
        </motion.div>
      </div>
    </nav>
  );
}