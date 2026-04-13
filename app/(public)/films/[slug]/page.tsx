import { FilmHero } from "../_components/film-hero";
import { FilmTrailer } from "../_components/film-trailer";
import { FilmContent } from "../_components/film-content";
import { FilmRelated } from "../_components/film-related";
import { CommentsSection } from "@/app/(public)/_components/comments-section";
import { ViewTracker } from "@/app/(public)/_components/view-tracker";
import { headers } from "next/headers";

type PageProps = {
    params: Promise<{ slug: string }>;
};

type ArticleApiResponse = {
    success: boolean;
    data?: {
        article: {
            id: string;
            slug: string;
            title: string;
            subtitle: string;
            authorName: string;
            categoryLabel: string;
            publishDate: string;
            coverImageUrl: string;
            tags: string[];
            blocks: Array<{
                type?: string;
                data?: {
                    text?: string;
                    caption?: string;
                    items?: string[];
                    source?: string;
                    embed?: string;
                };
            }>;
            viewCount: number;
        };
        related: Array<{
            tag: string;
            title: string;
            img: string;
            href: string;
        }>;
    };
    error?: string;
};

const URL_REGEX = /(https?:\/\/[^\s<>")\]]+)/g;

function normalizeText(value: unknown): string {
    if (typeof value === "string") return value;
    if (typeof value === "number") return String(value);
    return "";
}

function extractTrailerUrl(
    blocks: Array<{ type?: string; data?: { text?: string; source?: string; embed?: string } }>,
) {
    for (const block of blocks) {
        if (block.type === "embed") {
            const embedUrl = block.data?.source || block.data?.embed;
            if (embedUrl) return embedUrl;
        }

        const text = normalizeText(block.data?.text);
        const urls = text ? Array.from(text.matchAll(URL_REGEX), (match) => match[0]) : [];
        const videoUrl = urls.find((url) => /youtu\.be|youtube\.com|vimeo\.com|\.(mp4|webm|ogg)(\?.*)?$/i.test(url));
        if (videoUrl) return videoUrl;
    }

    return undefined;
}

async function fetchFilmBySlug(slug: string) {
    const headerStore = await headers();
    const protocol = headerStore.get("x-forwarded-proto") ?? "http";
    const host = headerStore.get("x-forwarded-host") ?? headerStore.get("host");

    if (!host) {
        throw new Error("Missing request host.");
    }

    const response = await fetch(
        `${protocol}://${host}/api/public/films/article?slug=${encodeURIComponent(slug)}`,
        { method: "GET", next: { revalidate: 3600 } },
    );

    const payload = (await response.json()) as ArticleApiResponse;

    if (!response.ok || !payload.success || !payload.data) {
        throw new Error(payload.error || "Failed to fetch film.");
    }

    return payload.data;
}

export async function generateMetadata({ params }: PageProps): Promise<import("next").Metadata> {
    try {
        const { slug } = await params;
        const data = await fetchFilmBySlug(slug);
        
        return {
            title: data.article.title,
            description: data.article.subtitle,
            openGraph: {
                title: data.article.title,
                description: data.article.subtitle,
                images: [{ url: data.article.coverImageUrl }],
                type: "article",
                authors: [data.article.authorName],
                publishedTime: data.article.publishDate,
                tags: data.article.tags,
            },
            twitter: {
                card: "summary_large_image",
                title: data.article.title,
                description: data.article.subtitle,
                images: [data.article.coverImageUrl],
            },
        };
    } catch {
        return {
            title: "Film Not Found",
            description: "The requested film could not be found.",
        };
    }
}

export default async function FilmEditorialPage({ params }: PageProps) {
    const { slug } = await params;
    const data = await fetchFilmBySlug(slug);
    const trailerUrl = extractTrailerUrl(data.article.blocks);

    return (
        <main className="w-full bg-[#FDF9F2] min-h-screen">
            <FilmHero
                categoryLabel={data.article.categoryLabel}
                title={data.article.title}
                subtitle={data.article.subtitle}
                authorName={data.article.authorName}
                publishDate={data.article.publishDate}
                coverImageUrl={data.article.coverImageUrl}
                viewCount={data.article.viewCount}
            />
            <ViewTracker articleId={data.article.id} />

            <FilmTrailer trailerUrl={trailerUrl} />
            <FilmContent blocks={data.article.blocks} tags={data.article.tags} />
            <FilmRelated items={data.related} />

            {/* Comments */}
            <div className="max-w-[1240px] mx-auto px-6 md:px-[60px] lg:px-[80px] pb-[80px]">
                <CommentsSection
                    articleId={data.article.id}
                    articleSlug={data.article.slug}
                    articleTitle={data.article.title}
                    articleType="films"
                />
            </div>
        </main>
    );
}