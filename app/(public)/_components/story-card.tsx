import { Dot } from "lucide-react";
import type { StoryCardItem } from "./content-data";
import Image from "next/image";
import Link from "next/link";
export function StoryCard({ tag, title, summary, author, date, image, slug }: StoryCardItem) {
    return (
        <Link
            href={`/literature/${slug}`}
            className="overflow-hidden bg-[#fdf9f2] shadow-md transition-all hover:-translate-y-1 rounded-xs">
            <div className="relative aspect-4/3 w-full overflow-hidden">
                <Image
                    loading="lazy"
                    src={image}
                    alt={title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover object-center transition-transform duration-500 hover:scale-105"
                />
            </div>

            <div className="space-y-1 p-2">
                <p className="text-[11px] font-semibold tracking-[0.18em] text-[#DC2828] uppercase">{tag}</p>
                <h3 className="font-heading text-xl leading-tight text-zinc-900">{title}</h3>
                <p className="text-sm leading-6 text-zinc-600">
                    {summary.split(' ').slice(0, 10).join(' ')}
                    {summary.split(' ').length > 10 ? '...' : ''}
                </p>
                <p className="text-xs text-[#8C8C8C] flex items-center gap-1">
                    {author} <Dot /> {date}
                </p>
            </div>
        </Link>
    );
}
