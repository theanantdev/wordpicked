import { NextRequest, NextResponse } from 'next/server';
import { AUTH_SESSION_COOKIE, parseAuthSession } from '@/utils/auth-session';
import { createAdminClient } from '@/utils/supabase/admin';

function isAdminSession(session: ReturnType<typeof parseAuthSession>) {
    if (!session) return false;
    return (session.isAdmin === true || session.is_admin === true) && session.role === 'admin';
}

export async function GET(request: NextRequest) {
    try {
        const session = parseAuthSession(request.cookies.get(AUTH_SESSION_COOKIE)?.value);

        if (!isAdminSession(session)) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const supabase = createAdminClient();
        const { data, error } = await supabase
            .from('newsletter_subscriptions')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw new Error(error.message);

        return NextResponse.json({ success: true, data });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: error instanceof Error ? error.message : 'Failed to fetch subscribers.' },
            { status: 500 },
        );
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const session = parseAuthSession(request.cookies.get(AUTH_SESSION_COOKIE)?.value);

        if (!isAdminSession(session)) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await request.json();

        if (!id) {
            return NextResponse.json({ success: false, error: 'ID is required.' }, { status: 400 });
        }

        const supabase = createAdminClient();
        const { error } = await supabase
            .from('newsletter_subscriptions')
            .delete()
            .eq('id', id);

        if (error) throw new Error(error.message);

        return NextResponse.json({ success: true, message: 'Subscriber removed.' });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: error instanceof Error ? error.message : 'Failed to delete subscriber.' },
            { status: 500 },
        );
    }
}
