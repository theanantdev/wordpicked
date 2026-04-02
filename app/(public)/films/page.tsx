import { FilmsHero } from "./_components/films-hero";
import { FilmsContent } from "./_components/films-content";
export default function FilmsPage() {
    return (
        <main className="bg-[#FAFAFA] min-h-screen">
            <FilmsHero />
            <FilmsContent />
        </main>
    )
}