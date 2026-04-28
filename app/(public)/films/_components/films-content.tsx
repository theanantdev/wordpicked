"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { ChevronDown, Search } from "lucide-react";
import Link from "next/link";
import MaxWidthWrapper from "@/components/max-width-wraper";

type Category = "ALL" | "FICTION" | "NON-FICTION" | "POETRY";
type SortOption = "LATEST" | "OLDEST" | "TITLE_A_Z";

type Article = {
    id: string;
    category: "FICTION" | "NON-FICTION" | "POETRY";
    readTime: string;
    releaseDate: string;
    title: string;
    author: string;
    description: string;
    imageUrl: string;
    slug: string;
};

type ApiResponse = {
    success: boolean;
    data?: {
        items: Article[];
        total: number;
        page: number;
        pageSize: number;
        totalPages: number;
        hasPrev: boolean;
        hasNext: boolean;
    };
    error?: string;
};

async function fetchFilms(params: {
    page: number;
    pageSize: number;
    search: string;
    category: Category;
    sort: SortOption;
}) {
    const query = new URLSearchParams({
        page: String(params.page),
        pageSize: String(params.pageSize),
        search: params.search,
        category: params.category,
        sort: params.sort,
    });

    const response = await fetch(`/api/public/films?${query.toString()}`, {
        method: "GET",
        cache: "no-store",
    });

    const payload = (await response.json()) as ApiResponse;

    if (!response.ok || !payload.success || !payload.data) {
        return {
            items: [] as Article[],
            total: 0,
            page: 1,
            pageSize: params.pageSize,
            totalPages: 1,
            hasPrev: false,
            hasNext: false,
            error: payload.error || "Failed to load films.",
        };
    }

    return {
        items: payload.data.items,
        total: payload.data.total,
        page: payload.data.page,
        pageSize: payload.data.pageSize,
        totalPages: payload.data.totalPages,
        hasPrev: payload.data.hasPrev,
        hasNext: payload.data.hasNext,
        error: null,
    };
}

