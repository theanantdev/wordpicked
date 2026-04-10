import { DashboardPopularByType } from "@/utils/server-dashboard";

interface Props {
    data: DashboardPopularByType;
}

function PopularList({ title, items }: { title: string; items: DashboardPopularByType[keyof DashboardPopularByType] }) {
    return (
        <div className="rounded-[3px] border border-[#EDE7D9] bg-[#FCFAF5]">
            <div className="px-4 py-3 border-b border-[#EDE7D9] flex items-center justify-between">
                <h3 className="font-heading font-bold text-[13px] text-[#1A1714]">{title}</h3>
                <span className="text-[10px] text-[#8C857C] uppercase tracking-[0.08em]">Top 5</span>
            </div>

            <div className="flex flex-col">
                {items.length === 0 ? (
                    <div className="px-4 py-3 text-[12px] text-[#8C857C]">No view data yet</div>
                ) : (
                    items.map((item, idx) => (
                        <div
                            key={item.id}
                            className={`px-4 py-3 flex items-center justify-between gap-3 ${idx !== items.length - 1 ? "border-b border-[#EFE8DA]" : ""}`}
                        >
                            <div className="min-w-0">
                                <div className="text-[13px] text-[#1A1714] font-medium truncate">{item.title}</div>
                                <div className="text-[10px] text-[#8C857C] uppercase tracking-[0.07em] mt-0.5">#{item.rank}</div>
                            </div>
                            <div className="text-[12px] font-heading font-bold text-[#11412a] shrink-0">{item.views}</div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export function PopularByType({ data }: Props) {
    return (
        <div className="bg-white border border-[#DDD7CC] rounded-[4px] overflow-hidden mb-6">
            <div className="px-5 py-4 border-b border-[#EDE7D9] flex items-center justify-between">
                <h2 className="font-heading font-bold text-[15px] text-[#1A1714]">Most Popular by Category</h2>
                <span className="text-[11px] text-[#8C857C]">Live ranking</span>
            </div>

            <div className="p-5 grid grid-cols-1 lg:grid-cols-3 gap-4">
                <PopularList title="Films" items={data.films} />
                <PopularList title="Artists" items={data.artists} />
                <PopularList title="Literature" items={data.literature} />
            </div>
        </div>
    );
}