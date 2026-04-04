import { StatCards } from "./_components/stat-cards";
import { RecentPosts } from "./_components/recent-posts";
import { MostViewed } from "./_components/most-viewed";
import { QuickActions } from "./_components/quick-actions";
import { CategoryStats } from "./_components/category-stats";

export default function DashboardPage() {
    return (
        <div className="max-w-[1240px] mx-auto w-full pb-10">

            <StatCards />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <RecentPosts />

                <div className="flex flex-col gap-5">
                    <MostViewed />
                    <QuickActions />
                </div>
            </div>

            <CategoryStats />

        </div>
    );
}
