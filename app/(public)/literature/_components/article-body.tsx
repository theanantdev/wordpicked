import { Star } from "lucide-react";
import Image from "next/image";
import type { ReactNode } from "react";

type ContentBlock = {
    type?: string;
    data?: {
        text?: string;
        caption?: string;
        items?: string[];
        source?: string;
        embed?: string;
        service?: string;
        file?: {
            url?: string;
        };
        url?: string;
        image?: {
            url?: string;
        };
    };
};

type ArticleBodyProps = {
    blocks: ContentBlock[];
    tags: string[];
};

const URL_REGEX = /(https?:\/\/[^\s<>")\]]+)/g;

function normalizeText(value: unknown): string {
    if (typeof value === "string") return value;
    if (typeof value === "number") return String(value);
    return "";
}

function extractUrls(text: unknown) {
    try {
        const normalized = normalizeText(text);
        if (!normalized) return [];
        const matches = Array.from(normalized.matchAll(URL_REGEX), (match) => match[0]);
        return Array.from(new Set(matches));
    } catch {
        return [];
    }
}

function parseYouTubeId(url: string) {
    try {
        const parsed = new URL(url);
        const host = parsed.hostname.toLowerCase();

        if (host.includes("youtube.com")) {
            return parsed.searchParams.get("v");
        }

        if (host.includes("youtu.be")) {
            return parsed.pathname.replace("/", "") || null;
        }
    } catch {
        return null;
    }

    return null;
}

function parseVimeoId(url: string) {
    try {
        const parsed = new URL(url);
        if (!parsed.hostname.toLowerCase().includes("vimeo.com")) return null;
        const segments = parsed.pathname.split("/").filter(Boolean);
        return segments[segments.length - 1] || null;
    } catch {
        return null;
    }
}

function toEmbedConfig(url: string) {
    const youtubeId = parseYouTubeId(url);
    if (youtubeId) {
        return {
            type: "iframe" as const,
            src: `https://www.youtube.com/embed/${youtubeId}`,
            title: "YouTube video",
        };
    }

    const vimeoId = parseVimeoId(url);
    if (vimeoId) {
        return {
            type: "iframe" as const,
            src: `https://player.vimeo.com/video/${vimeoId}`,
            title: "Vimeo video",
        };
    }

    if (/\.(mp4|webm|ogg)(\?.*)?$/i.test(url)) {
        return {
            type: "video" as const,
            src: url,
            title: "Video file",
        };
    }

    return null;
}

function renderTextWithLinks(text: unknown): ReactNode {
    const normalized = normalizeText(text);
    if (!normalized) return "";

    const parts = normalized.split(URL_REGEX);
    return parts.map((part, index) => {
        if (/^https?:\/\//i.test(part)) {
            return (
                <a
                    key={`link-${index}`}
                    href={part}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#11412A] underline break-all"
                >
                    {part}
                </a>
            );
        }

        return <span key={`text-${index}`}>{part}</span>;
    });
}

function LinkPreview({ url }: { url: string }) {
    const embed = toEmbedConfig(url);

    return (
        <div className="mt-4 border border-[#DCD6CC] bg-white p-3 sm:p-4">
            {embed?.type === "iframe" && (
                <div className="mt-3 aspect-video w-full overflow-hidden border border-[#DCD6CC] bg-black">
                    <iframe
                        src={embed.src}
                        title={embed.title}
                        className="h-full w-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                    />
                </div>
            )}

            {embed?.type === "video" && (
                <video className="mt-3 w-full border border-[#DCD6CC]" controls preload="metadata">
                    <source src={embed.src} />
                    Your browser does not support the video tag.
                </video>
            )}
        </div>
    );
}

function getImageUrl(block: ContentBlock) {
    return (
        block.data?.file?.url ||
        block.data?.image?.url ||
        block.data?.url ||
        ""
    );
}

export function ArticleBody({ blocks, tags }: ArticleBodyProps) {
    const safeBlocks = blocks.length > 0 ? blocks : [{ type: "paragraph", data: { text: "Article content is currently unavailable." } }];
    const renderedPreviewUrls = new Set<string>();

    const renderUniquePreviews = (urls: string[], keyPrefix: string) => {
        return urls
            .filter((url) => {
                if (renderedPreviewUrls.has(url)) {
                    return false;
                }

                renderedPreviewUrls.add(url);
                return true;
            })
            .map((url) => <LinkPreview key={`${keyPrefix}-${url}`} url={url} />);
    };

    return (
        <div className="flex flex-col gap-10 w-full pt-8 lg:pr-[40px]">
            <div className="flex flex-col items-center mb-6">
                <div className="flex items-center text-[#FBBC05] gap-[10px]">
                    <Star className="w-6 h-6 fill-current" />
                    <Star className="w-6 h-6 fill-current" />
                    <Star className="w-6 h-6 fill-current" />
                    <Star className="w-6 h-6 fill-current" />
                    <Star className="w-6 h-6 text-transparent stroke-[#181821] stroke-2" />
                </div>
                <span className="font-heading italic text-[18px] text-[#615E5A] mt-4">
                    The Wordpicked Essential Reading
                </span>
            </div>

            <div className="font-sans font-light text-[18px] leading-[29px] text-[#1C1C18] flex flex-col gap-8">
                {safeBlocks.map((block, index) => {
                    const text = normalizeText(block.data?.text);
                    const urls = extractUrls(text);

                    if (block.type === "embed") {
                        const embedUrl = block.data?.source || block.data?.embed || "";
                        if (embedUrl) {
                            return <div key={`embed-${index}`}>{renderUniquePreviews([embedUrl], `embed-${index}`)}</div>;
                        }
                    }

                    if (block.type === "quote") {
                        return (
                            <div key={`quote-${index}`}>
                                <blockquote className="my-6 py-6 px-8 bg-[#11412A]/5 border-l-[3px] border-[#2B5940]">
                                    <p className="font-heading italic text-[22px] md:text-[24px] leading-[32px] text-[#11412A] m-0">
                                        {renderTextWithLinks(text || block.data?.caption || "-")}
                                    </p>
                                </blockquote>
                                {renderUniquePreviews(urls, `quote-preview-${index}`)}
                            </div>
                        );
                    }

                    if (block.type === "image") {
                        const imageUrl = getImageUrl(block);
                        const caption = normalizeText(block.data?.caption);

                        if (!imageUrl) {
                            return null;
                        }

                        return (
                            <figure key={`image-${index}`} className="my-6 space-y-3">
                                <div className="overflow-hidden border border-[#DCD6CC] bg-[#F7F3EC]">
                                    <Image
                                        src={imageUrl}
                                        alt={caption || "Article image"}
                                        width={1200}
                                        height={800}
                                        unoptimized
                                        className="w-full h-auto object-cover"
                                        style={{ width: '100%', height: 'auto' }}
                                    />
                                </div>
                                {caption ? (
                                    <figcaption className="text-[13px] leading-[1.6] text-[#6B6258] italic text-center">
                                        {caption}
                                    </figcaption>
                                ) : null}
                                {renderUniquePreviews(extractUrls(imageUrl), `image-preview-${index}`)}
                            </figure>
                        );
                    }

                    if (block.type === "list") {
                        const rawItems = Array.isArray(block.data?.items) ? block.data.items : [];
                        const listItems = rawItems.map((item) => normalizeText(item)).filter(Boolean);
                        const listUrls = Array.from(new Set(listItems.flatMap((item) => extractUrls(item))));

                        return (
                            <div key={`list-${index}`}>
                                <ul className="list-disc pl-6 space-y-2">
                                    {listItems.map((item, itemIndex) => (
                                        <li key={`item-${index}-${itemIndex}`}>{renderTextWithLinks(item)}</li>
                                    ))}
                                </ul>
                                {renderUniquePreviews(listUrls, `list-preview-${index}`)}
                            </div>
                        );
                    }

                    if (block.type === "header") {
                        return (
                            <h2 key={`header-${index}`} className="font-heading text-[28px] leading-[36px] text-[#1C1C18]">
                                {text}
                            </h2>
                        );
                    }

                    if (index === 0) {
                        return (
                            <div key={`p-${index}`}>
                                <p className="first-letter:float-left first-letter:text-[90px] first-letter:leading-[75px] first-letter:mr-4 first-letter:text-[#1C1C18]/40 first-letter:font-light">
                                    {renderTextWithLinks(text)}
                                </p>
                                {renderUniquePreviews(urls, `first-preview-${index}`)}
                            </div>
                        );
                    }

                    return (
                        <div key={`p-${index}`}>
                            <p>{renderTextWithLinks(text)}</p>
                            {renderUniquePreviews(urls, `preview-${index}`)}
                        </div>
                    );
                })}

                <div className="w-full h-[195px] my-4 bg-[#EBE8E1] border border-[#C1C9C1]/30 flex flex-col gap-2 items-center justify-center relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#E7E5E4]/50 to-[#F5F5F4]/50 opacity-50" />
                    <span className="font-sans font-bold text-[10px] tracking-[1px] uppercase text-[#A8A29E] z-10">
                        Advertisement
                    </span>
                </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap items-center gap-[8px] border-t border-[#C1C9C1]/30 pt-8 mt-2">
                {(tags.length > 0 ? tags : ["Literature"]).map(tag => (
                    <div key={tag} className="bg-[#E6E2DB] px-3 py-1">
                        <span className="font-sans font-normal text-[12px] uppercase tracking-[-0.275px] text-[#1C1C18]">{tag}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
