import Link from "next/link";

export function RecentPosts() {
    const posts = [
        { id: "01", title: "The House on the Edge of the World", category: "Literature", date: "Mar 2026", status: "Live", badgeClass: "text-[#3A6648] bg-[#3A6648]/10" },
        { id: "02", title: "The Brutalist — Brady Corbet's epic", category: "Film", date: "Mar 2026", status: "Live", badgeClass: "text-[#3A6648] bg-[#3A6648]/10" },
        { id: "03", title: "Ocean Vuong — Language as home", category: "Artist", date: "Mar 2026", status: "Draft", badgeClass: "text-[#A8812A] bg-[#A8812A]/10" },
        { id: "04", title: "James by Percival Everett", category: "Literature", date: "Feb 2026", status: "Live", badgeClass: "text-[#3A6648] bg-[#3A6648]/10" },
        { id: "05", title: "A Real Pain — Jesse Eisenberg", category: "Film", date: "Feb 2026", status: "Draft", badgeClass: "text-[#A8812A] bg-[#A8812A]/10" },
    ];

    const categoryBadgeMap: Record<string, string> = {
        "Literature": "bg-[#243D2C]/10 text-[#243D2C]",
        "Film": "bg-[#B5542A]/10 text-[#B5542A]",
        "Artist": "bg-[#A8812A]/10 text-[#A8812A]"
    };

    return (
        <div className="bg-white border border-[#DDD7CC] rounded-[4px] overflow-hidden flex flex-col h-full">

            <div className="px-5 py-4 border-b border-[#EDE7D9] flex items-center justify-between">
                <div>
                    <h2 className="font-heading font-bold text-[15px] text-[#1A1714]">Recent Posts</h2>
                    <div className="text-[11px] text-[#8C857C] mt-0.5">Last 10 published</div>
                </div>
                <Link href="/dashboard/posts" className="text-[10px] tracking-[0.06em] uppercase px-2.5 py-[5px] rounded-[1px] border border-[#DDD7CC] text-[#8C857C] transition-colors hover:border-[#1A1714] hover:text-[#1A1714]">
                    View All
                </Link>
            </div>

            <div className="flex flex-col">
                {posts.map((post, idx) => (
                    <div key={post.id} className={`flex items-center gap-3 px-5 py-3 ${idx !== posts.length - 1 ? 'border-b border-[#EDE7D9]' : ''}`}>
                        <div className="min-w-[32px] text-center font-heading font-bold text-[17px] text-[#E3DAC8]">
                            {post.id}
                        </div>
                        <div className="flex-1 flex flex-col">
                            <div className="text-[12.5px] font-medium leading-[1.35] text-[#1A1714]">
                                {post.title}
                            </div>
                            <div className="text-[11px] text-[#8C857C] mt-0.5 flex items-center gap-1.5">
                                <span className={`inline-flex items-center text-[9.5px] tracking-[0.08em] uppercase font-medium px-2.5 py-[3px] rounded-[1px] ${categoryBadgeMap[post.category]}`}>
                                    {post.category}
                                </span>
                                <span>·</span>
                                <span>{post.date}</span>
                            </div>
                        </div>
                        <span className={`inline-flex items-center text-[9.5px] tracking-[0.08em] uppercase font-medium px-2.5 py-[3px] rounded-[1px] ${post.badgeClass}`}>
                            {post.status}
                        </span>
                    </div>
                ))}
            </div>

        </div>
    );
}
