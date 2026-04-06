export function MostViewed() {
    const posts = [
        { rank: "1", title: "The Brutalist", meta: "Film · 2024", views: "4.2k" },
        { rank: "2", title: "James — Percival Everett", meta: "Literature", views: "3.8k" },
        { rank: "3", title: "Ocean Vuong Interview", meta: "Artist", views: "3.1k" },
        { rank: "4", title: "Nickel Boys — RaMell Ross", meta: "Film", views: "2.9k" },
        { rank: "5", title: "The House on the Edge…", meta: "Literature", views: "2.4k" },
    ];

    return (
        <div className="bg-white border border-[#DDD7CC] rounded-[4px] overflow-hidden flex flex-col">

            <div className="px-5 py-4 border-b border-[#EDE7D9] flex items-center justify-between">
                <h2 className="font-heading font-bold text-[15px] text-[#1A1714]">Most Viewed</h2>
                <div className="text-[10px] text-[#8C857C] tracking-[0.08em] uppercase">Top 5</div>
            </div>

            <div className="flex flex-col">
                {posts.map((post, idx) => (
                    <div key={post.rank} className={`flex items-center gap-3 px-5 py-3 ${idx !== posts.length - 1 ? 'border-b border-[#EDE7D9]' : ''}`}>
                        <div className="min-w-[24px] text-center font-heading font-bold text-[18px] text-[#E3DAC8]">
                            {post.rank}
                        </div>
                        <div className="flex-1 flex flex-col">
                            <div className="text-[12.5px] font-medium leading-[1.35] text-[#1A1714]">
                                {post.title}
                            </div>
                            <div className="text-[11px] text-[#8C857C]">
                                {post.meta}
                            </div>
                        </div>
                        <div className="font-heading font-bold text-[15px] text-[#1A1714] whitespace-nowrap">
                            {post.views}
                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
}
