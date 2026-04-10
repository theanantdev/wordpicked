import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export type PickArticle = {
    id: string;
    title: string;
    subtitle: string | null;
    category: string;
    slug: string;
    featured_image_url: string | null;
    author_name: string | null;
    publish_at: string | null;
};

function formatDate(iso: string | null) {
    if (!iso) return "";
    return new Date(iso).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

function articleHref(article: PickArticle) {
    return article.category === "films"
        ? `/films/${article.slug}`
        : `/literature/${article.slug}`;
}

export function FeaturedPickCard({ article }: { article: PickArticle }) {
    return (
        <section className="mx-auto mt-14 mb-20 flex w-full max-w-360 flex-col items-start gap-8 px-4 sm:px-6 lg:mt-30 lg:mb-37.5 lg:flex-row lg:items-center lg:gap-7.5 lg:px-21.5" id="latest-pick">
            {/* Image */}
            <div className="relative aspect-429/455 w-full max-w-107.25 shrink-0">
                <Image
                    src={article.featured_image_url || "/home/pick-of-the-day.png"}
                    alt={article.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 429px"
                    className="object-cover"
                />
            </div>

            {/* Content */}
            <div className="flex max-w-190 grow flex-col gap-8 pl-0 lg:gap-8.75 lg:pl-7.5">
                <div className="flex flex-col gap-8">
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-5">
                            <div className="flex flex-wrap items-center gap-3 sm:gap-5">
                                <span className="font-sans text-[14px] leading-4 font-semibold tracking-[2.4px] uppercase text-[#DC2828] sm:text-[16px] md:text-[20px]">
                                    {article.category}
                                </span>
                                <span className="font-sans text-[13px] leading-4 tracking-[0.6px] uppercase text-[#737373] sm:text-[14px] md:text-[18px]">
                                    {formatDate(article.publish_at)}
                                </span>
                            </div>
                            <h2 className="font-heading text-[28px] leading-[1.2] font-bold text-[#1A1A1A] sm:text-[34px] md:text-[42px] md:leading-14">
                                {article.title}
                            </h2>
                        </div>
                        {article.subtitle && (
                            <p className="max-w-171 font-sans text-[15px] leading-normal text-[#595959] sm:text-[16px] md:text-[18px] md:leading-5.5">
                                {article.subtitle}
                            </p>
                        )}
                    </div>
                </div>

                <Link href={articleHref(article)} className="group flex w-fit flex-row items-center justify-center gap-2.5 px-0 py-2.5">
                    <div className="bg-[#DC2828] text-white flex flex-row items-center px-4 py-2 gap-2 transition-colors group-hover:bg-[#b02020]">
                        <span className="font-sans font-medium text-[16px] leading-6 tracking-[1.8px] capitalize sm:text-[18px] md:text-[20px]">
                            Read Now
                        </span>
                        <ArrowRight className="w-6 h-6" />
                    </div>
                </Link>
            </div>
        </section>
    );
}
