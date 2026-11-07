import type { Metadata } from "next";
import TourShowroom from "@/components/tour/TourShowroom";
import NextPage from "@/components/ui/NextPage";
import Reveal from "@/components/ui/Reveal";
import SplitTitle from "@/components/ui/SplitTitle";
import { tourIntro } from "@/data/tour";

export const metadata: Metadata = {
  title: "Tour 360",
  description:
    "Recorre la Torre 4000 en realidad virtual: mirador, restaurante FUEGO 4086 y lobby.",
};

export default function Tour360Page() {
  return (
    <main>
      <section className="force-dark relative bg-night-950 pt-[104px] lg:pt-[128px]">
        <div className="mx-auto max-w-[1280px] px-3 sm:px-8">
          <header className="mb-6 grid gap-3 px-1 md:mb-8 md:grid-cols-[auto_1fr] md:items-end md:gap-12">
            <div>
              <p className="mb-3 flex items-center gap-3 font-display text-sm font-semibold uppercase tracking-[0.4em] text-gold-400">
                <span className="h-px w-8 bg-gold-400" />
                {tourIntro.eyebrow}
              </p>
              <SplitTitle
                as="h1"
                text={tourIntro.title}
                className="font-display text-5xl font-bold uppercase leading-[0.9] text-white md:text-7xl"
              />
            </div>
            <Reveal delay={0.2}>
              <p className="max-w-md font-serif text-base italic text-white/80 md:justify-self-end md:pb-1 md:text-lg">
                {tourIntro.text}
              </p>
            </Reveal>
          </header>

          <TourShowroom />
        </div>
      </section>

      <NextPage href="/contacto#ruta" label="Cómo llegar" />
    </main>
  );
}