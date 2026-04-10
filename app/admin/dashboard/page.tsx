import { AnalyticsChart } from "../_components/analytics-chart";
import { getDashboardData } from "@/utils/server-dashboard";
import { StatCards } from "../_components/stat-cards";
import { PopularByType } from "../_components/popular-by-type";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
    const { stats, popularByType, dailyStats } = await getDashboardData();
    return (
        <div className="max-w-[1240px] mx-auto w-full pb-10">

            <StatCards stats={stats} />

            <AnalyticsChart data={dailyStats} />

            <PopularByType data={popularByType} />



        </div>
    );
}
