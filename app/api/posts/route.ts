import { NextRequest, NextResponse } from 'next/server';
import { AUTH_SESSION_COOKIE, parseAuthSession } from '@/utils/auth-session';
import { createAdminClient } from '@/utils/supabase/admin';

type PostRow = {
    id: string;
    title: string;
    slug: string | null;
    subtitle: string | null;
    category: string | null;
    status: string | null;
    publish_at: string | null;
    created_at: string | null;
    featured_image_url: string | null;
    view_count: number;
};

type PostListItem = {
    id: string;
    title: string;
    subtitle: string | null;
    slug: string;
    category: string;
    status: 'Published' | 'Draft';
    date: string;
    views: string;
    gradient: string;
    featured_image_url: string | null;
};

type SortOption = 'newest' | 'oldest' | 'az' | 'mostViewed';
type FilterOption = 'all' | 'literature' | 'films' | 'artists' | 'drafts';

function parsePositiveInt(value: string | null, fallback: number) {
    if (!value) return fallback;
    const parsed = Number.parseInt(value, 10);
    if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
    return parsed;
}

function isAdminSession(session: ReturnType<typeof parseAuthSession>) {
    if (!session) return false;
    return (session.isAdmin === true || session.is_admin === true) && session.role === 'admin';
}

function formatDisplayDate(value: string | null) {
    if (!value) return '-';
    const parsed = new Date(value);

    if (Number.isNaN(parsed.getTime())) return '-';

    return parsed.toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
    });
}

function normalizeCategory(value: string | null) {
    const normalized = (value || 'Literature').toLowerCase();

    if (normalized === 'film' || normalized === 'films') return 'Film';
    if (normalized === 'artist' || normalized === 'artists') return 'Artist';
    return 'Literature';
}

function gradientForCategory(category: string) {
    if (category === 'Film') return 'from-[#0a0d12] to-[#10182a]';
    if (category === 'Artist') return 'from-[#1a1208] to-[#321e0e]';
    return 'from-[#0e1a12] to-[#1a3222]';
}

export async function GET(request: NextRequest) {
    try {
        const session = parseAuthSession(request.cookies.get(AUTH_SESSION_COOKIE)?.value);

        if (!isAdminSession(session)) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const searchParams = request.nextUrl.searchParams;
        const search = (searchParams.get('search') || '').trim();
        const filter = (searchParams.get('filter') || 'all') as FilterOption;
        const sort = (searchParams.get('sort') || 'newest') as SortOption;
        const page = parsePositiveInt(searchParams.get('page'), 1);
        const pageSize = parsePositiveInt(searchParams.get('pageSize'), 10);
        const safePageSize = Math.min(pageSize, 100);

        const supabase = createAdminClient();
        let query = supabase
            .from('articles')
            .select('id, title, slug, subtitle, category, status, publish_at, created_at, featured_image_url, view_count', { count: 'exact' });

        if (search) {
            const escaped = search.replaceAll(',', ' ');
            query = query.or(`title.ilike.%${escaped}%,subtitle.ilike.%${escaped}%`);
        }

        if (filter === 'drafts') {
            query = query.eq('status', 'draft');
        } else if (filter === 'literature') {
            query = query.in('category', ['literature']);
        } else if (filter === 'films') {
            query = query.in('category', ['film', 'films']);
        } else if (filter === 'artists') {
            query = query.in('category', ['artist', 'artists']);
        }

        if (sort === 'oldest') {
            query = query.order('created_at', { ascending: true });
        } else if (sort === 'az') {
            query = query.order('title', { ascending: true });
        } else if (sort === 'mostViewed') {
            query = query.order('view_count', { ascending: false });
        } else {
            query = query.order('created_at', { ascending: false });
        }

        const from = (page - 1) * safePageSize;
        const to = from + safePageSize - 1;
        const { data, error, count } = await query.range(from, to);

        if (error) {
            return NextResponse.json({ success: false, error: error.message || 'Failed to fetch posts.' }, { status: 500 });
        }

        const posts: PostListItem[] = (data || []).map((post: PostRow) => {
            const category = normalizeCategory(post.category);
            const status = post.status === 'published' ? 'Published' : 'Draft';

            return {
                id: post.id,
                title: post.title,
                subtitle: post.subtitle || '-',
                category,
                status,
                date: formatDisplayDate(post.publish_at || post.created_at),
                views: (post.view_count || 0).toLocaleString(),
                gradient: gradientForCategory(category),
                featured_image_url: post.featured_image_url || null,
                slug: post.slug || '',
            };
        });

        const draftsCount = posts.filter((post) => post.status === 'Draft').length;
        const publishedCount = posts.length - draftsCount;
        const total = count || 0;
        const totalPages = Math.max(1, Math.ceil(total / safePageSize));

        return NextResponse.json({
            success: true,
            data: {
                posts,
                draftsCount,
                publishedCount,
                total,
                page,
                pageSize: safePageSize,
                totalPages,
                hasPrev: page > 1,
                hasNext: page < totalPages,
                search,
                filter,
                sort,
            },
        });
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to fetch posts.',
            },
            { status: 500 },
        );
    }
}