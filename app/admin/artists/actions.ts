'use server';

import { revalidatePath } from 'next/cache';
import { createArtist as createArtistDb, updateArtist as updateArtistDb, deleteArtist as deleteArtistDb, CreateArtistInput, UpdateArtistInput, Artist } from '@/utils/server-artists';

export type ActionState = {
    message?: string;
    error?: string;
    success?: boolean;
    artist?: Artist;
};

export async function createArtistAction(
    prevState: ActionState | null,
    formData: FormData
): Promise<ActionState> {
    try {
        const artistId = formData.get('artist_id') as string | null;
        const fullName = formData.get('full_name') as string;
        const artForm = formData.get('art_form') as string;

        if (!fullName || !artForm) {
            return { error: 'Full name and art form are required.' };
        }

        const quote = formData.get('quote') as string | null;
        const biography = formData.get('biography') as string | null;
        const imageUrl = formData.get('image_url') as string | null;
        const instagram = formData.get('instagram') as string | null;
        const twitter = formData.get('twitter') as string | null;
        const website = formData.get('website') as string | null;
        const isFeatured = formData.get('is_featured') === 'true';

        const baseInput: UpdateArtistInput = {
            full_name: fullName,
            art_form: artForm,
            quote: quote || null,
            biography: biography || null,
            image_url: imageUrl || null,
            instagram: instagram || null,
            twitter: twitter || null,
            website: website || null,
            is_featured: isFeatured,
        };

        let result: { artist?: Artist; error?: string };

        if (artistId) {
            result = await updateArtistDb(artistId, baseInput);
        } else {
            // Select a random gradient for empty states when creating a new artist.
            const gradients = [
                "from-[#1a1208] to-[#321e0e]",
                "from-[#08101a] to-[#10203a]",
                "from-[#100a1a] to-[#201535]",
                "from-[#1c2e24] to-[#111e17]"
            ];
            const randomGradient = gradients[Math.floor(Math.random() * gradients.length)];

            const createInput: CreateArtistInput = {
                ...baseInput,
                gradient: randomGradient,
            } as CreateArtistInput;

            result = await createArtistDb(createInput);
        }

        if (result.error) {
            return { error: `Failed to ${artistId ? 'update' : 'create'} artist: ${result.error}` };
        }

        revalidatePath('/admin/artists');
        revalidatePath('/artists');

        return {
            success: true,
            message: artistId ? 'Artist updated successfully.' : 'Artist created successfully.',
            artist: result.artist,
        };

    } catch (err) {
        console.error('Error in createArtistAction:', err);
        return { error: 'An unexpected error occurred.' };
    }
}

export async function deleteArtistAction(id: string) {
    try {
        const { error } = await deleteArtistDb(id);
        if (error) {
            return { error: `Failed to delete artist: ${error}` };
        }
        revalidatePath('/admin/artists');
        return { success: true };
    } catch (err) {
        console.error('Error in deleteArtistAction:', err);
        return { error: 'An unexpected error occurred.' };
    }
}
