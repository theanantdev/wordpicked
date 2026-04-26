import Image from "next/image";
import Link from "next/link";
import { Artist } from "@/utils/server-artists";

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?q=80&w=800&auto=format&fit=crop";

export function FeaturedArtist({ artist }: { artist: Artist }) {
    return (
        <section className="flex w-full justify-center border-t-[0.8px] border-white/5 bg-[#EBE8E1] py-16 md:py-15">
            <div className="flex w-full max-w-300 flex-col items-center gap-10 px-6 md:flex-row md:items-start md:gap-15 md:px-15 lg:gap-20 lg:px-30">

                {/* Left Image */}
                <div className="relative aspect-4/5 w-full shrink-0 md:aspect-3/4 md:w-[45%] lg:w-[48%]">
                    <Image
                        src={artist.image_url || FALLBACK_IMAGE}
                        alt={artist.full_name}
                        fill
                        className="rounded-xs object-cover"
                    />
                </div>

                {/* Right Content */}
                <div className="flex w-full flex-col gap-8 pt-0 md:w-[55%] md:gap-10 md:pt-4 lg:w-[52%] lg:gap-15">
                    <div className="flex flex-col gap-6 md:gap-7.5">
                        <div className="flex flex-col gap-3 md:gap-3.75">
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] leading-4.75 text-[#A8812A] md:text-[11px]">★</span>
                                <span className="font-sans text-[9px] font-normal uppercase tracking-[1.8px] leading-3.75 text-[#A8812A] md:text-[10px]">
                                    Featured Artist
                                </span>
                            </div>

                            <h2 className="font-heading font-bold text-[36px] sm:text-[42px] md:text-[52px] leading-[1.1] tracking-[-1.04px] text-[#1C1A17]">
                                {artist.full_name}
                            </h2>

                            <span className="font-sans text-[10px] font-normal uppercase tracking-[1.54px] leading-4.75 text-[#1C1A17]/40 md:text-[11px]">
                                {artist.art_form}
                            </span>
                        </div>

                        {artist.quote && (
                            <blockquote className="font-heading italic text-[17px] md:text-[19px] leading-[1.65] text-[#414141]/80 border-l-[3px] border-[#A8812A]/50 pl-5 pr-2 md:pr-10">
                                &apos;{artist.quote}&apos;
                            </blockquote>
                        )}

                        <p className="font-heading font-normal text-[14px] md:text-[15px] leading-[1.75] text-[#272727]/60">
                            {artist.biography || "No biography provided."}
                        </p>
                    </div>

                    <div className="flex flex-col gap-8">
                        {/* Social Buttons */}
                        <div className="flex flex-row flex-wrap gap-2.5">
                            {artist.instagram && (
                                <Link href={artist.instagram} target="_blank" className="px-5 py-1.5 border border-black/10 rounded-[1px] bg-transparent transition-colors hover:bg-black/5">
                                    <span className="font-sans font-medium text-[9px] md:text-[10px] uppercase tracking-[1px] text-[#1B1B1B]/70">Instagram</span>
                                </Link>
                            )}
                            {artist.twitter && (
                                <Link href={artist.twitter} target="_blank" className="px-5 py-1.5 border border-black/10 rounded-[1px] bg-transparent transition-colors hover:bg-black/5">
                                    <span className="font-sans font-medium text-[9px] md:text-[10px] uppercase tracking-[1px] text-[#1B1B1B]/70">Twitter / X</span>
                                </Link>
                            )}
                            {artist.website && (
                                <Link href={artist.website} target="_blank" className="px-5 py-1.5 border border-black/10 rounded-[1px] bg-transparent transition-colors hover:bg-black/5">
                                    <span className="font-sans font-medium text-[9px] md:text-[10px] uppercase tracking-[1px] text-[#1B1B1B]/70">Website</span>
                                </Link>
                            )}
                        </div>

                        {/* <Link href={`#`} className="flex flex-row justify-center items-center px-6 py-3.5 bg-[#DC2828] w-full sm:w-fit rounded-[2px] gap-2 transition-colors hover:bg-[#b02020] shadow-sm">
                            <span className="font-sans font-medium text-[13px] md:text-[14px] leading-[17px] tracking-[1.1px] text-white uppercase">
                                Read Full Profile
                            </span>
                            <ArrowRight className="w-4 h-4 md:w-5 md:h-5 text-white" />
                        </Link> */}
                    </div>
                </div>

            </div>
        </section>
    );
}
