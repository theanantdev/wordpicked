import { SkeletonHero, SkeletonBox, SkeletonArticleGrid } from "../../_components/skeleton";

export default function FilmArticleLoading() {
    return (
        <main className="w-full bg-[#FDF9F2] min-h-screen">
            {/* Film hero skeleton */}
            <SkeletonHero dark />

            {/* Trailer placeholder */}
            <div className="max-w-[1240px] mx-auto px-6 md:px-[60px] lg:px-[80px] py-10">
                <SkeletonBox className="w-full aspect-video rounded-[2px]" />
            </div>

            {/* Film body skeleton */}
            <div className="max-w-[1240px] mx-auto px-6 md:px-[60px] lg:px-[80px] pb-[80px]">
                <div className="flex flex-col gap-5 max-w-3xl">
                    <SkeletonBox className="h-5 w-full" />
                    <SkeletonBox className="h-5 w-5/6" />
                    <SkeletonBox className="h-5 w-3/4" />
                    <SkeletonBox className="h-5 w-full mt-4" />
                    <SkeletonBox className="h-5 w-5/6" />
                    <SkeletonBox className="h-5 w-full" />
                </div>

                {/* Related section */}
                <div className="mt-16">
                    <SkeletonBox className="h-8 w-40 mb-8" />
                    <SkeletonArticleGrid count={3} />
                </div>
            </div>
        </main>
    );
}
