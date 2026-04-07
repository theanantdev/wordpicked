import { ArticleHero } from "../../literature/_components/article-hero";
import { ArticleBody } from "../../literature/_components/article-body";
import { ArticleSidebar } from "../../literature/_components/article-sidebar";
import { ArticleRelated } from "../../literature/_components/article-related";
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
                };
            }>;
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

async function fetchFilmBySlug(slug: string) {
    const headerStore = await headers();
    const protocol = headerStore.get("x-forwarded-proto") ?? "http";
    const host = headerStore.get("x-forwarded-host") ?? headerStore.get("host");

    if (!host) {
        throw new Error("Missing request host.");
    }

    const response = await fetch(
        `${protocol}://${host}/api/public/films/article?slug=${encodeURIComponent(slug)}`,
        { method: "GET", cache: "no-store" },
    );

    const payload = (await response.json()) as ArticleApiResponse;

    if (!response.ok || !payload.success || !payload.data) {
        throw new Error(payload.error || "Failed to fetch film.");
    }

    return payload.data;
}

export default async function FilmEditorialPage({ params }: PageProps) {
    const { slug } = await params;
    const data = await fetchFilmBySlug(slug);

    return (
        <main className="w-full bg-[#FDF9F2] min-h-screen">
            <ArticleHero
                categoryLabel={data.article.categoryLabel}
                title={data.article.title}
                subtitle={data.article.subtitle}
                authorName={data.article.authorName}
                publishDate={data.article.publishDate}
                coverImageUrl={data.article.coverImageUrl}
            />

            <div className="max-w-[1240px] mx-auto px-6 md:px-[60px] lg:px-[80px] pb-[80px] md:pb-[120px] relative">
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-16 xl:gap-[100px] relative">
                    <ArticleBody blocks={data.article.blocks} tags={data.article.tags} />
                    <ArticleSidebar />
                </div>
            </div>

            <ArticleRelated items={data.related} />
        </main>
    );
}