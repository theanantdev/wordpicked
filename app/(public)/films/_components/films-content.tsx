"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import Link from "next/link";

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
            const result = await fetchFilms({
                page,
                pageSize,
                search,
                category: activeTab,
                sort: activeSort,
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

        return () => {
            cancelled = true;
        };
    }, [page, pageSize, search, activeTab, activeSort]);

    const pageButtons = useMemo(() => {
        const start = Math.max(1, page - 1);
        const end = Math.min(totalPages, page + 1);
        const values: number[] = [];
        for (let i = start; i <= end; i += 1) values.push(i);
        return values;
    }, [page, totalPages]);

    const sortLabelMap: Record<SortOption, string> = {
        LATEST: "Latest Release",
        OLDEST: "Oldest Release",
        TITLE_A_Z: "Title A-Z",
    };

    return (
        <section className="w-full flex flex-col items-center">
            {/* Tab and Sort Bar */}
            <div className="z-20 max-w-[1200px] w-full bg-[#F5F0E8] py-4 sm:py-5 -mt-15">
                <div className="mx-auto flex w-full flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 px-4 sm:px-6 md:px-8">
                    <input
                        type="text"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        placeholder="Search title, author, subtitle..."
                        className="w-full sm:w-70 bg-white border border-[#E4E4E7] px-3 py-2 text-sm text-[#18181B] outline-none"
                    />

                    <div className="flex flex-row items-center gap-2 sm:gap-2.5 overflow-x-auto">
                        {(["ALL", "FICTION", "NON-FICTION", "POETRY"] as Category[]).map(tab => (
                            <button
                                key={tab}
                                onClick={() => {
                                    setPage(1);
                                    setActiveTab(tab);
                                }}
                                className={`flex h-7.25 justify-center items-center px-3 sm:px-4.5 py-2.5 font-heading font-medium tracking-[1px] sm:tracking-[2px] text-xs sm:text-[14px] uppercase transition-colors whitespace-nowrap ${activeTab === tab
                                    ? "bg-[#DC2828] text-white"
                                    : "bg-white text-[#52525B] hover:text-[#18181B]"
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    <div className="relative w-full sm:w-auto">
                        <button
                            type="button"
                            onClick={() => setIsSortOpen((prev) => !prev)}
                            className="group flex w-full sm:w-auto cursor-pointer flex-row items-center justify-between sm:justify-start gap-2"
                        >
                            <span className="hidden sm:inline font-sans font-medium text-[#A1A1AA] tracking-[1.5px] uppercase text-[13px]">
                                Sort by:
                            </span>
                            <span className="font-heading font-bold text-[#18181B] tracking-[1.5px] sm:tracking-[2px] uppercase text-xs sm:text-[14px]">
                                {sortLabelMap[activeSort]}
                            </span>
                            <ChevronDown className={`h-4 sm:h-4.5 w-4 sm:w-4.5 text-[#A1A1AA] transition group-hover:text-[#18181B] ${isSortOpen ? "rotate-180" : "rotate-0"}`} />
                        </button>

                        {isSortOpen && (
                            <div className="absolute right-0 sm:right-0 z-30 mt-2 w-full sm:w-auto sm:min-w-47.5 border border-[#E4E4E7] bg-white shadow-lg">
                                {(["LATEST", "OLDEST", "TITLE_A_Z"] as SortOption[]).map((option) => (
                                    <button
                                        key={option}
                                        type="button"
                                        onClick={() => {
                                            setPage(1);
                                            setActiveSort(option);
                                            setIsSortOpen(false);
                                        }}
                                        className={`block w-full px-3 sm:px-4 py-2.5 sm:py-3 text-left font-sans text-xs sm:text-[13px] tracking-[1px] sm:tracking-[1.1px] uppercase transition-colors ${activeSort === option
                                            ? "bg-[#F4F4F5] text-[#18181B]"
                                            : "text-[#52525B] hover:bg-[#FAFAFA]"
                                            }`}
                                    >
                                        {sortLabelMap[option]}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <select
                        value={pageSize}
                        onChange={(e) => {
                            setPage(1);
                            setPageSize(Number.parseInt(e.target.value, 10));
                        }}
                        className="bg-white border border-[#E4E4E7] px-3 py-2 text-sm text-[#18181B] outline-none"
                    >
                        <option value={10}>10 / page</option>
                        <option value={20}>20 / page</option>
                        <option value={30}>30 / page</option>
                    </select>
                </div>
            </div>

            {/* Grid */}
            <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-8 sm:gap-12 lg:gap-15 px-4 sm:px-6 md:px-8 py-8 sm:py-12 md:py-16">
                <div className="grid w-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-x-8 md:gap-y-12">
                    {items.map(article => (
                        <Link key={article.id} href={`/films/${article.slug}`} className="flex flex-col bg-[#FAFAFA] border border-[#F4F4F5] shadow-sm hover:shadow-md transition-shadow group cursor-pointer">
                            {/* Image */}
                            <div className="relative w-full aspect-[3/4]">
                                <Image
                                    src={article.imageUrl}
                                    alt={article.title}
                                    fill
                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                    className="object-cover object-center group-hover:scale-[1.02] transition-transform duration-500 rounded-t-sm"
                                />
                                {/* Vintage overlay effect */}
                                <div className="absolute inset-0 bg-white/10 mix-blend-saturation pointer-events-none" />
                            </div>

                            {/* Content */}
                            <div className="flex flex-col gap-2.5 sm:gap-3 md:gap-4 p-4 sm:p-5 md:p-6">
                                <div className="flex flex-row items-center gap-2.5 sm:gap-3">
                                    <span className="font-sans font-black text-[9px] sm:text-[10.4px] leading-[14px] sm:leading-[16px] tracking-[1.8px] sm:tracking-[2.08px] text-[#E50914] uppercase">
                                        {article.category}
                                    </span>
                                    <div className="w-0.5 sm:w-1 h-0.5 sm:h-1 bg-[#E4E4E7] rounded-full" />
                                    <span className="font-sans font-bold text-[9px] sm:text-[10.4px] leading-[14px] sm:leading-[16px] tracking-[1.8px] sm:tracking-[2.08px] text-[#A1A1AA] uppercase">
                                        {article.readTime}
                                    </span>
                                </div>

                                <h2 className="font-heading h-auto sm:h-16 md:h-[66px] text-xl sm:text-2xl md:text-[28px] leading-[23px] sm:leading-[28px] md:leading-[33px] font-bold tracking-tight text-[#18181B] line-clamp-2 transition-colors group-hover:text-[#DC2828]">
                                    {article.title}
                                </h2>

                                <p className="font-heading text-sm sm:text-base md:text-[16px] leading-[20px] sm:leading-[23px] md:leading-[24px] italic text-[#71717A]">
                                    {article.author}
                                </p>

                                <p className="font-sans h-auto sm:h-10 md:h-[46px] text-xs sm:text-sm md:text-[14px] leading-[18px] sm:leading-[20px] md:leading-[23px] text-[#52525B] line-clamp-2">
                                    {article.description}
                                </p>
                            </div>
                        </Link>
                    ))}
                    {(loading || (!loading && !error && items.length === 0) || error) && (
                        <div className="col-span-1 sm:col-span-2 lg:col-span-3 text-center py-12 sm:py-16 md:py-20 text-gray-500">
                            {loading ? "Loading films..." : error ? error : "No films found."}
                        </div>
                    )}
                </div>

                {total > 0 && (
                    <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4">
                        <span className="text-sm text-[#71717A]">
                            Showing {total === 0 ? 0 : (page - 1) * pageSize + 1}-{Math.min(page * pageSize, total)} of {total}
                        </span>

                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => hasPrev && setPage((p) => Math.max(1, p - 1))}
                                disabled={!hasPrev}
                                className="w-8 h-8 border border-[#E4E4E7] bg-white disabled:opacity-40"
                            >
                                ‹
                            </button>
                            {pageButtons.map((value) => (
                                <button
                                    key={value}
                                    onClick={() => setPage(value)}
                                    className={`w-8 h-8 border ${value === page ? 'bg-[#18181B] text-white border-[#18181B]' : 'bg-white border-[#E4E4E7] text-[#18181B]'}`}
                                >
                                    {value}
                                </button>
                            ))}
                            <button
                                onClick={() => hasNext && setPage((p) => p + 1)}
                                disabled={!hasNext}
                                className="w-8 h-8 border border-[#E4E4E7] bg-white disabled:opacity-40"
                            >
                                ›
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
