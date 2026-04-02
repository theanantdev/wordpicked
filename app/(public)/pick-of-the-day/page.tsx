import { PicOfTheDayHero } from "./_components/pick-of-the-day-hero";
import { FeaturedPickCard } from "./_components/featured-pick-card";
import { PicksGrid } from "./_components/picks-grid";

export default function PicOfTheDayPage() {
    return (
        <main className="bg-[#FAFAFA] min-h-screen">
            <PicOfTheDayHero />
            <FeaturedPickCard />
            <PicksGrid />
        </main>
    )
}