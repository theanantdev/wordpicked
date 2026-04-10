import { DashboardRecentPost } from "@/utils/server-dashboard";
import Image from "next/image";
import Link from "next/link";

export function RecentPosts({ posts }: { posts: DashboardRecentPost[] }) {

    const categoryBadgeMap: Record<string, string> = {
        "Literature": "bg-[#243D2C]/10 text-[#243D2C]",
        "Films": "bg-[#B5542A]/10 text-[#B5542A]",
        "Film": "bg-[#B5542A]/10 text-[#B5542A]",
        "Artists": "bg-[#A8812A]/10 text-[#A8812A]",
        "Artist": "bg-[#A8812A]/10 text-[#A8812A]",
        "Article": "bg-[#243D2C]/10 text-[#243D2C]" // fallback
    };

    return (
        <div className="bg-white border border-[#DDD7CC] rounded-[4px] overflow-hidden flex flex-col h-full">

            <div className="px-5 py-4 border-b border-[#EDE7D9] flex items-center justify-between">
                <div>
                    <h2 className="font-heading font-bold text-[15px] text-[#1A1714]">Recent Posts</h2>
                    <div className="text-[11px] text-[#8C857C] mt-0.5">Latest published</div>
                </div>
                <Link href="/dashboard/posts" className="text-[10px] tracking-[0.06em] uppercase px-2.5 py-[5px] rounded-[1px] border border-[#DDD7CC] text-[#8C857C] transition-colors hover:border-[#1A1714] hover:text-[#1A1714]">
                    View All
                </Link>
            </div>

            <div className="flex flex-col">
                {posts.length === 0 ? (
                    <div className="px-5 py-4 text-[12px] text-[#8C857C]">No recent posts</div>
                ) : posts.map((post, idx) => (
                    <div key={idx} className={`flex items-center gap-4 px-5 py-3.5 ${idx !== posts.length - 1 ? 'border-b border-[#EDE7D9]' : ''} hover:bg-[#FAFAFA] transition-colors group`}>
                        <div className="relative w-12 h-12 shrink-0 overflow-hidden rounded-[2px] bg-[#E3DAC8]">
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
                            <div className="text-[11px] text-[#8C857C] mt-1 flex items-center gap-2">
                                <span className={`inline-flex items-center text-[9px] tracking-[0.05em] uppercase font-bold px-1.5 py-[2px] rounded-[1px] ${categoryBadgeMap[post.category] || categoryBadgeMap['Article']}`}>
                                    {post.category}
                                </span>
                                <span className="opacity-30">·</span>
                                <span>{post.date}</span>
                            </div>
                        </div>
                        <div className="flex flex-col items-end gap-1.5">
                            <span className={`inline-flex items-center text-[9px] tracking-[0.08em] uppercase font-bold px-2 py-[2.5px] rounded-[1px] ${post.badgeClass}`}>
                                {post.status}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
}
