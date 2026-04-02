import Image from "next/image";
import { filmReviews } from "./content-data";

export function CinemaSection() {
    return (
        <section className="bg-[#f7f3ec] py-16">
            <div className="mx-auto w-full max-w-310 space-y-12 px-4 md:px-6">
                <div className="grid items-center gap-10 lg:grid-cols-2">
                    <div>
                        <Image src={"/home/image.png"} alt="Cinema" width={600} height={400} className="h-auto w-full object-cover" />
                    </div>
                    <div className="text-center lg:text-left">
                        <h2 className="font-heading text-4xl leading-tight text-[#1c1c18] sm:text-5xl">Cinema as Ritual</h2>
                        <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-zinc-700 sm:text-lg sm:leading-8 lg:mx-0">
                            Our film critiques go beyond the surface of plot and performance. We dissect the visual grammar,
                            the acoustic textures, and the psychological resonance of modern and classic masterpieces.
                        </p>
                        <a className="mt-6 inline-flex border-b-2 border-[#4b3600] pb-1 text-sm tracking-[0.14em] text-[#11412a] uppercase" href="#">
                            Explore Filmography
                        </a>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {filmReviews.map((review) => (
                        <article key={review.title} className="bg-[#fdf9f2] p-10 shadow-sm">
                            <p className="text-4xl text-[#2b5940]">{review.score}</p>
                            <h3 className="mt-4 font-heading text-3xl">{review.title}</h3>
                            <p className="mt-4 text-sm text-zinc-600">{review.quote}</p>
                            <button className="mt-8 text-xs tracking-[0.12em] uppercase">Read Critique</button>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}
