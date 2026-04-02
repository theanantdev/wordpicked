import { ArtistsHero } from "./_components/artists-hero"
import { FeaturedArtist } from "./_components/featured-artist"
import { ArtistsContent } from "./_components/artists-content"

export default function ArtistsPage() {
    return (
        <main className="bg-[#FDF9F2] min-h-screen">
            <ArtistsHero />
            <FeaturedArtist />
            <ArtistsContent />
        </main>
    )
}