"use client";

import { useEffect, useState } from "react";
import { StoryCard } from "./story-card";
import { TabFilter } from "./tab-filter";
import { StoryCardSkeleton } from "./home-skeletons";
import MaxWidthWrapper from "@/components/max-width-wraper";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
type Article = {
    id: string;
    title: string;
    subtitle: string;
    slug: string;
    category: string;
    publish_at: string;
    created_at: string;
    featured_image_url: string;
    author_name: string;
    tags: string[];
};

type CategoryData = {
    recent: Article[];
    popular: Article[];
};

export function StoriesSections({ initialLiterature, initialFilms }: { initialLiterature?: CategoryData, initialFilms?: CategoryData }) {
    const [litData, setLitData] = useState<CategoryData | null>(initialLiterature || null);
    const [filmsData, setFilmsData] = useState<CategoryData | null>(initialFilms || null);
    const [loading, setLoading] = useState(!initialLiterature);
    const [litTab, setLitTab] = useState<"recent" | "popular">("recent");
    const [filmsTab, setFilmsTab] = useState<"recent" | "popular">("recent");

    useEffect(() => {
        if (initialLiterature && initialFilms) return;

        fetch("/api/public/home")
            .then(res => res.json())
            .then(payload => {
                if (payload.success) {
                    setLitData(payload.data.literature);
                    setFilmsData(payload.data.films);
                }
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [initialLiterature, initialFilms]);

    const renderGrid = (articles: Article[], isLoading: boolean) => {
        if (isLoading) {
            return (
                <div className="mt-5 grid gap-4 min-[360px]:mt-6 min-[360px]:gap-5 min-[640px]:mt-7 min-[640px]:grid-cols-2 min-[768px]:gap-6 min-[1200px]:grid-cols-3 min-[1440px]:gap-8">
                    {[1, 2, 3].map(i => <StoryCardSkeleton key={i} />)}
                </div>
            );
        }
        return (
            <div className=" grid gap-4 min-[360px]:mt-6 min-[360px]:gap-5 min-[640px]:mt-7 min-[640px]:grid-cols-2 min-[768px]:gap-6 min-[1200px]:grid-cols-3 min-[1440px]:gap-8">
                {articles.map((article) => (
                    <StoryCard
                        key={article.id}
                        tag={article.tags?.[0] || article.category}
                        title={article.title}
                        summary={article.subtitle}
                        author={article.author_name}
                        date={new Date(article.publish_at || article.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        image={article.featured_image_url || "/home/hero.jpg"} tone={""}
                        slug={article.slug} />
                ))}
            </div>
        );
    };

    return (<section className="  bg-[#fdf9f2]">
        <MaxWidthWrapper className="px-1  py-2 min-[360px]:px-4 min-[360px]:py-1 min-[480px]:px-5 min-[640px]:py-1 min-[768px]:px-6 min-[768px]:py-1 min-[1024px]:py-1 min-[1200px]:px-8 min-[1200px]:py-1 min-[1440px]:py-0 min-[1920px]:py-1">

            <div className="mx-auto w-full space-y-5 min-[768px]:space-y-10 min-[1200px]:space-y-10 min-[1440px]:space-y-10">
                {/* Literature Section */}
                <div>
                    <div className="">
                        <div className="flex flex-col border-b border-zinc-100">
                            <div className="h-1 w-12 bg-[#DC2828]" />
                            <div className="relative flex items-center flex-row w-full justify-between gap-4 py-2 min-[768px]:py-3">
                                <h2 className="font-heading text-xl font-semibold text-zinc-900 min-[360px]:text-2xl min-[640px]:text-3xl min-[768px]:text-4xl min-[1440px]:text-[44px] min-[1920px]:text-[52px]">Literature</h2>
                                <Link href={"/literature"}>
                                    <button className="group inline-flex h-9 items-center justify-center gap-2 border border-zinc-200 bg-[#DC2828] px-4 py-2 text-[9px] font-bold uppercase tracking-[0.16em] text-white transition-all hover:border-[#DC2828] min-[480px]:h-10 min-[480px]:px-5 min-[480px]:text-[10px] min-[768px]:h-11 min-[768px]:px-6">
                                        View All <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                                    </button>
                                </Link>

                            </div>

                        </div>
                        <TabFilter activeTab={litTab} onChange={setLitTab} />
                    </div>
                    {renderGrid(litData?.[litTab].slice(0, 3) || [], loading)}
                </div>

                {/* Films Section */}
                <div>
                    <div className="">
                        <div className="flex flex-col border-b border-zinc-100">
                            <div className="h-1 w-12 bg-[#DC2828]" />
                            <div className="relative flex items-center flex-row w-full justify-between gap-4 py-2 min-[768px]:py-3">
                                <h2 className="font-heading text-xl font-semibold text-zinc-900 min-[360px]:text-2xl min-[640px]:text-3xl min-[768px]:text-4xl min-[1440px]:text-[44px] min-[1920px]:text-[52px]">Films</h2>
                                <Link href={"/films"}>
                                    <button className="group inline-flex h-9 items-center justify-center gap-2 border border-zinc-200 bg-[#DC2828] px-4 py-2 text-[9px] font-bold uppercase tracking-[0.16em] text-white transition-all hover:border-[#DC2828] min-[480px]:h-10 min-[480px]:px-5 min-[480px]:text-[10px] min-[768px]:h-11 min-[768px]:px-6">
                                        View All <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                                    </button>
                                </Link>

                            </div>

                        </div>
                        <TabFilter activeTab={filmsTab} onChange={setFilmsTab} />
                    </div>
                    {renderGrid(filmsData?.[filmsTab].slice(0, 3) || [], loading)}
                </div>
            </div>

        </MaxWidthWrapper>
    </section>
    );
}
