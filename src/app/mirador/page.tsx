import type { Metadata } from "next";
import { mirador, pages } from "@/data/site";
import MiradorGallery from "@/components/sections/MiradorGallery";
import PageHero from "@/components/sections/PageHero";
import NextPage from "@/components/ui/NextPage";
import ScrollText from "@/components/ui/ScrollText";

export const metadata: Metadata = {
  title: "Mirador",
  description: "Fotografías y vistas panorámicas de La Paz y El Alto desde la Torre 4000.",
};

export default function MiradorPage() {
  const page = pages.mirador;

  return (
    <main>
      <PageHero
        crumb={page.crumb}
        eyebrow={page.eyebrow}
        title={page.title}
        subtitle={page.subtitle}
        image={page.image}
        imagePosition={page.position}
      />

      <section className="bg-night-900">
        <div className="mx-auto max-w-[1200px] px-6 py-28 lg:px-8 lg:py-40">
          <ScrollText
            text={mirador.statement}
            className="font-serif text-4xl leading-[1.15] text-white md:text-6xl"
          />
        </div>
      </section>

      <MiradorGallery />

      <NextPage href="/restaurante" label="Restaurante" />
    </main>
  );
}