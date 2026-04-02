import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

export function SectionHeader({ title, className }: { title: string; className?: string }) {
    return (
        <div className="flex items-center gap-4 flex-row justify-between sm:gap-6">
            <div>
                <div className={cn("mb-3 h-1 w-12 bg-[#DC2828]", className)} />
                <h2 className="font-heading text-3xl font-semibold text-zinc-900 md:text-4xl">{title}</h2>
            </div>
            <button className="inline-flex h-11 w-[165px] items-center justify-center gap-2 bg-[#DC2828] px-5 py-2 text-xs font-semibold tracking-[0.16em] text-white uppercase transition hover:bg-red-700 sm:w-41.25">
                View All <ArrowRight className="size-4" />
            </button>
        </div>
    );
}
