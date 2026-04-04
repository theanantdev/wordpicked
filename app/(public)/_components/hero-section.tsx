"use client";

import { Search } from "lucide-react";
import { FormEvent, useState } from "react";

const FILTERS = ["All", "Books", "Films", "Artists"] as const;

export function HeroSection() {
    const [query, setQuery] = useState("");
    const [activeFilter, setActiveFilter] = useState<(typeof FILTERS)[number]>("All");
    const [lastAction, setLastAction] = useState("");

    const handleSearch = (e: FormEvent) => {
        e.preventDefault();
        const text = query.trim() || "everything";
        setLastAction(`Showing ${activeFilter.toLowerCase()} results for ${text}`);
    };

    return (
        <section className="relative isolate overflow-hidden md:h-155 flex flex-col justify-center">
            <div
                className="absolute inset-0 bg-cover bg-center -z-10"
                style={{ backgroundImage: "url('/home/hero.jpg')" }}
            />
            <div
                className="absolute inset-0 -z-10"
                style={{
                    background:
                        "linear-gradient(2.44deg, #0D0D0D 2.04%, rgba(13, 13, 13, 0.6) 51.75%, rgba(0, 0, 0, 0) 111.45%)",
                }}
            />

            <div className="relative mx-auto flex h-full w-full max-w-7xl flex-col items-center px-4 py-16 text-center md:px-6">
                <div
                    className="mb-6 inline-flex items-center justify-center rounded-full bg-[#e0bc78]"
                    style={{ width: 81, height: 25 }}
                >
                    <span className="text-xs font-medium text-[#1A1A1A]">Fiction</span>
                </div>
                <form
                    className="w-full max-w-[358px] border border-white/20 bg-white/23 backdrop-blur md:max-w-[616px]"
                    style={{
                        minHeight: 31.38,
                        borderWidth: 0.464935,
                        borderColor: "rgba(255, 255, 255, 0.12)",
                        borderRadius: 2.32468,
                    }}
                    onSubmit={handleSearch}
                >
                    <div className="flex w-full items-center">
                        <div className="flex min-w-0 flex-1 items-center pl-[5.69px] pr-1 md:pl-2.5">
                            <Search className="h-[13.95px] w-[13.95px] shrink-0 text-[#F5F0E8] md:h-5 md:w-5" />
                            <input
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                className="h-[30.22px] w-full bg-transparent pl-[4.65px] text-[8.2526px] italic leading-[10px] text-[#F5F0E8] placeholder:text-[#F5F0E8] focus:outline-none md:h-[42px] md:pl-2 md:text-[14.2px]"
                                placeholder="Search books, films, artists..."
                                aria-label="Search books, films, artists"
                            />
                        </div>

                        <div className="h-[30.22px] items-center text-[#F5F0E8] md:flex md:h-[42px]">
                            {FILTERS.map((filter) => (
                                <button
                                    key={filter}
                                    type="button"
                                    onClick={() => setActiveFilter(filter)}
                                    className={`inline-flex h-full items-center justify-center px-3 text-[9.2987px] leading-[10px] capitalize transition-colors md:text-[14.2px] ${activeFilter === filter
                                        ? "bg-[#c9a24e12] font-medium"
                                        : "hover:bg-white/10"
                                        }`}
                                >
                                    {filter}
                                </button>
                            ))}
                        </div>

                        <button
                            type="submit"
                            className="h-[30.22px] w-[70.32px] bg-[#3A6648] text-[10.461px] leading-[10px] font-normal uppercase text-[#F5F0E8] transition-colors hover:bg-[#335a3f] md:h-[42px] md:w-[121px] md:text-base"
                        >
                            Search
                        </button>
                    </div>

                    {/* <div className="flex h-[30.22px] items-center overflow-x-auto border-t border-white/10 text-[#F5F0E8] md:hidden">
                        {FILTERS.map((filter) => (
                            <button
                                key={filter}
                                type="button"
                                onClick={() => setActiveFilter(filter)}
                                className={`inline-flex h-full items-center justify-center px-3 text-[9.2987px] leading-[10px] whitespace-nowrap capitalize transition-colors ${activeFilter === filter
                                        ? "bg-[#c9a24e12] font-medium"
                                        : "hover:bg-white/10"
                                    }`}
                            >
                                {filter}
                            </button>
                        ))}
                    </div> */}
                </form>

                {lastAction ? (
                    <p className="mt-2 text-[10px] text-[#f5f0e8]/90 md:text-xs">{lastAction}</p>
                ) : null}
                <h1
                    className="mt-8 max-w-[90vw] font-heading text-4xl leading-tight text-[#f2f2f2] sm:text-5xl md:mt-12 md:text-[72px] md:leading-[1.1] lg:max-w-[1051px]"
                >
                    The Weight of Silence: A
                    <br className="hidden md:block" />
                    {" "}Meditation on Absence
                </h1>
                <p
                    className="mt-6 max-w-2xl text-sm leading-relaxed text-[#A6A6A6] sm:text-base md:text-lg lg:max-w-[789px]"
                >
                    In her latest novel, Elena Morrow crafts a devastating portrait of grief that lingers long after the
                    final page. A masterwork of restraint and emotional precision.
                </p>
            </div>
        </section>
    );
}