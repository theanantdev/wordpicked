"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import Link from "next/link";

type Category = "ALL" | "FICTION" | "NON-FICTION" | "POETRY";
type SortOption = "LATEST" | "OLDEST" | "TITLE_A_Z";

interface Article {
    id: string;
    category: "FICTION" | "NON-FICTION" | "POETRY"; // Map back to our exact tab values
    readTime: string;
    releaseDate: string;
    title: string;
    author: string;
    description: string;
    imageUrl: string;
    slug: string;
}

const ARTICLES: Article[] = [
    {
        id: "1",
        category: "FICTION",
        readTime: "12 MIN READ",
        releaseDate: "2026-03-28",
        title: "The Silent Resonance of Modern Echoes",
        author: "By Julianna Vance",
        description: "An examination of silence as a narrative tool in contemporary prose, focusing on the weight of...",
        imageUrl: "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?q=80&w=600&auto=format&fit=crop",
        slug: "the-silent-resonance-of-modern-echoes"
    },
    {
        id: "2",
        category: "NON-FICTION",
        readTime: "08 MIN READ",
        releaseDate: "2026-03-27",
        title: "Ink & Ideology: The History of Printing",
        author: "By Marcus Thorne",
        description: "How the mechanical press didn't just reproduce words, but fundamentally restructured the human...",
        imageUrl: "https://images.unsplash.com/photo-1510172951991-856a654063f9?q=80&w=600&auto=format&fit=crop",
        slug: "ink-ideology-the-history-of-printing"
    },
    {
        id: "3",
        category: "POETRY",
        readTime: "05 MIN READ",
        releaseDate: "2026-03-26",
        title: "The Geometry of Verse in the Digital Age",
        author: "By Elena Rossi",
        description: "Exploring the visual architecture of concrete poetry and how screen-based reading changes our spati...",
        imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=600&auto=format&fit=crop",
        slug: "the-geometry-of-verse-in-the-digital-age"
    },
    {
        id: "4",
        category: "FICTION",
        readTime: "15 MIN READ",
        releaseDate: "2026-03-25",
        title: "Shadows of the Protaganist",
        author: "By David Chen",
        description: "A deep dive into the psychological complexity of unreliable narrators in 21st-century psychological...",
        imageUrl: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=600&auto=format&fit=crop",
        slug: "shadows-of-the-protaganist"
    },
    {
        id: "5",
        category: "NON-FICTION",
        readTime: "10 MIN READ",
        releaseDate: "2026-03-24",
        title: "The Architecture of an Argument",
        author: "By Sarah Jenkins",
        description: "Decoding the structural foundations of iconic essays and how they manipulate reader logic...",
        imageUrl: "https://images.unsplash.com/photo-1575881875475-31023242e3f9?q=80&w=600&auto=format&fit=crop",
        slug: "the-architecture-of-an-argument"
    },
    {
        id: "6",
        category: "POETRY",
        readTime: "07 MIN READ",
        releaseDate: "2026-03-23",
        title: "Landscape as Metaphor",
        author: "By Thomas O'Brien",
        description: "Tracing the evolution of nature imagery from Romanticism to the industrial-coded pastoral poe...",
        imageUrl: "https://images.unsplash.com/photo-1510172951991-856a654063f9?q=80&w=600&auto=format&fit=crop",
        slug: "landscape-as-metaphor"
    }
];

