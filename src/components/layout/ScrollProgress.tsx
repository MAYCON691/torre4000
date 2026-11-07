"use client";

import { motion, useScroll, useSpring } from "motion/react";

/** Linea dorada que crece a medida que avanzas por la pagina. */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 28,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="absolute inset-x-0 bottom-0 h-[2px] origin-left bg-gold-400"
    />
  );
}