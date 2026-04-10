import { StatCards } from "../_components/stat-cards";
import { RecentPosts } from "../_components/recent-posts";
import { MostViewed } from "../_components/most-viewed";
import { QuickActions } from "../_components/quick-actions";
import { CategoryStats } from "../_components/category-stats";
import { getDashboardData } from "@/utils/server-dashboard";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
    const { stats, categoryStats, recentPosts, mostViewed } = await getDashboardData();

    return (
        <div className="max-w-[1240px] mx-auto w-full pb-10">

            <StatCards stats={stats} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div className="flex flex-col gap-5 h-full">
                    {recentPosts.length > 0 && <RecentPosts posts={recentPosts} />}
                </div>

                <div className="flex flex-col gap-5 h-full">
                    {mostViewed.length > 0 && <MostViewed posts={mostViewed} />}
                    <QuickActions />
                </div>
            </div>

            {categoryStats.length > 0 && <CategoryStats stats={categoryStats} />}

        </div>
    );
}
