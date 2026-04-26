import Image from "next/image";

export function LiteratureHero() {
    return (
        <section className="relative mx-auto mt-0 w-full min-h-88.25 overflow-hidden border-b border-[#262626] bg-[#0F0F0F]">
            <Image
                src="/literature/hero.png"
                alt="The Weight of Silence: A Meditation on Absence"
                fill
                sizes="(max-width: 1024px) 100vw, 342px"
                className="object-cover"
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
            <div className="relative z-10 mx-auto flex min-h-88.25 max-w-360 flex-col items-start justify-center gap-8 px-4 py-10 sm:px-8 md:flex-row md:items-center md:justify-between md:gap-10 md:px-20.75">
                <div className="flex w-full max-w-3xl flex-col text-left">
                    <p className="mb-2 font-sans text-[16px] uppercase tracking-[1.54px] text-[#D4AC5A]">
                        Thursday, March 26 2026
                    </p>
                    <h1 className="font-heading text-[34px] font-bold leading-tight text-white sm:text-[44px] md:text-[48px] md:leading-16">
                        Literature
                    </h1>
                    <p className="mt-4 max-w-195.25 font-sans text-[15px] leading-[150%] text-white sm:text-[17px] md:text-[18px]">
                        Curated insights into the world of written word. From contemporary fiction to
                        timeless poetry, we explore the narratives that shape our cultural landscape.                    </p>
                </div>
            </div>
        </section>
    );
}
