"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";

/** Respeta la preferencia "reducir movimiento" del sistema del visitante. */
export default function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}