import Link from "next/link";
import Image from "next/image";

export function PicOfTheDayHero() {
    return (
        <section className="relative mx-auto w-full min-h-[313px] overflow-hidden border-b border-[#262626] bg-[#0F0F0F] mt-0">
            <Image
                src="/literature/hero.png"
                alt=""
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                priority
                className="object-cover object-center opacity-70"

            />

            <div
                className="absolute inset-0"
                style={{
                    background:
                        "linear-gradient(89.97deg, #0F0F0F 2.42%, rgba(20, 15, 15, 0.974681) 25.46%, rgba(34, 14, 14, 0.909574) 46.72%, rgba(220, 40, 40, 0) 168.98%)",
                    mixBlendMode: "normal",
                }}
            />

            {/* Content Layer */}
            <div className="relative z-10 flex min-h-[313px] max-w-360 mx-auto items-center justify-between gap-10 px-6 py-10 sm:px-10 md:px-20.75">
                <div className="flex max-w-3xl flex-col">
                    <p className="mb-2 font-sans text-[16px] uppercase tracking-[1.54px] text-[#D4AC5A]">
                        Thursday, March 26 2026
                    </p>
                    <h1 className="font-heading text-[40px] font-bold leading-tight text-white sm:text-[48px] sm:leading-16">
                        Pick of the Day
                    </h1>
                    <p className="mt-4  font-sans text-[16px] leading-[150%] text-white sm:text-[18px]">
                        One book or film we think you should read or watch today — curated daily, archived forever.
                    </p>
                </div>
            </div>
        </section>
    );
}
