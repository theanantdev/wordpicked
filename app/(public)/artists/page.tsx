import { ArtistsHero } from "./_components/artists-hero"
import { FeaturedArtist } from "./_components/featured-artist"
import { ArtistsContent } from "./_components/artists-content"
import { getArtists } from "@/utils/server-artists"

export const revalidate = 300; // 5 minutes — balance freshness & performance

export default async function ArtistsPage() {
    const artists = await getArtists();
    const featuredArtist = artists.find(a => a.is_featured) || artists[0];
    // console.log(featuredArtist)

    return (
        <main className=" min-h-screen">
            <ArtistsHero />
            {featuredArtist && <FeaturedArtist artist={featuredArtist} />}
            <ArtistsContent artists={artists} />
        </main>
    )
}