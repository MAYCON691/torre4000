"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef, type ReactNode } from "react";
import SplitTitle from "@/components/ui/SplitTitle";

type Props = {
  crumb: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  image: string;
  imagePosition?: string;
  /** Capa extra detras del texto (por ejemplo las brasas) */
  children?: ReactNode;
};

/** Encabezado a pantalla casi completa de cada pagina interior. */
export default function PageHero({
  crumb,
  eyebrow,
  title,
  subtitle,
  image,
  imagePosition = "50% 30%",
  children,
}: Props) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "26%"]);
  const backgroundScale = useTransform(scrollYProgress, [0, 1], [1.05, 1.22]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "55%"]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);

  return (
    <section
      ref={ref}
      className="force-dark grain relative isolate flex min-h-[82svh] items-end overflow-hidden bg-night-950"
    >
      {/* Fondo con parallax */}
      <motion.div
        aria-hidden
        style={{ y: backgroundY, scale: backgroundScale }}
        className="absolute inset-0 -z-20 will-change-transform"
      >
        <Image
          src={image}
          alt=""
          fill
          priority
          sizes="100vw"
          style={{ objectPosition: imagePosition }}
          className="object-cover"
        />
      </motion.div>
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-linear-to-t from-night-950 via-black/45 to-black/60"
      />

      {children && (
        <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
          {children}
        </div>
      )}

      {/* Texto */}
      <motion.div
        style={{ y: textY, opacity: textOpacity }}
        className="relative z-10 w-full px-6 pb-20 pt-40 sm:px-10 lg:px-[10.5%]"
      >
        <motion.nav
          aria-label="Ruta"
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.9 }}
          className="mb-6 flex items-center gap-3 font-display text-xs font-semibold uppercase tracking-[0.3em] text-white/70"
        >
          <Link href="/" className="transition-colors hover:text-gold-400">
            Inicio
          </Link>
          <span className="h-px w-8 bg-gold-400" />
          <span className="text-gold-400">{crumb}</span>
        </motion.nav>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1 }}
          className="mb-3 font-display text-sm font-semibold uppercase tracking-[0.4em] text-gold-400"
        >
          {eyebrow}
        </motion.p>

        <SplitTitle
          as="h1"
          text={title}
          delay={1}
          className="page-title font-display font-bold uppercase text-white"
        />

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.5 }}
          className="mt-6 max-w-xl font-serif text-xl italic text-white/85 md:text-2xl"
        >
          {subtitle}
        </motion.p>
      </motion.div>

      {/* Indicador de scroll */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
        className="absolute bottom-8 right-6 z-10 hidden flex-col items-center gap-3 text-white/70 md:flex lg:right-12"
      >
        <span className="font-display text-xs font-semibold uppercase tracking-[0.35em] [writing-mode:vertical-rl]">
          Scroll
        </span>
        <span className="relative block h-14 w-px bg-white/20">
          <motion.span
            className="absolute left-0 top-0 block h-5 w-px bg-gold-400"
            animate={{ y: [0, 36, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
        </span>
      </motion.div>
    </section>
  );
}