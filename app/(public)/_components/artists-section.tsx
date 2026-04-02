import { ArrowRight } from "lucide-react";
import { artists } from "./content-data";
import Image from "next/image";

export function ArtistsSection() {
    return (
        <section className="bg-[#fdf9f2] py-16">
            <div className="mx-auto w-full max-w-310 px-4 md:px-6">
                <div className="mb-8 flex flex-col justify-between gap-6 md:flex-row md:items-end">
                    <div>
                        <p className="font-heading text-base text-[#a8812a]">Conversations</p>
                        <h2 className="font-heading text-4xl">The Artists</h2>
                        <p className="mt-2 text-zinc-600">Long-form conversations with writers, filmmakers, musicians, and visual artists.</p>
                    </div>
                    <button className="inline-flex items-center gap-2 self-start bg-[#DC2828] px-5 py-2 text-xs font-semibold tracking-[0.16em] text-white uppercase">
                        All Artists <ArrowRight className="size-4" />
                    </button>
                </div>

                <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
                    {artists.map((artist) => (
                        <article key={artist.name} className="text-center">
                            <div>
                                <Image src={artist.image} alt={artist.name} width={300} height={300} className="mx-auto aspect-square w-full object-cover" />
                            </div>
                            <h3 className="mt-4 font-heading text-3xl text-[#1c1c18]">{artist.name}</h3>
                            <p className="mx-auto mt-2 max-w-sm text-zinc-600">{artist.bio}</p>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}


