"use client";

import Image from "next/image";
export function ArtistsHero() {
    return (
        <section className="relative h-83.75 w-full overflow-hidden min-[360px]:h-90 min-[480px]:h-100 min-[640px]:h-112 min-[768px]:h-130 min-[1024px]:h-150 min-[1200px]:h-160 min-[1440px]:h-170 min-[1920px]:h-190">
            {/* Background Image */}
            <Image
                src="/artist/hero.jpg"
                alt="Artists Hero Image"
                fill
                sizes="100vw"
                className="object-cover object-top min-[640px]:object-center"
            />
            {/* Gradient Overlay */}
            <div
                className="absolute inset-0"
                style={{ background: "linear-gradient(360deg, #1C1C18 -12.54%, rgba(28, 28, 24, 0.6) 29.23%, rgba(28, 28, 24, 0.4) 67.57%, rgba(28, 28, 24, 0.2) 108.75%)" }}
            />

            <div className="relative z-10 mx-auto flex h-full w-full max-w-360 flex-col justify-end px-4 pb-10 min-[360px]:px-5 min-[480px]:pb-12 min-[640px]:px-6 min-[768px]:px-12 min-[768px]:pb-15 min-[1200px]:px-30 min-[1440px]:px-34 min-[1920px]:max-w-420 min-[1920px]:px-36">
                <div className="flex flex-col gap-3 min-[640px]:gap-4 min-[1200px]:gap-5">
                    <div className="flex items-center gap-3 min-[640px]:gap-4">
                        <div className="h-px w-5 bg-[#E0BC78]" />
                        <span className="font-sans text-[11px] font-normal uppercase tracking-[1.8px] text-white leading-4.25 min-[640px]:text-[13px] min-[768px]:text-[14px]">
                            The Wordpicked × Artists
                        </span>
                    </div>

                    <h1 className="font-heading  text-[36px] font-semibold leading-[1.05] tracking-[-1.5px] text-[#F5F0E8] min-[360px]:text-[40px] min-[480px]:text-[48px] min-[640px]:text-[56px] min-[768px]:text-[64px] min-[1024px]:text-[72px] min-[1440px]:text-[80px]">
                        Long-form  Conversations
                    </h1>

                    <p className="mt-1 max-w-142 font-heading text-[14px] font-normal italic leading-[1.55] text-white/90 min-[480px]:text-[15px] min-[768px]:mt-2 min-[768px]:text-[17px] min-[768px]:leading-[1.7] min-[1440px]:text-[18px]">
                        Intimate conversations with writers, filmmakers, musicians, and visual artists about work, life, and what it costs to make things that matter.
                    </p>
                </div>
            </div>
        </section>
    );
}
