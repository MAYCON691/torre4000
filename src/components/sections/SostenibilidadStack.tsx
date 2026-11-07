"use client";

import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useRef } from "react";
import { sostenibilidad, type Feature } from "@/data/site";
import ScrollText from "@/components/ui/ScrollText";

type CardProps = {
  pillar: Feature;
  index: number;
  total: number;
  progress: MotionValue<number>;
};

/** Tarjeta que se queda fija y se hace mas pequena cuando llega la siguiente. */
function StackCard({ pillar, index, total, progress }: CardProps) {
  const isLast = index === total - 1;
  const scale = useTransform(
    progress,
    [index / total, 1],
    [1, isLast ? 1 : 1 - (total - index) * 0.05],
  );
  const rotate = useTransform(progress, [0, 1], [0, 160 * (index % 2 === 0 ? 1 : -1)]);

  return (
    <div className="sticky top-0 flex h-screen items-center justify-center px-5">
      <motion.article
        style={{ scale, top: `calc(-4vh + ${index * 28}px)` }}
        className="relative grid h-[64vh] w-full max-w-5xl origin-top overflow-hidden border border-white/15 bg-night-800 p-8 md:grid-cols-[auto_1fr] md:gap-12 md:p-14"
      >
        {/* Cuadrado decorativo que gira con el scroll */}
        <motion.span
          aria-hidden
          style={{ rotate }}
          className="absolute -right-24 -top-24 block h-72 w-72 border border-leaf-400/40"
        />
        <motion.span
          aria-hidden
          style={{ rotate }}
          className="absolute -right-10 -top-10 block h-48 w-48 border border-leaf-400/25"
        />

        <span className="outline-text font-display text-[9rem] font-bold leading-none md:text-[14rem]">
          {String(index + 1).padStart(2, "0")}
        </span>

        <div className="relative flex flex-col justify-end">
          <span className="mb-5 block h-1 w-16 bg-leaf-400" />
          <h3 className="font-display text-4xl font-bold uppercase leading-none text-white md:text-6xl">
            {pillar.title}
          </h3>
          <p className="mt-5 max-w-lg font-serif text-2xl leading-snug text-white/75">
            {pillar.text}
          </p>
        </div>
      </motion.article>
    </div>
  );
}

export default function SostenibilidadStack() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const total = sostenibilidad.pillars.length;

  return (
    <div className="bg-night-900">
      <div className="mx-auto max-w-[1200px] px-6 py-28 lg:px-8 lg:py-40">
        <ScrollText
          text={sostenibilidad.statement}
          className="font-serif text-4xl leading-[1.15] text-white md:text-6xl"
        />
      </div>

      <div ref={ref} className="relative">
        {sostenibilidad.pillars.map((pillar, index) => (
          <StackCard
            key={pillar.title}
            pillar={pillar}
            index={index}
            total={total}
            progress={scrollYProgress}
          />
        ))}
      </div>
    </div>
  );
}