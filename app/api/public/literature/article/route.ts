import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/utils/supabase/admin';

export const revalidate = 3600; // 1 hour — article content rarely changes


type ContentBlock = {
    type?: string;
    data?: {
        text?: string;
        caption?: string;
        items?: string[];
    };
};

function mapCategory(tags: string[] | null | undefined, title: string) {
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

function formatLongDate(value: string | null) {
    if (!value) return 'Unknown Date';
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return 'Unknown Date';
    return parsed.toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
    });
}

export async function GET(request: NextRequest) {
    try {
        const slug = request.nextUrl.searchParams.get('slug');

        if (!slug) {
            return NextResponse.json({ success: false, error: 'slug is required.' }, { status: 400 });
        }

        const supabase = createAdminClient();

        const { data: article, error } = await supabase
            .from('articles')
            .select('id, title, subtitle, slug, tags, content, author_name, publish_at, created_at, featured_image_url, category, status')
            .eq('slug', slug)
            .eq('status', 'published')
            .single();

        if (error || !article) {
            return NextResponse.json({ success: false, error: 'Article not found.' }, { status: 404 });
        }

        const { data: relatedRaw } = await supabase
            .from('articles')
            .select('id, title, slug, featured_image_url, tags')
            .eq('status', 'published')
            .eq('category', 'literature')
            .neq('id', article.id)
            .order('publish_at', { ascending: false, nullsFirst: false })
            .limit(3);

        const related = (relatedRaw || []).map((item) => ({
            tag: mapCategory(item.tags, item.title),
            title: item.title,
            img:
                item.featured_image_url ||
                'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=800&auto=format&fit=crop',
            href: `/literature/${item.slug}`,
        }));

        const blocks = (((article.content as { blocks?: ContentBlock[] }) || {}).blocks || []) as ContentBlock[];

        const response = NextResponse.json({
            success: true,
            data: {
                article: {
                    id: article.id,
                    slug: article.slug,
                    title: article.title,
                    subtitle: article.subtitle || 'A thoughtful exploration of literature and contemporary writing.',
                    authorName: article.author_name || 'Editorial Desk',
                    categoryLabel: mapCategory(article.tags, article.title),
                    publishDate: formatLongDate(article.publish_at || article.created_at),
                    coverImageUrl:
                        article.featured_image_url ||
                        'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=800&auto=format&fit=crop',
                    tags: (article.tags || []).slice(0, 6),
                    blocks,
                },
                related,
            },
        });
        response.headers.set('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=7200');
        return response;
    } catch (error) {
        return NextResponse.json(
            { success: false, error: error instanceof Error ? error.message : 'Failed to fetch article.' },
            { status: 500 },
        );
    }
}
