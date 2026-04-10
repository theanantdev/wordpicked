import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/utils/supabase/admin';

// POST /api/articles/view  { articleId: string }
// Atomically increments view_count — called client-side once per session.
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
    try {
        const { articleId } = await request.json();
        if (!articleId || typeof articleId !== 'string') {
            return NextResponse.json({ success: false, error: 'articleId required' }, { status: 400 });
        }

        const supabase = createAdminClient();

        // Use raw SQL for an atomic increment that won't race with other requests
        const { error } = await supabase
            .from('articles')
            .update({ view_count: supabase.rpc as unknown as number })  // type workaround below
            .eq('id', articleId);

        // Direct SQL via rpc — most reliable atomic approach
        const { error: rpcError } = await supabase.rpc('exec_sql', {
            sql: `UPDATE public.articles SET view_count = COALESCE(view_count, 0) + 1 WHERE id = '${articleId.replace(/'/g, "''")}'`,
        });

        if (rpcError) {
            console.error('view increment error:', rpcError.message);
            return NextResponse.json({ success: false, error: rpcError.message }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (err) {
        return NextResponse.json({ success: false, error: err instanceof Error ? err.message : 'Server error' }, { status: 500 });
    }
}
