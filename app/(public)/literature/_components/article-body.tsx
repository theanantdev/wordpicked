import { Star } from "lucide-react";

export function ArticleBody() {
    return (
        <div className="flex flex-col gap-10 w-full pt-8 lg:pr-[40px]">
            <div className="flex flex-col items-center mb-6">
                <div className="flex items-center text-[#FBBC05] gap-[10px]">
                    <Star className="w-6 h-6 fill-current" />
                    <Star className="w-6 h-6 fill-current" />
                    <Star className="w-6 h-6 fill-current" />
                    <Star className="w-6 h-6 fill-current" />
                    <Star className="w-6 h-6 text-transparent stroke-[#181821] stroke-2" />
                </div>
                <span className="font-heading italic text-[18px] text-[#615E5A] mt-4">
                    The Wordpicked Essential Reading
                </span>
            </div>

            <div className="font-sans font-light text-[18px] leading-[29px] text-[#1C1C18] flex flex-col gap-8">
                <p className="first-letter:float-left first-letter:text-[90px] first-letter:leading-[75px] first-letter:mr-4 first-letter:text-[#1C1C18]/40 first-letter:font-light">
                    To enter the world of a master stylist is to consent to a peculiar kind of haunting. In this latest retrospection, we find that the boundaries between memory and fabrication have not just blurred—they have dissolved entirely into the mist of the English countryside. The prose remains as clinical as ever, a surgical examination of the human capacity for self-delusion, yet beneath the surface, there is a warmth that was previously absent.
                </p>
                <p>
                    There is a specific rhythm to the narrative that feels almost architectural. Each sentence is a brick, meticulously laid, hiding the mortar of existential dread. We are led down hallways of conversation where the most important words are never spoken, only felt as a draft against the back of the neck.
                </p>

                <blockquote className="my-6 py-6 px-8 bg-[#11412A]/5 border-l-[3px] border-[#2B5940]">
                    <p className="font-heading italic text-[22px] md:text-[24px] leading-[32px] text-[#11412A] m-0">
                        &ldquo;Memory is a fragile instrument, prone to the warping of desire and the softening edges of regret. We do not remember what happened; we remember what we can live with.&rdquo;
                    </p>
                </blockquote>

                <p>
                    The supporting cast of characters serves as a mirror to the protagonist&apos;s own fading relevance. They move through the story like ghosts in a house they no longer recognize, searching for a meaning that was lost decades prior. It is a masterclass in atmospheric tension, proving once again that silence is the most powerful tool in a writer&apos;s arsenal.
                </p>

                {/* Ad Placeholder Inside Content */}
                <div className="w-full h-[195px] my-4 bg-[#EBE8E1] border border-[#C1C9C1]/30 flex flex-col gap-2 items-center justify-center relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#E7E5E4]/50 to-[#F5F5F4]/50 opacity-50" />
                    <span className="font-sans font-bold text-[10px] tracking-[1px] uppercase text-[#A8A29E] z-10">
                        Advertisement
                    </span>
                </div>

                <p>
                    Critics often mistake this restraint for coldness, but they miss the profound empathy at the heart of the project. Every omission is an act of mercy; every silence, a space for the reader to insert their own grief. By the final chapters, the weight of what has been unsaid becomes almost unbearable, a testament to the author&apos;s control over the medium.
                </p>

                <p>
                    In conclusion, this is not merely a book to be read, but a space to be inhabited. It demands a slow pace, a quiet room, and a willingness to confront the shadows of one&apos;s own past. It is, quite simply, a triumph of the human spirit over the decay of time.
                </p>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap items-center gap-[8px] border-t border-[#C1C9C1]/30 pt-8 mt-2">
                {["Post-War", "Modernism", "Critique"].map(tag => (
                    <div key={tag} className="bg-[#E6E2DB] px-3 py-1">
                        <span className="font-sans font-normal text-[12px] uppercase tracking-[-0.275px] text-[#1C1C18]">{tag}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
