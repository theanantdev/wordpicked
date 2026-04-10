import { createAdminClient } from '@/utils/supabase/admin';

export interface Artist {
    id: string;
    full_name: string;
    art_form: string;
    quote: string | null;
    biography: string | null;
    image_url: string | null;
    instagram: string | null;
    twitter: string | null;
    website: string | null;
    is_featured: boolean;
    posts: number;
    views: number;
    gradient: string;
    created_at: string;
    updated_at: string;
}

export type CreateArtistInput = Omit<Artist, 'id' | 'created_at' | 'updated_at' | 'posts' | 'views'>;

export async function getArtists(): Promise<Artist[]> {
    try {
        const supabase = await createAdminClient();
        const { data, error } = await supabase
            .from('artists')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching artists:', error);
            return [];
        }

        return data || [];
    } catch (error) {
        console.error('Exception fetching artists:', error);
        return [];
    }
}

export async function getFeaturedArtists(): Promise<Artist[]> {
    try {
        const supabase = await createAdminClient();
        const { data, error } = await supabase
            .from('artists')
            .select('*')
            .eq('is_featured', true)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching featured artists:', error);
            return [];
        }

        return data || [];
    } catch (error) {
        console.error('Exception fetching featured artists:', error);
        return [];
    }
}

export async function createArtist(input: CreateArtistInput): Promise<{ artist?: Artist; error?: string }> {
    try {
        const supabase = await createAdminClient();
        const { data, error } = await supabase
            .from('artists')
            .insert(input)
            .select()
            .single();

        if (error) {
            console.error('Error creating artist:', error);
            return { error: error.message };
        }

        return { artist: data as Artist };
    } catch (error) {
        console.error('Exception creating artist:', error);
        return { error: 'Failed to create artist.' };
    }
}

export async function deleteArtist(id: string): Promise<{ error?: string }> {
    try {
        const supabase = await createAdminClient();
        const { error } = await supabase
            .from('artists')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting artist:', error);
            return { error: error.message };
        }

        return {};
    } catch (error) {
        console.error('Exception deleting artist:', error);
        return { error: 'Failed to delete artist.' };
    }
}
