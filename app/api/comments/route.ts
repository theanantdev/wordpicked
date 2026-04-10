import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/utils/supabase/admin';

// GET /api/comments?articleId=xxx  → approved comments for a post
export async function GET(request: NextRequest) {
    const articleId = request.nextUrl.searchParams.get('articleId');
    if (!articleId) return NextResponse.json({ success: false, error: 'articleId required' }, { status: 400 });

    const supabase = createAdminClient();
    const { data, error } = await supabase
        .from('comments')
        .select('id, name, message, created_at, liked')
        .eq('article_id', articleId)
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    return NextResponse.json({ success: true, data: data ?? [] });
}

// POST /api/comments  → submit a new comment (stored as pending)
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { articleId, articleSlug, articleTitle, articleType, name, email, message } = body;

        if (!articleId || !name?.trim() || !email?.trim() || !message?.trim()) {
            return NextResponse.json({ success: false, error: 'All fields are required.' }, { status: 400 });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json({ success: false, error: 'Invalid email address.' }, { status: 400 });
        }

        if (message.trim().length < 3) {
            return NextResponse.json({ success: false, error: 'Message is too short.' }, { status: 400 });
        }

        const supabase = createAdminClient();
        const { error } = await supabase.from('comments').insert([{
            article_id: articleId,
            article_slug: articleSlug ?? '',
            article_title: articleTitle ?? '',
            article_type: articleType === 'films' ? 'films' : 'literature',
            name: name.trim(),
            email: email.trim().toLowerCase(),
            message: message.trim(),
            status: 'pending',
        }]);

        if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
        return NextResponse.json({ success: true, message: 'Comment submitted! It will appear after review.' });
    } catch (err) {
        return NextResponse.json({ success: false, error: err instanceof Error ? err.message : 'Server error.' }, { status: 500 });
    }
}
