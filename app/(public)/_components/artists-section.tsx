"use client";

import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArtistCardSkeleton } from "./home-skeletons";
import { TabFilter } from "./tab-filter";
import MaxWidthWrapper from "@/components/max-width-wraper";

type Artist = {
    id: string;
    full_name: string;
    art_form: string;
    biography: string;
    image_url: string;
    views: number;
};

export function ArtistsSection({ initialData }: { initialData?: { recent: Artist[], popular: Artist[] } }) {
    const [data, setData] = useState<{ recent: Artist[], popular: Artist[] } | null>(initialData || null);
    const [loading, setLoading] = useState(!initialData);
    const [tab, setTab] = useState<"recent" | "popular">("recent");

    useEffect(() => {
        if (initialData) return;

        fetch("/api/public/home")
            .then(res => res.json())
            .then(payload => {
                if (payload.success) {
                    setData(payload.data.artists);
                }
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [initialData]);

    const renderGrid = (artists: Artist[]) => {
        if (loading) {
            return (
                <div className="mt-6 grid gap-5 min-[640px]:mt-7 min-[640px]:grid-cols-2 min-[768px]:gap-6 min-[1200px]:grid-cols-3 min-[1440px]:mt-8 min-[1440px]:gap-8">
                    {[1, 2, 3].map(i => <ArtistCardSkeleton key={i} />)}
                </div>
            );
        }
        return (
            <div className="mx-auto mt-6 grid gap-5 min-[640px]:mt-7 min-[640px]:grid-cols-2 min-[768px]:gap-6 min-[1200px]:grid-cols-3 min-[1440px]:mt-5 min-[1440px]:gap-8">
                {artists.slice(0, 3).map((artist) => (
                    <article key={artist.id} className="group text-center min-[1200px]:text-left shadow-md ">
                        <div className="relative mx-auto aspect-square w-full max-w-84 overflow-hidden rounded-xs shadow-sm min-[768px]:max-w-96 min-[1200px]:mx-0 min-[1200px]:max-w-120 min-[1440px]:max-w-140 min-[1920px]:max-w-110">
                            <Image
                                loading="lazy"
                                src={artist.image_url || "/home/hero.jpg"}
                                alt={artist.full_name}
                                fill
                                sizes="(max-width: 640px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                className="object-cover object-center transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/10 opacity-0 transition-opacity group-hover:opacity-100" />
                        </div>
                        <div className="mx-auto px-3 mb-1 max-w-70 text-start min-[768px]:mx-0 min-[768px]:max-w-full" >
                            <h3 className="font-heading text-[30px] text-[#1c1c18] transition-colors group-hover:text-[#DC2828] min-[768px]:mt-6 min-[768px]:text-[34px] min-[1200px]:text-[30px] min-[1440px]:text-[34px] min-[1920px]:text-[38px]">{artist.full_name}</h3>
                            <div >

                                <p className="mx-auto text-start max-w-70 text-sm leading-relaxed text-zinc-600 line-clamp-3 min-[768px]:mt-4 min-[1200px]:mx-0 min-[1200px]:max-w-[32ch] min-[1440px]:text-[15px] min-[1920px]:max-w-[36ch] min-[1920px]:text-base">
                                    {artist.biography}
                                </p>
                                <p className="mt-1 text-[11px]  font-bold uppercase tracking-[0.2em] text-[#a8812a] min-[768px]:text-xs">{artist.art_form}</p>
                            </div>
                        </div>


                    </article>
                ))}
            </div>
        );
    };

    return (
        <section className="bg-[#fdf9f2] border-t border-zinc-100">
            <MaxWidthWrapper className="px-3 py-1 min-[360px]:px-4 min-[640px]:px-5 min-[768px]:px-6 mt-2 mb-3   min-[1200px]:px-8 ">
                <div>
                    <div className="">
                        <div className="text-center min-[768px]:text-left">
                            <div className="flex flex-col border-b border-zinc-100">
                                <div className="h-1 w-12 bg-[#DC2828]" />
                                <div className="relative flex w-full flex-row items-center justify-between gap-3 py-2 min-[480px]:flex-row min-[480px]:items-center min-[480px]:gap-4 min-[768px]:py-3">
                                    <h2 className="font-heading text-xl font-semibold text-zinc-900 min-[360px]:text-2xl min-[640px]:text-3xl min-[768px]:text-4xl min-[1440px]:text-[44px] min-[1920px]:text-[52px]">The Artists</h2>
                                    <Link href={"/artists"}>
                                        <button className="group inline-flex h-9 items-center justify-center gap-2 border border-zinc-200 bg-[#DC2828] px-4 py-2 text-[9px] font-bold uppercase tracking-[0.16em] text-white transition-all hover:border-[#DC2828] min-[480px]:h-10 min-[480px]:px-5 min-[480px]:text-[10px] min-[768px]:h-11 min-[768px]:px-6">
                                            All Artists <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                                        </button>
                                    </Link>
                                </div>

                            </div>
                            <div className="mt-4 flex flex-col items-start justify-between gap-4 min-[768px]:mt-5 min-[768px]:flex-row min-[768px]:items-start">
                                <div className="text-start text-zinc-500 min-[1440px]:max-w-2xl max-w-100 min-[1920px]:text-[17px] flex flex-row items-start  w-full justify-start">
                                    Long-form conversations with writers, filmmakers, musicians, and visual artists who shape our cultural landscape.
                                </div>
                                <TabFilter activeTab={tab} onChange={setTab} />
                            </div>

                        </div>


                    </div>

                    {renderGrid(data?.[tab] || [])}
                </div>
            </MaxWidthWrapper>
        </section>
    );
}
