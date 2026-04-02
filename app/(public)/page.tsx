import { ArtistsSection } from "./_components/artists-section";
import { CinemaSection } from "./_components/cinema-section";
import { HeroSection } from "./_components/hero-section";
import { NewsletterSection } from "./_components/newsletter-section";
import { PickOfDaySection } from "./_components/pick-of-day-section";
import { StoriesSections } from "./_components/stories-sections";

export default function Home() {
  return (
    <main className="bg-[#fafafa] text-zinc-900">
      <HeroSection />
      <PickOfDaySection />
      <StoriesSections />
      <CinemaSection />
      <ArtistsSection />
      <NewsletterSection />

    </main>
  );
}
