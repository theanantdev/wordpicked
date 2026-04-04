import { Search, Plus } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function PostsPage() {
    const posts = [
        {
            id: 1,
            title: "The House on the Edge of the World",
            sub: "Kaveh Akbar · Fiction",
            category: "Literature",
            status: "Published",
            date: "Mar 15, 2026",
            views: "2.4k",
            gradient: "from-[#0e1a12] to-[#1a3222]"
        },
        {
            id: 2,
            title: "The Brutalist — Brady Corbet's American epic",
            sub: "Brady Corbet · Drama",
            category: "Film",
            status: "Published",
            date: "Mar 10, 2026",
            views: "4.2k",
            gradient: "from-[#0a0d12] to-[#10182a]"
        },
        {
            id: 3,
            title: "Ocean Vuong — Language as the only home",
            sub: "Interview · Poet",
            category: "Artist",
            status: "Draft",
            date: "Mar 8, 2026",
            views: "—",
            gradient: "from-[#1a1208] to-[#321e0e]"
        },
        {
            id: 4,
            title: "James by Percival Everett",
            sub: "Percival Everett · Fiction",
            category: "Literature",
            status: "Published",
            date: "Feb 28, 2026",
            views: "3.8k",
            gradient: "from-[#1a0e10] to-[#321520]"
        },
        {
            id: 5,
            title: "A Real Pain — Jesse Eisenberg",
            sub: "Jesse Eisenberg · Drama",
            category: "Film",
            status: "Draft",
            date: "Feb 20, 2026",
            views: "—",
            gradient: "from-[#12080a] to-[#2a1012]"
        },
        {
            id: 6,
            title: "All Fours by Miranda July",
            sub: "Miranda July · Literary Fiction",
            category: "Literature",
            status: "Published",
            date: "Jan 14, 2026",
            views: "1.9k",
            gradient: "from-[#0e0e1a] to-[#181832]"
        }
    ];

    const categoryStyles: Record<string, string> = {
        "Literature": "bg-[#243D2C]/10 text-[#243D2C] border-[#243D2C]/20 border",
        "Film": "bg-[#B5542A]/10 text-[#B5542A] border-[#B5542A]/20 border",
        "Artist": "bg-[#A8812A]/10 text-[#A8812A] border-[#A8812A]/20 border"
    };

    return (
        <div className="max-w-[1240px] mx-auto w-full pb-10">
            {/* Header */}
            <div className="flex justify-between items-end mb-5">
                <div>
                    <h2 className="font-heading font-bold text-[22px] text-[#1A1714]">All Posts</h2>
                    <div className="text-[12.5px] text-[#8C857C] mt-1">47 posts · 8 drafts · 3 scheduled</div>
                </div>
                <Link href="/dashboard/new-post" className="flex items-center gap-1.5 bg-[#B5542A] text-white text-[11px] font-medium tracking-[0.08em] uppercase px-4 py-2 rounded-[2px] transition-colors hover:bg-[#C96840]">
                    <Plus className="w-[14px] h-[14px]" />
                    New Post
                </Link>
            </div>

            {/* Table Wrap */}
            <div className="bg-white border border-[#DDD7CC] rounded-[4px] shadow-[0_2px_4px_rgba(26,23,20,0.02)] overflow-hidden">

                {/* Toolbar */}
                <div className="flex items-center gap-4 px-5 py-3 border-b border-[#EDE7D9] bg-[#FAFAFA] flex-wrap">
                    <div className="flex items-center gap-2 bg-white border border-[#DDD7CC] rounded-[2px] px-3 py-1.5 w-[240px]">
                        <Search className="w-3.5 h-3.5 text-[#8C857C]" />
                        <input type="text" placeholder="Search by title or content…" className="bg-transparent border-none outline-none text-[12.5px] w-full text-[#1A1714] placeholder:text-[#8C857C]" />
                    </div>

                    <div className="flex bg-[#EDE7D9] p-[2px] rounded-[3px] gap-[2px]">
                        {["All", "Literature", "Films", "Artists", "Drafts"].map((filter, i) => (
                            <button key={filter} className={`px-3 py-1 text-[11.5px] font-medium rounded-[2px] cursor-pointer transition-colors ${i === 0 ? 'bg-white shadow-[0_1px_2px_rgba(0,0,0,0.05)] text-[#1A1714]' : 'text-[#8C857C] hover:text-[#1A1714]'}`}>
                                {filter}
                            </button>
                        ))}
                    </div>

                    <select className="ml-auto bg-white border border-[#DDD7CC] text-[12px] px-3 py-1.5 rounded-[2px] text-[#1A1714] outline-none">
                        <option>Newest First</option>
                        <option>Oldest First</option>
                        <option>A – Z</option>
                        <option>Most Viewed</option>
                    </select>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-[#EDE7D9]">
                                <th className="py-3 px-5 text-[10px] tracking-[0.08em] uppercase text-[#8C857C] font-semibold">Post</th>
                                <th className="py-3 px-5 text-[10px] tracking-[0.08em] uppercase text-[#8C857C] font-semibold text-center">Category</th>
                                <th className="py-3 px-5 text-[10px] tracking-[0.08em] uppercase text-[#8C857C] font-semibold text-center">Status</th>
                                <th className="py-3 px-5 text-[10px] tracking-[0.08em] uppercase text-[#8C857C] font-semibold">Date</th>
                                <th className="py-3 px-5 text-[10px] tracking-[0.08em] uppercase text-[#8C857C] font-semibold text-right">Views</th>
                                <th className="py-3 px-5 text-[10px] tracking-[0.08em] uppercase text-[#8C857C] font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {posts.map((post) => (
                                <tr key={post.id} className="border-b border-[#EDE7D9] hover:bg-[#FAFAFA] transition-colors group">
                                    <td className="py-4 px-5 align-middle w-[35%]">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-[60px] h-[40px] shrink-0 rounded-[2px] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)] bg-gradient-to-br ${post.gradient}`}></div>
                                            <div>
                                                <div className="font-heading font-bold text-[14.5px] text-[#1A1714] leading-[1.25] mb-0.5">{post.title}</div>
                                                <div className="text-[11.5px] text-[#8C857C]">{post.sub}</div>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="py-4 px-5 align-middle text-center">
                                        <span className={`inline-flex items-center px-[8px] py-[3px] text-[10px] uppercase tracking-[0.04em] font-medium rounded-[2px] ${categoryStyles[post.category]}`}>
                                            {post.category}
                                        </span>
                                    </td>

                                    <td className="py-4 px-5 align-middle text-center">
                                        <span className={`inline-flex items-center gap-1.5 px-[8px] py-[3px] text-[10px] uppercase tracking-[0.04em] font-medium rounded-[2px] border ${post.status === 'Published' ? 'border-[#243D2C]/20 text-[#243D2C]' : 'border-[#A8812A]/30 text-[#A8812A]'}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${post.status === 'Published' ? 'bg-[#243D2C]' : 'bg-[#A8812A]'}`}></span>
                                            {post.status}
                                        </span>
                                    </td>

                                    <td className="py-4 px-5 align-middle text-[12px] text-[#8C857C]">
                                        {post.date}
                                    </td>

                                    <td className="py-4 px-5 align-middle text-right font-heading font-bold text-[15px] text-[#1A1714]">
                                        {post.views}
                                    </td>

                                    <td className="py-4 px-5 align-middle">
                                        <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="text-[11px] font-medium text-[#1A1714] bg-white border border-[#DDD7CC] px-2.5 py-1 rounded-[2px] hover:bg-[#EDE7D9]">Edit</button>
                                            <button className="text-[11px] font-medium text-[#1A1714] bg-white border border-[#DDD7CC] px-2.5 py-1 rounded-[2px] hover:bg-[#EDE7D9]">Preview</button>
                                            <button className="text-[11px] font-medium text-[#B5542A] bg-white border border-[#B5542A]/30 px-2.5 py-1 rounded-[2px] hover:bg-[#B5542A]/10">Delete</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="bg-[#FAFAFA] border-t border-[#EDE7D9] px-5 py-3 flex items-center justify-between">
                    <span className="text-[11.5px] text-[#8C857C]">Showing 1–20 of 47 posts</span>
                    <div className="flex items-center gap-1">
                        <button className="w-7 h-7 flex items-center justify-center border border-[#DDD7CC] bg-white text-[#8C857C] hover:text-[#1A1714] rounded-[2px]">‹</button>
                        <button className="w-7 h-7 flex items-center justify-center border border-[#1A1714] bg-[#1A1714] text-white font-medium rounded-[2px]">1</button>
                        <button className="w-7 h-7 flex items-center justify-center border border-[#DDD7CC] bg-white text-[#1A1714] hover:bg-[#EDE7D9] rounded-[2px]">2</button>
                        <button className="w-7 h-7 flex items-center justify-center border border-[#DDD7CC] bg-white text-[#1A1714] hover:bg-[#EDE7D9] rounded-[2px]">3</button>
                        <button className="w-7 h-7 flex items-center justify-center border border-[#DDD7CC] bg-white text-[#8C857C] hover:text-[#1A1714] rounded-[2px]">›</button>
                    </div>
                </div>

            </div>
        </div>
    );
}
