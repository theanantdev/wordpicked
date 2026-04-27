"use client";

import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useEffect, useState } from "react";
import { PickOfDaySkeleton } from "./home-skeletons";
import MaxWidthWrapper from "@/components/max-width-wraper";

type Article = {
    id: string;
    title: string;
    subtitle: string;
    slug: string;
    category: string;
    publish_at: string;
    created_at: string;
    view_count: number;
    featured_image_url: string;
};

export function PickOfDaySection({ initialData }: { initialData?: Article | null }) {
    const [data, setData] = useState<Article | null>(initialData || null);
    const [loading, setLoading] = useState(!initialData);

    useEffect(() => {
        if (initialData) return;

        fetch("/api/public/home")
            .then(res => res.json())
            .then(payload => {
                if (payload.success) {
                    setData(payload.data.pickOfDay);
                }
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [initialData]);

    if (loading) {
        return (
            <section className="mx-auto w-full max-w-80 px-4 py-10 min-[360px]:max-w-90 min-[480px]:max-w-120 min-[640px]:max-w-160 min-[768px]:max-w-3xl min-[1024px]:max-w-5xl min-[1200px]:max-w-300 min-[1440px]:max-w-360 min-[1920px]:max-w-420 min-[768px]:py-12 min-[1200px]:py-14 min-[1920px]:py-16">
                <SectionHeader title="Pick of the Day" redirectionUrl="/pick-of-the-day" />
                <PickOfDaySkeleton />
            </section>
        );
    }

    if (!data) return null;

    const displayDate = new Date(data.publish_at || data.created_at).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    });

    return (
        <MaxWidthWrapper className="px-1  min-[360px]:px-4 min-[360px]:py-9 min-[480px]:px-5 min-[640px]:py-10 min-[768px]:px-6 min-[768px]:py-12 min-[1024px]:py-10 min-[1200px]:px-8 min-[1200px]:py-8 min-[1440px]:py-10 min-[1920px]:py-14">
            <SectionHeader title="Pick Of The Day" redirectionUrl="/pick-of-the-day" className="" />
            <div className="grid gap-6 min-[640px]:gap-8 min-[1024px]:grid-cols-[1fr_1.6fr] min-[1024px]:items-start min-[1200px]:grid-cols-[1fr_1.8fr] min-[1440px]:gap-10 min-[1920px]:grid-cols-[1fr_2fr]">
                <div className="relative mx-0 aspect-16/13 w-[90%] min-[1024px]:w-[88%]">
                    <Image
                        loading="lazy"
                        src={data.featured_image_url || "/home/pick-of-the-day.png"}
                        alt={data.title}
                        fill
                        className="object-cover transition-transform duration-500  shadow-[0_1px_2px_rgba(0,0,0,0.05)] rounded-xs"
                    />
                </div>
                <div className="space-y-1 text-start max-w-2xl min-[1024px]:space-y-8 min-[1024px]:text-left min-[1440px]:space-y-10">
                    <div className="space-y-2 min-[768px]:space-y-4 min-[1440px]:space-y-5">
                        <p className="text-[11px] uppercase tracking-[0.12em] text-zinc-500 min-[640px]:text-xs">{displayDate}</p>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#DC2828] min-[768px]:text-sm">{data.category}</p>
                        <h3 className="font-heading text-[18px] font-semibold leading-tight text-zinc-900 min-[360px]:text-[30px] min-[480px]:text-[34px] min-[768px]:text-[38px] min-[1024px]:text-[42px] min-[1440px]:text-[42px] min-[1920px]:text-[60px]">
                            {data.title}
                        </h3>
                        <p className=" max-w-2xl leading-relaxed text-zinc-600 min-[480px]:text-[15px] min-[1024px]:mx-0 min-[1024px]:text-[16px] min-[1440px]:max-w-[48ch] min-[1440px]:text-[18px] min-[1920px]:text-[20px]">
                            {data.subtitle}
                        </p>
                    </div>
                    <Link href={`/${data.category === 'films' ? 'films' : 'literature'}/${data.slug}`}>
                        <button className="inline-flex h-10 items-center gap-2 self-center rounded-full bg-[#DC2828] px-6 py-2 text-xs font-medium uppercase tracking-[0.12em] text-white transition-all hover:bg-black hover:px-8 min-[640px]:h-11 min-[640px]:px-8 min-[640px]:text-sm min-[1024px]:self-start min-[1440px]:h-12 min-[1440px]:px-10 min-[1440px]:text-base">
                            Read More <ArrowRight className="size-4" />
                        </button>
                    </Link>
                </div>
            </div>
        </MaxWidthWrapper>
    );
}

function SectionHeader({ title, redirectionUrl, className }: { title: string; className?: string, redirectionUrl?: string }) {

    return (
        <div className="flex flex-col border-b border-zinc-100">
            <div className={cn("h-1 w-12 bg-[#DC2828]", className)} />
            <div className="relative flex items-center justify-between gap-4 py-2 min-[768px]:py-3">
                <h2 className="font-heading text-xl font-semibold text-zinc-900 min-[360px]:text-2xl min-[640px]:text-3xl min-[768px]:text-4xl min-[1440px]:text-[44px] min-[1920px]:text-[52px]">{title}</h2>
                {redirectionUrl && (
                    <Link href={redirectionUrl}>
                        <button className="group inline-flex h-9 items-center justify-center gap-2 border border-zinc-200 bg-[#DC2828] px-4 py-2 text-[9px] font-bold uppercase tracking-[0.16em] text-white transition-all hover:border-[#DC2828] min-[480px]:h-10 min-[480px]:px-5 min-[480px]:text-[10px] min-[768px]:h-11 min-[768px]:px-6">
                            View All <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                        </button>
                    </Link>
                )}
            </div>

        </div>
    );
}