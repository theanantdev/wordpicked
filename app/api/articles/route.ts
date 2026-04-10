import { NextRequest, NextResponse } from 'next/server';
import { AUTH_SESSION_COOKIE, parseAuthSession } from '@/utils/auth-session';
import { createAdminClient } from '@/utils/supabase/admin';

function makeSlug(value: string) {
    return value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
}

export async function POST(request: NextRequest) {
    try {
        const session = await parseAuthSession(request.cookies.get(AUTH_SESSION_COOKIE)?.value);

        if (!session) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const {
            title,
            subtitle,
            category,
            subcategory,
            tags,
            content,
            featuredImageUrl,
            isPickOfTheDay,
            status,
            publishAt,
        } = body;

        if (!title || typeof title !== 'string') {
            return NextResponse.json({ success: false, error: 'Title is required.' }, { status: 400 });
        }

        if (!content || !Array.isArray(content.blocks) || content.blocks.length === 0) {
            return NextResponse.json({ success: false, error: 'Article content is required.' }, { status: 400 });
        }

        const supabase = createAdminClient();
        const slugBase = makeSlug(title);
        const slug = `${slugBase}-${Date.now()}`;
        const now = new Date().toISOString();

        const mergedTags = Array.from(
            new Set(
                [subcategory, ...(Array.isArray(tags) ? tags : [])]
                    .filter((tag) => typeof tag === 'string')
                    .map((tag: string) => tag.trim())
                    .filter(Boolean),
            ),
        );

        const normalizedSubcategory = typeof subcategory === 'string' ? subcategory.trim() : '';

        const payload = {
            title: title.trim(),
            subtitle: typeof subtitle === 'string' ? subtitle.trim() : null,
            slug,
            category: typeof category === 'string' ? category : 'literature',
            subcategory: normalizedSubcategory || null,
            tags: mergedTags,
            content,
            featured_image_url: typeof featuredImageUrl === 'string' ? featuredImageUrl : null,
            is_pick_of_the_day: isPickOfTheDay === true,
            status: status === 'published' ? 'published' : 'draft',
            publish_at: publishAt || now,
            author_name: session.name,
            author_email: session.email,
            created_at: now,
            updated_at: now,
        };

        const { data, error } = await supabase
            .from('articles')
            .insert([payload])
            .select('*')
            .single();

        if (error) {
            return NextResponse.json(
                {
                    success: false,
                    error: error.message || 'Failed to save article.',
                },
                { status: 500 },
            );
        }

        return NextResponse.json({ success: true, data });
    } catch (error) {
        console.error("Error in POST /api/articles:", error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to save article.',
            },
            { status: 500 },
        );
    }
}
