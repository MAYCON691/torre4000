"use client";

import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useRef } from "react";

/* ==========================================================================
   Altura de la Torre 4000 vs otras torres del mundo.
   Al hacer scroll la pagina queda anclada: sube la montana, aparece la
   Torre 4000 contando hasta 4200 m.s.n.m. y despues crece cada torre.
   Para cambiar datos o iconos edita solo esta lista.
   ========================================================================== */
const TOWERS = [
  { name: "Torre de Strat Skypod", meters: 350, icon: "/images/torrestratskypod.png" },
  { name: "Torre de Macao", meters: 338, icon: "/images/torremacao.png" },
  { name: "Torre de Tokio", meters: 333, icon: "/images/torretokio.png" },
  { name: "Torre Eiffel", meters: 333, icon: "/images/torreeiffel.png" },
  { name: "Torre de Sidney", meters: 305, icon: "/images/torresidney.png" },
  { name: "Aguja Espacial", meters: 184, icon: "/images/agujaespacial.png" },
  { name: "Monumento a Washington", meters: 169, icon: "/images/monumentowashington.png" },
  { name: "Estatua de la Libertad", meters: 93, icon: "/images/estatualibertad.png" },
];

const TORRE_4000_ICON = "/images/torre4000icono.png";

const ALTITUDE = 4200;
const MAX_METERS = 350;

type TowerProps = {
  name: string;
  icon: string;
  meters: number;
  index: number;
  progress: MotionValue<number>;
};

/** Una torre: crece de abajo hacia arriba y su altura cuenta desde 0 */
function Tower({ name, icon, meters, index, progress }: TowerProps) {
  const start = 0.3 + index * 0.07;
  const end = start + 0.1;

  const rise = useTransform(progress, [start, end], [0, 1]);
  // El icono se descubre de abajo hacia arriba (sin deformarse)
  const reveal = useTransform(rise, (v) => `inset(${((1 - v) * 100).toFixed(1)}% 0 0 0)`);
  const appear = useTransform(progress, [start, start + 0.05], [0, 1]);
  const count = useTransform(progress, [start, end], [0, meters]);
  const label = useTransform(count, (value) => String(Math.round(value)));

  // Deja lugar arriba para la etiqueta con los metros
  const height = (meters / MAX_METERS) * 60;

  return (
    <li className="relative flex h-full min-w-0 flex-1 flex-col items-center justify-end">
      <motion.p
        style={{ opacity: appear }}
        className="mb-2 flex items-baseline gap-0.5 font-display font-bold leading-none text-gold-400"
      >
        <motion.span className="text-[11px] md:text-2xl">{label}</motion.span>
        <span className="hidden text-xs md:inline">m</span>
      </motion.p>

      <div className="relative w-full" style={{ height: `${height}%` }}>
        <motion.img
          src={icon}
          alt={name}
          draggable={false}
          style={{ clipPath: reveal }}
          className="absolute bottom-0 left-1/2 h-full w-auto max-w-none -translate-x-1/2 select-none object-contain object-bottom"
        />
      </div>

      <span className="absolute inset-x-0 top-full mt-3 flex justify-center">
        <motion.span
          style={{ opacity: appear }}
          className="block max-h-28 text-center font-display text-[10px] font-semibold uppercase leading-tight tracking-[0.08em] text-white/75 [writing-mode:vertical-rl] md:max-h-none md:text-xs md:tracking-[0.12em] md:[writing-mode:horizontal-tb]"
        >
          {name}
        </motion.span>
      </span>
    </li>
  );
}

