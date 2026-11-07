"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { restaurant, type Feature } from "@/data/site";
import CountUp from "@/components/ui/CountUp";
import Marquee from "@/components/ui/Marquee";
import Reveal from "@/components/ui/Reveal";

/** Cada "momento" entra desde un lado, se centra y se despide al seguir bajando. */
function Moment({ item, index }: { item: Feature; index: number }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const direction = index % 2 === 0 ? -1 : 1;
  const x = useTransform(scrollYProgress, [0, 0.5, 1], [direction * 140, 0, direction * -140]);
  const opacity = useTransform(scrollYProgress, [0, 0.28, 0.72, 1], [0, 1, 1, 0]);
  const numberX = useTransform(scrollYProgress, [0, 1], [direction * -80, direction * 80]);

  return (
    <article
      ref={ref}
      className="relative flex min-h-[70vh] items-center overflow-hidden border-t border-white/10 px-6 sm:px-10 lg:px-[10.5%]"
    >
      <motion.span
        aria-hidden
        style={{ x: numberX }}
        className="outline-text pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 select-none font-display text-[38vw] font-bold leading-none md:text-[30vw]"
      >
        {String(index + 1).padStart(2, "0")}
      </motion.span>

      <motion.div style={{ x, opacity }} className="relative max-w-2xl">
        <p className="mb-4 font-display text-sm font-semibold uppercase tracking-[0.35em] text-ember-400">
          Momento {String(index + 1).padStart(2, "0")}
        </p>
        <h3 className="font-display text-5xl font-bold uppercase leading-none text-white md:text-7xl">
          {item.title}
        </h3>
        <p className="mt-6 font-serif text-2xl leading-snug text-white/80 md:text-3xl">
          {item.text}
        </p>
      </motion.div>
    </article>
  );
}

export default function RestauranteExperience() {
  const introRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: introRef,
    offset: ["start end", "end start"],
  });
  const numeralY = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);
  const numeralScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1.05, 0.9]);

  return (
    <div className="bg-night-900">
      {/* ---- Numero gigante con contador ---- */}
      <section
        ref={introRef}
        className="relative flex min-h-[90vh] items-center justify-center overflow-hidden px-6 py-28"
      >
        <motion.p
          aria-hidden
          style={{ y: numeralY, scale: numeralScale }}
          className="outline-text-gold pointer-events-none absolute select-none font-display text-[44vw] font-bold leading-none opacity-40 md:text-[34vw]"
        >
          4086
        </motion.p>

        <div className="relative text-center">
          <Reveal>
            <p className="mb-5 font-display text-sm font-semibold uppercase tracking-[0.4em] text-ember-400">
              {restaurant.numberLabel}
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-fire font-display text-[26vw] font-bold leading-[0.85] md:text-[18rem]">
              <CountUp to={restaurant.number} />
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mx-auto mt-8 max-w-2xl font-display text-2xl font-medium uppercase tracking-wide text-white md:text-3xl">
              {restaurant.tagline}
            </p>
            <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-white/70">
              {restaurant.text}
            </p>
          </Reveal>
        </div>
      </section>

      {/* ---- Franja que reacciona al scroll ---- */}
      <div className="border-y border-white/10 bg-night-950 py-6">
        <Marquee
          items={restaurant.marquee}
          speed={-4}
          itemClassName="text-fire font-display text-5xl font-bold uppercase tracking-wide md:text-7xl"
        />
      </div>

      {/* ---- Momentos ---- */}
      <div>
        {restaurant.moments.map((moment, index) => (
          <Moment key={moment.title} item={moment} index={index} />
        ))}
      </div>
    </div>
  );
}