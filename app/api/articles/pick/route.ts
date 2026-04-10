import { NextRequest, NextResponse } from 'next/server';
import { AUTH_SESSION_COOKIE, parseAuthSession } from '@/utils/auth-session';
import { createAdminClient } from '@/utils/supabase/admin';

export async function PATCH(request: NextRequest) {
    try {
        const session = await parseAuthSession(request.cookies.get(AUTH_SESSION_COOKIE)?.value);

        if (!session) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { id, isPickOfTheDay } = body;

        if (!id || typeof id !== 'string') {
            return NextResponse.json({ success: false, error: 'Article ID is required.' }, { status: 400 });
        }

        const supabase = createAdminClient();

        const { data, error } = await supabase
            .from('articles')
            .update({ is_pick_of_the_day: isPickOfTheDay === true })
            .eq('id', id)
            .select('id, title, is_pick_of_the_day')
            .single();

        if (error) {
            return NextResponse.json({ success: false, error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, data });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: error instanceof Error ? error.message : 'Request failed.' },
            { status: 500 },
        );
    }
}
