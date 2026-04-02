import Link from "next/link";
import Image from "next/image";

export function PicOfTheDayHero() {
    return (
        <section className="relative mx-auto mt-0 w-full min-h-78.25 overflow-hidden border-b border-[#262626] bg-[#0F0F0F]">
            <Image
                src="/pic-of-the-day/hero.png"
                alt=""
                fill
                priority
                className="object-cover object-center opacity-70"
                sizes="100vw"
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
            <div className="relative z-10 mx-auto flex min-h-78.25 max-w-360 flex-col items-start justify-center gap-8 px-4 py-10 sm:px-8 md:flex-row md:items-center md:justify-between md:gap-10 md:px-20.75">
                <div className="flex w-full max-w-3xl flex-col text-left">
                    <p className="mb-2 font-sans text-[16px] uppercase tracking-[1.54px] text-[#D4AC5A]">
                        Thursday, March 26 2026
                    </p>
                    <h1 className="font-heading text-[34px] font-bold leading-tight text-white sm:text-[44px] md:text-[48px] md:leading-16">
                        Pick of the Day
                    </h1>
                    <p className="mt-4 max-w-195.25 font-sans text-[15px] leading-[150%] text-white sm:text-[17px] md:text-[18px]">
                        One book or film we think you should read or watch today — curated daily, archived forever.
                    </p>
                </div>

                <Link href="#latest-pick" className="inline-flex h-12.5 w-full shrink-0 items-center justify-center gap-2.5 rounded-[8px] bg-[#DC2828] px-6 py-4.5 transition-colors hover:bg-[#b02020] sm:w-52.25">
                    <span className="font-sans text-[18px] font-semibold leading-6.75 text-white sm:text-[22px]">
                        Read Now
                    </span>
                </Link>
            </div>
        </section>
    );
}
