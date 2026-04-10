"use client";

import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArtistCardSkeleton } from "./home-skeletons";
import { TabFilter } from "./tab-filter";

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
                <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
                    {[1, 2, 3].map(i => <ArtistCardSkeleton key={i} />)}
                </div>
            );
        }
        return (
            <div className="grid gap-12 md:grid-cols-2 xl:grid-cols-3">
                {artists.slice(0, 3).map((artist) => (
                    <Link key={artist.id} href={`/artists/${artist.id}`}>
                        <article className="text-center group">
                            <div className="relative mx-auto aspect-square w-full max-w-[320px] overflow-hidden rounded-[2px] shadow-sm">
                                <Image 
                                    src={artist.image_url || "/home/hero.jpg"} 
                                    alt={artist.full_name} 
                                    fill 
                                    className="object-cover transition-transform duration-500 group-hover:scale-110" 
                                />
                                <div className="absolute inset-0 bg-black/10 opacity-0 transition-opacity group-hover:opacity-100" />
                            </div>
                            <h3 className="mt-6 font-heading text-3xl text-[#1c1c18] group-hover:text-[#DC2828] transition-colors">{artist.full_name}</h3>
                            <p className="mt-1 text-[11px] font-bold tracking-[0.2em] uppercase text-[#a8812a]">{artist.art_form}</p>
                            <p className="mx-auto mt-4 max-w-[280px] text-zinc-600 line-clamp-3 leading-relaxed text-sm">
                                {artist.biography}
                            </p>
                        </article>
                    </Link>
                ))}
            </div>
        );
    };

    return (
        <section className="bg-[#fdf9f2] py-24 border-t border-zinc-100">
            <div className="mx-auto w-full max-w-310 px-4 md:px-6">
                <div className="mb-16 flex flex-col justify-between items-center sm:items-end gap-10 md:flex-row">
                    <div className="text-center sm:text-left">
                        <p className="font-heading text-lg font-medium tracking-[0.1em] text-[#a8812a] uppercase mb-2">Conversations</p>
                        <h2 className="font-heading text-5xl leading-tight">The Artists</h2>
                        <p className="mt-4 text-zinc-500 max-w-lg">Long-form conversations with writers, filmmakers, musicians, and visual artists who shape our cultural landscape.</p>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                        <TabFilter activeTab={tab} onChange={setTab} />
                        <Link href="/artists">
                            <button className="inline-flex h-11 items-center gap-2 bg-[#DC2828] px-8 py-2 text-xs font-bold tracking-[0.16em] text-white uppercase transition-all hover:bg-black hover:px-10 group">
                                All Artists <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                            </button>
                        </Link>
                    </div>
                </div>

                {renderGrid(data?.[tab] || [])}
            </div>
        </section>
    );
}
