"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { CinemaCardSkeleton } from "./home-skeletons";
import Link from "next/link";
import MaxWidthWrapper from "@/components/max-width-wraper";

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

export function CinemaSection({ initialData }: { initialData?: { recent: Article[], popular: Article[] } }) {
    const [data, setData] = useState<{ recent: Article[], popular: Article[] } | null>(initialData || null);
    const [loading, setLoading] = useState(!initialData);

    useEffect(() => {
        if (initialData) return;

        fetch("/api/public/home")
            .then(res => res.json())
            .then(payload => {
                if (payload.success) {
                    setData(payload.data.films);
                }
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [initialData]);

    const renderGrid = (articles: Article[]) => {
        if (loading) {
            return (
                <div className="grid gap-6 min-[640px]:grid-cols-2 min-[1200px]:grid-cols-3 min-[1440px]:gap-8">
                    {[1, 2, 3].map(i => <CinemaCardSkeleton key={i} />)}
                </div>
            );
        }
        return (

            <div className="grid gap-6 min-[640px]:grid-cols-2 min-[1200px]:grid-cols-3 min-[1440px]:gap-8">
                {articles.slice(0, 3).map((article) => (
                    <Link key={article.id} href={`/films/${article.slug}`} className="block h-full">
                        <article className="flex h-80.25 w-full flex-col border items-start justify-start border-zinc-100 bg-[#fdf9f2] p-8 shadow-[0_1px_2px_rgba(0,0,0,0.05)] transition-all hover:-translate-y-1 hover:shadow-md min-[360px]:p-9 min-[480px]:p-10 min-[768px]:h-85 min-[768px]:p-10 min-[1024px]:h-90 min-[1200px]:h-95 min-[1440px]:h-102.5 min-[1440px]:p-12 min-[1920px]:h-110">
                            <p className="font-heading text-[30px] leading-9 text-[#2b5940] min-[768px]:text-[34px] min-[1200px]:text-[38px] min-[1440px]:text-[42px]">
                                {Math.min(9.8, 8 + (article.view_count % 20) / 10).toFixed(1)}
                            </p>
                            <h3 className="mt-4 line-clamp-2 font-heading text-[24px] leading-8 text-[#1c1c18] min-[768px]:text-[26px] min-[1200px]:mt-5 min-[1200px]:text-[28px] min-[1440px]:text-[30px]">
                                {article.title}
                            </h3>
                            <p className="mt-4 line-clamp-3 text-[14px] leading-4.25 text-[#615e5a] min-[768px]:mt-5 min-[768px]:text-[15px] min-[1200px]:text-[16px] min-[1440px]:mt-6 min-[1440px]:text-[17px]">
                                {article.subtitle}
                            </p>
                            <div className="mt-auto pt-6 min-[768px]:pt-7 min-[1440px]:pt-8">
                                <span className="group inline-flex items-center gap-2 text-[16px] font-normal uppercase tracking-[1.2px] text-[#DC2828] min-[768px]:text-[17px] min-[1440px]:text-[18px]">
                                    Read Critique <span className="transition-transform group-hover:translate-x-1">→</span>
                                </span>
                            </div>
                        </article>
                    </Link>
                ))}
            </div>

        );
    };

    return (
        <section className="bg-[#f7f3ec]">
            <MaxWidthWrapper className="px-3  py-8 min-[360px]:px-4 min-[480px]:py-10 min-[640px]:px-5 min-[768px]:px-6 min-[768px]:py-12 min-[1024px]:py-14 min-[1200px]:px-6 min-[1200px]:py-6 min-[1440px]:py-10 min-[1920px]:py-14">
                <div className="space-y-8 min-[768px]:space-y-10 min-[1200px]:space-y-7 min-[1440px]:space-y-10">
                    <div className="grid items-center gap-10 min-[640px]:gap-10 min-[1024px]:grid-cols-2 min-[1200px]:gap-12 min-[1440px]:gap-16">
                        <div className="relative aspect-4/3 w-full overflow-hidden shadow-sm min-[640px]:aspect-16/10 min-[1024px]:aspect-5/4 min-[1440px]:aspect-16/11 min-[1920px]:aspect-18/12">
                            <Image
                                loading="lazy"
                                src="/home/image.png"
                                alt="Cinema"
                                fill
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 60vw"
                                className="object-cover object-center"
                            />
                        </div>
                        <div className="text-start min-[1024px]:text-left">
                            <h2 className="font-heading text-center sm:text-start text-[34px] leading-tight text-[#1c1c18] min-[360px]:text-[36px] min-[640px]:text-[42px] min-[768px]:text-[48px] min-[1200px]:text-[54px] min-[1440px]:text-[60px] min-[1920px]:text-[68px]">Cinema as Ritual</h2>
                            <p className=" items-start max-w-xl text-[15px] leading-7 text-zinc-700 min-[480px]:text-[16px] min-[768px]:mt-1 min-[768px]:text-[18px] min-[1024px]:mx-0 min-[1200px]:max-w-[58ch] min-[1440px]:text-[19px] min-[1920px]:text-[20px]">
                                Our film critiques go beyond the surface of plot and performance. We dissect the visual grammar,
                                the acoustic textures, and the psychological resonance of masterpieces.
                            </p>
                            <div className="mt-8 flex flex-col items-center justify-center gap-6 min-[480px]:flex-row min-[480px]:gap-8 min-[1024px]:justify-start min-[1440px]:mt-10 min-[1440px]:gap-10">
                                <Link className="inline-flex border-b-2 border-[#4b3600] pb-1 text-[11px] font-bold uppercase tracking-[0.14em] text-[#11412a] transition-all hover:border-[#DC2828] hover:text-[#DC2828] min-[768px]:text-xs min-[1440px]:text-[13px]" href="/films">
                                    Explore Filmography
                                </Link>
                            </div>
                        </div>
                    </div>

                    {renderGrid(data?.recent || [])}
                </div>
            </MaxWidthWrapper>
        </section>
    );
}
