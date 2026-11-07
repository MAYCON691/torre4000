"use client";

import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";

type WordProps = {
  word: string;
  range: [number, number];
  progress: MotionValue<number>;
};

function Word({ word, range, progress }: WordProps) {
  const opacity = useTransform(progress, range, [0.14, 1]);
  return (
    <motion.span style={{ opacity }} className="mr-[0.26em] inline-block">
      {word}
    </motion.span>
  );
}

/** Texto cuyas palabras se iluminan una a una mientras haces scroll. */
export default function ScrollText({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.9", "end 0.45"],
  });
  const words = text.split(" ");

  return (
    <p ref={ref} className={className} aria-label={text}>
      {words.map((word, index) => {
        const start = index / words.length;
        const end = start + 1 / words.length;
        return (
          <Word
            key={`${word}-${index}`}
            word={word}
            range={[start, end]}
            progress={scrollYProgress}
          />
        );
      })}
    </p>
  );
}