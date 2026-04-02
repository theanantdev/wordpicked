import Image from "next/image";
import { Link2, MessageCircle } from "lucide-react";

export function FilmContent() {
    return (
        <article className="w-full bg-[#FDF9F2] flex flex-col items-center py-[80px] md:py-[120px] px-6">
            <div className="w-full max-w-[656px] flex flex-col gap-[36px]">

                <p className="font-sans font-light text-[18px] md:text-[20px] leading-[28px] text-[#1A1A1A]/90">
                    <span className="float-left font-sans font-bold text-[60px] md:text-[72px] leading-[65px] md:leading-[72px] text-[#1A1A1A]/60 mr-4">I</span>
                    n an era where cinema often screams for attention, Korvhoven's latest masterpiece whispers. It is a work of profound stillness, where every frame is meticulously composed with the precision of an Old Master's painting. The narrative unfolds not through dialogue, but through the shifting of light across a barren kitchen floor or the subtle tension in a glance. Moore is a revelation, adopting a stoic approach for a maelstrom.
                </p>

                <p className="font-sans font-light text-[18px] md:text-[20px] leading-[28px] text-[#1A1A1A]/90">
                    The film challenges our modern appetite for velocity. It demands a different kind of spectatorship—one that is patient, observant, and willing to dwell in the uncomfortable gaps between words.
                </p>

                <blockquote className="my-[40px] pl-[32px] py-4 border-l-[2px] border-[#E50914] flex flex-col gap-4">
                    <p className="font-heading italic font-bold text-[24px] md:text-[30px] leading-[36px] text-[#1A1A1A]">
                        "Cinema is not the movement of images, but the architecture of time perceived through light."
                    </p>
                    <span className="font-sans font-medium text-[12px] md:text-[14px] uppercase tracking-[1.4px] text-[#1A1A1A]/40">
                        — Elena Korvhoven
                    </span>
                </blockquote>

                <div className="flex flex-col items-center gap-[16px] my-6">
                    <div className="relative w-full aspect-[16/9] border border-black/5 rounded-[2px] overflow-hidden shadow-sm">
                        <Image
                            src="https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=800&auto=format&fit=crop"
                            alt="Mid content scene"
                            fill
                            className="object-cover opacity-90 saturate-50"
                        />
                    </div>
                    <span className="font-sans text-[11px] md:text-[12px] leading-[16px] text-center text-[#1A1A1A]/40 w-full max-w-[300px]">
                        Fig 1.1 The tactile nature of 35mm film holds true.
                    </span>
                </div>

                <p className="font-sans font-light text-[18px] md:text-[20px] leading-[28px] text-[#1A1A1A]/90">
                    By the final act, the silence that permeated the beginning of the film transforms into something else entirely. It is no longer an absence, but a presence—a heavy, resonant character that fills the room. It is a rare cinematic achievement that leaves the viewer not just thinking, but feeling the very weight of existence.
                </p>

                {/* Share Section */}
                <div className="w-full flex flex-col items-center gap-[24px] mt-[60px] md:mt-[100px]">
                    <span className="font-sans font-medium text-[10px] md:text-[12px] leading-[16px] uppercase tracking-[3.6px] text-[#1A1A1A]/40 text-center">
                        Share this curation
                    </span>
                    <div className="flex flex-row items-center gap-[32px]">
                        <button className="text-[#1A1A1A]/60 hover:text-black hover:scale-110 transition-all">
                            <Link2 className="w-5 h-5 md:w-[20px] md:h-[20px]" />
                        </button>
                        <button className="text-[#1A1A1A]/60 hover:text-black hover:scale-110 transition-all">
                            <p className="w-4 h-4 md:w-[18px] md:h-[18px]">
                                <svg width="24" height="22" viewBox="0 0 24 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M18.9 0H22.581L14.541 9.213L24 21.75H16.5945L10.794 14.145L4.1565 21.75H0.474L9.0735 11.895L0 0H7.5945L12.837 6.9495L18.9 0ZM17.61 19.542H19.65L6.4845 2.0925H4.2975L17.61 19.542Z" fill="#A8A29E" />
                                </svg>

                            </p>
                        </button>
                        <button className="text-[#1A1A1A]/60 hover:text-black hover:scale-110 transition-all">
                            <MessageCircle className="w-5 h-5 md:w-[20px] md:h-[20px]" />
                        </button>
                    </div>
                </div>

            </div>
        </article>
    );
}
