import { NextRequest, NextResponse } from 'next/server';
import { AUTH_SESSION_COOKIE, parseAuthSession } from '@/utils/auth-session';
import { createAdminClient } from '@/utils/supabase/admin';

export async function GET(request: NextRequest) {
    try {
        const session = await parseAuthSession(request.cookies.get(AUTH_SESSION_COOKIE)?.value);

        if (!session) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const supabase = createAdminClient();

        const { data, error } = await supabase
            .from('articles')
            .select('id, title, subtitle, category, slug, featured_image_url, author_name, publish_at, is_pick_of_the_day')
            .eq('status', 'published')
            .in('category', ['literature', 'films'])
            .order('publish_at', { ascending: false });

        if (error) {
            return NextResponse.json({ success: false, error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, data: data ?? [] });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: error instanceof Error ? error.message : 'Request failed.' },
            { status: 500 },
        );
    }
}
