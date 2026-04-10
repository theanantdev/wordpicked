"use client";

import { Share2 } from "lucide-react";

type ShareButtonProps = {
    title: string;
    text: string;
    url: string;
};

export function ShareButton({ title, text, url }: ShareButtonProps) {
    const handleShare = async () => {
        const shareData = {
            title,
            text,
            url,
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                console.error("Error sharing:", err);
            }
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert("Link copied to clipboard!");
        }
    };

    return (
        <button
            onClick={handleShare}
            className="w-[40px] h-[40px] flex items-center justify-center rounded-sm hover:bg-black/5 transition-colors"
            title="Share this article"
        >
            <Share2 className="w-5 h-5 text-[#181821]" />
        </button>
    );
}
