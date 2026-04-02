import { filmCards, literatureCards } from "./content-data";
import { SectionHeader } from "./section-header";
import { StoryCard } from "./story-card";

export function StoriesSections() {
    return (
        <section className="border-y border-zinc-200 bg-[#fdf9f2] py-16">
            <div className="mx-auto w-full max-w-310 space-y-16 px-4 md:px-6">
                <div>
                    <SectionHeader title="Literature" className="h-px" />
                    <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                        {literatureCards.map((card) => (
                            <StoryCard key={card.title} {...card} />
                        ))}
                    </div>
                </div>

                <div>
                    <SectionHeader title="Films" className="h-px" />
                    <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                        {filmCards.map((card) => (
                            <StoryCard key={card.title} {...card} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
