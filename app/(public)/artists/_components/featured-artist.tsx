import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function FeaturedArtist() {
    return (
        <section className="w-full bg-[#EBE8E1] border-t-[0.8px] border-white/5 py-16 md:py-[60px] flex justify-center">
            <div className="max-w-[1200px] w-full px-6 md:px-[60px] lg:px-[120px] flex flex-col md:flex-row gap-10 md:gap-[60px] lg:gap-[80px] items-center md:items-start">

                {/* Left Image */}
                <div className="relative w-full md:w-[45%] lg:w-[48%] aspect-[4/5] md:aspect-[3/4] flex-shrink-0">
                    <Image
                        src="https://images.unsplash.com/photo-1544717297-fa95b6ee9643?q=80&w=800&auto=format&fit=crop"
                        alt="Julian Prentiss"
                        fill
                        className="object-cover rounded-[2px]"
                    />
                </div>

                {/* Right Content */}
                <div className="flex flex-col gap-8 md:gap-[40px] lg:gap-[60px] w-full md:w-[55%] lg:w-[52%] pt-0 md:pt-4">
                    <div className="flex flex-col gap-6 md:gap-[30px]">
                        <div className="flex flex-col gap-3 md:gap-[15px]">
                            <div className="flex items-center gap-2">
                                <span className="text-[#A8812A] text-[10px] md:text-[11px] leading-[19px]">★</span>
                                <span className="font-sans font-normal text-[9px] md:text-[10px] leading-[15px] tracking-[1.8px] uppercase text-[#A8812A]">
                                    Featured Artist
                                </span>
                            </div>

                            <h2 className="font-heading font-bold text-[36px] sm:text-[42px] md:text-[52px] leading-[1.1] tracking-[-1.04px] text-[#1C1A17]">
                                Julian Prentiss
                            </h2>

                            <span className="font-sans font-normal text-[10px] md:text-[11px] leading-[19px] tracking-[1.54px] uppercase text-[#1C1A17]/40">
                                Poet · Novelist
                            </span>
                        </div>

                        <blockquote className="font-heading italic text-[17px] md:text-[19px] leading-[1.65] text-[#414141]/80 border-l-[3px] border-[#A8812A]/50 pl-5 pr-2 md:pr-10">
                            &apos;Every poem I&apos;ve written is an attempt to say something I already know in the most indirect way possible.&apos;
                        </blockquote>

                        <p className="font-heading font-normal text-[14px] md:text-[15px] leading-[1.75] text-[#272727]/60">
                            Award-winning author of On Earth We&apos;re Briefly Gorgeous and Time Is a Mother. Winner of the T.S. Eliot Prize and the Whiting Award. He teaches at New York University.
                        </p>
                    </div>

                    <div className="flex flex-col gap-8">
                        {/* Social Buttons */}
                        <div className="flex flex-row flex-wrap gap-[10px]">
                            <Link href="#" className="px-5 py-1.5 border border-black/10 rounded-[1px] bg-transparent transition-colors hover:bg-black/5">
                                <span className="font-sans font-medium text-[9px] md:text-[10px] uppercase tracking-[1px] text-[#1B1B1B]/70">Instagram</span>
                            </Link>
                            <Link href="#" className="px-5 py-1.5 border border-black/10 rounded-[1px] bg-transparent transition-colors hover:bg-black/5">
                                <span className="font-sans font-medium text-[9px] md:text-[10px] uppercase tracking-[1px] text-[#1B1B1B]/70">Twitter / X</span>
                            </Link>
                            <Link href="#" className="px-5 py-1.5 border border-black/10 rounded-[1px] bg-transparent transition-colors hover:bg-black/5">
                                <span className="font-sans font-medium text-[9px] md:text-[10px] uppercase tracking-[1px] text-[#1B1B1B]/70">Website</span>
                            </Link>
                        </div>

                        <Link href="#" className="flex flex-row justify-center items-center px-6 py-3.5 bg-[#DC2828] w-full sm:w-fit rounded-[2px] gap-2 transition-colors hover:bg-[#b02020] shadow-sm">
                            <span className="font-sans font-medium text-[13px] md:text-[14px] leading-[17px] tracking-[1.1px] text-white uppercase">
                                Read Full Profile
                            </span>
                            <ArrowRight className="w-4 h-4 md:w-5 md:h-5 text-white" />
                        </Link>
                    </div>
                </div>

            </div>
        </section>
    );
}
