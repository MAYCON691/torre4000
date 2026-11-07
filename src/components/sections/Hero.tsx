"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef, type MouseEvent } from "react";
import { site } from "@/data/site";
import { useTheme } from "@/hooks/useTheme";

// Fondo del inicio. Para tener una foto distinta de dia, copia el archivo a
// public/images y pon su ruta aqui, por ejemplo: "/images/fondo-illimani-dia.jpg"
// (si queda en null, de dia se usa la misma foto con un tratamiento de luz)
const IMAGE_NIGHT = "/images/fondo-illimani.jpg";
const IMAGE_DAY = null as string | null;

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const { theme } = useTheme();
  const backgroundSrc = theme === "day" && IMAGE_DAY ? IMAGE_DAY : IMAGE_NIGHT;

  // Movimiento con el scroll: en reposo todo queda IGUAL a la referencia
  const { scrollY } = useScroll();
  const backgroundY = useTransform(scrollY, [0, 900], [0, 300]);
  const towerY = useTransform(scrollY, [0, 900], [0, 90]);
  const towerScale = useTransform(scrollY, [0, 900], [1, 1.1]);
  const textY = useTransform(scrollY, [0, 700], [0, -130]);
  const textOpacity = useTransform(scrollY, [0, 520], [1, 0]);

  // Posicion del mouse (-0.5 a 0.5) guardada como variables CSS
  const setPointer = (x: number, y: number) => {
    const el = heroRef.current;
    if (!el) return;
    el.style.setProperty("--mx", x.toFixed(3));
    el.style.setProperty("--my", y.toFixed(3));
  };

  const handleMove = (event: MouseEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setPointer(
      (event.clientX - rect.left) / rect.width - 0.5,
      (event.clientY - rect.top) / rect.height - 0.5,
    );
  };

  return (
    <section
      id="inicio"
      ref={heroRef}
      onMouseMove={handleMove}
      onMouseLeave={() => setPointer(0, 0)}
      className="force-dark relative isolate flex min-h-[100svh] items-center overflow-hidden bg-night-950"
    >
      {/* ---------- Fondo: sin oscurecer, sin zoom, calidad original ---------- */}
      <motion.div
        aria-hidden
        style={{ y: backgroundY }}
        className="hero-bg absolute inset-0 -z-10 will-change-transform"
      >
        <Image
          src={backgroundSrc}
          alt="La Paz y El Alto con el Illimani al fondo"
          fill
          priority
          unoptimized
          sizes="100vw"
          className="object-cover object-top"
        />
        {/* Luz de dia (solo visible en modo dia) */}
        <span className="hero-sky absolute inset-0" />
      </motion.div>

      {/* ---------- La torre (PNG) ---------- */}
      <motion.div
        aria-hidden
        style={{ y: towerY, scale: towerScale, transformOrigin: "50% 100%" }}
        className="pointer-events-none absolute bottom-0 right-[-14%] z-10 h-[58vh] w-[84vw] will-change-transform sm:right-0 sm:h-[74vh] sm:w-[52vw] lg:right-[7%] lg:h-[92vh] lg:w-[42vw]"
      >
        <div
          className="h-full w-full"
          style={{
            transform:
              "translate3d(calc(var(--mx, 0) * 8px), calc(var(--my, 0) * 5px), 0)",
          }}
        >
          {/* La torre "se construye" de abajo hacia arriba al cargar */}
          <div className="tower-build absolute inset-0">
            <div className="tower-image relative h-full w-full">
              <Image
                src="/images/torre4000.png"
                alt="Torre 4000"
                fill
                priority
                unoptimized
                sizes="(min-width: 1024px) 42vw, 84vw"
                className="object-contain object-bottom"
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* ---------- Texto ---------- */}
      <motion.div
        style={{ y: textY, opacity: textOpacity }}
        className="relative z-20 w-full px-6 pb-20 pt-28 sm:px-10 lg:pl-[10.5%] lg:pr-8"
      >
        <h1 className="hero-title font-display font-bold uppercase text-white">
          <span className="hero-line block">{site.hero.titleTop}</span>
          <span className="hero-line block">{site.hero.titleBottom}</span>
        </h1>
        <p className="hero-subtitle hero-fade mt-5 max-w-[15em] font-display font-light uppercase text-white">
          {site.hero.subtitle}
        </p>
      </motion.div>

      {/* ---------- Indicador de scroll ---------- */}
      <motion.div
        aria-hidden
        style={{ opacity: textOpacity }}
        className="absolute bottom-7 left-6 z-20 hidden sm:block lg:left-[10.5%]"
      >
        <div className="hero-fade flex items-center gap-4">
          <span className="relative block h-12 w-px overflow-hidden bg-white/30">
            <span className="hero-scroll-dot absolute left-0 top-0 block h-4 w-px bg-gold-400" />
          </span>
          <span className="font-display text-xs font-semibold uppercase tracking-[0.35em] text-white/80">
            Desliza
          </span>
        </div>
      </motion.div>
    </section>
  );
}