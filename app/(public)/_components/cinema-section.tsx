"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { CinemaCardSkeleton } from "./home-skeletons";
import { TabFilter } from "./tab-filter";
import Link from "next/link";

type Article = {
    id: string;
    title: string;
    subtitle: string;
    slug: string;
    category: string;
    publish_at: string;
    created_at: string;
    featured_image_url: string;
    view_count: number;
};

export function CinemaSection() {
    const [data, setData] = useState<{ recent: Article[], popular: Article[] } | null>(null);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState<"recent" | "popular">("recent");

    useEffect(() => {
        fetch("/api/public/home")
            .then(res => res.json())
            .then(payload => {
                if (payload.success) {
                    setData(payload.data.films);
                }
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const renderGrid = (articles: Article[]) => {
        if (loading) {
            return (
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {[1, 2, 3].map(i => <CinemaCardSkeleton key={i} />)}
                </div>
            );
        }
        return (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {articles.slice(0, 3).map((article) => (
                    <Link key={article.id} href={`/films/${article.slug}`}>
                        <article className="bg-[#fdf9f2] p-10 shadow-sm border border-zinc-100 transition-all hover:shadow-md hover:-translate-y-1">
                            <p className="text-4xl text-[#2b5940] font-heading">
                                {Math.min(9.8, 8 + (article.view_count % 20) / 10).toFixed(1)}
                            </p>
                            <h3 className="mt-4 font-heading text-2xl line-clamp-2">{article.title}</h3>
                            <p className="mt-4 text-sm text-zinc-600 line-clamp-3 leading-relaxed">{article.subtitle}</p>
                            <button className="mt-8 text-[10px] font-bold tracking-[0.15em] uppercase text-[#DC2828] flex items-center gap-2 group">
                                Read Critique <span className="transition-transform group-hover:translate-x-1">→</span>
                            </button>
                        </article>
                    </Link>
                ))}
            </div>
        );
    };

    return (
        <section className="bg-[#f7f3ec] py-20">
            <div className="mx-auto w-full max-w-310 space-y-16 px-4 md:px-6">
                <div className="grid items-center gap-10 lg:grid-cols-2">
                    <div className="relative aspect-video w-full overflow-hidden rounded-[4px] shadow-sm">
                        <Image 
                            src="/home/image.png" 
                            alt="Cinema" 
                            fill 
                            className="object-cover"
                        />
                    </div>
                    <div className="text-center lg:text-left">
                        <h2 className="font-heading text-4xl leading-tight text-[#1c1c18] sm:text-5xl">Cinema as Ritual</h2>
                        <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-zinc-700 sm:text-lg sm:leading-8 lg:mx-0">
                            Our film critiques go beyond the surface of plot and performance. We dissect the visual grammar,
                            the acoustic textures, and the psychological resonance of masterpieces.
                        </p>
                        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-8">
                            <Link className="inline-flex border-b-2 border-[#4b3600] pb-1 text-xs font-bold tracking-[0.14em] text-[#11412a] uppercase transition-all hover:border-[#DC2828] hover:text-[#DC2828]" href="/films">
                                Explore Filmography
                            </Link>
                            <TabFilter activeTab={tab} onChange={setTab} />
                        </div>
                    </div>
                </div>

                {renderGrid(data?.[tab] || [])}
            </div>
        </section>
    );
}
