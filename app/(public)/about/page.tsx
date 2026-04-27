import MaxWidthWrapper from '@/components/max-width-wraper';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'About Us — Wordpicked',
    description: 'Wordpicked is a platform for thoughtful daily recommendations and intimate conversations with the artists who shape our cultural moment.',
    openGraph: {
        title: 'About Us — The Wordpicked',
        description: 'A digital curator for the modern intellectual. Exploring the intersections of literature, film, and the visual arts.',
    },
};

const SECTIONS = [
    {
        number: '01',
        title: 'Literature',
        href: '/literature',
        description:
            'In-depth reviews of fiction, non-fiction, and poetry — from debut voices to established masters. We read widely and write honestly, and we are not afraid to say when something falls short.',
    },
    {
        number: '02',
        title: 'Films',
        href: '/films',
        description:
            "We review films — from arthouse debuts to mainstream cinema when it's doing something worth serious attention. Each review treats the film as a text worthy of close reading, not a product to be scored out of five.",
    },
    {
        number: '03',
        title: 'Pick of the Day',
        href: '/pick-of-the-day',
        description:
            'One book or film recommended daily by our editors. No algorithm. No sponsored placement. Just something we read or watched and think you should too.',
    },
    {
        number: '04',
        title: 'The Wordpicked × Artists',
        href: '/artists',
        description:
            "Long-form conversations with creative artists — about their work, their process, and the questions that don't get asked in interviews designed to sell something.",
    },
];

const STATS = [
    { label: '60+ Reviews Published' },
    { label: '365 Days of Daily Picks' },
    { label: '15+ Artist Conversations' },
    { label: '4 Curated Sections' },
    { label: 'Free Always' },
];

