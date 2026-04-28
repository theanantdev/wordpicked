import Image from "next/image";
import MaxWidthWraper from "@/components/max-width-wraper";
export function PicOfTheDayHero() {
    return (
        <section className="relative mx-auto w-full min-h-[313px] overflow-hidden border-b border-[#262626] bg-[#0F0F0F] mt-0">
            <Image
                loading="lazy"
                src="/literature/hero.png"
                alt=""
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
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
            <MaxWidthWraper className="relative z-10 mx-auto flex min-h-88.25 flex-col items-start justify-center gap-6 px-1 py-1 sm:px-1 md:flex-row md:items-center md:justify-between md:gap-10 md:px-2">
                <div className=" w-full mx-auto flex flex-col gap-5 px-6 pt-5 md:px-15 lg:px-20  ">
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
            </MaxWidthWraper>
        </section>
    );
}
