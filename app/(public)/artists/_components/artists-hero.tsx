export function ArtistsHero() {
    return (
        <section className="relative w-full h-[335px] md:h-[400px] overflow-hidden">
            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: "url('/artist/hero.jpg')" }}
            />
            {/* Gradient Overlay */}
            <div
                className="absolute inset-0"
                style={{ background: "linear-gradient(360deg, #1C1C18 -12.54%, rgba(28, 28, 24, 0.6) 29.23%, rgba(28, 28, 24, 0.4) 67.57%, rgba(28, 28, 24, 0.2) 108.75%)" }}
            />

            <div className="relative z-10 w-full h-full flex flex-col justify-end px-6 md:px-12 lg:px-[120px] pb-[60px] max-w-[1440px] mx-auto">
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-[20px] h-[1px] bg-[#E0BC78]" />
                        <span className="font-sans font-normal text-[12px] md:text-[14px] leading-[17px] tracking-[1.8px] uppercase text-white">
                            The Wordpicked × Artists
                        </span>
                    </div>

                    <h1 className="font-heading font-semibold text-[48px] sm:text-[56px] md:text-[72px] leading-[1.05] tracking-[-1.5px] text-[#F5F0E8] max-w-[500px]">
                        Long-form <br className="hidden sm:block" /> Conversations
                    </h1>

                    <p className="font-heading italic font-normal text-[15px] md:text-[17px] leading-[1.6] md:leading-[1.7] text-white/90 max-w-[568px] mt-2">
                        Intimate conversations with writers, filmmakers, musicians, and visual artists about work, life, and what it costs to make things that matter.
                    </p>
                </div>
            </div>
        </section>
    );
}
