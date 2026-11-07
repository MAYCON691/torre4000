"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { home } from "@/data/site";
import SplitTitle from "@/components/ui/SplitTitle";

/** Cinco paneles, uno por pagina. En escritorio el panel bajo el mouse se expande. */
export default function HomeHighlights() {
  return (
    <section className="relative bg-night-900 pb-24">
      <div className="mx-auto max-w-[1400px] px-6 pb-12 lg:px-12">
        <p className="mb-4 font-display text-sm font-semibold uppercase tracking-[0.35em] text-gold-400">
          Explora
        </p>
        <SplitTitle
          text={home.panelsTitle}
          className="font-display text-5xl font-bold uppercase leading-none text-white md:text-7xl"
        />
      </div>

      <div className="force-dark mx-auto flex max-w-[1600px] flex-col border-y border-white/10 md:h-[78vh] md:flex-row">
        {home.panels.map((panel, index) => (
          <motion.div
            key={panel.href}
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -60px 0px" }}
            transition={{ duration: 0.85, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="group relative min-h-[46vh] flex-1 overflow-hidden border-white/10 md:min-h-0 md:border-r md:transition-[flex] md:duration-700 md:ease-out md:last:border-r-0 md:hover:flex-[2.8]"
          >
            <Link href={panel.href} className="absolute inset-0 block">
              <Image
                src={panel.image}
                alt=""
                fill
                sizes="(min-width: 768px) 40vw, 100vw"
                style={{ objectPosition: panel.position }}
                className="object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-110"
              />
              <span
                aria-hidden
                className="absolute inset-0 bg-black/55 transition-colors duration-500 group-hover:bg-black/20"
              />
              <span
                aria-hidden
                className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent"
              />

              <span className="absolute inset-x-0 bottom-0 flex flex-col gap-3 p-6 md:p-8">
                <span className="font-display text-5xl font-bold text-gold-400 md:text-6xl">
                  {panel.number}
                </span>
                <span className="break-words font-display text-3xl font-bold uppercase leading-none text-white md:text-[clamp(1.5rem,2.2vw,2.6rem)]">
                  {panel.title}
                </span>
                <span className="max-w-xs overflow-hidden text-white/80 transition-all duration-500 md:max-h-0 md:opacity-0 md:group-hover:max-h-32 md:group-hover:opacity-100">
                  {panel.text}
                </span>
                <span className="mt-1 flex items-center gap-3 font-display text-sm font-semibold uppercase tracking-[0.3em] text-gold-400">
                  Entrar
                  <span className="block h-px w-8 bg-gold-400 transition-all duration-500 group-hover:w-20" />
                </span>
              </span>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}