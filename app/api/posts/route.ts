import { NextRequest, NextResponse } from 'next/server';
import { AUTH_SESSION_COOKIE, parseAuthSession } from '@/utils/auth-session';
import { createAdminClient } from '@/utils/supabase/admin';

type PostRow = {
    id: string;
    title: string;
    subtitle: string | null;
    category: string | null;
    status: string | null;
    publish_at: string | null;
    created_at: string | null;
    featured_image_url: string | null;
};

type PostListItem = {
    id: string;
    title: string;
    sub: string;
    category: string;
    status: 'Published' | 'Draft';
    date: string;
    views: string;
    gradient: string;
    featured_image_url: string | null;
};

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

        const supabase = createAdminClient();
        const { data, error } = await supabase
            .from('articles')
            .select('id, title, subtitle, category, status, publish_at, created_at, featured_image_url')
            .order('created_at', { ascending: false })
            .limit(100);

        if (error) {
            return NextResponse.json({ success: false, error: error.message || 'Failed to fetch posts.' }, { status: 500 });
        }

        const posts: PostListItem[] = (data || []).map((post: PostRow) => {
            const category = normalizeCategory(post.category);
            const status = post.status === 'published' ? 'Published' : 'Draft';

            return {
                id: post.id,
                title: post.title,
                sub: post.subtitle || '-',
                category,
                status,
                date: formatDisplayDate(post.publish_at || post.created_at),
                views: '-',
                gradient: gradientForCategory(category),
                featured_image_url: post.featured_image_url || null,
            };
        });

        const draftsCount = posts.filter((post) => post.status === 'Draft').length;
        const publishedCount = posts.length - draftsCount;

        return NextResponse.json({
            success: true,
            data: {
                posts,
                draftsCount,
                publishedCount,
                total: posts.length,
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