export default function TorreAltura() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // Montana y curva
  const mountainReveal = useTransform(
    scrollYProgress,
    [0.02, 0.22],
    ["inset(0 100% 0 0)", "inset(0 0% 0 0)"],
  );
  const mountainFill = useTransform(scrollYProgress, [0.1, 0.26], [0, 1]);

  // Torre 4000 y numero de altitud
  const bigRise = useTransform(scrollYProgress, [0.08, 0.24], [0, 1]);
  const bigReveal = useTransform(bigRise, (v) => `inset(${((1 - v) * 100).toFixed(1)}% 0 0 0)`);
  const altitude = useTransform(scrollYProgress, [0.08, 0.26], [0, ALTITUDE]);
  const altitudeText = useTransform(altitude, (value) => String(Math.round(value)));
  const altitudeOpacity = useTransform(scrollYProgress, [0.06, 0.14], [0, 1]);

  // Linea del nivel del mar
  const baseline = useTransform(scrollYProgress, [0, 0.12], [0, 1]);

  return (
    <section
      aria-label="Altura de la Torre 4000 comparada con otras torres"
      className="force-dark relative bg-night-950"
    >
      <div ref={ref} className="relative h-[460vh]">
        <div className="sticky top-0 flex h-screen flex-col overflow-hidden px-5 pb-8 pt-24 sm:px-10 lg:px-[10.5%] lg:pt-28">
          {/* ---------------- Titulo ---------------- */}
          <header className="relative z-10 max-w-2xl">
            <p className="mb-3 font-display text-sm font-semibold uppercase tracking-[0.4em] text-gold-400">
              Altura
            </p>
            <h2 className="font-display text-4xl font-bold uppercase leading-[0.95] text-white md:text-6xl">
              Más cerca <br className="hidden md:block" />
              del cielo
            </h2>
            <p className="mt-4 max-w-md font-serif text-base italic text-white/75 md:text-xl">
              Las demás torres miden su altura desde el suelo. La Torre 4000 empieza a 4.200
              metros sobre el nivel del mar.
            </p>
          </header>

          {/* ---------------- Grafico ---------------- */}
          <div className="relative mb-32 mt-6 min-h-0 flex-1 md:mb-16">
            {/* Montana: curva que baja hasta el nivel del mar */}
            <motion.svg
              aria-hidden
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              style={{ clipPath: mountainReveal }}
              className="absolute inset-0 h-full w-full"
            >
              <defs>
                <linearGradient id="altura-mountain" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#d4af6a" stopOpacity="0.28" />
                  <stop offset="100%" stopColor="#d4af6a" stopOpacity="0" />
                </linearGradient>
              </defs>
              <motion.path
                d="M0 36 L12 36 C 22 36, 24 70, 38 100 L0 100 Z"
                fill="url(#altura-mountain)"
                style={{ opacity: mountainFill }}
              />
              <motion.path
                d="M0 36 L12 36 C 22 36, 24 70, 38 100"
                fill="none"
                stroke="#ffffff"
                strokeOpacity="0.75"
                strokeWidth="2"
                vectorEffect="non-scaling-stroke"
              />
            </motion.svg>

            {/* Linea del nivel del mar */}
            <motion.span
              aria-hidden
              style={{ scaleX: baseline }}
              className="absolute inset-x-0 bottom-0 block h-px origin-left bg-white/40"
            />
            <p className="absolute -bottom-6 left-0 font-display text-[10px] font-semibold uppercase tracking-[0.3em] text-gold-400 md:text-xs">
              0 m.s.n.m.
            </p>

            {/* Torre 4000 sobre la montana */}
            <div className="absolute left-[2%] top-0 h-[36%] w-[12%]">
              <motion.img
                src={TORRE_4000_ICON}
                alt="Torre 4000"
                draggable={false}
                style={{ clipPath: bigReveal }}
                className="absolute bottom-0 left-1/2 h-full w-auto max-w-none -translate-x-1/2 select-none object-contain object-bottom"
              />
            </div>

            {/* Altitud */}
            <motion.div
              style={{ opacity: altitudeOpacity }}
              className="absolute left-[15%] top-0 max-w-[60%]"
            >
              <p className="font-display text-xs font-semibold uppercase tracking-[0.3em] text-white/80 md:text-sm">
                Torre 4000
              </p>
              <p className="flex items-baseline gap-2 font-display font-bold leading-none text-gold-400">
                <motion.span className="text-5xl md:text-7xl">{altitudeText}</motion.span>
                <span className="text-sm uppercase tracking-[0.2em] md:text-2xl">m.s.n.m.</span>
              </p>
            </motion.div>

            {/* Torres del mundo */}
            <ol className="absolute bottom-0 right-0 flex h-full w-[66%] items-end gap-1 md:w-[62%] md:gap-3">
              {TOWERS.map((tower, index) => (
                <Tower
                  key={tower.name}
                  name={tower.name}
                  icon={tower.icon}
                  meters={tower.meters}
                  index={index}
                  progress={scrollYProgress}
                />
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}