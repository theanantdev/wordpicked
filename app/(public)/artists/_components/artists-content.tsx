"use client";

import { useState } from "react";
import Image from "next/image";
import { Artist } from "@/utils/server-artists";
import MaxWidthWrapper from "@/components/max-width-wraper";

type FilterTab = "ALL" | "WRITERS" | "FILMMAKERS" | "MUSICIANS" | "VISUAL ARTISTS" | "PHOTOGRAPHERS";

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?q=80&w=800&auto=format&fit=crop";

export function ArtistsContent({ artists }: { artists: Artist[] }) {
    const [activeTab, setActiveTab] = useState<FilterTab>("ALL");

    // Standardize category extraction based on art_form string for tabs mapping
    const matchesTab = (tab: FilterTab, artForm: string) => {
        const form = artForm.toUpperCase();
        if (tab === "ALL") return true;
        if (tab === "WRITERS") return form.includes("WRITER") || form.includes("NOVEL") || form.includes("POET") || form.includes("ESSAY");
        if (tab === "FILMMAKERS") return form.includes("FILM") || form.includes("DIRECTOR");
        if (tab === "MUSICIANS") return form.includes("MUSIC") || form.includes("COMPOSER");
        if (tab === "VISUAL ARTISTS") return form.includes("VISUAL") || form.includes("PAINT") || form.includes("SCULPT") || form.includes("ARTIST");
        if (tab === "PHOTOGRAPHERS") return form.includes("PHOTO");
        return false;
    };

    // Derived properties to fit the previous UI exactly
    const getUIMappedArtist = (artist: Artist) => {
        const isWriter = matchesTab("WRITERS", artist.art_form);
        const derivedCategory = artist.art_form.split(/[\s·,-]+/)[0].toUpperCase();

        let handle = "@" + artist.full_name.split(" ").join("").toLowerCase();
        if (artist.instagram && artist.instagram.includes(".com/")) {
            handle = "@" + artist.instagram.split("/").filter(Boolean).pop();
        } else if (artist.twitter && artist.twitter.includes(".com/")) {
            handle = "@" + artist.twitter.split("/").filter(Boolean).pop();
        }

        return {
            ...artist,
            uiCategory: derivedCategory,
            uiTag: artist.art_form.toUpperCase(),
            uiDescription: artist.biography || "No description provided.",
            uiHandle: handle,
            uiPostsStr: artist.posts === 1 ? "1 POST" : `${artist.posts} POSTS`,
            uiImage: artist.image_url || FALLBACK_IMAGE,
            isWriter
        };
    };

    const mappedArtists = artists.map(getUIMappedArtist);

    const visibleArtists = mappedArtists.filter((a) => matchesTab(activeTab, a.art_form));

    // Split into exact previous sections
    const visibleWriters = visibleArtists.filter(a => a.isWriter);
    const visibleOtherArtists = visibleArtists.filter(a => !a.isWriter);
    const visibleArtistCount = visibleArtists.length;

    return (
        <>
            <MaxWidthWrapper>
                {/* FILTER BAR */}
                <div className="w-full bg-white  sticky top-0 z-20">
                    <div className="max-w-310 mx-auto flex h-12 flex-row items-center justify-between overflow-x-auto px-6 md:px-15 lg:px-20 no-scrollbar">
                        <div className="flex min-w-max flex-row items-center gap-6 md:gap-10 px-2">
                            {(["ALL", "WRITERS", "FILMMAKERS", "MUSICIANS", "VISUAL ARTISTS", "PHOTOGRAPHERS"] as FilterTab[]).map(tab => (
                                <>
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        aria-pressed={activeTab === tab}
                                        className={`font-heading border-b-2 pb-1 text-[12px] md:text-[14px] uppercase tracking-[1.1px] transition-colors whitespace-nowrap ${activeTab === tab
                                            ? "text-[#B5542A] border-[#B5542A] border-b-4"
                                            : "border-transparent text-[#8C857C] hover:text-[#B5542A]"
                                            }`}
                                    >
                                        {tab}
                                    </button>

                                </>
                            ))}
                        </div>

                        <div className="hidden lg:flex flex-row items-center gap-6 min-w-max">
                            <div className="h-4.5 w-px bg-[#DDD7CC]" />
                            <span className="font-heading font-normal text-[14px] leading-4.25 tracking-[0.6px] text-[#1A1A1A]">
                                {visibleArtistCount} {visibleArtistCount === 1 ? "Artist" : "Artists"}
                            </span>
                        </div>
                    </div>
                </div>
            </MaxWidthWrapper>
            <div className="bg-[#FDF9F2]">
                <MaxWidthWrapper>
                    <div className=" w-full mx-auto flex flex-col gap-5 px-6 pt-5 md:px-15 lg:px-20  ">
                        {/* Writers & Novelists Section */}
                        {visibleWriters.length > 0 && (
                            <div className="flex flex-col gap-10">
                                <div className="flex flex-col gap-2 relative">
                                    <h3 className="font-sans font-medium text-[13px] md:text-[14px] uppercase tracking-[1.6px] text-[#B5542A]">
                                        All Artists
                                    </h3>
                                    <h2 className="font-heading font-bold text-[28px] md:text-[32px] leading-[1.2] tracking-[-0.32px] text-[#1A1714] pb-5 border-b border-[#DDD7CC]">
                                        Writers & Novelists
                                    </h2>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                                    {visibleWriters.map(writer => (
                                        <div key={writer.id} className="flex flex-col bg-white border border-[#E7E5E4] cursor-pointer group hover:shadow-md transition-all h-full">
                                            {/* Image Section */}
                                            <div className="relative w-full aspect-4/5 overflow-hidden">
                                                <Image
                                                    loading="lazy"
                                                    src={writer.uiImage}
                                                    alt={writer.full_name}
                                                    fill
                                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                                    className="object-cover object-center transition-transform duration-800 group-hover:scale-105"
                                                />
                                                {/* <div className={`absolute inset-0 bg-linear-to-br ${writer.gradient} mix-blend-multiply opacity-80`} /> */}

                                                {/* Top Left Tag */}
                                                <div className="absolute top-3 left-3 px-2 py-1 bg-[#1A1714]/55 border border-white/10 backdrop-blur-[2px] rounded-[1px]">
                                                    <span className="font-sans font-normal text-[9px] md:text-[10px] leading-tight tracking-[1.08px] text-[#F5F0E8]/90 uppercase">
                                                        {writer.uiTag}
                                                    </span>
                                                </div>

                                                {/* Top Right Label */}
                                                <div className="absolute top-4 right-4">
                                                    <span className="font-heading text-[8px] md:text-[9px] uppercase tracking-[0.9px] text-[#F5F0E8]/50">
                                                        {writer.uiPostsStr}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Content Section */}
                                            <div className="flex grow flex-col gap-3 p-5 md:p-6">
                                                <div className="flex flex-col gap-1 items-start">
                                                    <div className="flex w-full items-center gap-2.5">
                                                        <div className="h-px w-4 bg-[#B5542A]" />
                                                        <span className="font-sans text-[11px] md:text-[12px] uppercase tracking-[1.14px] text-[#B5542A] truncate">
                                                            {writer.uiCategory}
                                                        </span>
                                                    </div>

                                                    <h3 className="font-heading font-bold text-[18px] md:text-[20px] text-[#1A1714] mt-1 group-hover:text-[#B5542A] transition-colors">
                                                        {writer.full_name}
                                                    </h3>

                                                    <p className="font-sans font-light text-[12px] leading-[1.6] text-[#8C857C] mt-2 line-clamp-3">
                                                        {writer.uiDescription}
                                                    </p>
                                                </div>

                                                {/* Social Handle */}
                                                <div className="mt-auto flex items-center gap-1.5 pt-4">
                                                    <p className="w-4 h-4 text-[#A8A29E]">
                                                        <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M15.3417 0.000116526H1.225C1.06632 -0.00208733 0.908751 0.0269894 0.761305 0.0856863C0.613859 0.144383 0.479419 0.23155 0.365665 0.34221C0.25191 0.452869 0.161068 0.584853 0.0983266 0.730625C0.0355853 0.876396 0.00217366 1.0331 0 1.19178V15.4751C0.00217366 15.6338 0.0355853 15.7905 0.0983266 15.9363C0.161068 16.082 0.25191 16.214 0.365665 16.3247C0.479419 16.4353 0.613859 16.5225 0.761305 16.5812C0.908751 16.6399 1.06632 16.669 1.225 16.6668H15.3417C15.5004 16.669 15.6579 16.6399 15.8054 16.5812C15.9528 16.5225 16.0872 16.4353 16.201 16.3247C16.3148 16.214 16.4056 16.082 16.4683 15.9363C16.5311 15.7905 16.5645 15.6338 16.5667 15.4751V1.19178C16.5645 1.0331 16.5311 0.876396 16.4683 0.730625C16.4056 0.584853 16.3148 0.452869 16.201 0.34221C16.0872 0.23155 15.9528 0.144383 15.8054 0.0856863C15.6579 0.0269894 15.5004 -0.00208733 15.3417 0.000116526ZM5.025 13.9501H2.525V6.45012H5.025V13.9501ZM3.775 5.40012C3.43022 5.40012 3.09956 5.26315 2.85576 5.01936C2.61196 4.77556 2.475 4.4449 2.475 4.10012C2.475 3.75534 2.61196 3.42468 2.85576 3.18088C3.09956 2.93708 3.43022 2.80012 3.775 2.80012C3.95808 2.77935 4.14348 2.7975 4.31906 2.85335C4.49464 2.90921 4.65645 3.00152 4.79388 3.12425C4.93131 3.24698 5.04127 3.39735 5.11656 3.56552C5.19185 3.73369 5.23076 3.91586 5.23076 4.10012C5.23076 4.28437 5.19185 4.46655 5.11656 4.63471C5.04127 4.80288 4.93131 4.95326 4.79388 5.07598C4.65645 5.19871 4.49464 5.29102 4.31906 5.34688C4.14348 5.40274 3.95808 5.42088 3.775 5.40012ZM14.0417 13.9501H11.5417V9.92512C11.5417 8.91678 11.1833 8.25845 10.275 8.25845C9.99389 8.26051 9.72016 8.34868 9.4907 8.51109C9.26124 8.6735 9.08707 8.90235 8.99167 9.16678C8.92645 9.36265 8.8982 9.56893 8.90833 9.77512V13.9418H6.40833V6.44178H8.90833V7.50012C9.13544 7.10604 9.46576 6.78138 9.8637 6.56112C10.2616 6.34085 10.7121 6.23333 11.1667 6.25012C12.8333 6.25012 14.0417 7.32512 14.0417 9.63345V13.9501Z" fill="#A8A29E" />
                                                        </svg>

                                                    </p>
                                                    <span className="font-sans font-medium text-[11px] md:text-[12px] uppercase tracking-[0.76px] text-[#B0A89E]">
                                                        {writer.uiHandle}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Filmmakers & Visual Artists Section */}
                        {visibleOtherArtists.length > 0 && (
                            <div className="flex flex-col gap-10">
                                <div className="flex flex-col gap-2 relative">
                                    <h3 className="font-sans font-medium text-[13px] md:text-[14px] uppercase tracking-[1.6px] text-[#B5542A]">
                                        More Artists
                                    </h3>
                                    <h2 className="font-heading font-bold text-[28px] md:text-[32px] leading-[1.2] tracking-[-0.32px] text-[#1A1714] pb-5 border-b border-[#DDD7CC]">
                                        Filmmakers & Visual Artists
                                    </h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {visibleOtherArtists.map(artist => (
                                        <div key={artist.id} className="group flex flex-row items-center gap-5 border border-[#E7E5E4] bg-white p-5 cursor-pointer transition-shadow hover:shadow-sm">
                                            <div className="relative h-18 w-18 shrink-0 overflow-hidden rounded-[3px]">
                                                <Image
                                                    src={artist.uiImage}
                                                    alt={artist.full_name}
                                                    fill
                                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                                <div className="absolute inset-0 bg-[#080E10]/20 mix-blend-multiply" />
                                            </div>

                                            <div className="flex flex-col gap-1 w-full overflow-hidden">
                                                <div className="flex items-center gap-1.75">
                                                    <div className="h-px w-3.5 bg-[#B5542A]" />
                                                    <span className="font-sans text-[10px] md:text-[11px] leading-tight uppercase tracking-[1px] text-[#B5542A] truncate">
                                                        {artist.uiCategory}
                                                    </span>
                                                </div>
                                                <h4 className="font-heading font-bold text-[16px] md:text-[17px] text-[#1A1714] group-hover:text-[#B5542A] transition-colors truncate">
                                                    {artist.full_name}
                                                </h4>
                                                <p className="font-sans font-light text-[12px] md:text-[13px] leading-[1.35] text-[#8C857C] line-clamp-2">
                                                    {artist.uiDescription}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {visibleArtistCount === 0 && (
                            <div className="w-full rounded-lg border border-dashed border-[#DDD7CC] bg-white px-6 py-12 text-center">
                                <p className="font-heading text-[18px] md:text-[20px] text-[#1A1714]">
                                    No artists found for this tab.
                                </p>
                            </div>
                        )}

                        {/* Advertisement */}
                        <div className="mt-5 w-full">
                            <div className="mx-auto flex h-22.5 w-full items-center justify-center rounded-xs border border-dashed border-[#DDD7CC] bg-[#EDE7D9] md:h-30 md:max-w-182">
                                <span className="font-heading text-[14px] md:text-[16px] xl:text-[18px] uppercase tracking-[1px] text-[#B0A89E] opacity-80">
                                    Advertisement — 728 × 90
                                </span>
                            </div>
                        </div>

                    </div>
                </MaxWidthWrapper>
            </div>

        </>


    );
}
