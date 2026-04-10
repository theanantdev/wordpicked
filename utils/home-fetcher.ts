import { createAdminClient } from '@/utils/supabase/admin';

type HomeArticle = {
    id: string;
    title: string;
    subtitle: string;
    slug: string;
    tags: string[];
    author_name: string;
    publish_at: string;
    created_at: string;
    featured_image_url: string;
    category: string;
    view_count: number;
};

type HomeArtist = {
    id: string;
    full_name: string;
    art_form: string;
    biography: string;
    image_url: string;
    views: number;
    created_at: string;
};

type RawHomeArticle = {
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

type RawHomeArtist = {
    id: string;
    full_name: string;
    art_form: string;
    biography: string | null;
    image_url: string | null;
    views: number | null;
    created_at: string;
};

function normalizeArticle(article: RawHomeArticle): HomeArticle {
    return {
        id: article.id,
        title: article.title,
        subtitle: article.subtitle ?? '',
        slug: article.slug,
        tags: article.tags ?? [],
        author_name: article.author_name ?? 'Editorial Staff',
        publish_at: article.publish_at ?? article.created_at,
        created_at: article.created_at,
        featured_image_url: article.featured_image_url ?? '',
        category: article.category,
        view_count: Number(article.view_count ?? 0),
    };
}

function normalizeArtist(artist: RawHomeArtist): HomeArtist {
    return {
        id: artist.id,
        full_name: artist.full_name,
        art_form: artist.art_form,
        biography: artist.biography ?? '',
        image_url: artist.image_url ?? '',
        views: Number(artist.views ?? 0),
        created_at: artist.created_at,
    };
}

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
        .select('id, title, subtitle, slug, tags, author_name, publish_at, created_at, featured_image_url, category, view_count')
        .eq('status', 'published')
        .eq('is_pick_of_the_day', true)
        .order('publish_at', { ascending: false, nullsFirst: false })
        .limit(1)
        .single<RawHomeArticle>();

    // 2. Literature
    const { data: litRecent } = await supabase
        .from('articles')
        .select('id, title, subtitle, slug, tags, author_name, publish_at, created_at, featured_image_url, category, view_count')
        .eq('status', 'published')
        .eq('category', 'literature')
        .order('publish_at', { ascending: false, nullsFirst: false })
        .limit(6)
        .returns<RawHomeArticle[]>();

    const { data: litPopular } = await supabase
        .from('articles')
        .select('id, title, subtitle, slug, tags, author_name, publish_at, created_at, featured_image_url, category, view_count')
        .eq('status', 'published')
        .eq('category', 'literature')
        .order('view_count', { ascending: false, nullsFirst: false })
        .limit(6)
        .returns<RawHomeArticle[]>();

    // 3. Films (Cinema)
    const { data: filmsRecent } = await supabase
        .from('articles')
        .select('id, title, subtitle, slug, tags, author_name, publish_at, created_at, featured_image_url, category, view_count')
        .eq('status', 'published')
        .eq('category', 'films')
        .order('publish_at', { ascending: false, nullsFirst: false })
        .limit(6)
        .returns<RawHomeArticle[]>();

    const { data: filmsPopular } = await supabase
        .from('articles')
        .select('id, title, subtitle, slug, tags, author_name, publish_at, created_at, featured_image_url, category, view_count')
        .eq('status', 'published')
        .eq('category', 'films')
        .order('view_count', { ascending: false, nullsFirst: false })
        .limit(6)
        .returns<RawHomeArticle[]>();

    // 4. Artists
    const { data: artistsRecent } = await supabase
        .from('artists')
        .select('id, full_name, art_form, biography, image_url, views, created_at')
        .order('created_at', { ascending: false })
        .limit(6)
        .returns<RawHomeArtist[]>();

    const { data: artistsPopular } = await supabase
        .from('artists')
        .select('id, full_name, art_form, biography, image_url, views, created_at')
        .order('views', { ascending: false })
        .limit(6)
        .returns<RawHomeArtist[]>();

    return {
        pickOfDay: pickOfDay ? normalizeArticle(pickOfDay) : null,
        literature: {
            recent: (litRecent || []).map(normalizeArticle),
            popular: (litPopular || []).map(normalizeArticle),
        },
        films: {
            recent: (filmsRecent || []).map(normalizeArticle),
            popular: (filmsPopular || []).map(normalizeArticle),
        },
        artists: {
            recent: (artistsRecent || []).map(normalizeArtist),
            popular: (artistsPopular || []).map(normalizeArtist),
        },
    };
}
