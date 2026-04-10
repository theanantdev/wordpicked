import { DashboardMostViewed } from "@/utils/server-dashboard";
import Image from "next/image";

export function MostViewed({ posts }: { posts: DashboardMostViewed[] }) {
    return (
        <div className="bg-white border border-[#DDD7CC] rounded-[4px] overflow-hidden flex flex-col">

            <div className="px-5 py-4 border-b border-[#EDE7D9] flex items-center justify-between">
                <h2 className="font-heading font-bold text-[15px] text-[#1A1714]">Most Viewed</h2>
                <div className="text-[10px] text-[#8C857C] tracking-[0.08em] uppercase">Top 5</div>
            </div>

            <div className="flex flex-col">
                {posts.length === 0 ? (
                    <div className="px-5 py-4 text-[12px] text-[#8C857C]">No views recorded</div>
                ) : posts.map((post, idx) => (
                    <div key={post.id} className={`flex items-center gap-4 px-5 py-3.5 ${idx !== posts.length - 1 ? 'border-b border-[#EDE7D9] ' : ''} hover:bg-[#FAFAFA] transition-colors group`}>
                        <div className="relative w-10 h-10 shrink-0 overflow-hidden rounded-[2px] bg-[#E3DAC8]">
                            <Image 
                                src={post.image} 
                                alt={post.title}
                                fill
                                className="object-cover transition-transform group-hover:scale-110"
                            />
                        </div>
                        <div className="flex-1 flex flex-col min-w-0">
                            <div className="text-[13px] font-semibold leading-[1.4] text-[#1A1714] line-clamp-1">
                                {post.title}
                            </div>
                            <div className="text-[11px] text-[#8C857C] mt-0.5">
                                {post.meta}
                            </div>
                        </div>
                        <div className="flex flex-col items-end">
                            <div className="font-heading font-bold text-[15px] text-[#11412a]">
                                {post.views}
                            </div>
                            <div className="text-[9px] text-[#8C857C] uppercase tracking-[0.05em] font-medium">Views</div>
                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
}
