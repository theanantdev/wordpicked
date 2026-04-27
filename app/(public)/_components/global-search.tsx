"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Search, X, BookOpen, Film, ArrowRight, Loader2, Clock } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useMobile } from "@/hooks/use-mobile";

type SearchResult = {
    id: string;
    title: string;
    subtitle: string;
    slug: string;
    category: "literature" | "films";
    imageUrl: string;
    author: string;
    readTime: string;
};

type ApiResult = {
    id: string;
    title: string;
    description: string;
    slug: string;
    imageUrl: string;
    author: string;
    readTime: string;
};

const RECENT_KEY = "wp_recent_searches";
const MAX_RECENT = 5;

function getRecent(): string[] {
    try {
        return JSON.parse(localStorage.getItem(RECENT_KEY) || "[]");
    } catch {
        return [];
    }
}

function saveRecent(term: string) {
    try {
        const prev = getRecent().filter((t) => t !== term);
        localStorage.setItem(RECENT_KEY, JSON.stringify([term, ...prev].slice(0, MAX_RECENT)));
    } catch { /* noop */ }
}

function removeRecent(term: string) {
    try {
        const prev = getRecent().filter((t) => t !== term);
        localStorage.setItem(RECENT_KEY, JSON.stringify(prev));
    } catch { /* noop */ }
}

async function fetchResults(q: string): Promise<SearchResult[]> {
    const params = new URLSearchParams({ search: q, pageSize: "5", page: "1", category: "ALL", sort: "LATEST" });

    const [litRes, filmRes] = await Promise.allSettled([
        fetch(`/api/public/literature?${params}`).then((r) => r.json()),
        fetch(`/api/public/films?${params}`).then((r) => r.json()),
    ]);

    const results: SearchResult[] = [];

    if (litRes.status === "fulfilled" && litRes.value?.data?.items) {
        litRes.value.data.items.slice(0, 4).forEach((item: ApiResult) => {
            results.push({ ...item, subtitle: item.description, category: "literature" });
        });
    }
    if (filmRes.status === "fulfilled" && filmRes.value?.data?.items) {
        filmRes.value.data.items.slice(0, 4).forEach((item: ApiResult) => {
            results.push({ ...item, subtitle: item.description, category: "films" });
        });
    }

    return results;
}

