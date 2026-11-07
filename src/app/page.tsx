import Hero from "@/components/sections/Hero";
import HomeHighlights from "@/components/sections/HomeHighlights";
import HomeIntro from "@/components/sections/HomeIntro";

export default function Home() {
  return (
    <main>
      <Hero />
      <HomeIntro />
      <HomeHighlights />
    </main>
  );
}