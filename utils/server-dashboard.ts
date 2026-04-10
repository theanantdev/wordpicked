import { createAdminClient } from '@/utils/supabase/admin';

export interface DashboardStats {
    totalPosts: number;
    postsThisMonth: number;
    drafts: number;
    artistProfiles: number;
    artistsThisMonth: number;
    picksScheduled: number;
}

export interface DashboardCategoryStat {
    category: string;
    count: number;
}

export interface DashboardRecentPost {
    id: string;
    id_actual: string;
    title: string;
    category: string;
    date: string;
    status: string;
    badgeClass: string;
    image: string;
    slug?: string;
}

export interface DashboardMostViewed {
    id: string;
    rank: string;
    title: string;
    meta: string;
    views: string;
    image: string;
    slug?: string;
}

export interface DashboardPopularByType {
    films: DashboardMostViewed[];
    artists: DashboardMostViewed[];
    literature: DashboardMostViewed[];
}

export interface DailyAnalytic {
    date: string;
    views: number;
}

const CATEGORY_COLORS: Record<string, string> = {
    "Literature": "bg-[#243D2C]/10 text-[#243D2C]",
    "Film": "bg-[#B5542A]/10 text-[#B5542A]",
    "Artist": "bg-[#A8812A]/10 text-[#A8812A]",
    "Draft": "text-[#A8812A] bg-[#A8812A]/10",
    "Live": "text-[#3A6648] bg-[#3A6648]/10",
};

