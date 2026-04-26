import Image from "next/image";
import Link from "next/link";
import type { PickArticle } from "./featured-pick-card";

function formatDate(iso: string | null) {
    if (!iso) return "";
    return new Date(iso).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

function articleHref(article: PickArticle) {
    return article.category === "films"
        ? `/films/${article.slug}`
        : `/literature/${article.slug}`;
}

export function PicksGrid({ items }: { items: PickArticle[] }) {
    if (!items.length) return null;

    return (
        <section className="mx-auto mb-20 w-full">
            <div className="mb-10 flex flex-col gap-3.25 lg:mb-15">
                <h2 className="font-heading text-[28px] leading-[1.2] font-bold tracking-[1px] text-[#141210] sm:text-[32px] md:text-[36px] md:leading-12">
                    More Picks
                </h2>
                <p className="font-sans text-[15px] leading-6 text-[#7C7468] sm:text-[18px]">
                    Our editors&apos; recent selections
                </p>
            </div>

            <div className="grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-y-10">
                {items.map((pick) => (
                    <Link key={pick.id} href={articleHref(pick)} className="flex flex-col bg-white overflow-hidden group border border-transparent hover:border-neutral-100 transition-colors shadow-sm hover:shadow-md pb-4 rounded-sm">
                        <div className="relative mb-4 w-full aspect-4/3">
                            <Image
                                src={pick.featured_image_url || "/pick-of-the-day/Recent-Picks/image.png"}
                                alt={pick.title}
                                fill
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                        </div>

                        <div className="flex flex-col gap-3.5 px-5">
                            <div className="flex flex-col gap-2.5">
                                <span className="font-sans font-semibold text-[12px] leading-4 tracking-[2.4px] uppercase text-[#DC2828]">
                                    {pick.category}
                                </span>
                                <h3 className="font-heading text-[18px] leading-6 font-semibold text-[#1A1A1A] transition-colors group-hover:text-[#DC2828]">
                                    {pick.title}
                                </h3>
                                {pick.subtitle && (
                                    <p className="font-sans text-[14px] leading-5.5 text-[#737373] line-clamp-2">
                                        {pick.subtitle}
                                    </p>
                                )}
                            </div>

                            <div className="mt-1 flex flex-row items-center gap-2.25">
                                <span className="font-sans text-[14px] leading-4 text-[#8C8C8C]">
                                    {pick.author_name || "Editorial"}
                                </span>
                                <span className="w-1 h-1 rounded-full bg-[#8C8C8C]" />
                                <span className="font-sans text-[14px] leading-4 text-[#8C8C8C]">
                                    {formatDate(pick.publish_at)}
                                </span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}
