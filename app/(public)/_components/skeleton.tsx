// Reusable shimmer skeleton primitives shared across loading files

export function SkeletonBox({ className = "" }: { className?: string }) {
    return (
        <div
            className={`bg-gradient-to-r from-[#E8E3DC] via-[#F0EBE3] to-[#E8E3DC] bg-[length:400%_100%] animate-[shimmer_1.4s_ease-in-out_infinite] rounded-[2px] ${className}`}
        />
    );
}

export function SkeletonHero({ dark = false }: { dark?: boolean }) {
    const bg = dark ? "bg-[#1A1714]" : "bg-[#EDE7D9]";
    const shimmer = dark
        ? "from-[#252118] via-[#2E2820] to-[#252118]"
        : "from-[#E0D9D0] via-[#EBE5DC] to-[#E0D9D0]";

    return (
        <section className={`relative w-full h-[400px] md:h-[472px] overflow-hidden ${bg}`}>
            <div
                className={`absolute inset-0 bg-gradient-to-r ${shimmer} bg-[length:400%_100%] animate-[shimmer_1.4s_ease-in-out_infinite]`}
            />
            <div className="relative z-10 w-full h-full max-w-[1440px] flex flex-col justify-end px-6 md:px-12 lg:px-[98px] pb-[40px] md:pb-[60px] mx-auto gap-4">
                <div className={`h-3 w-28 rounded bg-white/20`} />
                <div className={`h-12 w-3/4 max-w-[600px] rounded bg-white/20`} />
                <div className={`h-5 w-1/2 max-w-[400px] rounded bg-white/20`} />
                <div className="flex gap-4 mt-2">
                    <div className={`h-3 w-24 rounded bg-white/20`} />
                    <div className={`h-3 w-24 rounded bg-white/20`} />
                </div>
            </div>
        </section>
    );
}

export function SkeletonArticleCard() {
    return (
        <div className="flex flex-col gap-3">
            <SkeletonBox className="w-full aspect-[4/3]" />
            <SkeletonBox className="h-3 w-16" />
            <SkeletonBox className="h-5 w-full" />
            <SkeletonBox className="h-4 w-5/6" />
            <SkeletonBox className="h-3 w-1/2 mt-1" />
        </div>
    );
}

export function SkeletonArticleGrid({ count = 9 }: { count?: number }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
            {Array.from({ length: count }).map((_, i) => (
                <SkeletonArticleCard key={i} />
            ))}
        </div>
    );
}
