"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

/**
 * Se vuelve a montar en cada cambio de pagina: una cortina negra baja y deja
 * ver la pagina nueva.
 */
export default function Template({ children }: { children: ReactNode }) {
  return (
    <>
      <motion.div
        aria-hidden
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0 }}
        transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: 0.05 }}
        style={{ transformOrigin: "top" }}
        className="pointer-events-none fixed inset-0 z-[100] bg-black"
      />
      {children}
    </>
  );
}