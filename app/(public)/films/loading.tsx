import { SkeletonHero, SkeletonArticleGrid, SkeletonBox } from "../_components/skeleton";

export default function FilmsLoading() {
    return (
        <main className="bg-[#FAFAFA] min-h-screen">
            {/* Hero skeleton */}
            <SkeletonHero dark />

            {/* Filter bar skeleton */}
            <div className="max-w-[1240px] mx-auto px-6 md:px-[60px] lg:px-[80px] pt-10 pb-4 flex flex-wrap items-center gap-3">
                {[1, 2, 3, 4, 5].map((i) => (
                    <SkeletonBox key={i} className="h-8 w-20 rounded-full" />
                ))}
                <SkeletonBox className="h-8 w-40 ml-auto" />
            </div>

            {/* Grid skeleton */}
            <div className="max-w-[1240px] mx-auto px-6 md:px-[60px] lg:px-[80px] py-8">
                <SkeletonArticleGrid count={9} />
            </div>
        </main>
    );
}
