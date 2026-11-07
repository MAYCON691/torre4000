"use client";

import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useTransform,
} from "motion/react";
import { useEffect, useRef } from "react";

type Props = {
  to: number;
  duration?: number;
  className?: string;
};

/** Cuenta desde 0 hasta un numero cuando entra en pantalla. */
export default function CountUp({ to, duration = 2.4, className = "" }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const value = useMotionValue(0);
  const text = useTransform(value, (latest) => Math.round(latest).toString());

  useEffect(() => {
    if (!inView) return;
    const controls = animate(value, to, {
      duration,
      ease: [0.16, 1, 0.3, 1],
    });
    return () => controls.stop();
  }, [inView, to, duration, value]);

  return (
    <motion.span ref={ref} className={className}>
      {text}
    </motion.span>
  );
}