import type { Metadata } from "next";
import { pages } from "@/data/site";
import EventosShowcase from "@/components/sections/EventosShowcase";
import PageHero from "@/components/sections/PageHero";
import NextPage from "@/components/ui/NextPage";

export const metadata: Metadata = {
  title: "Eventos",
  description: "Celebraciones, encuentros y causas solidarias en la Torre 4000.",
};

export default function EventosPage() {
  const page = pages.eventos;

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

      <EventosShowcase />

      <NextPage href="/contacto" label="Cómo llegar" />
    </main>
  );
}