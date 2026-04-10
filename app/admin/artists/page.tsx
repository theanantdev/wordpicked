import { getArtists } from "@/utils/server-artists";
import { ArtistsClient } from "./_components/artists-client";

export const dynamic = 'force-dynamic';

export default async function ArtistsPage() {
    const artists = await getArtists();

    return (
        <ArtistsClient initialArtists={artists} />
    );
}
