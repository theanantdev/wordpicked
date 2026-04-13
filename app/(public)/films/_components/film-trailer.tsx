type FilmTrailerProps = {
    trailerUrl?: string;
};

function toEmbed(url?: string) {
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

export function FilmTrailer({ trailerUrl }: FilmTrailerProps) {
    const embedUrl = toEmbed(trailerUrl);
    const hasVideoFile = Boolean(trailerUrl && /\.(mp4|webm|ogg)(\?.*)?$/i.test(trailerUrl));

    if (!embedUrl && !hasVideoFile) {
        return null;
    }

    return (
        <section className="w-full bg-[#FDF9F2] pt-[60px] md:pt-[100px] flex flex-col items-center">
            <h2 className="font-sans font-normal text-[24px] md:text-[30px] leading-[36px] tracking-[2.08px] text-[#E50914] uppercase mb-[40px]">
                Movie Trailer
            </h2>

            <div className="w-full max-w-[1240px] px-6 md:px-[60px] lg:px-[80px]">
                {embedUrl ? (
                    <div className="relative w-full aspect-video bg-black border border-black/5 overflow-hidden rounded-[2px] shadow-sm">
                        <iframe
                            src={embedUrl}
                            title="Film trailer"
                            className="h-full w-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                        />
                    </div>
                ) : hasVideoFile ? (
                    <video className="w-full border border-black/5 rounded-[2px] shadow-sm" controls preload="metadata">
                        <source src={trailerUrl} />
                        Your browser does not support the video tag.
                    </video>
                ) : null}
            </div>
        </section>
    );
}
