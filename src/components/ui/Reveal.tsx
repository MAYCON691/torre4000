"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  /** Retraso en segundos */
  delay?: number;
  y?: number;
  x?: number;
  className?: string;
};

/** Hace aparecer el contenido con movimiento al entrar en pantalla. */
export default function Reveal({
  children,
  delay = 0,
  y = 36,
  x = 0,
  className = "",
}: Props) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, x }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true, margin: "0px 0px -80px 0px" }}
      transition={{ duration: 0.85, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}