import { home } from "@/data/site";
import Marquee from "@/components/ui/Marquee";
import ScrollText from "@/components/ui/ScrollText";

/** Frase de bienvenida que se ilumina con el scroll + franja en movimiento. */
export default function HomeIntro() {
  return (
    <section className="relative bg-night-900">
      <div className="border-y border-white/10 bg-night-950 py-5">
        <Marquee
          items={home.marquee}
          speed={-3}
          itemClassName="font-display text-2xl font-semibold uppercase tracking-[0.25em] text-white/80 md:text-3xl"
        />
      </div>

      <div className="mx-auto max-w-[1200px] px-6 py-28 lg:px-8 lg:py-40">
        <ScrollText
          text={home.statement}
          className="font-serif text-4xl leading-[1.15] text-white md:text-6xl lg:text-7xl"
        />
      </div>
    </section>
  );
}