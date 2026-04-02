import { Dot } from "lucide-react";
import type { StoryCardItem } from "./content-data";
import Image from "next/image";
export function StoryCard({ tag, title, summary, author, date, image }: StoryCardItem) {
    return (
        <article className="overflow-hidden border border-zinc-200 bg-[#fdf9f2]">

            <Image src={image} alt={title} width={400} height={300} className=" object-cover" />

            <div className="space-y-3 p-5">
                <p className="text-[11px] font-semibold tracking-[0.18em] text-[#DC2828] uppercase">{tag}</p>
                <h3 className="font-heading text-xl leading-tight text-zinc-900">{title}</h3>
                <p className="text-sm leading-6 text-zinc-600">{summary}</p>
                <p className="text-xs text-[#8C8C8C] flex items-center gap-1">
                    {author} <Dot /> {date}
                </p>
            </div>
        </article>
    );
}