export function FilmsContent() {
    const [activeTab, setActiveTab] = useState<Category>("ALL");
    const [isSortOpen, setIsSortOpen] = useState(false);
    const [activeSort, setActiveSort] = useState<SortOption>("LATEST");

    const filteredArticles = ARTICLES.filter(
        article => activeTab === "ALL" || article.category === activeTab
    );

    const sortedArticles = [...filteredArticles].sort((a, b) => {
        if (activeSort === "LATEST") {
            return new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime();
        }

        if (activeSort === "OLDEST") {
            return new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime();
        }

        return a.title.localeCompare(b.title);
    });

    const sortLabelMap: Record<SortOption, string> = {
        LATEST: "Latest Release",
        OLDEST: "Oldest Release",
        TITLE_A_Z: "Title A-Z",
    };

    return (
        <section className="w-full flex flex-col items-center">
            {/* Tab and Sort Bar */}
            <div className="z-20 max-w-[1200px] w-full bg-[#F5F0E8] py-4 sm:py-5 -mt-15">
                <div className="mx-auto flex w-full flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 px-4 sm:px-6 md:px-8">
                    <div className="flex flex-row items-center gap-2 sm:gap-2.5 overflow-x-auto">
                        {(["ALL", "FICTION", "NON-FICTION", "POETRY"] as Category[]).map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`flex h-7.25 justify-center items-center px-3 sm:px-4.5 py-2.5 font-heading font-medium tracking-[1px] sm:tracking-[2px] text-xs sm:text-[14px] uppercase transition-colors whitespace-nowrap ${activeTab === tab
                                    ? "bg-[#DC2828] text-white"
                                    : "bg-white text-[#52525B] hover:text-[#18181B]"
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    <div className="relative w-full sm:w-auto">
                        <button
                            type="button"
                            onClick={() => setIsSortOpen((prev) => !prev)}
                            className="group flex w-full sm:w-auto cursor-pointer flex-row items-center justify-between sm:justify-start gap-2"
                        >
                            <span className="hidden sm:inline font-sans font-medium text-[#A1A1AA] tracking-[1.5px] uppercase text-[13px]">
                                Sort by:
                            </span>
                            <span className="font-heading font-bold text-[#18181B] tracking-[1.5px] sm:tracking-[2px] uppercase text-xs sm:text-[14px]">
                                {sortLabelMap[activeSort]}
                            </span>
                            <ChevronDown className={`h-4 sm:h-4.5 w-4 sm:w-4.5 text-[#A1A1AA] transition group-hover:text-[#18181B] ${isSortOpen ? "rotate-180" : "rotate-0"}`} />
                        </button>

                        {isSortOpen && (
                            <div className="absolute right-0 sm:right-0 z-30 mt-2 w-full sm:w-auto sm:min-w-47.5 border border-[#E4E4E7] bg-white shadow-lg">
                                {(["LATEST", "OLDEST", "TITLE_A_Z"] as SortOption[]).map((option) => (
                                    <button
                                        key={option}
                                        type="button"
                                        onClick={() => {
                                            setActiveSort(option);
                                            setIsSortOpen(false);
                                        }}
                                        className={`block w-full px-3 sm:px-4 py-2.5 sm:py-3 text-left font-sans text-xs sm:text-[13px] tracking-[1px] sm:tracking-[1.1px] uppercase transition-colors ${activeSort === option
                                            ? "bg-[#F4F4F5] text-[#18181B]"
                                            : "text-[#52525B] hover:bg-[#FAFAFA]"
                                            }`}
                                    >
                                        {sortLabelMap[option]}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Grid */}
            <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-8 sm:gap-12 lg:gap-15 px-4 sm:px-6 md:px-8 py-8 sm:py-12 md:py-16">
                <div className="grid w-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-x-8 md:gap-y-12">
                    {sortedArticles.map(article => (
                        <Link href={`/films/${article.slug}`} key={article.id} className="flex flex-col bg-[#FAFAFA] border border-[#F4F4F5] shadow-sm hover:shadow-md transition-shadow group cursor-pointer">
                            {/* Image */}
                            <div className="relative w-full aspect-3/4">
                                <Image
                                    src={article.imageUrl}
                                    alt={article.title}
                                    fill
                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                    className="object-cover object-center group-hover:scale-[1.02] transition-transform duration-500 rounded-t-sm"
                                />
                                {/* Vintage overlay effect similar to user's figma reference */}
                                <div className="absolute inset-0 bg-white/10 mix-blend-saturation pointer-events-none" />
                            </div>

                            {/* Content */}
                            <div className="flex flex-col gap-2.5 sm:gap-3 md:gap-4 p-4 sm:p-5 md:p-6">
                                <div className="flex flex-row items-center gap-2.5 sm:gap-3">
                                    <span className="font-sans font-black text-[9px] sm:text-[10.4px] leading-3.5 sm:leading-4 tracking-[1.8px] sm:tracking-[2.08px] text-[#E50914] uppercase">
                                        {article.category}
                                    </span>
                                    <div className="w-0.5 sm:w-1 h-0.5 sm:h-1 bg-[#E4E4E7] rounded-full" />
                                    <span className="font-sans font-bold text-[9px] sm:text-[10.4px] leading-3.5 sm:leading-4 tracking-[1.8px] sm:tracking-[2.08px] text-[#A1A1AA] uppercase">
                                        {article.readTime}
                                    </span>
                                </div>

                                <h2 className="font-heading h-auto sm:h-16 md:h-16.5 text-xl sm:text-2xl md:text-[28px] leading-5.75 sm:leading-7 md:leading-8.25 font-bold tracking-tight text-[#18181B] line-clamp-2 transition-colors group-hover:text-[#DC2828]">
                                    {article.title}
                                </h2>

                                <p className="font-heading text-sm sm:text-base md:text-[16px] leading-5 sm:leading-5.75 md:leading-6 italic text-[#71717A]">
                                    {article.author}
                                </p>

                                <p className="font-sans h-auto sm:h-10 md:h-11.5 text-xs sm:text-sm md:text-[14px] leading-4.5 sm:leading-5 md:leading-5.75 text-[#52525B] line-clamp-2">
                                    {article.description}
                                </p>
                            </div>
                        </Link>
                    ))}
                    {/* Empty state if all items are filtered out */}
                    {filteredArticles.length === 0 && (
                        <div className="col-span-1 sm:col-span-2 lg:col-span-3 text-center py-12 sm:py-16 md:py-20 text-gray-500">
                            No articles found in this category.
                        </div>
                    )}
                </div>

                {filteredArticles.length > 0 && (
                    <button className="flex items-center justify-center bg-[#b02020] px-6 sm:px-8 md:px-12 py-3.5 sm:py-4 md:py-5 text-white shadow-lg transition-colors w-full sm:w-auto">
                        <span className="relative z-10 font-sans text-xs sm:text-sm md:text-[14px] leading-3.5 sm:leading-4 md:leading-4.25 font-bold tracking-[1.8px] sm:tracking-[2px] md:tracking-[2.24px] uppercase">
                            Load More Reviews
                        </span>
                    </button>
                )}
            </div>
        </section>
    );
}
