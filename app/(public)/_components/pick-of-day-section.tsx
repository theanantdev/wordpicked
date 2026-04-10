"use client";

import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useEffect, useState } from "react";
import { PickOfDaySkeleton } from "./home-skeletons";

type Article = {
    id: string;
    title: string;
    subtitle: string;
    slug: string;
    category: string;
    publish_at: string;
    created_at: string;
    featured_image_url: string;
};

export function PickOfDaySection() {
    const [data, setData] = useState<Article | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/public/home")
            .then(res => res.json())
            .then(payload => {
                if (payload.success) {
                    setData(payload.data.pickOfDay);
                }
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <section className="mx-auto w-full max-w-[1171px] px-4 py-14 md:px-6">
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
        <section className="mx-auto w-full max-w-[1171px] px-4 py-14 md:px-6">
            <SectionHeader title="Pick of the Day" redirectionUrl="/pick-of-the-day" />
            <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_1.9fr] lg:items-start">
                <div className="relative aspect-[387/440] w-full overflow-hidden rounded-[2px] shadow-sm">
                    <Image
                        src={data.featured_image_url || "/home/pick-of-the-day.png"}
                        alt={data.title}
                        fill
                        className="object-cover transition-transform duration-500 hover:scale-105"
                    />
                </div>
                <div className="space-y-8 text-center lg:text-left">
                    <div className="space-y-4">
                        <p className="text-xs tracking-[0.12em] text-zinc-500 uppercase">{displayDate}</p>
                        <p className="text-sm font-semibold tracking-[0.18em] text-[#DC2828] uppercase">{data.category}</p>
                        <h3 className="font-heading text-3xl font-semibold leading-tight text-zinc-900 sm:text-4xl lg:text-[42px]">
                            {data.title}
                        </h3>
                        <p className="mx-auto max-w-2xl text-zinc-600 lg:mx-0 leading-relaxed">
                            {data.subtitle}
                        </p>
                    </div>
                    <Link href={`/${data.category === 'films' ? 'films' : 'literature'}/${data.slug}`}>
                        <button className="inline-flex h-11 items-center gap-2 self-center rounded-full bg-[#DC2828] px-8 py-2 text-sm font-medium tracking-[0.12em] text-white uppercase lg:self-start transition-all hover:bg-black hover:px-10">
                            Read More <ArrowRight className="size-4" />
                        </button>
                    </Link>
                </div>
            </div>
        </section>
    );
}

function SectionHeader({ title, redirectionUrl, className }: { title: string; className?: string, redirectionUrl?: string }) {

    return (
        <div className="flex items-center gap-4 flex-row justify-between sm:gap-6 border-b border-zinc-100 pb-6">
            <div className="relative">
                <div className={cn("mb-3 h-1 w-12 bg-[#DC2828]", className)} />
                <h2 className="font-heading text-3xl font-semibold text-zinc-900 md:text-4xl">{title}</h2>
            </div>
            {redirectionUrl && (
                <Link href={redirectionUrl}>
                    <button className="inline-flex h-11 items-center justify-center gap-2 bg-transparent border border-zinc-200 px-6 py-2 text-[10px] font-bold tracking-[0.16em] text-zinc-900 uppercase transition-all hover:bg-[#DC2828] hover:text-white hover:border-[#DC2828] group">
                        View All <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                    </button>
                </Link>
            )}
        </div>
    );
}