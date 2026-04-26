import MaxWidthWrapper from "@/components/max-width-wraper";

type ContentBlock = {
    type?: string;
    data?: {
        text?: string;
        caption?: string;
        items?: string[];
        source?: string;
        embed?: string;
    };
};

type FilmContentProps = {
    blocks?: ContentBlock[];
    tags?: string[];
};

const URL_REGEX = /(https?:\/\/[^\s<>")\]]+)/g;

function getUrlsFromText(text: string): string[] {
    if (!text) return [];
    return Array.from(text.matchAll(URL_REGEX), (match) => match[0]);
}

function toEmbedUrl(url?: string): string | null {
    if (!url) return null;

    try {
        const parsed = new URL(url);
        const host = parsed.hostname.toLowerCase();

        if (host.includes("youtube.com")) {
            const id = parsed.searchParams.get("v");
            if (id) return `https://www.youtube.com/embed/${id}`;
        }

        if (host.includes("youtu.be")) {
            const id = parsed.pathname.replace("/", "");
            if (id) return `https://www.youtube.com/embed/${id}`;
        }

        if (host.includes("vimeo.com")) {
            const segments = parsed.pathname.split("/").filter(Boolean);
            const id = segments[segments.length - 1];
            if (id) return `https://player.vimeo.com/video/${id}`;
        }
    } catch {
        return null;
    }

    return null;
}

function LinkPreview({ url }: { url: string }) {
    const embedUrl = toEmbedUrl(url);

    if (embedUrl) {
        return (
            <div className="relative mt-4 w-full aspect-video overflow-hidden rounded-lg border border-black/10 bg-black">
                <iframe
                    src={embedUrl}
                    title="Embedded preview"
                    className="h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                />
            </div>
        );
    }

    return (
        <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 block rounded-lg border border-[#1A1A1A]/15 bg-[#FFFFFF] p-3 text-[14px] text-[#1A1A1A] hover:bg-[#F8F3EA]"
        >
            {url}
        </a>
    );
}

export function FilmContent({ blocks = [], tags = [] }: FilmContentProps) {
    const safeBlocks = blocks.length > 0 ? blocks : [{ type: "paragraph", data: { text: "Film content is currently unavailable." } }];

    return (
        <MaxWidthWrapper>
            <div className="flex w-full mx-auto max-w-164 flex-col gap-9 min-[768px]:max-w-3xl min-[1200px]:max-w-230 min-[1440px]:max-w-300">
                {safeBlocks
                    .map((block, index) => {
                        const text = block.data?.text || "";

                        if (block.type === "embed") {
                            const embeddedUrl = block.data?.source || block.data?.embed || "";
                            if (!embeddedUrl) return null;

                            return <LinkPreview key={`embed-${index}`} url={embeddedUrl} />;
                        }

                        if (block.type === "header") {
                            return (
                                <h2 key={`header-${index}`} className="font-heading text-[30px] font-bold leading-9.5 text-[#1A1A1A] min-[640px]:text-[34px] min-[1200px]:text-[38px]">
                                    {text}
                                </h2>
                            );
                        }

                        if (block.type === "quote") {
                            return (
                                <blockquote key={`quote-${index}`} className="my-5 flex flex-col gap-4 border-l-2 border-[#E50914] py-3 pl-6">
                                    <p className="font-heading text-[22px] font-bold italic leading-8.5 text-[#1A1A1A] md:text-[28px] md:leading-9.5">
                                        {text || block.data?.caption || "-"}
                                    </p>
                                </blockquote>
                            );
                        }

                        if (block.type === "list") {
                            return (
                                <ul key={`list-${index}`} className="list-disc pl-6 space-y-2 text-[16px] md:text-[18px] text-[#1A1A1A]/85">
                                    {(block.data?.items || []).map((item, itemIndex) => (
                                        <li key={`item-${index}-${itemIndex}`}>{item}</li>
                                    ))}
                                </ul>
                            );
                        }

                        if (index === 0) {
                            const urls = getUrlsFromText(text);

                            return (
                                <div key={`p-${index}`}>
                                    <p className="font-sans text-[18px] font-light leading-7 text-[#1A1A1A]/90 md:text-[20px]">
                                        <span className="float-left mr-4 font-sans text-[60px] font-bold leading-16.25 text-[#1A1A1A]/60 md:text-[72px] md:leading-18">
                                            {text.charAt(0) || "F"}
                                        </span>
                                        {text.slice(1)}
                                    </p>
                                    {urls.map((url) => (
                                        <LinkPreview key={`${index}-${url}`} url={url} />
                                    ))}
                                </div>
                            );
                        }

                        const urls = getUrlsFromText(text);

                        return (
                            <div key={`p-${index}`}>
                                <p className="font-sans text-[18px] font-light leading-7 text-[#1A1A1A]/90 md:text-[20px]">
                                    {text}
                                </p>
                                {urls.map((url) => (
                                    <LinkPreview key={`${index}-${url}`} url={url} />
                                ))}
                            </div>
                        );
                    })}

                {tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 border-t border-[#1A1A1A]/10 pt-6 mt-4">
                        {tags.map((tag) => (
                            <span key={tag} className="px-3 py-1 text-[11px] uppercase tracking-[1px] bg-[#EFE9DF] text-[#3A3A3A]">
                                {tag}
                            </span>
                        ))}
                    </div>
                )}

            </div>
        </MaxWidthWrapper>
    );
}
