import Image from "next/image";

export function ArticleRelated() {
    return (
        <section className="w-full bg-[#F7F3EC] border-t border-[#C1C9C1]/20 py-[96px] md:py-[120px]">
            <div className="max-w-[1280px] md:max-w-[1536px] mx-auto px-6 md:px-[32px] lg:px-[80px] flex flex-col gap-12">

                <h2 className="font-heading font-normal text-[30px] leading-[40px] text-center text-[#1C1C18]">
                    More from The Digital Curator
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[40px] lg:gap-[60px]">
                    {[
                        {
                            tag: "LITERATURE",
                            title: "The Architecture of Grand European Libraries",
                            img: "https://images.unsplash.com/photo-1481627834876-c220cc3ddbd0?q=80&w=800&auto=format&fit=crop"
                        },
                        {
                            tag: "FILM",
                            title: "Neon-Noir: The Visual Grammar of Urban Isolation",
                            img: "https://images.unsplash.com/photo-1542204165-65bf26472b9b?q=80&w=800&auto=format&fit=crop"
                        },
                        {
                            tag: "ARTS",
                            title: "The Gold Leaf Obsession: A Study of Gilded Art",
                            img: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=800&auto=format&fit=crop"
                        },
                    ].map(item => (
                        <div key={item.title} className="flex flex-col gap-5 pt-4 group cursor-pointer">
                            <div className="relative w-full aspect-[4/3] overflow-hidden rounded-[2px]">
                                <Image
                                    src={item.img}
                                    fill
                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                    alt={item.title}
                                    className="object-cover group-hover:scale-105 transition-transform duration-[800ms]"
                                />
                                <div className="absolute inset-0 bg-white/5 mix-blend-overlay group-hover:bg-transparent transition-colors" />
                            </div>

                            <div className="flex flex-col gap-2 pt-2">
                                <span className="font-sans font-normal text-[14px] md:text-[16px] leading-[15px] uppercase tracking-[1px] text-[#11412A]">
                                    {item.tag}
                                </span>
                                <h3 className="font-heading font-normal text-[22px] md:text-[24px] leading-[32px] text-[#1C1C18] group-hover:text-[#11412A] transition-colors mt-2">
                                    {item.title}
                                </h3>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
