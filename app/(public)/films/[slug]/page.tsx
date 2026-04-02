import { FilmHero } from "../_components/film-hero";
import { FilmTrailer } from "../_components/film-trailer";
import { FilmContent } from "../_components/film-content";
import { FilmRelated } from "../_components/film-related";

export default function FilmEditorialPage() {
    return (
        <main className="w-full bg-[#FDF9F2] min-h-screen">
            <FilmHero />
            <FilmTrailer />
            <FilmContent />
            <FilmRelated />
        </main>
    );
}