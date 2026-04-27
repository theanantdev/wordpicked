"use client";

import Image from "next/image";
import MaxWidthWraper from "@/components/max-width-wraper";
export function ArtistsHero() {
    return (
        <section className="relative h-83.75 w-full overflow-hidden min-[360px]:h-70 min-[425px]:h-80 min-[640px]:h-100 min-[768px]:h-90 min-[1024px]:h-100 min-[1200px]:h-140 min-[1440px]:h-120 min-[1920px]:h-190">
            {/* Background Image */}
            <Image
                loading="lazy"
                src="/artist/hero.jpg"
                alt="Artists Hero Image"
                fill
                sizes="100vw"
                className="object-cover object-top min-[340px]:object-center"
            />
            {/* Gradient Overlay */}
            <div
                className="absolute inset-0"
                style={{ background: "linear-gradient(360deg, #1C1C18 -12.54%, rgba(28, 28, 24, 0.6) 29.23%, rgba(28, 28, 24, 0.4) 67.57%, rgba(28, 28, 24, 0.2) 108.75%)" }}
            />

            <MaxWidthWraper className="relative bottom-0 z-10 mx-auto flex h-full flex-col items-start justify-end gap-6 px-4 pb-8 pt-4 min-[360px]:px-5 min-[480px]:pb-10 min-[640px]:px-8 md:flex-row md:items-end md:justify-between md:gap-10 md:px-14 lg:px-18">
                <div className="flex flex-col gap-1  min-[640px]:gap-4 min-[1200px]:gap-5">
                    <div className="flex items-center gap-3 min-[640px]:gap-4">
                        <div className="h-px w-5 bg-[#E0BC78]" />
                        <span className="font-sans text-[11px] font-normal uppercase tracking-[1px] text-white leading-4.25 min-[640px]:text-[13px] min-[768px]:text-[14px]">
                            The Wordpicked × Artists
                        </span>
                    </div>

                    <h1 className="font-heading text-[36px] font-semibold leading-none tracking-[-1px] text-[#F5F0E8] min-[360px]:text-[40px] min-[480px]:text-[48px] min-[640px]:text-[56px] min-[768px]:text-[64px] min-[1024px]:text-[72px] min-[1440px]:text-[80px]">
                        Long-form Conversations
                    </h1>

                    <p className=" max-w-142 font-heading text-[14px] font-normal italic leading-[1.55] text-white/90 min-[480px]:text-[15px] min-[768px]:mt-2 min-[768px]:text-[17px] min-[768px]:leading-[1.7] min-[1440px]:text-[18px]">
                        Intimate conversations with writers, filmmakers, musicians, and visual artists about work, life, and what it costs to make things that matter.
                    </p>
                </div>
            </MaxWidthWraper>
        </section>
    );
}
