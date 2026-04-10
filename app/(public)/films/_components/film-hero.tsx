type FilmHeroProps = {
    categoryLabel?: string;
    title?: string;
    subtitle?: string;
    authorName?: string;
    publishDate?: string;
    coverImageUrl?: string;
};

export function FilmHero({
    categoryLabel = "FILM EDITORIAL",
    title = "The Quiet Symmetry of Silence",
    subtitle = "A cinematic exploration of modern storytelling.",
    authorName = "Editorial Desk",
    publishDate = "Unknown Date",
    coverImageUrl = "/pick-of-the-day/hero.png",
}: FilmHeroProps) {
    return (
        <section className="relative w-full h-[400px] md:h-[472px] overflow-hidden">
            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url('${coverImageUrl}')` }}
            />
            {/* Gradient Overlay */}
            <div
                className="absolute inset-0"
                style={{ background: "linear-gradient(0deg, rgba(220, 40, 40, 0.85) 0%, rgba(220, 40, 40, 0.4) 37.45%, rgba(220, 40, 40, 0.1) 71.83%, rgba(220, 40, 40, 0) 100%)" }}
            />

            <div className="relative z-10 w-full h-full max-w-[1440px] flex flex-col justify-end px-6 md:px-12 lg:px-[98px] pb-[40px] md:pb-[60px] mx-auto">

                <span className="font-sans mt-10 font-medium text-[14px] md:text-[18px] leading-[16px] tracking-[2.4px] uppercase text-white mb-6">
                    {categoryLabel}
                </span>

                <h1 className="font-heading font-semibold text-[48px] sm:text-[60px] md:text-[80px] lg:text-[96px] leading-[1] tracking-[-2px] md:tracking-[-4.8px] text-white max-w-[811px] mb-8">
                    {title}
                </h1>

                <p className="font-sans text-[14px] md:text-[18px] leading-[24px] text-white/90 max-w-[900px] mb-6 line-clamp-2">
                    {subtitle}
                </p>

                {/* Metadata row */}
                <div className="flex flex-row flex-wrap items-center gap-4 md:gap-6 text-white/90">
                    <div className="flex items-center gap-2">
                        <span className="font-heading font-normal text-[12px] md:text-[14px] leading-5 tracking-[1.4px] uppercase text-white/70">AUTHOR</span>
                        <span className="font-sans text-[14px] md:text-[16px] leading-5 text-white">{authorName}</span>
                    </div>
                    <div className="hidden sm:block w-1.5 h-1.5 bg-white/50 rounded-full" />
                    <div className="flex items-center gap-2">
                        <span className="font-heading font-normal text-[12px] md:text-[14px] leading-5 tracking-[1.4px] uppercase text-white/70">PUBLISHED</span>
                        <span className="font-sans text-[14px] md:text-[16px] leading-5 text-white">{publishDate}</span>
                    </div>
                </div>

            </div>
        </section>
    );
}
