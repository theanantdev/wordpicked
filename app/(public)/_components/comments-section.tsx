"use client";

import { useEffect, useState } from "react";
import { MessageSquare, Send, Loader2, CheckCircle2, Heart, AlertCircle } from "lucide-react";

type Comment = {
    id: string;
    name: string;
    message: string;
    created_at: string;
    liked: boolean;
};

type Props = {
    articleId: string;
    articleSlug: string;
    articleTitle: string;
    articleType: "literature" | "films";
};

function timeAgo(iso: string) {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    if (days < 30) return `${days}d ago`;
    return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function initials(name: string) {
    return name.split(" ").slice(0, 2).map(n => n[0]?.toUpperCase() ?? "").join("");
}

const AVATAR_COLORS = [
    "bg-[#B5542A]", "bg-[#11412A]", "bg-[#4A3728]",
    "bg-[#6B4F3A]", "bg-[#2C5F4A]", "bg-[#8B3A3A]",
];

function avatarColor(name: string) {
    let hash = 0;
    for (const c of name) hash = (hash * 31 + c.charCodeAt(0)) & 0xffffffff;
    return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

export function CommentsSection({ articleId, articleSlug, articleTitle, articleType }: Props) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [loadingComments, setLoadingComments] = useState(true);

    // Form state
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        fetch(`/api/comments?articleId=${articleId}`)
            .then(r => r.json())
            .then(json => { if (json.success) setComments(json.data); })
            .finally(() => setLoadingComments(false));
    }, [articleId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        if (!name.trim() || !email.trim() || !message.trim()) {
            setError("Please fill in all fields.");
            return;
        }
        setSubmitting(true);
        try {
            const res = await fetch("/api/comments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ articleId, articleSlug, articleTitle, articleType, name, email, message }),
            });
            const json = await res.json();
            if (!json.success) { setError(json.error || "Submission failed."); return; }
            setSubmitted(true);
            setName(""); setEmail(""); setMessage("");
        } catch {
            setError("Network error. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <section className="w-full border-t border-[#E7E3DC] pt-12 mt-12">
            {/* Header */}
            <div className="flex items-center gap-2.5 mb-8">
                <MessageSquare className="w-5 h-5 text-[#B5542A]" />
                <h2 className="font-heading text-[22px] font-bold text-[#1A1714]">
                    Comments
                    {comments.length > 0 && (
                        <span className="ml-2 text-[16px] font-normal text-[#8C857C]">({comments.length})</span>
                    )}
                </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12 lg:gap-16">
                {/* Comment List */}
                <div className="flex flex-col gap-6 order-2 lg:order-1">
                    {loadingComments ? (
                        <div className="flex flex-col gap-4">
                            {[1, 2].map(i => (
                                <div key={i} className="flex gap-3 animate-pulse">
                                    <div className="w-10 h-10 rounded-full bg-[#E8E3DC] shrink-0" />
                                    <div className="flex-1 flex flex-col gap-2">
                                        <div className="h-3 w-24 bg-[#E8E3DC] rounded" />
                                        <div className="h-4 w-full bg-[#E8E3DC] rounded" />
                                        <div className="h-4 w-3/4 bg-[#E8E3DC] rounded" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : comments.length === 0 ? (
                        <div className="text-center py-12 border border-dashed border-[#DDD7CC] rounded-[4px]">
                            <MessageSquare className="w-8 h-8 text-[#C4BDB5] mx-auto mb-3" />
                            <p className="font-sans text-[14px] text-[#8C857C]">No comments yet. Be the first!</p>
                        </div>
                    ) : (
                        <div className="flex flex-col divide-y divide-[#EDE7D9]">
                            {comments.map(c => (
                                <div key={c.id} className="flex gap-3 py-5 first:pt-0">
                                    {/* Avatar */}
                                    <div className={`w-9 h-9 rounded-full shrink-0 flex items-center justify-center text-white text-[12px] font-bold ${avatarColor(c.name)}`}>
                                        {initials(c.name)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                                            <span className="font-sans text-[13px] font-semibold text-[#1A1714]">{c.name}</span>
                                            {c.liked && (
                                                <span className="flex items-center gap-0.5 text-[10px] text-[#B5542A] font-medium">
                                                    <Heart className="w-2.5 h-2.5 fill-[#B5542A]" />Editors&apos; pick
                                                </span>
                                            )}
                                            <span className="text-[11px] text-[#8C857C] ml-auto">{timeAgo(c.created_at)}</span>
                                        </div>
                                        <p className="font-sans text-[14px] leading-relaxed text-[#44403C]">{c.message}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Comment Form */}
                <div className="order-1 lg:order-2">
                    <div className="bg-[#FAF7F2] border border-[#E8E3DC] rounded-[4px] p-6">
                        <h3 className="font-heading text-[16px] font-bold text-[#1A1714] mb-4">Leave a comment</h3>

                        {submitted ? (
                            <div className="flex flex-col items-center gap-3 py-6 text-center">
                                <CheckCircle2 className="w-10 h-10 text-green-600" />
                                <p className="font-sans text-[14px] font-medium text-[#1A1714]">Thank you for your comment!</p>
                                <p className="font-sans text-[12px] text-[#8C857C]">It will appear after our editors review it.</p>
                                <button
                                    onClick={() => setSubmitted(false)}
                                    className="mt-2 text-[12px] text-[#B5542A] underline hover:no-underline"
                                >
                                    Write another comment
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div className="flex flex-col gap-1">
                                        <label className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#8C857C]">Name *</label>
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={e => setName(e.target.value)}
                                            placeholder="Your name"
                                            className="bg-white border border-[#DDD7CC] px-3 py-2 text-[13px] text-[#1A1714] placeholder:text-[#C4BDB5] outline-none focus:border-[#B5542A] transition-colors rounded-[2px]"
                                            required
                                        />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#8C857C]">Email *</label>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={e => setEmail(e.target.value)}
                                            placeholder="your@email.com"
                                            className="bg-white border border-[#DDD7CC] px-3 py-2 text-[13px] text-[#1A1714] placeholder:text-[#C4BDB5] outline-none focus:border-[#B5542A] transition-colors rounded-[2px]"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#8C857C]">Message *</label>
                                    <textarea
                                        value={message}
                                        onChange={e => setMessage(e.target.value)}
                                        placeholder="Share your thoughts on this article…"
                                        rows={4}
                                        className="bg-white border border-[#DDD7CC] px-3 py-2 text-[13px] text-[#1A1714] placeholder:text-[#C4BDB5] outline-none focus:border-[#B5542A] transition-colors rounded-[2px] resize-none"
                                        required
                                    />
                                </div>
                                <p className="text-[11px] text-[#8C857C]">
                                    Your email won&apos;t be published. Comments are reviewed before appearing.
                                </p>
                                {error && (
                                    <div className="flex items-center gap-2 text-red-600 text-[12px] bg-red-50 border border-red-200 px-3 py-2 rounded-[2px]">
                                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />{error}
                                    </div>
                                )}
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex items-center justify-center gap-2 bg-[#1A1714] text-white text-[12px] font-semibold uppercase tracking-[0.1em] px-5 py-2.5 rounded-[2px] hover:bg-[#B5542A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                                    {submitting ? "Submitting…" : "Post Comment"}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
