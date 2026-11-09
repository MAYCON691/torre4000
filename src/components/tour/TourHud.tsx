"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import type { RefObject } from "react";
import { whatsappLink } from "@/data/site";
import { tourScenes, tourZones, type TourScene } from "@/data/tour";
import type { PanoApi } from "@/components/tour/PanoViewer";
import TourGuide from "@/components/tour/TourGuide";

type Props = {
  scene: TourScene;
  expanded: boolean;
  menuOpen: boolean;
  zoomApi: RefObject<PanoApi | null>;
  onGo: (id: string) => void;
  onMenu: (open: boolean) => void;
  onToggleExpand: () => void;
};

function Icon({ name }: { name: "menu" | "expand" | "close" | "chat" | "prev" | "next" | "back" }) {
  const common = {
    viewBox: "0 0 24 24",
    className: "h-4 w-4",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    "aria-hidden": true,
  } as const;
  switch (name) {
    case "menu":
      return (
        <svg {...common}>
          <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
      );
    case "expand":
      return (
        <svg {...common}>
          <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />
        </svg>
      );
    case "close":
      return (
        <svg {...common}>
          <path d="M5 5l14 14M19 5L5 19" />
        </svg>
      );
    case "chat":
      return (
        <svg {...common}>
          <path d="M4 5h16v11H9l-5 4z" />
        </svg>
      );
    case "prev":
      return (
        <svg {...common}>
          <path d="M15 5l-7 7 7 7" />
        </svg>
      );
    case "next":
      return (
        <svg {...common}>
          <path d="M9 5l7 7-7 7" />
        </svg>
      );
    case "back":
      return (
        <svg {...common}>
          <path d="M20 12H4M10 6l-6 6 6 6" />
        </svg>
      );
  }
}

/** Interfaz sobre el visor: titulo, pestanas, menu, torre guia, barra de escenas y zoom. */
export default function TourHud({
  scene,
  expanded,
  menuOpen,
  zoomApi,
  onGo,
  onMenu,
  onToggleExpand,
}: Props) {
  const index = tourScenes.findIndex((item) => item.id === scene.id);
  const prev = tourScenes[(index - 1 + tourScenes.length) % tourScenes.length];
  const next = tourScenes[(index + 1) % tourScenes.length];
  const isPano = scene.kind === "pano";
  const isExterior = scene.id === "exterior";

  return (
    <>
      {/* ------------------------- Arriba a la izquierda ------------------------- */}
      <div className="pointer-events-none absolute left-3 top-3 z-20 sm:left-6 sm:top-6">
        <button
          type="button"
          onClick={() => onMenu(true)}
          className="tour-btn tour-btn--light pointer-events-auto"
          aria-label="Abrir menú de escenas"
        >
          <Icon name="menu" />
          Menú
        </button>

        <motion.div
          key={scene.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-4 sm:mt-6"
        >
          <p className="tour-kicker">
            <span className="h-px w-6 bg-white/70" />
            {scene.kicker}
          </p>
          <h2 className="tour-title mt-2 font-body text-3xl font-medium leading-none tracking-tight text-white sm:text-5xl">
            {scene.title}
          </h2>
        </motion.div>
      </div>

      {/* -------------------------- Arriba a la derecha -------------------------- */}
      <div className="absolute right-3 top-3 z-20 flex items-start gap-2 sm:right-6 sm:top-6">
        <div className="tour-tabs hidden md:flex" role="tablist" aria-label="Secciones del tour">
          <button
            type="button"
            role="tab"
            aria-selected={scene.id === "exterior"}
            data-active={scene.id === "exterior"}
            onClick={() => onGo("exterior")}
          >
            <b>01</b> Exterior
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={!isExterior}
            data-active={!isExterior}
            onClick={() => onGo("planta-baja")}
          >
            <b>02</b> Recorrido
          </button>
          <Link href="/contacto#ruta" role="tab" aria-selected={false}>
            <b>03</b> Ubicación
          </Link>
        </div>

        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="tour-btn tour-btn--accent"
          aria-label="Consultar por WhatsApp"
        >
          <Icon name="chat" />
          <span className="hidden sm:inline">Consultar</span>
        </a>

        <button
          type="button"
          onClick={onToggleExpand}
          className="tour-btn tour-btn--icon"
          aria-label={expanded ? "Salir de pantalla completa" : "Pantalla completa"}
        >
          <Icon name={expanded ? "close" : "expand"} />
        </button>
      </div>

      {/* ----------------------------- Indicacion ------------------------------ */}
      <p key={`hint-${scene.id}`} className="tour-hint" aria-hidden>
        {isExterior ? "Toca la flecha para entrar" : "Desliza para mirar · toca una flecha para avanzar"}
      </p>

      {/* ------------------------- Torre guia (donde estas) ------------------------ */}
      <TourGuide sceneId={scene.id} onGo={onGo} />

      {/* ----------------------------- Barra inferior ---------------------------- */}
      <div className="absolute inset-x-0 bottom-3 z-20 flex justify-center px-3 sm:bottom-6">
        <div className="tour-bar">
          {!isExterior && (
            <button
              type="button"
              onClick={() => onGo("exterior")}
              className="tour-bar__btn"
              aria-label="Volver al exterior"
            >
              <Icon name="back" />
              <span className="hidden sm:inline">Exterior</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => onGo(prev.id)}
            className="tour-bar__btn"
            aria-label={`Escena anterior: ${prev.title}`}
          >
            <Icon name="prev" />
          </button>

          <div className="tour-bar__dots" role="group" aria-label="Escenas">
            {tourScenes.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onGo(item.id)}
                data-active={item.id === scene.id}
                aria-label={item.title}
                aria-current={item.id === scene.id}
                title={item.title}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => onGo(next.id)}
            className="tour-bar__btn"
            aria-label={`Escena siguiente: ${next.title}`}
          >
            <Icon name="next" />
          </button>

          {isPano && (
            <>
              <button
                type="button"
                onClick={() => zoomApi.current?.zoomOut()}
                className="tour-bar__btn"
                aria-label="Alejar"
              >
                −
              </button>
              <button
                type="button"
                onClick={() => zoomApi.current?.zoomIn()}
                className="tour-bar__btn"
                aria-label="Acercar"
              >
                +
              </button>
            </>
          )}
        </div>
      </div>

      {/* ------------------------------- Menu lateral ---------------------------- */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.button
              key="backdrop"
              type="button"
              aria-label="Cerrar menú"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => onMenu(false)}
              className="absolute inset-0 z-30 bg-black/55"
            />
            <motion.aside
              key="drawer"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="tour-drawer"
              aria-label="Escenas del tour"
            >
              <div className="mb-6 flex items-center justify-between">
                <p className="tour-kicker">Escenas</p>
                <button
                  type="button"
                  onClick={() => onMenu(false)}
                  className="tour-btn tour-btn--icon"
                  aria-label="Cerrar menú"
                >
                  <Icon name="close" />
                </button>
              </div>

              {tourZones.map((zone) => (
                <div key={zone} className="mb-5">
                  <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.25em] text-gold-400">
                    {zone}
                  </p>
                  {tourScenes
                    .filter((item) => item.zone === zone)
                    .map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => onGo(item.id)}
                        data-active={item.id === scene.id}
                        className="tour-drawer__item"
                      >
                        <span className="font-mono text-[10px] text-white/50">
                          {String(tourScenes.indexOf(item) + 1).padStart(2, "0")}
                        </span>
                        {item.title}
                      </button>
                    ))}
                </div>
              ))}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}