export default function AboutPage() {
    return (
        <main className="w-full bg-[#FDF9F2] min-h-screen">

            {/* ── Hero ──────────────────────────────────────── */}
            <section className="relative h-95 w-full overflow-hidden bg-[#1C1C18] sm:h-107.5 md:h-119.5">

                {/* Angled book/film covers — hidden on very small screens */}
                <Image loading="lazy" src="/literature/hero.png" alt="Stack of book and film covers" fill className="object-cover object-center opacity-40 " sizes="100vw" priority />

                {/* Dark gradient — bottom-heavy so text is legible */}
                <div
                    className="absolute inset-0 z-10"
                    style={{
                        background:
                            'linear-gradient(to top, #1C1C18 0%, rgba(28,28,24,0.92) 25%, rgba(28,28,24,0.55) 55%, rgba(28,28,24,0.10) 100%)',
                    }}
                />

                {/* Headline + subtitle */}
                <MaxWidthWrapper className="absolute inset-0 z-20 flex flex-col mx-auto h-full items-start justify-end px-4 pb-12 sm:px-8 md:px-18 lg:px-30 min-[1440px]:px-34 min-[1920px]:px-40 ">
                    <h1 className="font-heading font-semibold text-[26px] sm:text-[38px] md:text-[52px] leading-[1.15] tracking-[-1.5px] text-white mb-3 max-w-3xl">
                        We believe great stories deserve serious attention.
                    </h1>
                    <p className="font-heading italic text-[13px] sm:text-[15px] md:text-[17px] leading-[1.7] text-white/80 max-w-xl">
                        The Wordpicked is a platform for thoughtful, daily recommendations, and intimate conversations with the artists who shape our cultural moment.
                    </p>
                </MaxWidthWrapper>
            </section>

            {/* ── What We Are ───────────────────────────────── */}
            <div className="w-full bg-[#EBE8E1] ">
                <MaxWidthWrapper className="w-full py-14 md:py-20">
                    <div className="mx-auto max-w-310 px-5 sm:px-8 md:px-18">
                        <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-12 lg:gap-20 items-center">

                            {/* Logo column */}
                            <div className="flex items-center justify-center lg:justify-center">
                                <div className="relative h-45 w-45 opacity-75 sm:h-55 sm:w-55 md:h-65 md:w-65">
                                    <Image
                                        src="/logo.png"
                                        alt="The Wordpicked"
                                        fill
                                        sizes="(max-width: 640px) 180px, (max-width: 768px) 220px, 260px"
                                        className="object-contain"
                                    />
                                </div>
                            </div>

                            {/* Text column */}
                            <div className="flex flex-col gap-5">
                                <h2 className="font-heading font-bold text-[36px] sm:text-[44px] md:text-[52px] leading-[1.1] tracking-[-1.04px] text-[#1C1A17]">
                                    What We Are
                                </h2>

                                <blockquote className="pl-4 border-l-2 border-[#A8812A]">
                                    <p className="font-heading italic text-[15px] md:text-[18px] leading-[1.75] text-[#414141]/70">
                                        There is a particular kind of reader who finishes a book and needs somewhere to go. Not a star rating. Not a plot summary. A conversation — with someone who read it carefully, thought about it honestly, and has something worth saying.
                                    </p>
                                </blockquote>

                                <p className="font-heading text-[15px] md:text-[18px] leading-[1.55] font-medium text-[#1A1A1A]">
                                    The Wordpicked was built for that reader.
                                </p>

                                <p className="font-sans font-light text-[14px] md:text-[17px] leading-[1.65] text-[#272727]/55">
                                    We cover contemporary fiction, literary non-fiction, and poetry. We review films — from arthouse debuts to mainstream cinema when it&apos;s doing something worth serious attention. And through our Artists section, we sit down with writers, filmmakers, musicians, and visual artists for the kinds of long-form conversations that rarely happen in press junkets or promotional cycles.
                                </p>

                                <p className="font-sans font-light text-[14px] md:text-[17px] leading-[1.65] text-[#272727]/55">
                                    We are not a recommendation engine. We are not a bestseller list. We are a publication that believes the act of reading and watching carefully is itself a form of attention worth protecting.
                                </p>
                            </div>
                        </div>
                    </div>
                </MaxWidthWrapper>
            </div>


            {/* ── Stats bar ─────────────────────────────────── */}
            <div className="w-full bg-white border-y border-[#E7E5E4]">


                <MaxWidthWrapper className="w-full overflow-x-auto no-scrollbar">
                    <div className="mx-auto flex w-max h-5 min-w-max items-center gap-6 px-6 py-4 sm:gap-10 md:w-full md:min-w-0 md:justify-center md:gap-14">
                        {STATS.map((s, i) => (
                            <span
                                key={i}
                                className="font-heading text-[11px] leading-6 tracking-[1.1px] uppercase text-[#11412A] whitespace-nowrap sm:text-[13px] md:text-[16px]"
                            >
                                {s.label}
                            </span>
                        ))}
                    </div>
                </MaxWidthWrapper>
            </div>

            {/* ── Our Sections ──────────────────────────────── */}
            <div className="w-full bg-[#FDF9F2]">
                <MaxWidthWrapper className="w-full py-14 md:py-20 px-4">
                    <div className="mx-auto max-w-250">

                        <h2 className="font-heading font-bold text-[36px] sm:text-[44px] md:text-[52px] leading-[1.1] tracking-[-1.04px] text-[#1C1A17] text-center mb-12 md:mb-16">
                            Our Sections
                        </h2>

                        <div className="flex flex-col divide-y divide-[#E7E5E4]">
                            {SECTIONS.map((s) => (
                                <Link
                                    key={s.number}
                                    href={s.href}
                                    className="group flex flex-col gap-3 py-8 transition-colors sm:grid sm:grid-cols-[180px_1fr] sm:gap-10 sm:py-10 items-start justify-start"
                                >
                                    {/* Number + title */}
                                    <div className="flex sm:flex-row md:flex-col gap-3 sm:gap-1.5 w-full justify-start ">
                                        <span className="font-heading font-normal text-[12px] tracking-[1.5px] uppercase text-[#A8812A] pt-1">
                                            {s.number}
                                        </span>
                                        <h3 className="font-heading font-semibold text-[20px] sm:text-[22px] leading-[1.3] text-[#1A1A1A] group-hover:text-[#A8812A] transition-colors">
                                            {s.title}
                                        </h3>
                                    </div>

                                    {/* Description */}
                                    <p className="font-sans font-light text-[14px] sm:text-[15px] md:text-[17px] leading-[1.65] text-[#1A1A1A]/65 self-center">
                                        {s.description}
                                    </p>
                                </Link>
                            ))}
                        </div>
                    </div>
                </MaxWidthWrapper>
            </div>

            {/* ── Ad placeholder ────────────────────────────── */}
            <div className="flex w-full items-center justify-center border border-dashed border-[#DDD7CC] bg-[#EDE7D9] py-20 md:py-32.5">
                <p className="font-heading text-[14px] sm:text-[16px] md:text-[18px] tracking-[1px] uppercase text-[#B0A89E] text-center px-4">
                    Advertisement — 728 × 90
                </p>
            </div>

        </main>
    );
}
