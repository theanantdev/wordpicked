"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";

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
        imageUrl: "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?q=80&w=600&auto=format&fit=crop"
    },
    {
        id: "2",
        category: "NON-FICTION",
        readTime: "08 MIN READ",
        releaseDate: "2026-03-27",
        title: "Ink & Ideology: The History of Printing",
        author: "By Marcus Thorne",
        description: "How the mechanical press didn't just reproduce words, but fundamentally restructured the human...",
        imageUrl: "https://images.unsplash.com/photo-1510172951991-856a654063f9?q=80&w=600&auto=format&fit=crop"
    },
    {
        id: "3",
        category: "POETRY",
        readTime: "05 MIN READ",
        releaseDate: "2026-03-26",
        title: "The Geometry of Verse in the Digital Age",
        author: "By Elena Rossi",
        description: "Exploring the visual architecture of concrete poetry and how screen-based reading changes our spati...",
        imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=600&auto=format&fit=crop"
    },
    {
        id: "4",
        category: "FICTION",
        readTime: "15 MIN READ",
        releaseDate: "2026-03-25",
        title: "Shadows of the Protaganist",
        author: "By David Chen",
        description: "A deep dive into the psychological complexity of unreliable narrators in 21st-century psychological...",
        imageUrl: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=600&auto=format&fit=crop"
    },
    {
        id: "5",
        category: "NON-FICTION",
        readTime: "10 MIN READ",
        releaseDate: "2026-03-24",
        title: "The Architecture of an Argument",
        author: "By Sarah Jenkins",
        description: "Decoding the structural foundations of iconic essays and how they manipulate reader logic...",
        imageUrl: "https://images.unsplash.com/photo-1575881875475-31023242e3f9?q=80&w=600&auto=format&fit=crop"
    },
    {
        id: "6",
        category: "POETRY",
        readTime: "07 MIN READ",
        releaseDate: "2026-03-23",
        title: "Landscape as Metaphor",
        author: "By Thomas O'Brien",
        description: "Tracing the evolution of nature imagery from Romanticism to the industrial-coded pastoral poe...",
        imageUrl: "https://images.unsplash.com/photo-1510172951991-856a654063f9?q=80&w=600&auto=format&fit=crop"
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
            <div className="z-20 w-full max-w-7xl bg-[#F5F0E8] py-5 -mt-15">
                <div className="mx-auto flex w-full flex-row items-center justify-between px-8">
                    <div className="flex flex-row items-center gap-2.5">
                        {(["ALL", "FICTION", "NON-FICTION", "POETRY"] as Category[]).map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`flex h-7.25 justify-center items-center px-4.5 py-2.5 font-heading font-medium tracking-[2px] text-[14px] uppercase transition-colors ${activeTab === tab
                                    ? "bg-[#DC2828] text-white"
                                    : "bg-white text-[#52525B] hover:text-[#18181B]"
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setIsSortOpen((prev) => !prev)}
                            className="group flex cursor-pointer flex-row items-center gap-2"
                        >
                            <span className="font-sans font-medium text-[#A1A1AA] tracking-[1.5px] uppercase text-[13px]">
                                Sort by:
                            </span>
                            <span className="font-heading font-bold text-[#18181B] tracking-[2px] uppercase text-[14px]">
                                {sortLabelMap[activeSort]}
                            </span>
                            <ChevronDown className={`h-4.5 w-4.5 text-[#A1A1AA] transition group-hover:text-[#18181B] ${isSortOpen ? "rotate-180" : "rotate-0"}`} />
                        </button>

                        {isSortOpen && (
                            <div className="absolute right-0 z-30 mt-2 min-w-47.5 border border-[#E4E4E7] bg-white shadow-lg">
                                {(["LATEST", "OLDEST", "TITLE_A_Z"] as SortOption[]).map((option) => (
                                    <button
                                        key={option}
                                        type="button"
                                        onClick={() => {
                                            setActiveSort(option);
                                            setIsSortOpen(false);
                                        }}
                                        className={`block w-full px-4 py-3 text-left font-sans text-[13px] tracking-[1.1px] uppercase transition-colors ${activeSort === option
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
            <div className="mx-auto flex w-full max-w-300 flex-col items-center gap-15 px-8 py-16">
                <div className="grid w-full grid-cols-3 gap-x-8 gap-y-12">
                    {sortedArticles.map(article => (
                        <article key={article.id} className="flex flex-col bg-[#FAFAFA] border border-[#F4F4F5] shadow-sm hover:shadow-md transition-shadow group cursor-pointer">
                            {/* Image */}
                            <div className="relative w-full aspect-3/4">
                                <Image
                                    src={article.imageUrl}
                                    alt={article.title}
                                    fill
                                    className="object-cover object-center group-hover:scale-[1.02] transition-transform duration-500 rounded-t-sm"
                                />
                                {/* Vintage overlay effect similar to user's figma reference */}
                                <div className="absolute inset-0 bg-white/10 mix-blend-saturation pointer-events-none" />
                            </div>

                            {/* Content */}
                            <div className="flex flex-col gap-4 p-6">
                                <div className="flex flex-row items-center gap-3">
                                    <span className="font-sans font-black text-[10.4px] leading-4 tracking-[2.08px] text-[#E50914] uppercase">
                                        {article.category}
                                    </span>
                                    <div className="w-1 h-1 bg-[#E4E4E7] rounded-full" />
                                    <span className="font-sans font-bold text-[10.4px] leading-4 tracking-[2.08px] text-[#A1A1AA] uppercase">
                                        {article.readTime}
                                    </span>
                                </div>

                                <h2 className="font-heading h-16.5 text-[28px] leading-8.25 font-bold tracking-tight text-[#18181B] line-clamp-2 transition-colors group-hover:text-[#DC2828]">
                                    {article.title}
                                </h2>

                                <p className="font-heading text-[16px] leading-6 italic text-[#71717A]">
                                    {article.author}
                                </p>

                                <p className="font-sans h-11.5 text-[14px] leading-5.75 text-[#52525B] line-clamp-2">
                                    {article.description}
                                </p>
                            </div>
                        </article>
                    ))}
                    {/* Empty state if all items are filtered out */}
                    {filteredArticles.length === 0 && (
                        <div className="col-span-3 text-center py-20 text-gray-500">
                            No articles found in this category.
                        </div>
                    )}
                </div>

                {filteredArticles.length > 0 && (
                    <button className="flex items-center justify-center bg-[#DC2828] px-12 py-5 text-white shadow-lg transition-colors hover:bg-[#b02020]">
                        <span className="relative z-10 font-sans text-[14px] leading-4.25 font-bold tracking-[2.24px] uppercase">
                            Load More Reviews
                        </span>
                    </button>
                )}
            </div>
        </section>
    );
}
