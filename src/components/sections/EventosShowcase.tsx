"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { eventos, type EventItem } from "@/data/site";
import Marquee from "@/components/ui/Marquee";
import SplitTitle from "@/components/ui/SplitTitle";

/** Tarjeta de cristal: entra desde un lado y flota con el scroll. */
function EventCard({ item, index }: { item: EventItem; index: number }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [70, -70]);
  const fromRight = index % 2 === 1;

  return (
    <motion.article
      ref={ref}
      style={{ y }}
      className={`flex w-full ${fromRight ? "justify-end" : "justify-start"}`}
    >
      <motion.div
        initial={{ opacity: 0, x: fromRight ? 90 : -90 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "0px 0px -15% 0px" }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className={`glass relative w-full max-w-xl p-8 md:p-12 ${
          item.featured ? "!border-gold-400/70" : ""
        }`}
      >
        <span className="outline-text pointer-events-none absolute right-6 top-2 select-none font-display text-8xl font-bold leading-none opacity-60">
          {String(index + 1).padStart(2, "0")}
        </span>

        <span
          className={`inline-block px-3 py-1 font-display text-xs font-bold uppercase tracking-[0.3em] ${
            item.featured ? "bg-gold-400 text-night-950" : "bg-white/15 text-white"
          }`}
        >
          {item.tag}
        </span>
        <h3 className="mt-6 font-display text-4xl font-bold uppercase leading-none text-white md:text-5xl">
          {item.title}
        </h3>
        <p className="mt-5 font-serif text-xl leading-relaxed text-white/85 md:text-2xl">
          {item.text}
        </p>
      </motion.div>
    </motion.article>
  );
}

/**
 * Fondo del Illimani FIJO: las tarjetas transparentes se deslizan por encima
 * mientras la foto se queda quieta.
 */
export default function EventosShowcase() {
  return (
    <section
      className="force-dark relative isolate bg-cover bg-center bg-no-repeat md:bg-fixed"
      style={{ backgroundImage: `url(${eventos.background})` }}
    >
      <div aria-hidden className="absolute inset-0 -z-10 bg-black/30" />

      <div className="mx-auto max-w-[1200px] px-6 pb-[16vh] pt-[22vh] lg:px-8">
        {/* Titulo en cristal */}
        <div className="glass mx-auto max-w-3xl p-8 text-center md:p-14">
          <p className="mb-4 font-display text-sm font-semibold uppercase tracking-[0.4em] text-gold-400">
            {eventos.eyebrow}
          </p>
          <SplitTitle
            text={eventos.title}
            className="font-display text-5xl font-bold uppercase leading-none text-white md:text-7xl"
          />
          <p className="mx-auto mt-6 max-w-lg font-serif text-xl italic text-white/85 md:text-2xl">
            {eventos.text}
          </p>
        </div>

        {/* Tarjetas */}
        <div className="mt-[18vh] flex flex-col gap-[22vh]">
          {eventos.items.map((item, index) => (
            <EventCard key={item.title} item={item} index={index} />
          ))}
        </div>
      </div>

      <div className="border-t border-white/20 bg-black/50 py-5 backdrop-blur-sm">
        <Marquee
          items={eventos.marquee}
          speed={-3.5}
          itemClassName="font-display text-3xl font-semibold uppercase tracking-[0.3em] text-white/85"
        />
      </div>
    </section>
  );
}