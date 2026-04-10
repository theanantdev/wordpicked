import { createAdminClient } from "@/utils/supabase/admin";
import { PicOfTheDayHero } from "./_components/pick-of-the-day-hero";
import { FeaturedPickCard, type PickArticle } from "./_components/featured-pick-card";
import { PicksGrid } from "./_components/picks-grid";
import type { Metadata } from "next";

export const revalidate = 300; // 5 minutes

export const metadata: Metadata = {
    title: "Pick of the Day",
    description: "One book or film our editors think you should read or watch today — curated daily, archived forever.",
};

async function fetchPicks(): Promise<PickArticle[]> {
    try {
        const supabase = createAdminClient();
        const { data, error } = await supabase
            .from("articles")
            .select("id, title, subtitle, category, slug, featured_image_url, author_name, publish_at")
            .eq("is_pick_of_the_day", true)
            .eq("status", "published")
            .order("publish_at", { ascending: false });

        if (error || !data) return [];
        return data as PickArticle[];
    } catch {
        return [];
    }
}

export default async function PicOfTheDayPage() {
    const picks = await fetchPicks();
    const [featured, ...rest] = picks;

    return (
        <main className="bg-[#FAFAFA] min-h-screen">
            <PicOfTheDayHero />
            {featured ? (
                <FeaturedPickCard article={featured} />
            ) : (
                <div className="mx-auto max-w-360 px-6 py-20 text-center">
                    <p className="font-heading text-[24px] font-bold text-[#1A1A1A] mb-3">No picks yet</p>
                    <p className="font-sans text-[16px] text-[#737373]">
                        Check back soon — our editors are curating today&apos;s selection.
                    </p>
                </div>
            )}
            {rest.length > 0 && <PicksGrid items={rest} />}
        </main>
    );
}