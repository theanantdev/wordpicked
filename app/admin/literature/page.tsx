"use client";

import { Search, Plus } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

type PostListItem = {
    id: string;
    title: string;
    sub: string;
    category: string;
    status: "Published" | "Draft";
    date: string;
    views: string;
    gradient: string;
    featured_image_url?: string | null;
};

type PostsApiResponse = {
    success: boolean;
    data?: {
        posts: PostListItem[];
        draftsCount: number;
        publishedCount: number;
        total: number;
        page: number;
        pageSize: number;
        totalPages: number;
        hasPrev: boolean;
        hasNext: boolean;
        search: string;
        filter: string;
        sort: string;
    };
    error?: string;
};

type FilterOption = "all" | "literature" | "films" | "artists" | "drafts";
type SortOption = "newest" | "oldest" | "az" | "mostViewed";

async function fetchPostsFromApi(params: {
    page: number;
    pageSize: number;
    search: string;
    filter: FilterOption;
    sort: SortOption;
}) {
    const query = new URLSearchParams({
        page: String(params.page),
        pageSize: String(params.pageSize),
        search: params.search,
        filter: params.filter,
        sort: params.sort,
    });

    const response = await fetch(`/api/posts?${query.toString()}`, {
        method: "GET",
        cache: "no-store",
    });

    const payload = (await response.json()) as PostsApiResponse;

    if (!response.ok || !payload.success || !payload.data) {
        return {
            posts: [] as PostListItem[],
            draftsCount: 0,
            publishedCount: 0,
            total: 0,
            page: params.page,
            pageSize: params.pageSize,
            totalPages: 1,
            hasPrev: false,
            hasNext: false,
            error: payload.error || "Failed to load posts from database.",
        };
    }

    return {
        posts: payload.data.posts,
        draftsCount: payload.data.draftsCount,
        publishedCount: payload.data.publishedCount,
        total: payload.data.total,
        page: payload.data.page,
        pageSize: payload.data.pageSize,
        totalPages: payload.data.totalPages,
        hasPrev: payload.data.hasPrev,
        hasNext: payload.data.hasNext,
        error: null,
    };
}

