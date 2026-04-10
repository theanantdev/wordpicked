"use client";

import { useEffect, useState } from "react";
import { SectionHeader } from "./section-header";
import { StoryCard } from "./story-card";
import { TabFilter } from "./tab-filter";
import { StoryCardSkeleton } from "./home-skeletons";

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
                <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {[1, 2, 3].map(i => <StoryCardSkeleton key={i} />)}
                </div>
            );
        }
        return (
            <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
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

    return (
        <section className="border-y border-zinc-200 bg-[#fdf9f2] py-20">
            <div className="mx-auto w-full max-w-310 space-y-24 px-4 md:px-6">
                {/* Literature Section */}
                <div>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b border-zinc-100 pb-8">
                        <div>
                            <div className="mb-3 h-1 w-12 bg-[#DC2828]" />
                            <h2 className="font-heading text-4xl font-semibold text-zinc-900">Literature</h2>
                        </div>
                        <TabFilter activeTab={litTab} onChange={setLitTab} />
                    </div>
                    {renderGrid(litData?.[litTab].slice(0, 3) || [], loading)}
                </div>

                {/* Films Section */}
                <div>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b border-zinc-100 pb-8">
                        <div>
                            <div className="mb-3 h-1 w-12 bg-[#DC2828]" />
                            <h2 className="font-heading text-4xl font-semibold text-zinc-900">Films</h2>
                        </div>
                        <TabFilter activeTab={filmsTab} onChange={setFilmsTab} />
                    </div>
                    {renderGrid(filmsData?.[filmsTab].slice(0, 3) || [], loading)}
                </div>
            </div>
        </section>
    );
}
