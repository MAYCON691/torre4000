"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { tourIntro } from "@/data/tour";

type Props = {
  ready: boolean;
  onStart: () => void;
};

/** Portada del tour: "Cargando realidad virtual" y luego el boton de play. */
export default function TourPoster({ ready, onStart }: Props) {
  return (
    <motion.div
      key="poster"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="absolute inset-0 overflow-hidden bg-night-950"
    >
      <Image
        src={tourIntro.poster}
        alt=""
        fill
        priority
        unoptimized
        sizes="100vw"
        className="scale-110 object-cover opacity-70 blur-xl"
      />
      <span aria-hidden className="absolute inset-0 bg-black/45" />

      <div className="absolute left-4 top-4 z-10 sm:left-8 sm:top-8">
        <p className="tour-kicker">
          <span className="h-px w-8 bg-white/70" />
          El Alto · La Paz
        </p>
        <h2 className="mt-3 font-body text-4xl font-medium leading-none tracking-tight text-white sm:text-6xl md:text-7xl">
          Torre 4000
        </h2>
      </div>

      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center">
        {ready ? (
          <motion.button
            type="button"
            onClick={onStart}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="group flex flex-col items-center gap-5"
            aria-label={tourIntro.startLabel}
          >
            <span className="tour-play">
              <Image
                src={tourIntro.poster}
                alt=""
                fill
                unoptimized
                sizes="140px"
                className="object-cover"
              />
              <span aria-hidden className="absolute inset-0 bg-black/25" />
              <span className="relative z-10 flex h-14 w-14 items-center justify-center bg-white text-night-900 transition-transform duration-300 group-hover:scale-110">
                <svg viewBox="0 0 24 24" className="ml-0.5 h-6 w-6 fill-current" aria-hidden="true">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
            </span>
            <span className="font-body text-xl font-medium tracking-tight text-white sm:text-2xl">
              {tourIntro.startLabel}
            </span>
          </motion.button>
        ) : (
          <div role="status" aria-live="polite" className="flex flex-col items-center gap-5">
            <p className="tour-kicker text-sm sm:text-base">
              {tourIntro.loading}
              <span className="tour-dots" aria-hidden />
            </p>
            <span className="relative block h-px w-56 overflow-hidden bg-white/25 sm:w-72">
              <span className="tour-loadbar absolute inset-y-0 left-0 block w-full bg-gold-400" />
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}