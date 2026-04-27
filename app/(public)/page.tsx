
import { ArtistsSection } from "./_components/artists-section";
import { CinemaSection } from "./_components/cinema-section";
import { HeroSection } from "./_components/hero-section";
import { NewsletterSection } from "./_components/newsletter-section";
import { PickOfDaySection } from "./_components/pick-of-day-section";
import { StoriesSections } from "./_components/stories-sections";
import { fetchHomeData } from "@/app/api/public/home/home-fetcher";

export const revalidate = 600; // ISR: Revalidate every 10 minutes

export default async function Home() {
  const homeData = await fetchHomeData();
  // console.log("Fetched home data:", homeData.artists); // Debug log to verify data structure
  return (
    <main className="bg-[#fafafa] text-zinc-900">
      <HeroSection />
      <PickOfDaySection initialData={homeData.pickOfDay} />
      <StoriesSections
        initialLiterature={homeData.literature}
        initialFilms={homeData.films}
      />
      <CinemaSection initialData={homeData.films} />
      <ArtistsSection initialData={homeData.artists} />
      <NewsletterSection />
    </main>
  );
}
