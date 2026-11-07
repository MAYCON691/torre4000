"use client";

import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useScroll,
  useTransform,
} from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { mirador, photos } from "@/data/site";

/**
 * Galeria horizontal: la pagina queda "anclada" y al hacer scroll hacia abajo
 * las fotografias se deslizan hacia los lados. Clic para ampliar.
 */
export default function MiradorGallery() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const distance = useMotionValue(0);
  const [active, setActive] = useState<number | null>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const x = useTransform([scrollYProgress, distance], (latest: number[]) => {
    return -latest[0] * latest[1];
  });
  const imageShift = useTransform(scrollYProgress, [0, 1], ["7%", "-7%"]);
  const counter = useTransform(scrollYProgress, (value) =>
    String(Math.min(photos.length, Math.floor(value * photos.length) + 1)).padStart(2, "0"),
  );

  // Mide cuanto debe recorrer la pista horizontal
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const measure = () =>
      distance.set(Math.max(0, track.scrollWidth - window.innerWidth));
    const observer = new ResizeObserver(measure);
    observer.observe(track);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [distance]);

  const close = useCallback(() => setActive(null), []);
  const step = useCallback(
    (direction: 1 | -1) =>
      setActive((current) =>
        current === null ? current : (current + direction + photos.length) % photos.length,
      ),
    [],
  );

  // Teclado y bloqueo de scroll mientras el visor esta abierto
  useEffect(() => {
    if (active === null) return;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key === "ArrowRight") step(1);
      if (event.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [active, close, step]);

  return (
    <>
      <div
        ref={sectionRef}
        className="force-dark relative bg-night-950"
        style={{ height: `${photos.length * 85 + 30}vh` }}
      >
        <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
          <motion.div
            ref={trackRef}
            style={{ x }}
            className="flex w-max items-center gap-[4vw] px-[8vw] will-change-transform"
          >
            {/* Tarjeta de titulo */}
            <div className="w-[70vw] shrink-0 md:w-[26vw]">
              <p className="mb-4 font-display text-sm font-semibold uppercase tracking-[0.35em] text-gold-400">
                {mirador.galleryHint}
              </p>
              <h2 className="font-display text-6xl font-bold uppercase leading-[0.9] text-white md:text-8xl">
                {mirador.galleryTitle}
              </h2>
              <span className="mt-6 block h-px w-24 bg-gold-400" />
            </div>

            {photos.map((photo, index) => (
              <button
                key={photo.src}
                type="button"
                onClick={() => setActive(index)}
                aria-label={`Ampliar ${photo.alt}`}
                className="group relative h-[62vh] w-[80vw] shrink-0 cursor-zoom-in overflow-hidden border border-white/15 md:w-[46vw]"
              >
                <motion.div
                  style={{ x: imageShift }}
                  className="absolute inset-y-0 -inset-x-[12%]"
                >
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    sizes="(min-width: 768px) 60vw, 100vw"
                    className="object-cover transition-transform duration-1000 group-hover:scale-105"
                  />
                </motion.div>
                <span
                  aria-hidden
                  className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent"
                />
                <span className="absolute inset-x-0 bottom-0 flex items-end justify-between p-5 text-white">
                  <span className="font-display text-4xl font-bold text-gold-400">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="font-display text-xs font-semibold uppercase tracking-[0.3em] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    Ampliar +
                  </span>
                </span>
              </button>
            ))}
          </motion.div>

          {/* Progreso */}
          <div className="absolute inset-x-[8vw] bottom-8 flex items-center gap-4 text-white">
            <motion.span className="font-display text-lg font-bold text-gold-400">
              {counter}
            </motion.span>
            <span className="relative block h-px flex-1 bg-white/20">
              <motion.span
                style={{ scaleX: scrollYProgress }}
                className="absolute inset-0 origin-left bg-gold-400"
              />
            </span>
            <span className="font-display text-lg font-bold text-white/60">
              {String(photos.length).padStart(2, "0")}
            </span>
          </div>
        </div>
      </div>

      {/* Visor ampliado */}
      <AnimatePresence>
        {active !== null && (
          <motion.div
            key="lightbox"
            role="dialog"
            aria-modal="true"
            aria-label="Visor de fotografías"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={close}
            className="force-dark fixed inset-0 z-[90] flex items-center justify-center bg-black/95"
          >
            <motion.div
              key={active}
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              onClick={(event) => event.stopPropagation()}
              className="relative h-[80vh] w-[92vw] max-w-6xl"
            >
              <Image
                src={photos[active].src}
                alt={photos[active].alt}
                fill
                unoptimized
                sizes="92vw"
                className="object-contain"
              />
            </motion.div>

            <button
              type="button"
              onClick={close}
              aria-label="Cerrar visor"
              className="absolute right-5 top-5 flex h-12 w-12 items-center justify-center border border-white/30 text-white transition-colors hover:border-gold-400 hover:bg-gold-400 hover:text-night-950"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 5l14 14M19 5L5 19" />
              </svg>
            </button>
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                step(-1);
              }}
              aria-label="Fotografía anterior"
              className="absolute left-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center border border-white/30 text-white transition-colors hover:border-gold-400 hover:bg-gold-400 hover:text-night-950"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 5l-7 7 7 7" />
              </svg>
            </button>
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                step(1);
              }}
              aria-label="Fotografía siguiente"
              className="absolute right-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center border border-white/30 text-white transition-colors hover:border-gold-400 hover:bg-gold-400 hover:text-night-950"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <p className="absolute bottom-6 left-1/2 -translate-x-1/2 font-display text-sm font-semibold uppercase tracking-[0.3em] text-white/70">
              {String(active + 1).padStart(2, "0")} / {String(photos.length).padStart(2, "0")}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}