export function GlobalSearch() {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);
    const [recent, setRecent] = useState<string[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const open = useCallback(() => {
        setIsOpen(true);
        setRecent(getRecent());
        setTimeout(() => inputRef.current?.focus(), 50);
    }, []);

    const close = useCallback(() => {
        setIsOpen(false);
        setQuery("");
        setResults([]);
        setActiveIndex(-1);
    }, []);

    // Keyboard shortcut Cmd/Ctrl + K
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                if (isOpen) close(); else open();
            }
            if (e.key === "Escape") close();
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [isOpen, open, close]);

    // Debounced search
    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);

        if (!query.trim()) {
            // Schedule state resets outside the synchronous effect body
            debounceRef.current = setTimeout(() => {
                setResults([]);
                setLoading(false);
            }, 0);
            return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
        }

        debounceRef.current = setTimeout(async () => {
            setLoading(true);
            const res = await fetchResults(query.trim());
            setResults(res);
            setLoading(false);
            setActiveIndex(-1);
        }, 280);

        return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
    }, [query]);

    const allItems = results;

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setActiveIndex((i) => Math.min(i + 1, allItems.length - 1));
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setActiveIndex((i) => Math.max(i - 1, -1));
        } else if (e.key === "Enter") {
            if (activeIndex >= 0 && allItems[activeIndex]) {
                const item = allItems[activeIndex];
                saveRecent(query);
                setRecent(getRecent());
                close();
                window.location.href = `/${item.category}/${item.slug}`;
            } else if (query.trim()) {
                saveRecent(query);
                setRecent(getRecent());
                close();
                window.location.href = `/literature?search=${encodeURIComponent(query.trim())}`;
            }
        }
    };

    const handleResultClick = (item: SearchResult) => {
        saveRecent(query || item.title);
        setRecent(getRecent());
        close();
    };

    const handleRecentClick = (term: string) => {
        setQuery(term);
        inputRef.current?.focus();
    };

    const handleRemoveRecent = (e: React.MouseEvent, term: string) => {
        e.stopPropagation();
        removeRecent(term);
        setRecent(getRecent());
    };

    const litResults = results.filter((r) => r.category === "literature");
    const filmResults = results.filter((r) => r.category === "films");
    const showResults = query.trim().length > 0;
    const showRecent = !showResults && recent.length > 0;
    const isMobile = useMobile();

    return (
        <>
            {/* Trigger button */}
            <button
                onClick={open}
                aria-label="Open search"
                className="flex h-7 w-50 items-center gap-2 rounded-[3px] border border-white/30 bg-white/5 px-2.5 py-1 text-[11px] font-sans text-white/70 transition-all group hover:border-white/50 hover:bg-white/10 min-[360px]:h-8 min-[360px]:w-54 min-[360px]:px-3 min-[360px]:text-[12px] min-[480px]:w-60 min-[480px]:text-[12px] min-[640px]:w-70 min-[640px]:text-[13px] min-[768px]:h-9 min-[768px]:w-90 min-[768px]:px-3.5 min-[1024px]:h-10 min-[1024px]:w-82 min-[1024px]:px-4 min-[1200px]:w-96 min-[1440px]:w-[330px] min-[1920px]:w-164"
            >
                <Search className="h-3 w-3 shrink-0 min-[360px]:h-3.5 min-[360px]:w-3.5" />
                <span className="inline flex-1 text-left">{isMobile ? "Search Movies..." : "Search Movies, Books And More..."}</span>
                <kbd className="ml-auto inline-flex items-center gap-0.5 rounded border border-white/20 px-1 py-0.5 text-[9px] text-white/40 min-[360px]:text-[10px]">
                    ⌘K
                </kbd>
            </button>

            {/* Full-screen Modal */}
            {isOpen && (
                <div
                    ref={overlayRef}
                    className="fixed inset-0 z-200 flex items-start justify-center px-4 pt-[10vh]"
                    onClick={(e) => { if (e.target === overlayRef.current) close(); }}
                >
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

                    {/* Panel */}
                    <div className="relative w-full max-w-160 overflow-hidden rounded-[6px] border border-white/10 bg-[#1A1714] shadow-2xl animate-in fade-in slide-in-from-top-4 duration-200">

                        {/* Search Input */}
                        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/10">
                            {loading ? (
                                <Loader2 className="w-4 h-4 text-[#E0BC78] shrink-0 animate-spin" />
                            ) : (
                                <Search className="w-4 h-4 text-white/40 shrink-0" />
                            )}
                            <input
                                ref={inputRef}
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Search Movies, Books And More..."
                                className="flex-1 bg-transparent text-white text-[15px] font-sans placeholder:text-white/30 outline-none"
                                autoComplete="off"
                                spellCheck={false}
                            />
                            {query && (
                                <button onClick={() => setQuery("")} className="text-white/40 hover:text-white transition-colors">
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                            <button onClick={close} className="text-white/40 hover:text-white transition-colors ml-1">
                                <kbd className="text-[10px] border border-white/20 rounded px-1.5 py-0.5">Esc</kbd>
                            </button>
                        </div>

                        {/* Recent searches */}
                        {showRecent && (
                            <div className="px-4 py-3">
                                <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-white/30">Recent searches</p>
                                <div className="flex flex-col gap-1">
                                    {recent.map((term) => (
                                        <button
                                            key={term}
                                            onClick={() => handleRecentClick(term)}
                                            className="flex items-center justify-between px-3 py-2 rounded-[3px] text-left hover:bg-white/5 group transition-colors"
                                        >
                                            <div className="flex items-center gap-2.5">
                                                <Clock className="w-3.5 h-3.5 text-white/30" />
                                                <span className="text-[13px] text-white/70">{term}</span>
                                            </div>
                                            <span
                                                role="button"
                                                onClick={(e) => handleRemoveRecent(e, term)}
                                                className="opacity-0 group-hover:opacity-100 text-white/30 hover:text-white transition-all cursor-pointer"
                                            >
                                                <X className="w-3 h-3" />
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Results */}
                        {showResults && !loading && results.length === 0 && (
                            <div className="px-4 py-10 text-center">
                                <p className="text-white/40 text-[14px]">No results for &quot;{query}&quot;</p>
                                <p className="text-white/25 text-[12px] mt-1">Try a different keyword</p>
                            </div>
                        )}

                        {showResults && results.length > 0 && (
                            <div className="max-h-[60vh] overflow-y-auto divide-y divide-white/5">
                                {/* Literature */}
                                {litResults.length > 0 && (
                                    <div className="px-4 py-3">
                                        <div className="flex items-center gap-1.5 mb-2">
                                            <BookOpen className="w-3 h-3 text-[#E0BC78]" />
                                            <p className="text-[10px] font-semibold uppercase tracking-widest text-[#E0BC78]">Literature</p>
                                        </div>
                                        {litResults.map((item) => {
                                            const globalIdx = results.indexOf(item);
                                            return (
                                                <Link
                                                    key={item.id}
                                                    href={`/literature/${item.slug}`}
                                                    onClick={() => handleResultClick(item)}
                                                    className={`flex items-center gap-3 px-2 py-2.5 rounded-[3px] transition-colors group ${activeIndex === globalIdx ? "bg-white/10" : "hover:bg-white/5"}`}
                                                >
                                                    <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-xs bg-white/10">
                                                        {item.imageUrl && (
                                                            <Image src={item.imageUrl} alt={item.title} loading="lazy" fill className="object-cover" />
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-[13px] text-white font-medium line-clamp-1 group-hover:text-[#E0BC78] transition-colors">{item.title}</p>
                                                        <p className="text-[11px] text-white/40 line-clamp-1">{item.author} · {item.readTime}</p>
                                                    </div>
                                                    <ArrowRight className="w-3.5 h-3.5 text-white/20 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                </Link>
                                            );
                                        })}
                                    </div>
                                )}

                                {/* Films */}
                                {filmResults.length > 0 && (
                                    <div className="px-4 py-3">
                                        <div className="flex items-center gap-1.5 mb-2">
                                            <Film className="w-3 h-3 text-[#B5542A]" />
                                            <p className="text-[10px] font-semibold uppercase tracking-widest text-[#B5542A]">Films</p>
                                        </div>
                                        {filmResults.map((item) => {
                                            const globalIdx = results.indexOf(item);
                                            return (
                                                <Link
                                                    key={item.id}
                                                    href={`/films/${item.slug}`}
                                                    onClick={() => handleResultClick(item)}
                                                    className={`flex items-center gap-3 px-2 py-2.5 rounded-[3px] transition-colors group ${activeIndex === globalIdx ? "bg-white/10" : "hover:bg-white/5"}`}
                                                >
                                                    <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-xs bg-white/10">
                                                        {item.imageUrl && (
                                                            <Image src={item.imageUrl} alt={item.title} loading="lazy" fill className="object-cover" />
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-[13px] text-white font-medium line-clamp-1 group-hover:text-[#E0BC78] transition-colors">{item.title}</p>
                                                        <p className="text-[11px] text-white/40 line-clamp-1">{item.author} · {item.readTime}</p>
                                                    </div>
                                                    <ArrowRight className="w-3.5 h-3.5 text-white/20 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                </Link>
                                            );
                                        })}
                                    </div>
                                )}

                                {/* View all results */}
                                <div className="px-4 py-3">
                                    <Link
                                        href={`/literature?search=${encodeURIComponent(query)}`}
                                        onClick={() => { saveRecent(query); setRecent(getRecent()); close(); }}
                                        className="flex items-center justify-between w-full px-3 py-2.5 bg-white/5 rounded-[3px] hover:bg-white/10 transition-colors group"
                                    >
                                        <span className="text-[12px] text-white/60 group-hover:text-white transition-colors">
                                            View all results for &quot;<span className="font-medium text-white">{query}</span>&quot;
                                        </span>
                                        <ArrowRight className="w-3.5 h-3.5 text-white/30 group-hover:text-white transition-colors" />
                                    </Link>
                                </div>
                            </div>
                        )}

                        {/* Footer hint */}
                        {!showResults && !showRecent && (
                            <div className="px-4 py-4 text-center">
                                <p className="text-white/25 text-[12px]">Search across all literature and films</p>
                            </div>
                        )}
                        <div className="flex items-center gap-4 px-4 py-2.5 border-t border-white/5 bg-black/20">
                            <span className="text-[10px] text-white/25 flex items-center gap-1"><kbd className="border border-white/15 rounded px-1">↑↓</kbd>Navigate</span>
                            <span className="text-[10px] text-white/25 flex items-center gap-1"><kbd className="border border-white/15 rounded px-1">↵</kbd>Open</span>
                            <span className="text-[10px] text-white/25 flex items-center gap-1"><kbd className="border border-white/15 rounded px-1">Esc</kbd>Close</span>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
