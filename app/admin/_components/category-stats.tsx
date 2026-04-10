import { DashboardCategoryStat } from "@/utils/server-dashboard";

export function CategoryStats({ stats }: { stats: DashboardCategoryStat[] }) {
    const topStats = stats.slice(0, 3);

    // Using real count proportionally to draw heights
    const maxCount = Math.max(...topStats.map(s => s.count), 1);

    const colorProfiles = [
        { label: "text-[#243D2C]", bar: "bg-[#2E5239]" },
        { label: "text-[#B5542A]", bar: "bg-[#B5542A]/30" },
        { label: "text-[#A8812A]", bar: "bg-[#E3DAC8]", activeBar: "bg-[#A8812A]/40" },
    ];

    // Generate procedural but static feeling bar arrays for top categories (each gets 7 blocks representing volume distribution visually)
    function getBarHeights(count: number, index: number) {
        const ratio = count / maxCount;
        // Pseudo-randomizing array based on index to look nice but bound to volume ratio
        const randoms = [
            [0.6, 0.4, 0.8, 0.55, 0.9, 0.7, 0.45],
            [0.5, 0.7, 0.45, 0.85, 0.6, 0.75, 0.4],
            [0.3, 0.2, 0.4, 0.6, 0.25, 0.35, 0.15]
        ][index % 3];
        
        return randoms.map(r => Math.max(10, Math.floor(r * ratio * 100)));
    }

    return (
        <div className="bg-white border border-[#DDD7CC] rounded-[4px] overflow-hidden">
            <div className="px-5 py-4 border-b border-[#EDE7D9] flex items-center justify-between">
                <h2 className="font-heading font-bold text-[15px] text-[#1A1714]">Posts by Category</h2>
                <span className="text-[11px] text-[#8C857C]">All time</span>
            </div>

            <div className="p-6">
                {topStats.length === 0 ? (
                    <div className="text-[12px] text-[#8C857C]">No category data available</div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        {topStats.map((stat, idx) => {
                            const profile = colorProfiles[idx % colorProfiles.length];
                            const heights = getBarHeights(stat.count, idx);
                            
                            return (
                                <div key={stat.category}>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className={`text-[11px] tracking-[0.1em] uppercase ${profile.label} font-medium`}>
                                            {stat.category}
                                        </span>
                                        <span className="font-heading font-bold text-[17px] text-[#1A1714]">
                                            {stat.count}
                                        </span>
                                    </div>
                                    <div className="flex items-end gap-[3px] h-12 pt-1">
                                        {heights.map((h, i) => (
                                            <div 
                                                key={i} 
                                                className={`flex-1 rounded-t-[1px] min-h-[4px] transition-colors hover:bg-[#B5542A] ${profile.activeBar && i === 3 ? profile.activeBar : profile.bar}`} 
                                                style={{ height: `${h}%` }} 
                                            />
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
