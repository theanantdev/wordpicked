import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function FeaturedPickCard() {
    return (
        <section className="w-full max-w-[1440px] mx-auto px-[86px] mt-[120px] mb-[150px] flex flex-row gap-[30px] items-center" id="latest-pick">
            {/* Image */}
            <div className="relative w-[429px] h-[455px] flex-shrink-0">
                <Image
                    src="/home/pick-of-the-day.png"
                    alt="The Weight of Silence: A Meditation on Absence"
                    fill
                    className="object-cover"
                />
            </div>

            {/* Content */}
            <div className="flex flex-col gap-[35px] max-w-[760px] flex-grow pl-[30px]">
                <div className="flex flex-col gap-[32px]">
                    <div className="flex flex-col gap-[16px]">
                        <div className="flex flex-col gap-[20px]">
                            <div className="flex items-center gap-[20px]">
                                <span className="font-sans font-semibold text-[20px] leading-[16px] tracking-[2.4px] uppercase text-[#DC2828]">
                                    Literature
                                </span>
                                <span className="text-[#737373] font-sans text-[18px] leading-[16px] tracking-[0.6px] uppercase">
                                    March 28, 2026
                                </span>
                            </div>
                            <h2 className="font-heading font-bold text-[42px] leading-[56px] text-[#1A1A1A]">
                                The Weight of Silence: A Meditation on Absence
                            </h2>
                        </div>
                        <p className="font-sans text-[18px] leading-[22px] text-[#595959] max-w-[684px]">
                            Our editors&apos; unanimous choice. A novel that redefines narrative structure, exploring what happens in the spaces between words. Elena Morrow crafts a devastating portrait of loss without ever directly naming it.
                        </p>
                    </div>
                </div>

                <Link href="#" className="flex flex-row justify-center items-center py-[10px] px-0 gap-[10px] w-fit group">
                    <div className="bg-[#DC2828] text-white flex flex-row items-center px-4 py-2 gap-2 transition-colors group-hover:bg-[#b02020]">
                        <span className="font-sans font-medium text-[20px] leading-[24px] tracking-[1.8px] capitalize">
                            View More
                        </span>
                        <ArrowRight className="w-6 h-6" />
                    </div>
                </Link>
            </div>
        </section>
    );
}
