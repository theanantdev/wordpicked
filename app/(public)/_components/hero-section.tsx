"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useMobile } from "@/hooks/use-mobile";

type HeroSlide = {
    eyebrow: string;
    image: string;
    mobileImage: string;
};

const slides: HeroSlide[] = [
    { eyebrow: "Wordpicked presents", image: "/home/hero.png", mobileImage: "/home/hero-mobile.png" },
    { eyebrow: "Literature first", image: "/home/hero.png", mobileImage: "/home/hero-mobile.png" },
    { eyebrow: "Cinema in view", image: "/home/hero.png", mobileImage: "/home/hero-mobile.png" },
    { eyebrow: "Artists in focus", image: "/home/hero.png", mobileImage: "/home/hero-mobile.png" },
];

export function HeroSection() {
    const [activeSlide, setActiveSlide] = useState(0);
    const isMobile = useMobile();

    useEffect(() => {
        const interval = window.setInterval(() => {
            setActiveSlide((current) => (current + 1) % slides.length);
        }, 5500);
        return () => window.clearInterval(interval);
    }, []);

    return (
        /* Standardized the height across the whole section */
        <section className="relative isolate h-125 w-full overflow-hidden border-b border-white/10 bg-[#0d0d0d] sm:h-137.5 md:h-150 lg:h-162.5 xl:h-165 2xl:h-[827px]">

            {/* Background Images Layer */}
            <div className="absolute inset-0 z-0">
                {slides.map((slide, index) => (
                    <div
                        key={`${slide.image}-${index}`}
                        aria-hidden={index !== activeSlide}
                        className={`absolute inset-0 transition-all duration-1000 ease-in-out ${index === activeSlide
                            ? "opacity-100 scale-100"
                            : "pointer-events-none opacity-0 scale-105"
                            }`}
                    >
                        <Image
                            loading="lazy"
                            src={isMobile ? slide.mobileImage : slide.image}
                            alt="Hero Image"
                            fill
                            sizes="100vw"
                            className={isMobile ? "object-cover object-bottom" : "object-cover object-top"}
                        />

                        {/* Overlays */}
                        <div
                            className="absolute inset-0 z-10"
                            style={{
                                background:
                                    "linear-gradient(357.34deg, #0D0D0D -0.57%, rgba(13, 13, 13, 0.6) 12.03%, rgba(0, 0, 0, 0.0220602) 69.9%, rgba(0, 0, 0, 0) 111.15%)",
                            }}
                        />
                        <div className="absolute inset-0 z-20 bg-[radial-gradient(circle_at_center,rgba(255,194,80,0.14),transparent_42%),linear-gradient(180deg,rgba(0,0,0,0.06),rgba(0,0,0,0.34))]" />
                    </div>
                ))}
            </div>

            {/* Content Layer */}
            <div className="relative z-30 h-full mx-auto w-full max-w-7xl flex flex-col items-center justify-end pb-16 px-4 text-center">

                {/* Pagination Dots */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3">
                    {slides.map((_, index) => {
                        const isActive = index === activeSlide;
                        return (
                            <button
                                key={index}
                                type="button"
                                aria-label={`Go to slide ${index + 1}`}
                                onClick={() => setActiveSlide(index)}
                                className={`rounded-full transition-all duration-300 ${isActive
                                    ? "h-4 w-4 bg-white ring-4 ring-white/20"
                                    : "h-3 w-3 bg-white/40 hover:bg-white/70"
                                    }`}
                            />
                        );
                    })}
                </div>

                {/* Eyebrow Label */}

            </div>
        </section>
    );
}