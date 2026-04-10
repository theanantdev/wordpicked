"use client"

import Image from "next/image";
import { Bookmark, Heart, Star, Eye } from "lucide-react";
import { ShareButton } from "./share-button";
import { usePathname } from "next/navigation";
type ArticleHeroProps = {
    categoryLabel: string;
    title: string;
    subtitle: string;
    authorName: string;
    publishDate: string;
    coverImageUrl: string;
    viewCount?: number;
};

export function ArticleHero({ categoryLabel, title, subtitle, authorName, publishDate, coverImageUrl, viewCount = 0 }: ArticleHeroProps) {
    const pathname = usePathname();
    return (

        <section className="w-full bg-[#FDF9F2] pt-[40px] md:pt-[60px] lg:pt-[92px] pb-[40px] md:pb-[60px] relative mt-16 md:mt-2">
            <div className="max-w-[1240px] mx-auto px-6 md:px-[60px] lg:px-[80px] grid grid-cols-1 md:grid-cols-[55%_45%] lg:grid-cols-[60%_40%] gap-10 md:gap-8 items-center relative z-10">
                <div className="flex flex-col items-start gap-8 lg:gap-10">
                    <div className="flex flex-col items-start gap-6 lg:gap-8 w-full">
                        <div className="bg-[#11412A] px-4 py-[5px]">
                            <span className="font-heading font-medium text-[12px] md:text-[14px] leading-tight uppercase tracking-[2px] text-white">
                                Literature / {categoryLabel}
                            </span>
                        </div>

                        <h1 className="font-heading font-normal text-[36px] sm:text-[45px] lg:text-[55px] leading-[1.1] md:leading-[1.15] lg:leading-[1.25] tracking-[-1.8px] text-[#11412A]">
                            {title}
                        </h1>

                        <p className="font-heading italic font-normal text-[18px] md:text-[20px] lg:text-[24px] leading-[1.4] md:leading-[32px] text-[#57534E]">
                            {subtitle}
                        </p>
                    </div>

                    <div className="flex flex-col gap-8 w-full border-t border-[#292524] pt-8">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full overflow-hidden relative grayscale">
                                <Image src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150&auto=format&fit=crop" alt="Julian Barnes-Holloway" fill className="object-cover" />
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="font-sans font-light text-[14px] leading-none tracking-[1.4px] uppercase text-[#1C1C18]">
                                    {authorName}
                                </span>
                                <span className="font-serif text-[12px] leading-none text-[#595959] flex items-center gap-3">
                                    <span>Senior Literary Critic • {publishDate}</span>
                                    {viewCount > 0 && (
                                        <span className="flex items-center gap-1">
                                            <Eye className="w-3 h-3" />
                                            {viewCount.toLocaleString()}
                                        </span>
                                    )}
                                </span>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center justify-between md:justify-start gap-6 lg:gap-[40px] w-full">
                            <div className="flex items-center gap-[10px]">
                                <span className="font-sans font-medium text-[20px] md:text-[24px] text-[#181821]">4.3</span>
                                <div className="flex items-center text-[#FBBC05] gap-1">
                                    <Star className="w-5 h-5 fill-current" />
                                    <Star className="w-5 h-5 fill-current" />
                                    <Star className="w-5 h-5 fill-current" />
                                    <Star className="w-5 h-5 fill-current" />
                                    <Star className="w-5 h-5 text-gray-300" />
                                </div>
                                <span className="font-sans font-normal text-[16px] md:text-[20px] text-[#181821] ml-2">• 24 Review</span>
                            </div>

                            <div className="flex items-center gap-5 lg:gap-[30px]">
                                <button className="w-[40px] h-[40px] flex items-center justify-center rounded-sm hover:bg-black/5 transition-colors">
                                    <Bookmark className="w-5 h-5 text-[#181821]" />
                                </button>
                                <button className="w-[40px] h-[40px] flex items-center justify-center rounded-sm hover:bg-black/5 transition-colors">
                                    <Heart className="w-5 h-5 text-[#181821]" />
                                </button>
                                <ShareButton title={title} text={subtitle} url={pathname} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Desktop Cover Representation */}
                <div className="relative w-full aspect-[2/3] max-h-[600px] h-full max-w-[440px] ml-auto hidden md:block">
                    <Image src={coverImageUrl} alt={title} fill className="object-cover shadow-2xl" />
                </div>

                {/* Mobile Cover Representation */}
                <div className="relative w-full max-w-[80%] mx-auto aspect-[2/3] md:hidden shadow-2xl mt-4">
                    <Image src={coverImageUrl} alt={title} fill className="object-cover" />
                </div>

            </div>
        </section>
    );
}
