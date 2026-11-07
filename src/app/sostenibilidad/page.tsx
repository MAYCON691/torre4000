import type { Metadata } from "next";
import { pages } from "@/data/site";
import PageHero from "@/components/sections/PageHero";
import SostenibilidadStack from "@/components/sections/SostenibilidadStack";
import NextPage from "@/components/ui/NextPage";

export const metadata: Metadata = {
  title: "Sostenibilidad",
  description: "Torre 4000, el primer rascacielos ecológico de altura.",
};

export default function SostenibilidadPage() {
  const page = pages.sostenibilidad;

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

      <SostenibilidadStack />

      <NextPage href="/eventos" label="Eventos" />
    </main>
  );
}