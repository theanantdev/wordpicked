import Image from "next/image";
import Link from "next/link";

export function FilmRelated() {
    const RELATED_FILMS = [
        {
            id: "1",
            tag: "NOIR",
            title: "Shadows in the Metropolis",
            description: "A deep dive into the resurgence of minimalist neo-noir in the 21st century.",
            image: "https://images.unsplash.com/photo-1510884343110-394ffdc61f74?q=80&w=800&auto=format&fit=crop"
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
        <section className="w-full bg-[#FDF9F2] px-6 md:px-12 lg:px-[152px] pb-[80px] md:pb-[120px] flex flex-col gap-12 border-t border-[rgba(0,0,0,0.05)] pt-12 md:pt-20">
            <div className="flex flex-row items-center justify-between">
                <h2 className="font-heading italic font-bold text-[28px] md:text-[36px] leading-[40px] text-[#1A1A1A]">
                    Further Readings
                </h2>
                <Link href="/films" className="px-5 py-2.5 bg-[#DC2828] text-white hover:bg-[#b02020] transition-colors rounded-[2px] hidden sm:flex items-center justify-center shadow-sm hover:shadow-md">
                    <span className="font-sans font-medium text-[12px] md:text-[14px] leading-[20px] uppercase tracking-[1.4px]">
                        View Archive
                    </span>
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 lg:gap-12">
                {RELATED_FILMS.map(film => (
                    <div key={film.id} className="flex flex-col gap-[28px] group cursor-pointer w-full group">
                        <div className="relative w-full aspect-[4/5] max-h-[446px] bg-[#F5F5F5] border border-[rgba(0,0,0,0.05)] overflow-hidden rounded-[2px]">
                            <Image
                                src={film.image}
                                alt={film.title}
                                fill
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                className="object-cover opacity-90 group-hover:scale-105 transition-transform duration-[800ms]"
                            />
                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-[rgba(0,0,0,0.6)] to-transparent" />

                            {/* Tag Badge */}
                            <div className="absolute bottom-[25px] left-[25px] bg-[rgba(229,9,20,0.9)] px-[12px] py-[2.5px] rounded-[1px] shadow-sm">
                                <span className="font-sans font-semibold text-[12px] md:text-[14px] leading-[15px] tracking-[1px] uppercase text-white">
                                    {film.tag}
                                </span>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <h3 className="font-heading font-bold text-[20px] md:text-[24px] text-[#1A1A1A] leading-[28px] group-hover:text-[#E50914] transition-colors line-clamp-2">
                                {film.title}
                            </h3>
                            <p className="font-sans font-normal text-[14px] md:text-[15px] leading-[20px] text-[rgba(26,26,26,0.6)] line-clamp-3">
                                {film.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Mobile View Archive Button */}
            <div className="sm:hidden w-full flex justify-center mt-2">
                <Link href="/films" className="px-8 py-3.5 bg-[#DC2828] text-white hover:bg-[#b02020] transition-colors rounded-[2px] w-full text-center shadow-sm">
                    <span className="font-sans font-medium text-[13px] uppercase tracking-[1.4px]">
                        View Archive
                    </span>
                </Link>
            </div>

            <div className="w-full flex justify-center mt-[40px] md:mt-[48px]">
                <button className="bg-[#DC2828] transition-transform shadow-[2px_2px_0px_#DC2828] px-[48px] py-[20px] rounded-[2px] flex flex-col items-center justify-center">
                    <span className="font-sans font-bold text-[14px] md:text-[18px] leading-[22px] tracking-[2.24px] uppercase text-white">
                        Load More Reviews
                    </span>
                </button>
            </div>
        </section>
    );
}
