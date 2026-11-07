import Link from "next/link";
import Reveal from "@/components/ui/Reveal";

type Props = {
  href: string;
  label: string;
  kicker?: string;
};

/** Enlace grande al final de cada pagina para seguir recorriendo el sitio. */
export default function NextPage({ href, label, kicker = "Siguiente" }: Props) {
  return (
    <section className="border-t border-white/10 bg-night-900">
      <Link
        href={href}
        className="group relative block overflow-hidden px-6 py-24 sm:px-10 lg:px-[10.5%]"
      >
        <span
          aria-hidden
          className="absolute inset-0 origin-bottom scale-y-0 bg-gold-400 transition-transform duration-500 ease-out group-hover:scale-y-100"
        />
        <Reveal className="relative">
          <p className="font-display text-sm font-semibold uppercase tracking-[0.35em] text-gold-400 transition-colors duration-500 group-hover:text-night-950">
            {kicker}
          </p>
          <span className="mt-4 flex items-center justify-between gap-6 font-display text-5xl font-bold uppercase leading-none text-white transition-colors duration-500 group-hover:text-night-950 md:text-8xl">
            {label}
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="h-10 w-10 shrink-0 transition-transform duration-500 group-hover:translate-x-3 md:h-16 md:w-16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M3 12h18M14 5l7 7-7 7" />
            </svg>
          </span>
        </Reveal>
      </Link>
    </section>
  );
}