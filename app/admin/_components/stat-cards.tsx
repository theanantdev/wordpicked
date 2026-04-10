import { DashboardStats } from "@/utils/server-dashboard"

export function StatCards({ stats }: { stats: DashboardStats }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[1px] bg-[#DDD7CC] border border-[#DDD7CC] rounded-[4px] overflow-hidden mb-7">

            <div className="bg-white p-6 pb-5">
                <div className="text-[9.5px] tracking-[0.14em] uppercase text-[#8C857C] mb-2.5">
                    Total Posts
                </div>
                <div className="font-heading font-bold text-[38px] text-[#1A1714] leading-none mb-1.5 flex items-baseline gap-2">
                    {stats.totalPosts} <span className="font-sans text-[16px] font-normal italic text-[#8C857C]">published</span>
                </div>
                {stats.postsThisMonth > 0 ? (
                    <div className="text-[11px] flex items-center gap-1.5 text-[#3A6648]">
                        ↑ {stats.postsThisMonth} this month
                    </div>
                ) : (
                    <div className="text-[11px] flex items-center gap-1.5 text-[#8C857C]">
                        Active
                    </div>
                )}
            </div>

            <div className="bg-white p-6 pb-5">
                <div className="text-[9.5px] tracking-[0.14em] uppercase text-[#8C857C] mb-2.5">
                    Drafts
                </div>
                <div className="font-heading font-bold text-[38px] text-[#1A1714] leading-none mb-1.5 flex items-baseline gap-2">
                    {stats.drafts} <span className="font-sans text-[16px] font-normal italic text-[#8C857C]">pending</span>
                </div>
                {stats.drafts > 0 ? (
                    <div className="text-[11px] flex items-center gap-1.5 text-[#B5542A]">
                        {stats.drafts} need review
                    </div>
                ) : (
                    <div className="text-[11px] flex items-center gap-1.5 text-[#8C857C]">
                        All clear
                    </div>
                )}
            </div>

            <div className="bg-white p-6 pb-5">
                <div className="text-[9.5px] tracking-[0.14em] uppercase text-[#8C857C] mb-2.5">
                    Artist Profiles
                </div>
                <div className="font-heading font-bold text-[38px] text-[#1A1714] leading-none mb-1.5 flex items-baseline gap-2">
                    {stats.artistProfiles} <span className="font-sans text-[16px] font-normal italic text-[#8C857C]">active</span>
                </div>
                {stats.artistsThisMonth > 0 ? (
                    <div className="text-[11px] flex items-center gap-1.5 text-[#3A6648]">
                        ↑ {stats.artistsThisMonth} added
                    </div>
                ) : (
                    <div className="text-[11px] flex items-center gap-1.5 text-[#8C857C]">
                        Live
                    </div>
                )}
            </div>

            {stats.picksScheduled > 0 ? (
                <div className="bg-white p-6 pb-5">
                    <div className="text-[9.5px] tracking-[0.14em] uppercase text-[#8C857C] mb-2.5">
                        Picks Scheduled
                    </div>
                    <div className="font-heading font-bold text-[38px] text-[#1A1714] leading-none mb-1.5 flex items-baseline gap-2">
                        {stats.picksScheduled} <span className="font-sans text-[16px] font-normal italic text-[#8C857C]">ahead</span>
                    </div>
                    <div className="text-[11px] flex items-center gap-1.5 text-[#3A6648]">
                        Scheduled drops
                    </div>
                </div>
            ) : (
                <div className="bg-white p-6 pb-5 border border-dashed border-[#DDD7CC] w-full h-full flex flex-col justify-center items-center">
                    <span className="font-heading text-[14px] text-[#B0A89E] opacity-80 uppercase tracking-widest text-center mt-3">
                        No picks<br/>scheduled
                    </span>
                </div>
            )}

        </div>
    );
}
