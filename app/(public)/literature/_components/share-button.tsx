"use client";

import { useState, useRef, useEffect } from "react";
import { Share2, Link2, Check, X } from "lucide-react";

type ShareButtonProps = {
    title: string;
    text: string;
    url: string;
};

// SVG icons for platforms (no external icon lib needed)
function WhatsAppIcon() {
    return (
        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
            <path d="M12.004 2C6.477 2 2 6.477 2 12.004c0 1.78.467 3.45 1.284 4.897L2 22l5.233-1.265A9.956 9.956 0 0012.004 22C17.523 22 22 17.523 22 12.004 22 6.477 17.523 2 12.004 2zm0 18.181a8.177 8.177 0 01-4.194-1.154l-.3-.179-3.106.751.786-2.996-.196-.309A8.143 8.143 0 013.82 12.004c0-4.515 3.67-8.185 8.184-8.185 4.515 0 8.184 3.67 8.184 8.185 0 4.514-3.669 8.177-8.184 8.177z" />
        </svg>
    );
}

function TwitterXIcon() {
    return (
        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L2.25 2.25H8.08l4.253 5.622 5.91-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
        </svg>
    );
}

function FacebookIcon() {
    return (
        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
    );
}

function LinkedInIcon() {
    return (
        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
    );
}

export function ShareButton({ title, text, url }: ShareButtonProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [copied, setCopied] = useState(false);
    const panelRef = useRef<HTMLDivElement>(null);

    const fullUrl = typeof window !== "undefined"
        ? `${window.location.origin}${url}`
        : url;

    const encodedUrl = encodeURIComponent(fullUrl);
    const encodedTitle = encodeURIComponent(title);
    const encodedText = encodeURIComponent(`${title} – ${text}`);

    const platforms = [
        {
            name: "WhatsApp",
            href: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
            icon: <WhatsAppIcon />,
            color: "hover:bg-[#25D366]/10 hover:text-[#25D366] hover:border-[#25D366]/30",
        },
        {
            name: "X (Twitter)",
            href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
            icon: <TwitterXIcon />,
            color: "hover:bg-white/10 hover:text-white hover:border-white/20",
        },
        {
            name: "Facebook",
            href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
            icon: <FacebookIcon />,
            color: "hover:bg-[#1877F2]/10 hover:text-[#1877F2] hover:border-[#1877F2]/30",
        },
        {
            name: "LinkedIn",
            href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
            icon: <LinkedInIcon />,
            color: "hover:bg-[#0A66C2]/10 hover:text-[#0A66C2] hover:border-[#0A66C2]/30",
        },
    ];

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(fullUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            /* noop */
        }
    };

    const handleNativeShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({ title, text, url: fullUrl });
                return;
            } catch { /* user cancelled */ }
        }
        setIsOpen((prev) => !prev);
    };

    // Close on outside click
    useEffect(() => {
        if (!isOpen) return;
        const handler = (e: MouseEvent) => {
            if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [isOpen]);

    return (
        <div className="relative" ref={panelRef}>
            <button
                onClick={handleNativeShare}
                className="w-[40px] h-[40px] flex items-center justify-center rounded-sm hover:bg-black/5 transition-colors"
                title="Share this article"
                aria-label="Share"
            >
                <Share2 className="w-5 h-5 text-[#181821]" />
            </button>

            {/* Share popover */}
            {isOpen && (
                <div className="absolute bottom-full right-0 mb-2 w-[220px] bg-[#1A1714] border border-white/10 rounded-[6px] shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-150 z-50">
                    {/* Header */}
                    <div className="flex items-center justify-between px-3 py-2.5 border-b border-white/10">
                        <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-white/40">Share</span>
                        <button onClick={() => setIsOpen(false)} className="text-white/30 hover:text-white transition-colors">
                            <X className="w-3.5 h-3.5" />
                        </button>
                    </div>

                    {/* Platform list */}
                    <div className="p-2 flex flex-col gap-0.5">
                        {platforms.map((p) => (
                            <a
                                key={p.name}
                                href={p.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => setIsOpen(false)}
                                className={`flex items-center gap-2.5 px-3 py-2 rounded-[4px] text-[13px] text-white/60 border border-transparent transition-all ${p.color}`}
                            >
                                {p.icon}
                                <span className="font-sans">{p.name}</span>
                            </a>
                        ))}
                    </div>

                    {/* Copy link */}
                    <div className="px-2 pb-2">
                        <button
                            onClick={handleCopy}
                            className={`flex items-center gap-2.5 w-full px-3 py-2 rounded-[4px] text-[13px] border transition-all ${
                                copied
                                    ? "bg-green-500/10 text-green-400 border-green-500/20"
                                    : "text-white/60 border-transparent hover:bg-white/5 hover:text-white hover:border-white/10"
                            }`}
                        >
                            {copied ? <Check className="w-4 h-4 shrink-0" /> : <Link2 className="w-4 h-4 shrink-0" />}
                            <span className="font-sans">{copied ? "Link copied!" : "Copy link"}</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