export function FilmsContent() {
    const [activeTab, setActiveTab] = useState<Category>("ALL");
    const [isSortOpen, setIsSortOpen] = useState(false);
    const [activeSort, setActiveSort] = useState<SortOption>("LATEST");
    const [searchInput, setSearchInput] = useState("");
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(12); // Use multiples of 2 and 3 for cleaner grids
    const [items, setItems] = useState<Article[]>([]);
    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [hasPrev, setHasPrev] = useState(false);
    const [hasNext, setHasNext] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setPage(1);
            setSearch(searchInput.trim());
        }, 300);
        return () => clearTimeout(timer);
    }, [searchInput]);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            setLoading(true);
            const result = await fetchFilms({
                page, pageSize, search, category: activeTab, sort: activeSort,
            });
            if (cancelled) return;
            setItems(result.items);
            setTotal(result.total);
            setTotalPages(result.totalPages);
            setHasPrev(result.hasPrev);
            setHasNext(result.hasNext);
            setError(result.error);
            setLoading(false);
        })();
        return () => { cancelled = true; };
    }, [page, pageSize, search, activeTab, activeSort]);

    const pageButtons = useMemo(() => {
        const start = Math.max(1, page - 1);
        const end = Math.min(totalPages, page + 1);
        const values: number[] = [];
        for (let i = start; i <= end; i += 1) values.push(i);
        return values;
    }, [page, totalPages]);

    const sortLabelMap: Record<SortOption, string> = {
        LATEST: "Latest",
        OLDEST: "Oldest",
        TITLE_A_Z: "Title A-Z",
    };

    return (
        <div className="min-h-screen bg-[#F5F0E8]/30">
            {/* Toolbar: Search, Tabs, and Sort */}
            <div className="top-0 z-40 w-full border-b border-zinc-200 py-4 shadow-sm">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                        {/* Search Input */}
                        <div className="relative w-full lg:max-w-xs">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                            <input
                                type="text"
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                placeholder="Search films..."
                                className="w-full rounded-none border border-zinc-300 bg-white py-2 pl-10 pr-4 text-sm outline-none focus:border-[#DC2828] transition-colors"
                            />
                        </div>

                        {/* Category Tabs */}
                        <div className="flex items-center gap-1.5 flex-wrap pb-1 lg:pb-0">
                            {(["ALL", "FICTION", "NON-FICTION", "POETRY"] as Category[]).map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => { setPage(1); setActiveTab(tab); }}
                                    className={`px-4 py-2 text-[11px] font-bold uppercase tracking-widest transition-all ${activeTab === tab
                                        ? "bg-[#DC2828] text-white"
                                        : "bg-white text-zinc-500 border border-zinc-200 hover:border-zinc-400"
                                        }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        {/* Sort & Page Size */}
                        <div className="flex items-center justify-between gap-4 border-t border-zinc-200 pt-4 lg:border-none lg:pt-0">
                            <div className="relative">
                                <button
                                    onClick={() => setIsSortOpen(!isSortOpen)}
                                    className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-zinc-900"
                                >
                                    <span className="text-zinc-400">Sort:</span> {sortLabelMap[activeSort]}
                                    <ChevronDown className={`h-4 w-4 transition-transform ${isSortOpen ? 'rotate-180' : ''}`} />
                                </button>
                                {isSortOpen && (
                                    <div className="absolute right-0 mt-3 w-48 border border-zinc-200 bg-white shadow-xl">
                                        {(Object.keys(sortLabelMap) as SortOption[]).map((option) => (
                                            <button
                                                key={option}
                                                onClick={() => { setPage(1); setActiveSort(option); setIsSortOpen(false); }}
                                                className="w-full px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest hover:bg-zinc-50 border-b border-zinc-50 last:border-0"
                                            >
                                                {sortLabelMap[option]}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <select
                                value={pageSize}
                                onChange={(e) => { setPage(1); setPageSize(Number(e.target.value)); }}
                                className="bg-transparent text-[11px] font-bold uppercase tracking-widest outline-none cursor-pointer"
                            >
                                <option value={12}>12 Per Page</option>
                                <option value={24}>24 Per Page</option>
                                <option value={48}>48 Per Page</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <MaxWidthWrapper className="">
                <div className=" w-full mx-auto flex flex-col gap-5 pt-5 md:px-15 lg:px-20  ">
                    {/* Grid */}
                    <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 sm:gap-x-8 lg:grid-cols-3">
                        {items.map(article => (
                            <Link key={article.id} href={`/films/${article.slug}`} className="group flex flex-col shadow-md rounded-md">
                                <div className="relative aspect-video w-full overflow-hidden  bg-zinc-100 shadow-sm">
                                    <Image
                                        loading="lazy"
                                        src={article.imageUrl}
                                        alt={article.title}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-black/5 opacity-0 transition-opacity group-hover:opacity-100" />
                                </div>

                                <div className="mt-6 flex flex-col gap-3 pl-1.5 pb-1.5">
                                    <div className="flex items-center gap-3">
                                        <span className="text-[10px] font-black tracking-[2px] text-[#E50914] uppercase">
                                            {article.category}
                                        </span>
                                        <span className="h-1 w-1 rounded-full bg-zinc-300" />
                                        <span className="text-[10px] font-bold tracking-[2px] text-zinc-400 uppercase">
                                            {article.readTime}
                                        </span>
                                    </div>

                                    <h2 className="text-2xl font-bold leading-tight tracking-tight text-zinc-900 group-hover:text-[#DC2828] transition-colors line-clamp-2 min-h-[3.5rem]">
                                        {article.title}
                                    </h2>

                                    <p className="text-sm italic text-zinc-500">by {article.author}</p>

                                    <p className="text-sm leading-relaxed text-zinc-600 line-clamp-2 min-h-[2.5rem]">
                                        {article.description}
                                    </p>
                                </div>
                            </Link>
                        ))}

                        {/* Skeletons */}
                        {loading && Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="flex flex-col">
                                <div className="aspect-video w-full animate-pulse bg-zinc-200" />
                                <div className="mt-6 h-4 w-1/4 animate-pulse bg-zinc-200" />
                                <div className="mt-4 h-8 w-full animate-pulse bg-zinc-200" />
                                <div className="mt-4 h-4 w-2/3 animate-pulse bg-zinc-200" />
                            </div>
                        ))}
                    </div>

                    {/* Empty/Error States */}
                    {!loading && items.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <p className="text-sm font-bold uppercase tracking-widest text-zinc-400">
                                {error || "No films found matching your criteria."}
                            </p>
                        </div>
                    )}

                    {/* Pagination */}
                    {total > 0 && (
                        <div className=" flex flex-col items-center justify-between gap-6 border-t border-zinc-200 pt-10 sm:flex-row">
                            <p className="text-xs font-bold uppercase tracking-widest text-zinc-400">
                                Page {page} of {totalPages} <span className="mx-2">—</span> {total} Total
                            </p>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setPage(p => p - 1)}
                                    disabled={!hasPrev || loading}
                                    className="border border-zinc-300 bg-white px-4 py-2 text-[10px] font-black uppercase tracking-widest disabled:opacity-30"
                                >
                                    Prev
                                </button>
                                {pageButtons.map((val) => (
                                    <button
                                        key={val}
                                        onClick={() => setPage(val)}
                                        className={`h-10 w-10 border text-[10px] font-black transition-colors ${page === val ? "bg-zinc-900 border-zinc-900 text-white" : "border-zinc-300 bg-white hover:border-zinc-900"
                                            }`}
                                    >
                                        {val}
                                    </button>
                                ))}
                                <button
                                    onClick={() => setPage(p => p + 1)}
                                    disabled={!hasNext || loading}
                                    className="border border-zinc-300 bg-white px-4 py-2 text-[10px] font-black uppercase tracking-widest disabled:opacity-30"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </MaxWidthWrapper>
        </div>
    );
}