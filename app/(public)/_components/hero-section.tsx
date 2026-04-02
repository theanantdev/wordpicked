import { Search } from "lucide-react";

export function HeroSection() {
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
                <div
                    className="w-full max-w-[616px] sm:flex hidden border border-white/20 bg-white/23 backdrop-blur"
                    style={{ minHeight: 54 }}
                >
                    <div className=" flex h-full flex-col gap-2 p-2 md:flex-row md:items-center md:gap-0 md:py-0 md:pl-2 md:pr-0">
                        <div className="flex flex-1 items-center gap-2">
                            <Search className="size-6 text-[#f5f0e8] shrink-0" />
                            <input
                                className="h-10 w-full bg-transparent text-[14.2px] italic leading-4.5 text-[#f5f0e8] placeholder:text-[#f5f0e8] focus:outline-none"
                                placeholder="Search books, films, artists..."
                            />
                        </div>

                        <div className="flex h-10 items-center gap-2 overflow-x-auto text-sm text-[#f5f0e8] md:h-11 md:gap-0 md:text-base">
                            <span className="inline-flex h-full px-3 items-center justify-center bg-[#c9a24e12] text-[14.2px] font-medium">All</span>
                            <span className="inline-flex h-full px-3 items-center justify-center">Books</span>
                            <span className="inline-flex h-full px-3 items-center justify-center">Films</span>
                            <span className="inline-flex h-full px-3 items-center justify-center">Artists</span>
                        </div>
                        <button className="h-11 w-full bg-[#3a6648] text-lg leading-4.5 text-[#f5f0e8] uppercase md:w-30.25 shrink-0">
                            Search
                        </button>
                    </div>
                </div>
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