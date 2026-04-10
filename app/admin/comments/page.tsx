"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { MessageSquare, Check, X, Heart, Trash2, Loader2, AlertCircle, ExternalLink } from "lucide-react";

type Comment = {
    id: string;
    article_id: string;
    article_slug: string;
    article_title: string;
    article_type: "literature" | "films";
    name: string;
    email: string;
    message: string;
    status: "pending" | "approved" | "rejected";
    liked: boolean;
    created_at: string;
};

function timeAgo(iso: string) {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
}

const STATUS_STYLES: Record<string, string> = {
    pending: "bg-amber-100 text-amber-700",
    approved: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
};

export default function AdminCommentsPage() {
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");
    const [actionId, setActionId] = useState<string | null>(null);
    const [error, setError] = useState("");

    const fetchComments = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const res = await fetch(`/api/admin/comments?status=${filter}`);
            const json = await res.json();
            if (json.success) setComments(json.data);
            else setError(json.error || "Failed to load comments.");
        } catch {
            setError("Network error.");
        } finally {
            setLoading(false);
        }
    }, [filter]);

    useEffect(() => { fetchComments(); }, [fetchComments]);

    const act = async (id: string, action: string) => {
        setActionId(id);
        await fetch("/api/admin/comments", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, action }),
        });
        await fetchComments();
        setActionId(null);
    };

    const del = async (id: string) => {
        if (!confirm("Delete this comment permanently?")) return;
        setActionId(id);
        await fetch("/api/admin/comments", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id }),
        });
        await fetchComments();
        setActionId(null);
    };

    const pending = comments.filter(c => c.status === "pending").length;
    const approved = comments.filter(c => c.status === "approved").length;

    const tabs = [
        { key: "all", label: `All (${comments.length})` },
        { key: "pending", label: `Pending (${pending})` },
        { key: "approved", label: `Approved (${approved})` },
        { key: "rejected", label: "Rejected" },
    ] as const;

    return (
        <div className="min-h-screen bg-[#F7F3EC] p-6 md:p-10">
            {/* Header */}
            <div className="mb-8 flex items-center gap-2.5">
                <MessageSquare className="w-5 h-5 text-[#B5542A]" />
                <div>
                    <h1 className="font-heading font-bold text-[24px] text-[#1A1714]">Comments</h1>
                    <p className="font-sans text-[13px] text-[#8C857C]">Moderate and manage reader comments across all posts.</p>
                </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                {[
                    { label: "Total", value: comments.length, color: "text-[#1A1714]" },
                    { label: "Pending", value: pending, color: "text-amber-600" },
                    { label: "Approved", value: approved, color: "text-green-600" },
                    { label: "Rejected", value: comments.filter(c => c.status === "rejected").length, color: "text-red-600" },
                ].map(s => (
                    <div key={s.label} className="bg-white border border-[#DDD7CC] rounded-[4px] px-5 py-4">
                        <div className={`font-heading font-bold text-[28px] ${s.color}`}>{s.value}</div>
                        <div className="font-sans text-[11px] uppercase tracking-[0.1em] text-[#8C857C] mt-0.5">{s.label}</div>
                    </div>
                ))}
            </div>

            {/* Tabs */}
            <div className="flex gap-1 mb-4 border border-[#DDD7CC] bg-white rounded-[4px] p-1 w-fit flex-wrap">
                {tabs.map(t => (
                    <button
                        key={t.key}
                        onClick={() => setFilter(t.key)}
                        className={`px-4 py-1.5 text-[12px] font-medium uppercase tracking-[0.08em] rounded-[2px] transition-colors ${filter === t.key ? "bg-[#B5542A] text-white" : "text-[#8C857C] hover:text-[#1A1714]"}`}
                    >
                        {t.label}
                    </button>
                ))}
            </div>

            {/* Error */}
            {error && (
                <div className="mb-4 flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-[2px] text-[13px]">
                    <AlertCircle className="w-4 h-4 shrink-0" />{error}
                </div>
            )}

            {/* Comment list */}
            <div className="bg-white border border-[#DDD7CC] rounded-[4px] overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center py-20 gap-2 text-[#8C857C]">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span className="text-[13px]">Loading comments…</span>
                    </div>
                ) : comments.length === 0 ? (
                    <div className="flex flex-col items-center gap-3 py-20 text-[#8C857C]">
                        <MessageSquare className="w-8 h-8 opacity-30" />
                        <p className="text-[13px]">No comments found.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-[#EDE7D9]">
                        {comments.map(c => (
                            <div key={c.id} className={`px-5 py-4 hover:bg-[#FAF7F2] transition-colors ${actionId === c.id ? "opacity-50 pointer-events-none" : ""}`}>
                                <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                                    {/* Comment content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex flex-wrap items-center gap-2 mb-1">
                                            <span className="font-sans text-[13px] font-semibold text-[#1A1714]">{c.name}</span>
                                            <span className="text-[11px] text-[#8C857C]">{c.email}</span>
                                            <span className={`text-[10px] font-semibold uppercase tracking-[0.08em] px-1.5 py-0.5 rounded-[2px] ${STATUS_STYLES[c.status]}`}>
                                                {c.status}
                                            </span>
                                            {c.liked && <Heart className="w-3.5 h-3.5 text-[#B5542A] fill-[#B5542A]" />}
                                            <span className="text-[11px] text-[#8C857C] ml-auto sm:ml-0">{timeAgo(c.created_at)}</span>
                                        </div>
                                        <p className="font-sans text-[13px] text-[#44403C] leading-relaxed mb-2">{c.message}</p>
                                        <div className="flex items-center gap-1.5">
                                            <span className={`text-[10px] font-semibold uppercase tracking-[0.08em] px-1.5 py-0.5 rounded-[2px] ${c.article_type === "films" ? "bg-blue-100 text-blue-700" : "bg-amber-100 text-amber-700"}`}>
                                                {c.article_type}
                                            </span>
                                            <Link
                                                href={`/${c.article_type}/${c.article_slug}`}
                                                target="_blank"
                                                className="flex items-center gap-1 text-[11px] text-[#8C857C] hover:text-[#B5542A] transition-colors"
                                            >
                                                {c.article_title || c.article_slug}
                                                <ExternalLink className="w-2.5 h-2.5" />
                                            </Link>
                                        </div>
                                    </div>

                                    {/* Action buttons */}
                                    <div className="flex items-center gap-1.5 shrink-0 flex-wrap sm:flex-nowrap">
                                        {c.status !== "approved" && (
                                            <button
                                                onClick={() => act(c.id, "approve")}
                                                title="Approve"
                                                className="flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-medium text-green-700 bg-green-50 border border-green-200 rounded-[2px] hover:bg-green-100 transition-colors"
                                            >
                                                <Check className="w-3.5 h-3.5" />Approve
                                            </button>
                                        )}
                                        {c.status !== "rejected" && (
                                            <button
                                                onClick={() => act(c.id, "reject")}
                                                title="Reject"
                                                className="flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-medium text-red-700 bg-red-50 border border-red-200 rounded-[2px] hover:bg-red-100 transition-colors"
                                            >
                                                <X className="w-3.5 h-3.5" />Reject
                                            </button>
                                        )}
                                        <button
                                            onClick={() => act(c.id, c.liked ? "unlike" : "like")}
                                            title={c.liked ? "Remove Editor's Pick" : "Mark Editor's Pick"}
                                            className={`flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-medium rounded-[2px] border transition-colors ${c.liked ? "text-[#B5542A] bg-[#B5542A]/10 border-[#B5542A]/20 hover:bg-[#B5542A]/20" : "text-[#8C857C] bg-[#FAF7F2] border-[#DDD7CC] hover:border-[#B5542A]/40 hover:text-[#B5542A]"}`}
                                        >
                                            <Heart className={`w-3.5 h-3.5 ${c.liked ? "fill-[#B5542A]" : ""}`} />
                                        </button>
                                        <button
                                            onClick={() => del(c.id)}
                                            title="Delete permanently"
                                            className="flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-medium text-[#8C857C] bg-[#FAF7F2] border border-[#DDD7CC] rounded-[2px] hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
