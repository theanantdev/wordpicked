import { NextRequest, NextResponse } from 'next/server';
import { AUTH_SESSION_COOKIE, parseAuthSession } from '@/utils/auth-session';
import { createAdminClient } from '@/utils/supabase/admin';

// GET /api/admin/comments?status=pending|approved|all
export async function GET(request: NextRequest) {
    const session = await parseAuthSession(request.cookies.get(AUTH_SESSION_COOKIE)?.value);
    if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const status = request.nextUrl.searchParams.get('status') ?? 'all';
    const supabase = createAdminClient();

    let query = supabase
        .from('comments')
        .select('id, article_id, article_slug, article_title, article_type, name, email, message, status, liked, created_at')
        .order('created_at', { ascending: false });

    if (status !== 'all') query = query.eq('status', status);

    const { data, error } = await query;
    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    return NextResponse.json({ success: true, data: data ?? [] });
}

// PATCH /api/admin/comments  { id, action: 'approve' | 'reject' | 'like' | 'unlike' }
export async function PATCH(request: NextRequest) {
    const session = await parseAuthSession(request.cookies.get(AUTH_SESSION_COOKIE)?.value);
    if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const { id, action } = await request.json();
    if (!id || !action) return NextResponse.json({ success: false, error: 'id and action required' }, { status: 400 });

    const supabase = createAdminClient();
    const updates: Record<string, unknown> = {};

    if (action === 'approve') updates.status = 'approved';
    else if (action === 'reject') updates.status = 'rejected';
    else if (action === 'like') updates.liked = true;
    else if (action === 'unlike') updates.liked = false;
    else return NextResponse.json({ success: false, error: 'Unknown action' }, { status: 400 });

    const { error } = await supabase.from('comments').update(updates).eq('id', id);
    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
}

// DELETE /api/admin/comments  { id }
export async function DELETE(request: NextRequest) {
    const session = await parseAuthSession(request.cookies.get(AUTH_SESSION_COOKIE)?.value);
    if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const { id } = await request.json();
    if (!id) return NextResponse.json({ success: false, error: 'id required' }, { status: 400 });

    const supabase = createAdminClient();
    const { error } = await supabase.from('comments').delete().eq('id', id);
    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
}
