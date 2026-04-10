"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Star, StarOff, Plus, Loader2, AlertCircle, BookOpen, Film } from "lucide-react";

type PickArticle = {
    id: string;
    title: string;
    subtitle: string | null;
    category: string;
    slug: string;
    featured_image_url: string | null;
    author_name: string | null;
    publish_at: string | null;
    is_pick_of_the_day: boolean;
};

type ApiResponse = {
    success: boolean;
    data?: PickArticle[];
    error?: string;
};

function formatDate(iso: string | null) {
    if (!iso) return "—";
    return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function AdminPickOfTheDayPage() {
    const [picks, setPicks] = useState<PickArticle[]>([]);
    const [allPublished, setAllPublished] = useState<PickArticle[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [togglingId, setTogglingId] = useState<string | null>(null);
    const [tab, setTab] = useState<"picks" | "all">("picks");
    const [success, setSuccess] = useState("");

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        setError("");
        try {
            const res = await fetch("/api/admin/picks");
            const json = (await res.json()) as ApiResponse;
            if (!json.success || !json.data) throw new Error(json.error || "Failed to fetch articles.");
            setPicks(json.data.filter((a) => a.is_pick_of_the_day));
            setAllPublished(json.data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An unknown error occurred.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    const togglePick = async (article: PickArticle) => {
        setTogglingId(article.id);
        setSuccess("");
        try {
            const res = await fetch("/api/articles/pick", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: article.id, isPickOfTheDay: !article.is_pick_of_the_day }),
            });
            const json = await res.json();
            if (!json.success) throw new Error(json.error || "Failed to update.");
            setSuccess(article.is_pick_of_the_day ? `"${article.title}" removed from picks.` : `"${article.title}" added as Pick of the Day!`);
            setTimeout(() => setSuccess(""), 3500);
            await fetchData();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Update failed.");
        } finally {
            setTogglingId(null);
        }
    };

    const displayList = tab === "picks" ? picks : allPublished;

    return (
        <div className="min-h-screen bg-[#F7F3EC] p-6 md:p-10">
            {/* Header */}
            <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2.5 mb-1">
                        <Star className="w-5 h-5 text-[#B5542A] fill-[#B5542A]" />
                        <h1 className="font-heading font-bold text-[24px] text-[#1A1714]">Pick of the Day</h1>
                    </div>
                    <p className="font-sans text-[13px] text-[#8C857C]">
                        Manage which articles are featured on the public Pick of the Day page.
                    </p>
                </div>
                <Link
                    href="/admin/literature/add"
                    className="flex items-center gap-1.5 px-4 py-2 bg-[#B5542A] text-white text-[12px] font-medium uppercase tracking-[0.08em] rounded-[2px] hover:bg-[#C96840] transition-colors"
                >
                    <Plus className="w-3.5 h-3.5" />
                    New Article
                </Link>
            </div>

            {/* Toasts */}
            {success && (
                <div className="mb-4 flex items-center gap-2 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-[2px] text-[13px]">
                    <Star className="w-4 h-4 fill-green-600 text-green-600 shrink-0" />
                    {success}
                </div>
            )}
            {error && (
                <div className="mb-4 flex items-center gap-2 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-[2px] text-[13px]">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    {error}
                </div>
            )}

            {/* Stats bar */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                <div className="bg-white border border-[#DDD7CC] rounded-[4px] px-5 py-4">
                    <div className="font-heading font-bold text-[28px] text-[#1A1714]">{picks.length}</div>
                    <div className="font-sans text-[11px] uppercase tracking-[0.1em] text-[#8C857C] mt-0.5">Current Picks</div>
                </div>
                <div className="bg-white border border-[#DDD7CC] rounded-[4px] px-5 py-4">
                    <div className="font-heading font-bold text-[28px] text-[#1A1714]">
                        {allPublished.filter(a => a.category === "literature").length}
                    </div>
                    <div className="font-sans text-[11px] uppercase tracking-[0.1em] text-[#8C857C] mt-0.5">Literature Articles</div>
                </div>
                <div className="bg-white border border-[#DDD7CC] rounded-[4px] px-5 py-4">
                    <div className="font-heading font-bold text-[28px] text-[#1A1714]">
                        {allPublished.filter(a => a.category === "films").length}
                    </div>
                    <div className="font-sans text-[11px] uppercase tracking-[0.1em] text-[#8C857C] mt-0.5">Film Articles</div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 mb-4 border border-[#DDD7CC] bg-white rounded-[4px] p-1 w-fit">
                <button
                    onClick={() => setTab("picks")}
                    className={`px-4 py-1.5 text-[12px] font-medium uppercase tracking-[0.08em] rounded-[2px] transition-colors ${tab === "picks" ? "bg-[#B5542A] text-white" : "text-[#8C857C] hover:text-[#1A1714]"}`}
                >
                    ⭐ Current Picks ({picks.length})
                </button>
                <button
                    onClick={() => setTab("all")}
                    className={`px-4 py-1.5 text-[12px] font-medium uppercase tracking-[0.08em] rounded-[2px] transition-colors ${tab === "all" ? "bg-[#B5542A] text-white" : "text-[#8C857C] hover:text-[#1A1714]"}`}
                >
                    All Published ({allPublished.length})
                </button>
            </div>

            {/* Article List */}
            <div className="bg-white border border-[#DDD7CC] rounded-[4px] overflow-hidden">
                {isLoading ? (
                    <div className="flex items-center justify-center py-20 gap-2 text-[#8C857C]">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span className="font-sans text-[13px]">Loading articles…</span>
                    </div>
                ) : displayList.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-3 text-[#8C857C]">
                        <Star className="w-8 h-8 opacity-30" />
                        <p className="font-sans text-[13px]">
                            {tab === "picks" ? "No picks selected yet. Switch to \"All Published\" to add some." : "No published articles found."}
                        </p>
                    </div>
                ) : (
                    <div className="divide-y divide-[#EDE7D9]">
                        {displayList.map((article) => (
                            <div key={article.id} className="flex items-center gap-4 px-5 py-4 hover:bg-[#FAF7F2] transition-colors">
                                {/* Thumbnail */}
                                <div className="relative w-12 h-12 rounded-[2px] overflow-hidden shrink-0 bg-[#EDE7D9]">
                                    {article.featured_image_url ? (
                                        <Image src={article.featured_image_url} alt={article.title} fill className="object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            {article.category === "films" ? (
                                                <Film className="w-5 h-5 text-[#8C857C]" />
                                            ) : (
                                                <BookOpen className="w-5 h-5 text-[#8C857C]" />
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Details */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                                        <span className={`text-[10px] font-semibold uppercase tracking-[0.1em] px-1.5 py-0.5 rounded-[2px] ${article.category === "films" ? "bg-blue-100 text-blue-700" : "bg-amber-100 text-amber-700"}`}>
                                            {article.category}
                                        </span>
                                        {article.is_pick_of_the_day && (
                                            <span className="text-[10px] font-semibold uppercase tracking-[0.1em] px-1.5 py-0.5 rounded-[2px] bg-[#B5542A]/10 text-[#B5542A]">
                                                ⭐ Pick
                                            </span>
                                        )}
                                    </div>
                                    <p className="font-sans text-[13px] font-medium text-[#1A1714] line-clamp-1">{article.title}</p>
                                    <p className="font-sans text-[11px] text-[#8C857C] mt-0.5">
                                        {article.author_name || "Unknown"} · {formatDate(article.publish_at)}
                                    </p>
                                </div>

                                {/* Action */}
                                <button
                                    onClick={() => togglePick(article)}
                                    disabled={togglingId === article.id}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[2px] text-[11px] font-medium uppercase tracking-[0.08em] transition-colors shrink-0 ${
                                        article.is_pick_of_the_day
                                            ? "bg-red-50 border border-red-200 text-red-600 hover:bg-red-100"
                                            : "bg-[#EDE7D9] border border-[#DDD7CC] text-[#1A1714] hover:bg-[#E3DAC8]"
                                    }`}
                                >
                                    {togglingId === article.id ? (
                                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                    ) : article.is_pick_of_the_day ? (
                                        <StarOff className="w-3.5 h-3.5" />
                                    ) : (
                                        <Star className="w-3.5 h-3.5" />
                                    )}
                                    {article.is_pick_of_the_day ? "Remove" : "Set Pick"}
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
