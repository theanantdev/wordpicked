import { SkeletonHero, SkeletonBox } from "../_components/skeleton";

function SkeletonArtistCard() {
    return (
        <div className="flex flex-col gap-3">
            <SkeletonBox className="w-full aspect-square" />
            <SkeletonBox className="h-5 w-3/4" />
            <SkeletonBox className="h-3 w-1/2" />
        </div>
    );
}

export default function ArtistsLoading() {
    return (
        <main className="bg-[#FDF9F2] min-h-screen">
            {/* Hero skeleton */}
            <SkeletonHero dark />

            {/* Featured artist skeleton */}
            <section className="w-full bg-[#EBE8E1] py-16 md:py-[60px]">
                <div className="max-w-[1200px] mx-auto px-6 md:px-[60px] lg:px-[120px] flex flex-col md:flex-row gap-10 md:gap-[80px] items-center">
                    <SkeletonBox className="w-full md:w-[45%] aspect-[3/4]" />
                    <div className="flex flex-col gap-5 w-full md:w-[55%]">
                        <SkeletonBox className="h-3 w-24" />
                        <SkeletonBox className="h-12 w-3/4" />
                        <SkeletonBox className="h-3 w-20" />
                        <SkeletonBox className="h-24 w-full mt-2" />
                        <div className="flex gap-3 mt-2">
                            <SkeletonBox className="h-9 w-28" />
                            <SkeletonBox className="h-9 w-28" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Artists grid skeleton */}
            <div className="max-w-[1240px] mx-auto px-6 md:px-[60px] lg:px-[80px] py-16">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <SkeletonArtistCard key={i} />
                    ))}
                </div>
            </div>
        </main>
    );
}
