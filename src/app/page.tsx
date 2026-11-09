import Hero from "@/components/sections/Hero";
import HomeHighlights from "@/components/sections/HomeHighlights";
import HomeIntro from "@/components/sections/HomeIntro";
import TorreAltura from "@/components/sections/TorreAltura";

export default function Home() {
  return (
    <main>
      <Hero />
      <HomeIntro />
      <TorreAltura />
      <HomeHighlights />
    </main>
  );
}