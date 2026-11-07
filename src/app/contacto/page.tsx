import type { Metadata } from "next";
import { pages } from "@/data/site";
import ContactoMap from "@/components/sections/ContactoMap";
import PageHero from "@/components/sections/PageHero";
import NextPage from "@/components/ui/NextPage";

export const metadata: Metadata = {
  title: "Contacto y ubicación",
  description: "Cómo llegar a la Torre 4000 en El Alto, La Paz.",
};

export default function ContactoPage() {
  const page = pages.contacto;

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

      <ContactoMap />

      <NextPage href="/" label="Volver al inicio" kicker="Regresar" />
    </main>
  );
}