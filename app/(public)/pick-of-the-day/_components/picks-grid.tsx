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
        <section className="w-full max-w-[1440px] mx-auto px-[92px] mb-[150px]">
            <div className="flex flex-col gap-[13px] mb-[60px]">
                <h2 className="font-heading font-bold text-[36px] leading-[48px] tracking-[1px] text-[#141210]">
                    Literature
                </h2>
                <p className="font-sans text-[18px] leading-[24px] text-[#7C7468]">
                    The last 5 days
                </p>
            </div>

            <div className="grid grid-cols-3 gap-x-[20px] gap-y-[40px]">
                {PICKS.map((pick) => (
                    <Link key={pick.id} href={`#`} className="flex flex-col bg-white overflow-hidden group border border-transparent hover:border-neutral-100 transition-colors shadow-sm hover:shadow-md pb-4 rounded-sm">
                        <div className="relative w-full aspect-[4/3] mb-4">
                            <Image
                                src={pick.imageUrl}
                                alt={pick.title}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                        </div>

                        <div className="flex flex-col px-5 gap-[14px]">
                            <div className="flex flex-col gap-2.5">
                                <span className="font-sans font-semibold text-[12px] leading-[16px] tracking-[2.4px] uppercase text-[#DC2828]">
                                    {pick.category}
                                </span>
                                <h3 className="font-heading font-semibold text-[18px] leading-[24px] text-[#1A1A1A] group-hover:text-[#DC2828] transition-colors">
                                    {pick.title}
                                </h3>
                                <p className="font-sans text-[14px] leading-[22px] text-[#737373] line-clamp-2">
                                    {pick.description}
                                </p>
                            </div>

                            <div className="flex flex-row items-center gap-[9px] mt-1">
                                <span className="font-sans text-[14px] leading-[16px] text-[#8C8C8C]">
                                    {pick.author}
                                </span>
                                <span className="w-1 h-1 rounded-full bg-[#8C8C8C]" />
                                <span className="font-sans text-[14px] leading-[16px] text-[#8C8C8C]">
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
