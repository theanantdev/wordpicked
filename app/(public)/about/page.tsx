import { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
    title: 'About Us',
    description: 'Learn more about Wordpicked, our mission, and our editorial standards for literature and film.',
};

export default function AboutPage() {
    return (
        <main className="w-full bg-[#FAFAFA] min-h-screen">
            <div className="max-w-[1240px] mx-auto px-6 md:px-[60px] lg:px-[80px] py-[80px] md:py-[120px]">
                <div className="max-w-3xl">
                    <h1 className="font-playfair text-4xl md:text-5xl lg:text-6xl text-[#141210] mb-6">
                        About Wordpicked
                    </h1>
                    <p className="text-lg md:text-xl text-zinc-600 font-sans leading-relaxed mb-10">
                        Wordpicked is a digital curator for the modern intellectual. We explore the profound intersections of contemporary literature, impactful cinema, and the defining visual arts of our time.
                    </p>

                    <div className="prose prose-lg prose-zinc max-w-none font-sans text-zinc-700">
                        <p>
                            Founded on the belief that meaningful culture requires thoughtful curation, our editorial team sifts through the noise to bring you pieces that challenge, inspire, and resonate. Whether it is an in-depth review of an independent film or an exploration of modern poetry, our goal is to elevate discourse and appreciation for the arts.
                        </p>
                        
                        <h2 className="font-playfair text-2xl text-[#141210] mt-12 mb-4">Our Mission</h2>
                        <p>
                            We aim to cultivate a community of readers and thinkers who value substance over superficiality. By highlighting both established visionaries and emerging voices across various mediums, we provide a platform for stories that matter.
                        </p>

                        <h2 className="font-playfair text-2xl text-[#141210] mt-12 mb-4">Editorial Integrity</h2>
                        <p>
                            Our content is rigorously researched and thoughtfully written by individuals deeply passionate about their respective fields. We maintain strict editorial independence, ensuring that our recommendations and critiques are always honest and uncompromised.
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}
