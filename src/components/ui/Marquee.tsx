"use client";

import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "motion/react";
import { useRef } from "react";

const wrap = (min: number, max: number, value: number) => {
  const range = max - min;
  return ((((value - min) % range) + range) % range) + min;
};

type Props = {
  items: string[];
  /** Velocidad base en % por segundo (negativo = hacia la izquierda) */
  speed?: number;
  className?: string;
  itemClassName?: string;
};

/** Franja de texto infinita que acelera y cambia de sentido con tu scroll. */
export default function Marquee({
  items,
  speed = -3,
  className = "",
  itemClassName = "",
}: Props) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smooth = useSpring(velocity, { damping: 50, stiffness: 400 });
  const factor = useTransform(smooth, [0, 1000], [0, 5], { clamp: false });
  const x = useTransform(baseX, (latest) => `${wrap(-50, 0, latest)}%`);
  const direction = useRef(1);

  useAnimationFrame((_, delta) => {
    let moveBy = direction.current * speed * (delta / 1000);
    const boost = factor.get();
    if (boost < 0) direction.current = -1;
    else if (boost > 0) direction.current = 1;
    moveBy += direction.current * moveBy * boost;
    baseX.set(baseX.get() + moveBy);
  });

  const sequence = [...items, ...items];

  return (
    <div className={`overflow-hidden whitespace-nowrap ${className}`} aria-hidden>
      <motion.div style={{ x }} className="flex w-max">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0 items-center">
            {sequence.map((item, index) => (
              <span
                key={`${copy}-${item}-${index}`}
                className={`flex items-center gap-8 px-4 ${itemClassName}`}
              >
                {item}
                <span className="h-2.5 w-2.5 rotate-45 bg-gold-400" />
              </span>
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  );
}