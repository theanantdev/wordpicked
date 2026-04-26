import Image from "next/image";
import Link from "next/link";

type FilmRelatedItem = {
    tag: string;
    title: string;
    img: string;
    href: string;
};

type FilmRelatedProps = {
    items?: FilmRelatedItem[];
};

export function FilmRelated({ items = [] }: FilmRelatedProps) {
    const RELATED_FILMS = items.length > 0 ? items : [
        {
            id: "1",
            tag: "NOIR",
            title: "Shadows in the Metropolis",
            description: "A deep dive into the resurgence of minimalist neo-noir in the 21st century.",
            image: "https://images.unsplash.com/photo-1542204165-65bf26472b9b?q=80&w=800&auto=format&fit=crop"
        },
        {
            id: "2",
            tag: "CLASSIC",
            title: "The Grain of Truth",
            description: "Why 35mm film still holds a tactile soul that digital cannot replicate.",
            image: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=800&auto=format&fit=crop"
        },
        {
            id: "3",
            tag: "INDIE",
            title: "Fractured Horizons",
            description: "Exploring the desolate beauty of Scandinavian avant-garde cinema.",
            image: "https://images.unsplash.com/photo-1542204165-65bf26472b9b?q=80&w=800&auto=format&fit=crop"
        }
    ];

    return (
        <section className="w-full border-t border-[rgba(0,0,0,0.05)] bg-[#FDF9F2] px-4 py-12 min-[360px]:px-6 min-[640px]:px-8 min-[768px]:py-20 min-[1200px]:px-12 min-[1200px]:py-24 min-[1440px]:px-38 min-[1920px]:px-44 min-[1920px]:py-28">
            <div className="flex flex-col items-start justify-between gap-4 min-[640px]:flex-row min-[640px]:items-center">
                <h2 className="font-heading text-[28px] font-bold italic leading-10 text-[#1A1A1A] min-[768px]:text-[36px]">
                    Further Readings
                </h2>
                <Link href="/films" className="hidden items-center justify-center rounded-xs bg-[#DC2828] px-5 py-2.5 text-white shadow-sm transition-colors hover:bg-[#b02020] hover:shadow-md min-[640px]:flex">
                    <span className="font-sans text-[12px] font-medium uppercase tracking-[1.4px] leading-5 min-[768px]:text-[14px]">
                        View Archive
                    </span>
                </Link>
            </div>

            <div className="grid grid-cols-1 gap-6 min-[640px]:grid-cols-2 min-[1200px]:grid-cols-3 min-[1440px]:gap-8 min-[1920px]:gap-10">
                {RELATED_FILMS.map((film, index) => (

                    <Link key={(film as FilmRelatedItem).href || `related-${index}`} href={(film as FilmRelatedItem).href || "/films"} className="group flex w-full flex-col gap-7 cursor-pointer">
                        <div className="relative aspect-4/5 w-full max-h-111.5 overflow-hidden rounded-xs border border-[rgba(0,0,0,0.05)] bg-[#F5F5F5]">
                            <Image
                                src={(film as FilmRelatedItem).img || (film as { image?: string }).image || "https://images.unsplash.com/photo-1542204165-65bf26472b9b?q=80&w=800&auto=format&fit=crop"}
                                alt={film.title}
                                fill
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                className="object-cover opacity-90 transition-transform duration-800 group-hover:scale-105"
                            />
                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-linear-to-t from-[rgba(0,0,0,0.6)] to-transparent" />

                            {/* Tag Badge */}
                            <div className="absolute bottom-6.25 left-6.25 rounded-[1px] bg-[rgba(229,9,20,0.9)] px-3 py-[2.5px] shadow-sm">
                                <span className="font-sans text-[12px] font-semibold uppercase tracking-[1px] leading-3.75 min-[768px]:text-[14px]">
                                    {film.tag}
                                </span>
                            </div>
                        </div>


                        <h3 className="font-heading text-[20px] font-bold leading-7 text-[#1A1A1A] transition-colors line-clamp-2 group-hover:text-[#E50914] min-[768px]:text-[24px]">
                            {film.title}
                        </h3>
                        <p className="font-sans text-[14px] font-normal leading-5 text-[rgba(26,26,26,0.6)] line-clamp-3 min-[768px]:text-[15px]">
                            {(film as { description?: string }).description || "Read the full film feature."}
                        </p>
                    </Link>

                ))}
            </div>

            {/* Mobile View Archive Button */}
            <div className="mt-2 flex w-full justify-center min-[640px]:hidden">
                <Link href="/films" className="w-full rounded-xs bg-[#DC2828] px-8 py-3.5 text-center text-white shadow-sm transition-colors hover:bg-[#b02020]">
                    <span className="font-sans text-[13px] font-medium uppercase tracking-[1.4px]">
                        View Archive
                    </span>
                </Link>
            </div>

            {/* <div className="mt-10 flex w-full justify-center min-[768px]:mt-12">
                <button className="flex flex-col items-center justify-center rounded-xs bg-[#DC2828] px-12 py-5 text-white shadow-[2px_2px_0px_#DC2828] transition-transform">
                    <span className="font-sans text-[14px] font-bold uppercase tracking-[2.24px] leading-5.5 min-[768px]:text-[18px]">
                        Load More Reviews
                    </span>
                </button>
            </div> */}
        </section>
    );
}
