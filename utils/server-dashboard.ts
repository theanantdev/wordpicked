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
    title: string;
    category: string;
    date: string;
    status: string;
    badgeClass: string;
}

export interface DashboardMostViewed {
    id: string;
    rank: string;
    title: string;
    meta: string;
    views: string;
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

export async function getDashboardData() {
    const supabase = await createAdminClient();

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
        { data: rawArtists }
    ] = await Promise.all([
        supabase.from('articles').select('*', { count: 'exact', head: true }).eq('status', 'published'),
        supabase.from('articles').select('*', { count: 'exact', head: true }).eq('status', 'published').gte('created_at', startOfMonthISO),
        supabase.from('articles').select('*', { count: 'exact', head: true }).eq('status', 'draft'),
        supabase.from('artists').select('*', { count: 'exact', head: true }),
        supabase.from('artists').select('*', { count: 'exact', head: true }).gte('created_at', startOfMonthISO),
        supabase.from('articles').select('*', { count: 'exact', head: true }).gt('publish_at', new Date().toISOString()),
        supabase.from('articles').select('id, title, category, status, publish_at, created_at, views').order('created_at', { ascending: false }),
        supabase.from('artists').select('id, full_name, art_form, created_at, views').order('created_at', { ascending: false }),
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
    
    const categoryCounts: Record<string, number> = {};
    articles.forEach(a => {
        const cat = a.category ? a.category.charAt(0).toUpperCase() + a.category.slice(1).toLowerCase() : 'Other';
        categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    });

    const categoryStats: DashboardCategoryStat[] = [
        ...Object.entries(categoryCounts).map(([cat, count]) => ({ category: cat, count })),
        { category: 'Artists', count: artistsCount || 0 }
    ].sort((a, b) => b.count - a.count);

    const combinedRecent = [
        ...articles.map(a => ({
            id: a.id,
            title: a.title,
            category: a.category ? a.category.charAt(0).toUpperCase() + a.category.slice(1).toLowerCase() : 'Article',
            date: getMonthYear(a.created_at),
            status: a.status === 'published' ? 'Live' : 'Draft',
            timestamp: new Date(a.created_at).getTime()
        })),
        ...artists.map(a => ({
            id: a.id,
            title: a.full_name,
            category: 'Artist',
            date: getMonthYear(a.created_at),
            status: 'Live',
            timestamp: new Date(a.created_at).getTime()
        }))
    ].sort((a, b) => b.timestamp - a.timestamp).slice(0, 10);

    const recentPosts: DashboardRecentPost[] = combinedRecent.map((p, idx) => ({
        id: (idx + 1).toString().padStart(2, '0'),
        title: p.title,
        category: p.category,
        date: p.date,
        status: p.status,
        badgeClass: CATEGORY_COLORS[p.status] || CATEGORY_COLORS['Live']
    }));

    const combinedViewed = [
        ...articles.map(a => ({
            id: a.id,
            title: a.title,
            meta: a.category ? a.category.charAt(0).toUpperCase() + a.category.slice(1).toLowerCase() : 'Article',
            viewsNum: a.views || 0
        })),
        ...artists.map(a => ({
            id: a.id,
            title: a.full_name,
            meta: 'Artist',
            viewsNum: a.views || 0
        }))
    ].sort((a, b) => b.viewsNum - a.viewsNum).slice(0, 5);

    const mostViewed: DashboardMostViewed[] = combinedViewed.map((v, idx) => ({
        id: v.id,
        rank: (idx + 1).toString(),
        title: v.title,
        meta: v.meta,
        views: formatViews(v.viewsNum)
    }));

    return {
        stats,
        categoryStats,
        recentPosts,
        mostViewed
    };
}
