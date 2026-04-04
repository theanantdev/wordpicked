export function StatCards() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[1px] bg-[#DDD7CC] border border-[#DDD7CC] rounded-[4px] overflow-hidden mb-7">

            <div className="bg-white p-6 pb-5">
                <div className="text-[9.5px] tracking-[0.14em] uppercase text-[#8C857C] mb-2.5">
                    Total Posts
                </div>
                <div className="font-heading font-bold text-[38px] text-[#1A1714] leading-none mb-1.5 flex items-baseline gap-2">
                    47 <span className="font-sans text-[16px] font-normal italic text-[#8C857C]">published</span>
                </div>
                <div className="text-[11px] flex items-center gap-1.5 text-[#3A6648]">
                    ↑ 12 this month
                </div>
            </div>

            <div className="bg-white p-6 pb-5">
                <div className="text-[9.5px] tracking-[0.14em] uppercase text-[#8C857C] mb-2.5">
                    Drafts
                </div>
                <div className="font-heading font-bold text-[38px] text-[#1A1714] leading-none mb-1.5 flex items-baseline gap-2">
                    8 <span className="font-sans text-[16px] font-normal italic text-[#8C857C]">pending</span>
                </div>
                <div className="text-[11px] flex items-center gap-1.5 text-[#B5542A]">
                    3 need review
                </div>
            </div>

            <div className="bg-white p-6 pb-5">
                <div className="text-[9.5px] tracking-[0.14em] uppercase text-[#8C857C] mb-2.5">
                    Artist Profiles
                </div>
                <div className="font-heading font-bold text-[38px] text-[#1A1714] leading-none mb-1.5 flex items-baseline gap-2">
                    12 <span className="font-sans text-[16px] font-normal italic text-[#8C857C]">active</span>
                </div>
                <div className="text-[11px] flex items-center gap-1.5 text-[#3A6648]">
                    ↑ 2 added
                </div>
            </div>

            <div className="bg-white p-6 pb-5">
                <div className="text-[9.5px] tracking-[0.14em] uppercase text-[#8C857C] mb-2.5">
                    Picks Scheduled
                </div>
                <div className="font-heading font-bold text-[38px] text-[#1A1714] leading-none mb-1.5 flex items-baseline gap-2">
                    28 <span className="font-sans text-[16px] font-normal italic text-[#8C857C]">days ahead</span>
                </div>
                <div className="text-[11px] flex items-center gap-1.5 text-[#3A6648]">
                    Through April
                </div>
            </div>

        </div>
    );
}
