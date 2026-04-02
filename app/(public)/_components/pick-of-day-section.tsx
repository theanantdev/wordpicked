import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export function PickOfDaySection() {
    return (
        <section className="mx-auto w-full max-w-[1171px] px-4 py-14 md:px-6">
            <SectionHeader title="Pick of the Day" />
            <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_1.9fr] lg:items-start">
                <Image
                    src="/home/pick-of-the-day.png"
                    alt="Pick of the Day"
                    width={387}
                    height={440}
                    className="h-auto w-full object-cover"
                />
                <div className="space-y-8 text-center lg:text-left">
                    <div className="space-y-4">
                        <p className="text-xs tracking-[0.12em] text-zinc-500 uppercase">March 28, 2026</p>
                        <p className="text-sm font-semibold tracking-[0.18em] text-[#DC2828] uppercase">Literature</p>
                        <h3 className="font-heading text-3xl font-semibold leading-tight text-zinc-900 sm:text-4xl lg:text-[42px]">
                            The Weight of Silence: A Meditation on Absence
                        </h3>
                        <p className="mx-auto max-w-2xl text-zinc-600 lg:mx-0">
                            Our editors&apos; unanimous choice. A novel that redefines what contemporary literary fiction can
                            achieve: intimate, devastating, and utterly unforgettable.
                        </p>
                    </div>
                    <button className="inline-flex h-11 items-center gap-2 self-center rounded-full bg-[#DC2828] px-5 py-2 text-sm font-medium tracking-[0.12em] text-white uppercase lg:self-start">
                        Read More <ArrowRight className="size-4" />
                    </button>
                </div>
            </div>
        </section>
    );
}

function SectionHeader({ title, className }: { title: string; className?: string }) {
    return (
        <div className="flex  items-center gap-4 flex-row  justify-between sm:gap-6">
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