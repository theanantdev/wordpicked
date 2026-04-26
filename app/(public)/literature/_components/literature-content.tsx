"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
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

async function fetchLiterature(params: {
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

    const response = await fetch(`/api/public/literature?${query.toString()}`, {
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
            error: payload.error || "Failed to load literature.",
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

export function LiteratureContent() {
    const [activeTab, setActiveTab] = useState<Category>("ALL");
    const [isSortOpen, setIsSortOpen] = useState(false);
    const [activeSort, setActiveSort] = useState<SortOption>("LATEST");
    const [searchInput, setSearchInput] = useState("");
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
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
            const result = await fetchLiterature({
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
        <MaxWidthWrapper>
            {/* Header & Filters */}
            <div className="w-full border-b border-zinc-100 bg-white/50 backdrop-blur-md sticky top-0 z-40">
                <div className="flex flex-col gap-4 py-6">
                    {/* Categories */}
                    <div className="flex flex-wrap items-center gap-2">
                        {(["ALL", "FICTION", "NON-FICTION", "POETRY"] as Category[]).map(tab => (
                            <button
                                key={tab}
                                onClick={() => { setPage(1); setActiveTab(tab); }}
                                className={`px-4 py-2 text-[11px] font-bold tracking-[2px] uppercase transition-all border ${activeTab === tab
                                    ? "bg-[#DC2828] border-[#DC2828] text-white shadow-lg shadow-red-100"
                                    : "bg-white border-zinc-200 text-zinc-500 hover:border-zinc-400"
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Sort & Pagination Controls */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="relative inline-block text-left w-full sm:w-auto">
                            <button
                                onClick={() => setIsSortOpen(!isSortOpen)}
                                className="flex items-center justify-between gap-3 w-full sm:w-auto bg-zinc-50 px-4 py-2 border border-zinc-200 hover:bg-zinc-100 transition-colors"
                            >
                                <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Sort:</span>
                                <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-900">{sortLabelMap[activeSort]}</span>
                                <ChevronDown className={`w-4 h-4 transition-transform ${isSortOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {isSortOpen && (
                                <div className="absolute left-0 mt-2 w-48 bg-white border border-zinc-200 shadow-xl z-50">
                                    {(Object.keys(sortLabelMap) as SortOption[]).map((option) => (
                                        <button
                                            key={option}
                                            onClick={() => { setActiveSort(option); setIsSortOpen(false); setPage(1); }}
                                            className="w-full text-left px-4 py-3 text-[11px] font-bold uppercase tracking-wider hover:bg-zinc-50 border-b border-zinc-50 last:border-0"
                                        >
                                            {sortLabelMap[option]}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            <input
                                type="text"
                                placeholder="Search literature..."
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                className="flex-1 sm:w-64 px-4 py-2 border border-zinc-200 bg-zinc-50 text-[13px] outline-none focus:border-zinc-400"
                            />
                            <select
                                value={pageSize}
                                onChange={(e) => { setPage(1); setPageSize(Number(e.target.value)); }}
                                className="px-3 py-2 border border-zinc-200 bg-zinc-50 text-[11px] font-bold uppercase outline-none"
                            >
                                <option value={10}>10</option>
                                <option value={20}>20</option>
                                <option value={50}>50</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Grid */}
            <div className="py-1">
                {error ? (
                    <div className="bg-red-50 text-red-600 p-8 text-center font-bold tracking-widest uppercase text-xs border border-red-100">
                        {error}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
                        {items.map(article => (
                            <Link key={article.id} href={`/literature/${article.slug}`} className="group block">
                                <div className="relative aspect-[16/9] overflow-hidden bg-zinc-100 border border-zinc-200">
                                    <Image
                                        src={article.imageUrl}
                                        alt={article.title}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
                                    {/* Category Badge over Image */}
                                    <div className="absolute top-4 left-4">
                                        <span className="bg-white/90 backdrop-blur px-3 py-1 text-[9px] font-black tracking-[2px] uppercase text-[#E50914]">
                                            {article.category}
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-6 flex flex-col gap-3">
                                    <div className="flex items-center gap-3">
                                        <span className="text-[10px] font-bold tracking-[2px] text-zinc-400 uppercase">{article.readTime}</span>
                                        <span className="w-1 h-1 bg-zinc-200 rounded-full" />
                                        <span className="text-[10px] font-bold tracking-[2px] text-zinc-400 uppercase">{new Date(article.releaseDate).getFullYear()}</span>
                                    </div>
                                    <h2 className="text-2xl font-bold tracking-tight text-zinc-900 group-hover:text-[#DC2828] transition-colors line-clamp-2">
                                        {article.title}
                                    </h2>
                                    <p className="text-sm italic text-zinc-500">by {article.author}</p>
                                    <p className="text-sm leading-relaxed text-zinc-600 line-clamp-3">
                                        {article.description}
                                    </p>
                                </div>
                            </Link>
                        ))}

                        {/* Skeleton Loading State */}
                        {loading && Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="animate-pulse">
                                <div className="aspect-[3/4] bg-zinc-100 mb-6" />
                                <div className="h-4 bg-zinc-100 w-1/3 mb-4" />
                                <div className="h-8 bg-zinc-100 w-full mb-3" />
                                <div className="h-4 bg-zinc-100 w-2/3" />
                            </div>
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {!loading && items.length === 0 && !error && (
                    <div className="text-center py-24">
                        <p className="text-zinc-400 font-bold tracking-widest uppercase text-xs">No entries found in this collection.</p>
                    </div>
                )}

                {/* Pagination */}
                {total > 0 && (
                    <div className="mt-20 pt-10 border-t border-zinc-100 flex flex-col sm:flex-row items-center justify-between gap-8">
                        <p className="text-xs font-bold tracking-widest text-zinc-400 uppercase">
                            Volume {page} of {totalPages} — {total} Items
                        </p>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setPage(p => p - 1)}
                                disabled={!hasPrev || loading}
                                className="px-4 py-2 border border-zinc-200 text-[10px] font-black uppercase tracking-widest hover:bg-zinc-50 disabled:opacity-30 transition-all"
                            >
                                Previous
                            </button>
                            <div className="flex gap-1">
                                {pageButtons.map((btn) => (
                                    <button
                                        key={btn}
                                        onClick={() => setPage(btn)}
                                        className={`w-10 h-10 border text-[10px] font-black transition-all ${page === btn
                                            ? "bg-zinc-900 border-zinc-900 text-white"
                                            : "border-zinc-200 text-zinc-900 hover:border-zinc-900"
                                            }`}
                                    >
                                        {btn}
                                    </button>
                                ))}
                            </div>
                            <button
                                onClick={() => setPage(p => p + 1)}
                                disabled={!hasNext || loading}
                                className="px-4 py-2 border border-zinc-200 text-[10px] font-black uppercase tracking-widest hover:bg-zinc-50 disabled:opacity-30 transition-all"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </MaxWidthWrapper>
    );
}