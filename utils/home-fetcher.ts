import { createAdminClient } from '@/utils/supabase/admin';

type HomeArticle = {
    id: string;
    title: string;
    subtitle: string | null;
    slug: string;
    tags: string[] | null;
    author_name: string | null;
    publish_at: string | null;
    created_at: string;
    featured_image_url: string | null;
    category: string;
    view_count?: number | null;
};

type HomeArtist = {
    id: string;
    full_name: string;
    art_form: string;
    biography: string | null;
    image_url: string | null;
    views: number;
    created_at: string;
};

export type HomeData = {
    pickOfDay: HomeArticle | null;
    literature: {
        recent: HomeArticle[];
        popular: HomeArticle[];
    };
    films: {
        recent: HomeArticle[];
        popular: HomeArticle[];
    };
    artists: {
        recent: HomeArtist[];
        popular: HomeArtist[];
    };
};

export async function fetchHomeData(): Promise<HomeData> {
    const supabase = createAdminClient();

    // 1. Pick of the Day (Latest one)
    const { data: pickOfDay } = await supabase
        .from('articles')
        .select('id, title, subtitle, slug, tags, author_name, publish_at, created_at, featured_image_url, category')
        .eq('status', 'published')
        .eq('is_pick_of_the_day', true)
        .order('publish_at', { ascending: false, nullsFirst: false })
        .limit(1)
        .single();

    // 2. Literature
    const { data: litRecent } = await supabase
        .from('articles')
        .select('id, title, subtitle, slug, tags, author_name, publish_at, created_at, featured_image_url, category, view_count')
        .eq('status', 'published')
        .eq('category', 'literature')
        .order('publish_at', { ascending: false, nullsFirst: false })
        .limit(6);

    const { data: litPopular } = await supabase
        .from('articles')
        .select('id, title, subtitle, slug, tags, author_name, publish_at, created_at, featured_image_url, category, view_count')
        .eq('status', 'published')
        .eq('category', 'literature')
        .order('view_count', { ascending: false, nullsFirst: false })
        .limit(6);

    // 3. Films (Cinema)
    const { data: filmsRecent } = await supabase
        .from('articles')
        .select('id, title, subtitle, slug, tags, author_name, publish_at, created_at, featured_image_url, category, view_count')
        .eq('status', 'published')
        .eq('category', 'films')
        .order('publish_at', { ascending: false, nullsFirst: false })
        .limit(6);

    const { data: filmsPopular } = await supabase
        .from('articles')
        .select('id, title, subtitle, slug, tags, author_name, publish_at, created_at, featured_image_url, category, view_count')
        .eq('status', 'published')
        .eq('category', 'films')
        .order('view_count', { ascending: false, nullsFirst: false })
        .limit(6);

    // 4. Artists
    const { data: artistsRecent } = await supabase
        .from('artists')
        .select('id, full_name, art_form, biography, image_url, views, created_at')
        .order('created_at', { ascending: false })
        .limit(6);

    const { data: artistsPopular } = await supabase
        .from('artists')
        .select('id, full_name, art_form, biography, image_url, views, created_at')
        .order('views', { ascending: false })
        .limit(6);

    return {
        pickOfDay,
        literature: {
            recent: litRecent || [],
            popular: litPopular || [],
        },
        films: {
            recent: filmsRecent || [],
            popular: filmsPopular || [],
        },
        artists: {
            recent: artistsRecent || [],
            popular: artistsPopular || [],
        },
    };
}
