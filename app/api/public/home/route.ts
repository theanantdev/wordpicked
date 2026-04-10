import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/utils/supabase/admin';

export const revalidate = 600; // 10 minutes cache

export async function GET(request: NextRequest) {
    try {
        const supabase = createAdminClient();

        // 1. Pick of the Day (Latest one)
        const { data: pickOfDay } = await supabase
            .from('articles')
            .select('id, title, subtitle, slug, tags, author_name, publish_at, created_at, featured_image_url, category')
            .eq('status', 'published')
            .eq('is_pick_of_the_day', true)
            .order('publish_at', { ascending: false, nullsFirst: false })
            .limit(1)
            .single();

        // 2. Literature
        const { data: litRecent } = await supabase
            .from('articles')
            .select('id, title, subtitle, slug, tags, author_name, publish_at, created_at, featured_image_url, category, view_count')
            .eq('status', 'published')
            .eq('category', 'literature')
            .order('publish_at', { ascending: false, nullsFirst: false })
            .limit(6);

        const { data: litPopular } = await supabase
            .from('articles')
            .select('id, title, subtitle, slug, tags, author_name, publish_at, created_at, featured_image_url, category, view_count')
            .eq('status', 'published')
            .eq('category', 'literature')
            .order('view_count', { ascending: false, nullsFirst: false })
            .limit(6);

        // 3. Films (Cinema)
        const { data: filmsRecent } = await supabase
            .from('articles')
            .select('id, title, subtitle, slug, tags, author_name, publish_at, created_at, featured_image_url, category, view_count')
            .eq('status', 'published')
            .eq('category', 'films')
            .order('publish_at', { ascending: false, nullsFirst: false })
            .limit(6);

        const { data: filmsPopular } = await supabase
            .from('articles')
            .select('id, title, subtitle, slug, tags, author_name, publish_at, created_at, featured_image_url, category, view_count')
            .eq('status', 'published')
            .eq('category', 'films')
            .order('view_count', { ascending: false, nullsFirst: false })
            .limit(6);

        // 4. Artists
        const { data: artistsRecent } = await supabase
            .from('artists')
            .select('id, full_name, art_form, biography, image_url, views, created_at')
            .order('created_at', { ascending: false })
            .limit(6);

        const { data: artistsPopular } = await supabase
            .from('artists')
            .select('id, full_name, art_form, biography, image_url, views, created_at')
            .order('views', { ascending: false })
            .limit(6);

        return NextResponse.json({
            success: true,
            data: {
                pickOfDay,
                literature: {
                    recent: litRecent || [],
                    popular: litPopular || [],
                },
                films: {
                    recent: filmsRecent || [],
                    popular: filmsPopular || [],
                },
                artists: {
                    recent: artistsRecent || [],
                    popular: artistsPopular || [],
                },
            },
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: error instanceof Error ? error.message : 'Failed to fetch home data.' },
            { status: 500 },
        );
    }
}
