import Image from "next/image";

export function ArticleSidebar() {
    return (
        <aside className="w-full h-full flex flex-col gap-16 pt-8 md:pt-[100px]">

            {/* Related Critiques */}
            <div className="flex flex-col gap-8">
                <div className="border-b border-[#2B5940] pb-2">
                    <h3 className="font-sans text-[22px] leading-[27px] text-[#1C1C18]">Related Critiques</h3>
                </div>

                <div className="flex flex-col gap-10">
                    <div className="flex flex-col gap-4 group cursor-pointer">
                        <div className="relative w-full aspect-[16/9] overflow-hidden">
                            <Image
                                src="https://images.unsplash.com/photo-1516979187457-637abb4f9353?q=80&w=600&auto=format&fit=crop"
                                fill
                                alt="Essays"
                                className="object-cover group-hover:scale-105 transition-transform duration-700 grayscale group-hover:grayscale-0"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <span className="font-sans font-semibold text-[14px] leading-[17px] tracking-[1px] uppercase text-[#11412A]">
                                Essays
                            </span>
                            <h4 className="font-heading font-normal text-[18px] text-[#1C1C18] leading-[24px]">
                                The Death of the Novel in the Digital Age
                            </h4>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4 group cursor-pointer">
                        <div className="relative w-full aspect-[16/9] overflow-hidden">
                            <Image
                                src="https://images.unsplash.com/photo-1491841550275-ad7854e35ca6?q=80&w=600&auto=format&fit=crop"
                                fill
                                alt="Poetry"
                                className="object-cover group-hover:scale-105 transition-transform duration-700 grayscale group-hover:grayscale-0"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <span className="font-sans font-semibold text-[14px] leading-[17px] tracking-[1px] uppercase text-[#11412A]">
                                Poetry
                            </span>
                            <h4 className="font-heading font-normal text-[18px] text-[#1C1C18] leading-[24px]">
                                Rhythmic Despair: Modern Verse and the Void
                            </h4>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sidebar Ad */}
            <div className="flex flex-col items-center justify-center h-[345px] bg-[#EBE8E1] border border-[#C1C9C1]/30 p-8 gap-8">
                <span className="font-sans font-medium text-[14px] tracking-[1px] uppercase text-[#A8A29E]">
                    Advertisement
                </span>
                <div className="flex flex-col items-center gap-6">
                    <span className="font-heading font-normal text-[16px] leading-[21px] text-center text-[#57534E]">
                        Support Independent Literary Criticism
                    </span>
                    <button className="bg-[#11412A] hover:bg-[#1a5b3d] text-white px-6 py-2 transition-colors">
                        <span className="font-heading font-semibold text-[14px] leading-[16px] uppercase tracking-[1.1px]">
                            Join the Circle
                        </span>
                    </button>
                </div>
            </div>

            {/* Newsletter */}
            <div className="flex flex-col pb-6 bg-white shadow-sm border-l-[4px] border-[#EBC164]">
                <div className="flex flex-col p-8 gap-4">
                    <h3 className="font-heading font-normal text-[22px] leading-[29px] text-[#1C1C18]">
                        The Weekly Dispatch
                    </h3>
                    <p className="font-heading italic font-normal text-[14px] leading-[19px] text-[#1A1A1A]">
                        Essential reading and cultural curation delivered to your inbox every Sunday morning.
                    </p>
                    <div className="border border-[#D6D3D1] p-3.5 mt-2 transition-colors focus-within:border-[#EBC164]">
                        <input
                            type="email"
                            placeholder="Your email address"
                            className="w-full bg-transparent outline-none font-sans font-extralight text-[16px] placeholder:text-[#1C1C18]/50 text-[#1C1C18]"
                        />
                    </div>
                </div>
            </div>

        </aside>
    );
}
