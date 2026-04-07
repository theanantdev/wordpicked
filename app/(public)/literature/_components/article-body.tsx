import { Star } from "lucide-react";

type ContentBlock = {
    type?: string;
    data?: {
        text?: string;
        caption?: string;
        items?: string[];
    };
};

type ArticleBodyProps = {
    blocks: ContentBlock[];
    tags: string[];
};

export function ArticleBody({ blocks, tags }: ArticleBodyProps) {
    const safeBlocks = blocks.length > 0 ? blocks : [{ type: "paragraph", data: { text: "Article content is currently unavailable." } }];

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
                {safeBlocks.map((block, index) => {
                    const text = block.data?.text || "";

                    if (block.type === "quote") {
                        return (
                            <blockquote key={`quote-${index}`} className="my-6 py-6 px-8 bg-[#11412A]/5 border-l-[3px] border-[#2B5940]">
                                <p className="font-heading italic text-[22px] md:text-[24px] leading-[32px] text-[#11412A] m-0">
                                    {text || block.data?.caption || "-"}
                                </p>
                            </blockquote>
                        );
                    }

                    if (block.type === "list") {
                        return (
                            <ul key={`list-${index}`} className="list-disc pl-6 space-y-2">
                                {(block.data?.items || []).map((item, itemIndex) => (
                                    <li key={`item-${index}-${itemIndex}`}>{item}</li>
                                ))}
                            </ul>
                        );
                    }

                    if (block.type === "header") {
                        return (
                            <h2 key={`header-${index}`} className="font-heading text-[28px] leading-[36px] text-[#1C1C18]">
                                {text}
                            </h2>
                        );
                    }

                    if (index === 0) {
                        return (
                            <p key={`p-${index}`} className="first-letter:float-left first-letter:text-[90px] first-letter:leading-[75px] first-letter:mr-4 first-letter:text-[#1C1C18]/40 first-letter:font-light">
                                {text}
                            </p>
                        );
                    }

                    return <p key={`p-${index}`}>{text}</p>;
                })}

                <div className="w-full h-[195px] my-4 bg-[#EBE8E1] border border-[#C1C9C1]/30 flex flex-col gap-2 items-center justify-center relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#E7E5E4]/50 to-[#F5F5F4]/50 opacity-50" />
                    <span className="font-sans font-bold text-[10px] tracking-[1px] uppercase text-[#A8A29E] z-10">
                        Advertisement
                    </span>
                </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap items-center gap-[8px] border-t border-[#C1C9C1]/30 pt-8 mt-2">
                {(tags.length > 0 ? tags : ["Literature"]).map(tag => (
                    <div key={tag} className="bg-[#E6E2DB] px-3 py-1">
                        <span className="font-sans font-normal text-[12px] uppercase tracking-[-0.275px] text-[#1C1C18]">{tag}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