function formatViews(views: number): string {
    if (views >= 1000) {
        return (views / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
    }
    return views.toString();
}

function getMonthYear(dateString: string): string {
    const d = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { month: 'short', year: 'numeric' };
    return d.toLocaleDateString('en-US', options);
}

function normalizeArticleCategory(category: string | null | undefined): 'films' | 'literature' | 'other' {
    const value = (category || '').trim().toLowerCase();
    if (value === 'film' || value === 'films' || value === 'cinema') return 'films';
    if (value === 'literature' || value === 'literary') return 'literature';
    return 'other';
}

function getArticleViews(article: { view_count?: number | null; views?: number | null }): number {
    return Number(article.view_count ?? article.views ?? 0);
}

function getLast30DaySeries(dailyAnalytics: Array<{ date: string; views: number | null }> | null | undefined): DailyAnalytic[] {
    const valuesByDate = new Map<string, number>();

    for (const row of dailyAnalytics || []) {
        if (!row?.date) continue;
        valuesByDate.set(row.date, Number(row.views || 0));
    }

    const result: DailyAnalytic[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let offset = 29; offset >= 0; offset--) {
        const date = new Date(today);
        date.setDate(today.getDate() - offset);
        const dateKey = date.toISOString().slice(0, 10);

        result.push({
            date: dateKey,
            views: valuesByDate.get(dateKey) ?? 0,
        });
    }

    return result;
}

export async function getDashboardData() {
    const supabase = createAdminClient();

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    const startOfMonthISO = startOfMonth.toISOString();

    const [
        { count: totalPosts },
        { count: postsThisMonth },
        { count: draftsCount },
        { count: artistsCount },
        { count: artistsThisMonth },
        { count: scheduledCount },
        { data: rawArticles },
        { data: rawArtists },
        { data: dailyAnalytics }
    ] = await Promise.all([
        supabase.from('articles').select('*', { count: 'exact', head: true }).eq('status', 'published'),
        supabase.from('articles').select('*', { count: 'exact', head: true }).eq('status', 'published').gte('created_at', startOfMonthISO),
        supabase.from('articles').select('*', { count: 'exact', head: true }).eq('status', 'draft'),
        supabase.from('artists').select('*', { count: 'exact', head: true }),
        supabase.from('artists').select('*', { count: 'exact', head: true }).gte('created_at', startOfMonthISO),
        supabase.from('articles').select('*', { count: 'exact', head: true }).gt('publish_at', new Date().toISOString()),
        supabase.from('articles').select('id, title, category, status, publish_at, created_at, view_count, views, featured_image_url, slug').order('created_at', { ascending: false }),
        supabase.from('artists').select('id, full_name, art_form, created_at, views, image_url').order('created_at', { ascending: false }),
        supabase.from('daily_analytics').select('date, views').order('date', { ascending: false }).limit(30)
    ]);

    const stats: DashboardStats = {
        totalPosts: totalPosts || 0,
        postsThisMonth: postsThisMonth || 0,
        drafts: draftsCount || 0,
        artistProfiles: artistsCount || 0,
        artistsThisMonth: artistsThisMonth || 0,
        picksScheduled: scheduledCount || 0,
    };

    const articles = rawArticles || [];
    const artists = rawArtists || [];
    const publishedArticles = articles.filter(a => a.status === 'published');

    // Category aggregation
    const categoryCounts: Record<string, number> = {};
    publishedArticles.forEach(a => {
        const cat = a.category ? a.category.charAt(0).toUpperCase() + a.category.slice(1).toLowerCase() : 'Other';
        // Normalize "Film" to "Films" and "Artist" to "Artists" for consistency if they appear as article categories
        let finalCat = cat === 'Film' ? 'Films' : cat;
        if (finalCat === 'Artist') finalCat = 'Artists';

        categoryCounts[finalCat] = (categoryCounts[finalCat] || 0) + 1;
    });

    // Remove "Artists" from categoryCounts because we add it explicitly from the artists table count
    delete categoryCounts['Artists'];

    const categoryStats: DashboardCategoryStat[] = [
        ...Object.entries(categoryCounts).map(([cat, count]) => ({ category: cat, count })),
        { category: 'Artists', count: artistsCount || 0 }
    ].sort((a, b) => b.count - a.count);

    // Recent Posts merging
    const combinedRecent = [
        ...publishedArticles.map(a => ({
            id: a.id,
            title: a.title,
            category: a.category ? a.category.charAt(0).toUpperCase() + a.category.slice(1).toLowerCase() : 'Article',
            date: getMonthYear(a.created_at),
            status: a.status === 'published' ? 'Live' : 'Draft',
            timestamp: new Date(a.created_at).getTime(),
            image: a.featured_image_url || '/placeholder.png',
            slug: a.slug
        })),
        ...artists.map(a => ({
            id: a.id,
            title: a.full_name,
            category: 'Artist',
            date: getMonthYear(a.created_at),
            status: 'Live',
            timestamp: new Date(a.created_at).getTime(),
            image: a.image_url || '/placeholder.png',
            slug: a.id // Artists use ID as slug usually
        }))
    ].sort((a, b) => b.timestamp - a.timestamp).slice(0, 10);

    const recentPosts: DashboardRecentPost[] = combinedRecent.map((p, idx) => ({
        id: (idx + 1).toString().padStart(2, '0'),
        id_actual: p.id,
        title: p.title,
        category: p.category,
        date: p.date,
        status: p.status,
        badgeClass: CATEGORY_COLORS[p.status] || CATEGORY_COLORS['Live'],
        image: p.image,
        slug: p.slug
    }));

    // Most Viewed merging
    const combinedViewed = [
        ...publishedArticles.map(a => ({
            id: a.id,
            title: a.title,
            meta: a.category ? a.category.charAt(0).toUpperCase() + a.category.slice(1).toLowerCase() : 'Article',
            viewsNum: getArticleViews(a),
            image: a.featured_image_url || '/placeholder.png',
            slug: a.slug
        })),
        ...artists.map(a => ({
            id: a.id,
            title: a.full_name,
            meta: 'Artist',
            viewsNum: a.views || 0,
            image: a.image_url || '/placeholder.png',
            slug: a.id
        }))
    ].sort((a, b) => b.viewsNum - a.viewsNum).slice(0, 5);

    const mostViewed: DashboardMostViewed[] = combinedViewed.map((v, idx) => ({
        id: v.id,
        rank: (idx + 1).toString(),
        title: v.title,
        meta: v.meta,
        views: formatViews(v.viewsNum),
        image: v.image,
        slug: v.slug
    }));

    const popularByType: DashboardPopularByType = {
        films: publishedArticles
            .filter(a => normalizeArticleCategory(a.category) === 'films')
            .sort((a, b) => getArticleViews(b) - getArticleViews(a))
            .slice(0, 5)
            .map((a, idx) => ({
                id: a.id,
                rank: (idx + 1).toString(),
                title: a.title,
                meta: 'Films',
                views: formatViews(getArticleViews(a)),
                image: a.featured_image_url || '/placeholder.png',
                slug: a.slug,
            })),
        artists: artists
            .slice()
            .sort((a, b) => Number(b.views || 0) - Number(a.views || 0))
            .slice(0, 5)
            .map((a, idx) => ({
                id: a.id,
                rank: (idx + 1).toString(),
                title: a.full_name,
                meta: 'Artists',
                views: formatViews(Number(a.views || 0)),
                image: a.image_url || '/placeholder.png',
                slug: a.id,
            })),
        literature: publishedArticles
            .filter(a => normalizeArticleCategory(a.category) === 'literature')
            .sort((a, b) => getArticleViews(b) - getArticleViews(a))
            .slice(0, 5)
            .map((a, idx) => ({
                id: a.id,
                rank: (idx + 1).toString(),
                title: a.title,
                meta: 'Literature',
                views: formatViews(getArticleViews(a)),
                image: a.featured_image_url || '/placeholder.png',
                slug: a.slug,
            })),
    };

    // Daily Stats for graph (sorted chronologically for charting)
    const dailyStats = getLast30DaySeries(dailyAnalytics || []);

    return {
        stats,
        categoryStats,
        recentPosts,
        mostViewed,
        popularByType,
        dailyStats
    };
}
