import type { Metadata } from "next";
import { pages } from "@/data/site";
import PageHero from "@/components/sections/PageHero";
import RestauranteExperience from "@/components/sections/RestauranteExperience";
import Embers from "@/components/ui/Embers";
import NextPage from "@/components/ui/NextPage";

export const metadata: Metadata = {
  title: "Restaurante FUEGO 4086",
  description: "FUEGO 4086, presentado como el restaurante más alto de Latinoamérica, dentro de la Torre 4000.",
};

export default function RestaurantePage() {
  const page = pages.restaurante;

  return (
    <main>
      <PageHero
        crumb={page.crumb}
        eyebrow={page.eyebrow}
        title={page.title}
        subtitle={page.subtitle}
        image={page.image}
        imagePosition={page.position}
      >
        <Embers className="h-full w-full" />
      </PageHero>

      <RestauranteExperience />

      <NextPage href="/sostenibilidad" label="Sostenibilidad" />
    </main>
  );
}