export default function PostsPage() {
    const [posts, setPosts] = useState<PostListItem[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [draftsCount, setDraftsCount] = useState(0);
    const [publishedCount, setPublishedCount] = useState(0);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [hasPrev, setHasPrev] = useState(false);
    const [hasNext, setHasNext] = useState(false);
    const [filter, setFilter] = useState<FilterOption>("all");
    const [sort, setSort] = useState<SortOption>("newest");
    const [searchInput, setSearchInput] = useState("");
    const [search, setSearch] = useState("");

    useEffect(() => {
        const timer = setTimeout(() => {
            setPage(1);
            setSearch(searchInput.trim());
        }, 300);
        return () => clearTimeout(timer);
    }, [searchInput]);

    useEffect(() => {
        let isCancelled = false;

        (async () => {
            setIsLoading(true);
            const result = await fetchPostsFromApi({ page, pageSize, search, filter, sort });
            if (isCancelled) return;

            setPosts(result.posts);
            setDraftsCount(result.draftsCount);
            setPublishedCount(result.publishedCount);
            setTotal(result.total);
            setTotalPages(result.totalPages);
            setHasPrev(result.hasPrev);
            setHasNext(result.hasNext);
            setError(result.error);
            setIsLoading(false);
        })();

        return () => {
            isCancelled = true;
        };
    }, [page, pageSize, search, filter, sort]);

    const pageButtons = useMemo(() => {
        const current = page;
        const max = totalPages;
        const result: number[] = [];
        const start = Math.max(1, current - 1);
        const end = Math.min(max, current + 1);
        for (let i = start; i <= end; i += 1) result.push(i);
        return result;
    }, [page, totalPages]);

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
                    <h2 className="font-heading font-bold text-[22px] text-[#1A1714]">All Literature</h2>
                    <div className="text-[12.5px] text-[#8C857C] mt-1">{posts.length} pieces · {draftsCount} drafts · {publishedCount} published</div>
                </div>
                <Link href="/admin/literature/add" className="flex items-center gap-1.5 bg-[#B5542A] text-white text-[11px] font-medium tracking-[0.08em] uppercase px-4 py-2 rounded-[2px] transition-colors hover:bg-[#C96840]">
                    <Plus className="w-[14px] h-[14px]" />
                    New Literature
                </Link>
            </div>

            {/* Table Wrap */}
            <div className="bg-white border border-[#DDD7CC] rounded-[4px] shadow-[0_2px_4px_rgba(26,23,20,0.02)] overflow-hidden">

                {/* Toolbar */}
                <div className="flex items-center gap-4 px-5 py-3 border-b border-[#EDE7D9] bg-[#FAFAFA] flex-wrap">
                    <div className="flex items-center gap-2 bg-white border border-[#DDD7CC] rounded-[2px] px-3 py-1.5 w-[240px]">
                        <Search className="w-3.5 h-3.5 text-[#8C857C]" />
                        <input
                            type="text"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            placeholder="Search by title or subtitle..."
                            className="bg-transparent border-none outline-none text-[12.5px] w-full text-[#1A1714] placeholder:text-[#8C857C]"
                        />
                    </div>

                    <div className="flex bg-[#EDE7D9] p-[2px] rounded-[3px] gap-[2px]">
                        {[
                            { label: "All", value: "all" },
                            { label: "Literature", value: "literature" },
                            { label: "Films", value: "films" },
                            { label: "Artists", value: "artists" },
                            { label: "Drafts", value: "drafts" },
                        ].map((item) => (
                            <button
                                key={item.value}
                                onClick={() => {
                                    setPage(1);
                                    setFilter(item.value as FilterOption);
                                }}
                                className={`px-3 py-1 text-[11.5px] font-medium rounded-[2px] cursor-pointer transition-colors ${filter === item.value ? 'bg-white shadow-[0_1px_2px_rgba(0,0,0,0.05)] text-[#1A1714]' : 'text-[#8C857C] hover:text-[#1A1714]'}`}
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>

                    <select
                        value={sort}
                        onChange={(e) => {
                            setPage(1);
                            setSort(e.target.value as SortOption);
                        }}
                        className="ml-auto bg-white border border-[#DDD7CC] text-[12px] px-3 py-1.5 rounded-[2px] text-[#1A1714] outline-none"
                    >
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                        <option value="az">A - Z</option>
                        <option value="mostViewed">Most Viewed</option>
                    </select>

                    <select
                        value={pageSize}
                        onChange={(e) => {
                            setPage(1);
                            setPageSize(Number.parseInt(e.target.value, 10));
                        }}
                        className="bg-white border border-[#DDD7CC] text-[12px] px-3 py-1.5 rounded-[2px] text-[#1A1714] outline-none"
                    >
                        <option value={10}>10 / page</option>
                        <option value={20}>20 / page</option>
                        <option value={50}>50 / page</option>
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
                            {error && (
                                <tr>
                                    <td colSpan={6} className="py-8 px-5 text-center text-[12px] text-[#B5542A]">
                                        {error}
                                    </td>
                                </tr>
                            )}
                            {!error && posts.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="py-8 px-5 text-center text-[12px] text-[#8C857C]">
                                        {isLoading ? 'Loading posts...' : 'No posts found.'}
                                    </td>
                                </tr>
                            )}
                            {posts.map((post) => (
                                <tr key={post.id} className="border-b border-[#EDE7D9] hover:bg-[#FAFAFA] transition-colors group">
                                    <td className="py-4 px-5 align-middle w-[35%]">
                                        <div className="flex items-center gap-4">
                                            {post.featured_image_url ? (
                                                <Image
                                                    src={post.featured_image_url}
                                                    alt={post.title}
                                                    width={60}
                                                    height={40}
                                                    className="w-[60px] h-[40px] shrink-0 rounded-[2px] object-cover"
                                                />
                                            ) : (
                                                <div className={`w-[60px] h-[40px] shrink-0 rounded-[2px] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)] bg-gradient-to-br ${post.gradient}`}></div>
                                            )}
                                            <div>
                                                <div className="font-heading font-bold text-[14.5px] text-[#1A1714] leading-[1.25] mb-0.5">{post.title}</div>
                                                <div className="text-[11.5px] text-[#8C857C]">{post.sub.split(/\s+/).filter(Boolean).slice(0, 10).join(' ')} ...</div>
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
                    <span className="text-[11.5px] text-[#8C857C]">
                        Showing {total === 0 ? 0 : (page - 1) * pageSize + 1}-{Math.min(page * pageSize, total)} of {total} posts
                    </span>
                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => hasPrev && setPage((p) => Math.max(1, p - 1))}
                            disabled={!hasPrev}
                            className="w-7 h-7 flex items-center justify-center border border-[#DDD7CC] bg-white text-[#8C857C] hover:text-[#1A1714] rounded-[2px] disabled:opacity-40"
                        >
                            ‹
                        </button>
                        {pageButtons.map((pageNumber) => (
                            <button
                                key={pageNumber}
                                onClick={() => setPage(pageNumber)}
                                className={`w-7 h-7 flex items-center justify-center border font-medium rounded-[2px] ${pageNumber === page ? 'border-[#1A1714] bg-[#1A1714] text-white' : 'border-[#DDD7CC] bg-white text-[#1A1714] hover:bg-[#EDE7D9]'}`}
                            >
                                {pageNumber}
                            </button>
                        ))}
                        <button
                            onClick={() => hasNext && setPage((p) => p + 1)}
                            disabled={!hasNext}
                            className="w-7 h-7 flex items-center justify-center border border-[#DDD7CC] bg-white text-[#8C857C] hover:text-[#1A1714] rounded-[2px] disabled:opacity-40"
                        >
                            ›
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}
