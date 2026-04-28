import { ArticleHero } from "../_components/article-hero";
import { ArticleBody } from "../_components/article-body";
import { ArticleSidebar } from "../_components/article-sidebar";
import { ArticleRelated } from "../_components/article-related";
import { CommentsSection } from "@/app/(public)/_components/comments-section";
import { ViewTracker } from "@/app/(public)/_components/view-tracker";
import { headers } from "next/headers";
import MaxWidthWrapper from "@/components/max-width-wraper";
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

async function fetchArticleBySlug(slug: string) {
    const headerStore = await headers();
    const protocol = headerStore.get("x-forwarded-proto") ?? "http";
    const host = headerStore.get("x-forwarded-host") ?? headerStore.get("host");

    if (!host) {
        throw new Error("Missing request host.");
    }

    const response = await fetch(
        `${protocol}://${host}/api/public/literature/article?slug=${encodeURIComponent(slug)}`,
        { method: "GET", next: { revalidate: 3600 } },
    );

    const payload = (await response.json()) as ArticleApiResponse;

    if (!response.ok || !payload.success || !payload.data) {
        throw new Error(payload.error || "Failed to fetch article.");
    }

    return payload.data;
}

export async function generateMetadata({ params }: PageProps): Promise<import("next").Metadata> {
    try {
        const { slug } = await params;
        const data = await fetchArticleBySlug(slug);

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
            title: "Article Not Found",
            description: "The requested article could not be found.",
        };
    }
}

export default async function LiteraturePostPage({ params }: PageProps) {
    const { slug } = await params;
    const data = await fetchArticleBySlug(slug);

    return (
        <main className="w-full bg-[#FDF9F2] min-h-screen">
            <div className=" w-full mx-auto flex px-2 flex-col gap-5 pt-5 md:px-15 lg:px-20  ">
                <ArticleHero
                    categoryLabel={data.article.categoryLabel}
                    title={data.article.title}
                    subtitle={data.article.subtitle}
                    authorName={data.article.authorName}
                    publishDate={data.article.publishDate}
                    coverImageUrl={data.article.coverImageUrl}
                    viewCount={data.article.viewCount}
                />
                <ViewTracker articleId={data.article.id} />

                <MaxWidthWrapper>
                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-10 xl:gap-[60px] relative">

                        <ArticleBody blocks={data.article.blocks} tags={data.article.tags} />

                        {/* Optional separator line visible only on large screens if desired */}
                        {/* <div className="hidden lg:block absolute left-[calc(100%-250px-50px)] xl:left-[calc(100%-350px-50px)] top-0 bottom-0 w-px bg-[#E7E5E4]" /> */}
                        <div className="">
                            <ArticleSidebar />
                        </div>


                    </div>
                </MaxWidthWrapper>

                <ArticleRelated items={data.related} />

                {/* Comments */}
                <div className="w-full mx-auto px-0  lg:px-[80px] pb-[80px]">
                    <CommentsSection
                        articleId={data.article.id}
                        articleSlug={data.article.slug}
                        articleTitle={data.article.title}
                        articleType="literature"
                    />
                </div>
            </div>
        </main>
    );
}