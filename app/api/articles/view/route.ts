import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/utils/supabase/admin';

export const dynamic = 'force-dynamic';

// POST /api/articles/view { articleId: string }
export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const articleId = body?.articleId;

		if (!articleId || typeof articleId !== 'string') {
			return NextResponse.json({ success: false, error: 'articleId required' }, { status: 400 });
		}

		const supabase = createAdminClient();
		const safeArticleId = articleId.replace(/'/g, "''");

		const { error } = await supabase.rpc('exec_sql', {
			sql: `
				UPDATE public.articles
				SET view_count = COALESCE(view_count, 0) + 1
				WHERE id = '${safeArticleId}';

				INSERT INTO public.daily_analytics (date, views)
				VALUES (CURRENT_DATE, 1)
				ON CONFLICT (date)
				DO UPDATE SET views = public.daily_analytics.views + 1;
			`,
		});

		if (error) {
			return NextResponse.json({ success: false, error: error.message }, { status: 500 });
		}

		return NextResponse.json({ success: true });
	} catch (error) {
		const message = error instanceof Error ? error.message : 'Server error';
		return NextResponse.json({ success: false, error: message }, { status: 500 });
	}
}
