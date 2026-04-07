type ContentBlock = {
    type?: string;
    data?: {
        text?: string;
        caption?: string;
        items?: string[];
    };
};

type FilmContentProps = {
    blocks?: ContentBlock[];
    tags?: string[];
};

export function FilmContent({ blocks = [], tags = [] }: FilmContentProps) {
    const safeBlocks = blocks.length > 0 ? blocks : [{ type: "paragraph", data: { text: "Film content is currently unavailable." } }];

    return (
        <article className="w-full bg-[#FDF9F2] flex flex-col items-center py-[80px] md:py-[120px] px-6">
            <div className="w-full max-w-[656px] flex flex-col gap-[36px]">
                {safeBlocks
                    .filter((block) => block.type !== "embed")
                    .map((block, index) => {
                        const text = block.data?.text || "";

                        if (block.type === "header") {
                            return (
                                <h2 key={`header-${index}`} className="font-heading font-bold text-[30px] leading-[38px] text-[#1A1A1A]">
                                    {text}
                                </h2>
                            );
                        }

                        if (block.type === "quote") {
                            return (
                                <blockquote key={`quote-${index}`} className="my-[20px] pl-[24px] py-3 border-l-[2px] border-[#E50914] flex flex-col gap-4">
                                    <p className="font-heading italic font-bold text-[22px] md:text-[28px] leading-[34px] text-[#1A1A1A]">
                                        {text || block.data?.caption || "-"}
                                    </p>
                                </blockquote>
                            );
                        }

                        if (block.type === "list") {
                            return (
                                <ul key={`list-${index}`} className="list-disc pl-6 space-y-2 text-[16px] md:text-[18px] text-[#1A1A1A]/85">
                                    {(block.data?.items || []).map((item, itemIndex) => (
                                        <li key={`item-${index}-${itemIndex}`}>{item}</li>
                                    ))}
                                </ul>
                            );
                        }

                        if (index === 0) {
                            return (
                                <p key={`p-${index}`} className="font-sans font-light text-[18px] md:text-[20px] leading-[28px] text-[#1A1A1A]/90">
                                    <span className="float-left font-sans font-bold text-[60px] md:text-[72px] leading-[65px] md:leading-[72px] text-[#1A1A1A]/60 mr-4">
                                        {text.charAt(0) || "F"}
                                    </span>
                                    {text.slice(1)}
                                </p>
                            );
                        }

                        return (
                            <p key={`p-${index}`} className="font-sans font-light text-[18px] md:text-[20px] leading-[28px] text-[#1A1A1A]/90">
                                {text}
                            </p>
                        );
                    })}

                {tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 border-t border-[#1A1A1A]/10 pt-6 mt-4">
                        {tags.map((tag) => (
                            <span key={tag} className="px-3 py-1 text-[11px] uppercase tracking-[1px] bg-[#EFE9DF] text-[#3A3A3A]">
                                {tag}
                            </span>
                        ))}
                    </div>
                )}

            </div>
        </article>
    );
}
