
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
  const hasLiterature =
    homeData.literature.recent.length > 0 || homeData.literature.popular.length > 0;
  const hasFilms = homeData.films.recent.length > 0 || homeData.films.popular.length > 0;
  const hasArtists =
    homeData.artists.recent.length > 0 || homeData.artists.popular.length > 0;
  return (
    <main className="bg-[#fafafa] text-zinc-900 ">
      <HeroSection />
      {homeData.pickOfDay && (
        <PickOfDaySection initialData={homeData.pickOfDay} />
      )}
      {hasLiterature && hasFilms && (
        <StoriesSections
          initialLiterature={homeData.literature}
          initialFilms={homeData.films}
        />
      )}
      {hasFilms && <CinemaSection initialData={homeData.films} />}
      {hasArtists && <ArtistsSection initialData={homeData.artists} />}
      <NewsletterSection />
    </main>
  );
}
