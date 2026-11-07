"use client";

import { motion } from "motion/react";

type Props = {
  text: string;
  as?: "h1" | "h2" | "h3" | "p";
  className?: string;
  /** Retraso inicial en segundos */
  delay?: number;
};

/** Titulo cuyas palabras suben una a una desde una mascara. */
export default function SplitTitle({
  text,
  as: Tag = "h2",
  className = "",
  delay = 0,
}: Props) {
  const words = text.split(" ");

  return (
    <Tag className={className} aria-label={text}>
      {words.map((word, index) => (
        <span
          key={`${word}-${index}`}
          aria-hidden
          className="mr-[0.22em] inline-block overflow-hidden pb-[0.14em] align-bottom"
        >
          <motion.span
            className="inline-block"
            initial={{ y: "115%" }}
            whileInView={{ y: "0%" }}
            viewport={{ once: true }}
            transition={{
              duration: 0.95,
              delay: delay + index * 0.08,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}