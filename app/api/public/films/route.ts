import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/utils/supabase/admin';

export const revalidate = 300; // 5 minutes Next.js route cache


type Category = 'FICTION' | 'NON-FICTION' | 'POETRY';
type SortOption = 'LATEST' | 'OLDEST' | 'TITLE_A_Z';

function parsePositiveInt(value: string | null, fallback: number) {
    if (!value) return fallback;
    const parsed = Number.parseInt(value, 10);
    if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
    return parsed;
}

function mapCategory(tags: string[] | null | undefined, title: string): Category {
    const normalizedTags = (tags || []).map((tag) => tag.toLowerCase());
    const normalizedTitle = title.toLowerCase();

    if (normalizedTags.some((tag) => tag.includes('poetry') || tag.includes('poem')) || normalizedTitle.includes('poetry')) {
        return 'POETRY';
    }

    if (
        normalizedTags.some((tag) => tag.includes('essay') || tag.includes('review') || tag.includes('non-fiction')) ||
        normalizedTitle.includes('history') ||
        normalizedTitle.includes('argument')
    ) {
        return 'NON-FICTION';
    }

    return 'FICTION';
}

function estimateReadTime(content: unknown) {
    if (!content || typeof content !== 'object') return '5 MIN READ';

    const contentRecord = content as { blocks?: Array<{ data?: { text?: string; items?: string[] } }> };
    const blocks = contentRecord.blocks || [];

    let wordCount = 0;

    for (const block of blocks) {
        const text = block?.data?.text || '';
        const items = block?.data?.items || [];

        wordCount += text.split(/\s+/).filter(Boolean).length;
        for (const item of items) {
            wordCount += item.split(/\s+/).filter(Boolean).length;
        }
    }

    const minutes = Math.max(3, Math.ceil(wordCount / 200));
    return `${String(minutes).padStart(2, '0')} MIN READ`;
}

function toIsoDate(value: string | null) {
    if (!value) return new Date().toISOString().slice(0, 10);
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return new Date().toISOString().slice(0, 10);
    return date.toISOString().slice(0, 10);
}

function makeSlugFromTitle(id: string, title: string) {
    const base = title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');

    return `${base}-${id.slice(0, 8)}`;
}

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const search = (searchParams.get('search') || '').trim();
        const category = (searchParams.get('category') || 'ALL').toUpperCase();
        const sort = (searchParams.get('sort') || 'LATEST').toUpperCase() as SortOption;
        const page = parsePositiveInt(searchParams.get('page'), 1);
        const pageSize = Math.min(parsePositiveInt(searchParams.get('pageSize'), 10), 60);

        const supabase = createAdminClient();

        let query = supabase
            .from('articles')
            .select('id, title, subtitle, slug, tags, status, publish_at, created_at, author_name, featured_image_url, content, category')
            .eq('status', 'published')
            .eq('category', 'films');

        if (search) {
            const escaped = search.replaceAll(',', ' ');
            query = query.or(`title.ilike.%${escaped}%,subtitle.ilike.%${escaped}%,author_name.ilike.%${escaped}%`);
        }

        if (sort === 'OLDEST') {
            query = query.order('publish_at', { ascending: true, nullsFirst: false });
        } else if (sort === 'TITLE_A_Z') {
            query = query.order('title', { ascending: true });
        } else {
            query = query.order('publish_at', { ascending: false, nullsFirst: false });
        }

        const { data, error } = await query.limit(1000);

        if (error) {
            return NextResponse.json({ success: false, error: error.message || 'Failed to fetch films.' }, { status: 500 });
        }

        const mapped = (data || []).map((row) => {
            const mappedCategory = mapCategory(row.tags, row.title);

            return {
                id: row.id,
                category: mappedCategory,
                readTime: estimateReadTime(row.content),
                releaseDate: toIsoDate(row.publish_at || row.created_at),
                title: row.title,
                author: row.author_name ? `By ${row.author_name}` : 'By Editorial Desk',
                description: row.subtitle || 'A thoughtful exploration of cinema and film.',
                imageUrl:
                    row.featured_image_url ||
                    'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=600&auto=format&fit=crop',
                slug: row.slug || makeSlugFromTitle(row.id, row.title),
            };
        });

        const filteredByCategory = category === 'ALL' ? mapped : mapped.filter((item) => item.category === category);
        const total = filteredByCategory.length;
        const totalPages = Math.max(1, Math.ceil(total / pageSize));
        const safePage = Math.min(page, totalPages);
        const from = (safePage - 1) * pageSize;
        const to = from + pageSize;
        const pageItems = filteredByCategory.slice(from, to);

        const response = NextResponse.json({
            success: true,
            data: {
                items: pageItems,
                total,
                page: safePage,
                pageSize,
                totalPages,
                hasPrev: safePage > 1,
                hasNext: safePage < totalPages,
                search,
                category,
                sort,
            },
        });
        response.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
        return response;
    } catch (error) {
        return NextResponse.json(
            { success: false, error: error instanceof Error ? error.message : 'Failed to fetch films.' },
            { status: 500 },
        );
    }
}
