import Image from "next/image";
import Link from "next/link";

interface PickItem {
    id: string;
    category: string;
    title: string;
    description: string;
    author: string;
    date: string;
    imageUrl: string;
}

const PICKS: PickItem[] = [
    {
        id: "1",
        category: "Fiction",
        title: "The Weight of Silence: A Meditation on Absence",
        description: "In her latest novel, Elena Morrow crafts a devastating portrait of loss without ever directly naming it...",
        author: "James Whitfield",
        date: "March 28, 2026",
        imageUrl: "/pick-of-the-day/Recent-Picks/image.png"
    },
    {
        id: "2",
        category: "Drama",
        title: "Echoes in the Dark: Reimagining Film Noir",
        description: "Director Lena Park's debut feature is a stunning visual exploration of morality in the modern metropolis...",
        author: "Sofia Chen",
        date: "March 27, 2026",
        imageUrl: "/pick-of-the-day/Recent-Picks/image1.png"
    },
    {
        id: "3",
        category: "Poetry",
        title: "Beneath the Surface: Poetry of the Mundane",
        description: "A collection that finds extraordinary beauty in everyday moments, from morning routines to evening commutes...",
        author: "Marcus Rivera",
        date: "March 26, 2026",
        imageUrl: "/pick-of-the-day/Recent-Picks/image2.png"
    },
    {
        id: "4",
        category: "Documentary",
        title: "The Last Projection: Cinema's Analog Farewell",
        description: "A documentary that mourns — and celebrates — the dying art of 35mm projection and the lovers of film...",
        author: "Alex Turner",
        date: "March 25, 2026",
        imageUrl: "/pick-of-the-day/Recent-Picks/image.png"
    },
    {
        id: "5",
        category: "Fiction",
        title: "Cartography of Longing: Maps We Draw in the Dark",
        description: "A sprawling, ambitious novel that charts the geographic and emotional distances between estranged siblings...",
        author: "Elena Vasquez",
        date: "March 24, 2026",
        imageUrl: "/pick-of-the-day/Recent-Picks/image1.png"
    },
    {
        id: "6",
        category: "Experimental",
        title: "Still Life with Shadows",
        description: "An experimental short film that blurs the line between stillness and motion, light and profound darkness...",
        author: "Yuki Tanaka",
        date: "March 23, 2026",
        imageUrl: "/pick-of-the-day/Recent-Picks/image2.png"
    }
];

export function PicksGrid() {
    return (
        <section className="mx-auto mb-20 w-full max-w-360 px-4 sm:px-6 lg:mb-37.5 lg:px-23">
            <div className="mb-10 flex flex-col gap-3.25 lg:mb-15">
                <h2 className="font-heading text-[28px] leading-[1.2] font-bold tracking-[1px] text-[#141210] sm:text-[32px] md:text-[36px] md:leading-12">
                    Literature
                </h2>
                <p className="font-sans text-[15px] leading-6 text-[#7C7468] sm:text-[18px]">
                    The last 5 days
                </p>
            </div>

            <div className="grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-y-10">
                {PICKS.map((pick) => (
                    <Link key={pick.id} href={`#`} className="flex flex-col bg-white overflow-hidden group border border-transparent hover:border-neutral-100 transition-colors shadow-sm hover:shadow-md pb-4 rounded-sm">
                        <div className="relative mb-4 w-full aspect-4/3">
                            <Image
                                src={pick.imageUrl}
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
                                <p className="font-sans text-[14px] leading-5.5 text-[#737373] line-clamp-2">
                                    {pick.description}
                                </p>
                            </div>

                            <div className="mt-1 flex flex-row items-center gap-2.25">
                                <span className="font-sans text-[14px] leading-4 text-[#8C8C8C]">
                                    {pick.author}
                                </span>
                                <span className="w-1 h-1 rounded-full bg-[#8C8C8C]" />
                                <span className="font-sans text-[14px] leading-4 text-[#8C8C8C]">
                                    {pick.date}
                                </span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}
