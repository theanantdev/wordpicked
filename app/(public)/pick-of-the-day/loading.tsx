import { SkeletonBox, SkeletonArticleGrid } from "../_components/skeleton";

export default function PickOfTheDayLoading() {
    return (
        <main className="bg-[#FAFAFA] min-h-screen">
            {/* Hero skeleton — dark bg matching real hero */}
            <section className="relative w-full min-h-[313px] bg-[#0F0F0F] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-[#151515] via-[#202020] to-[#151515] bg-[length:400%_100%] animate-[shimmer_1.4s_ease-in-out_infinite]" />
                <div className="relative z-10 flex min-h-[313px] max-w-[1440px] mx-auto items-center px-6 md:px-20 py-10">
                    <div className="flex flex-col gap-4 max-w-3xl">
                        <SkeletonBox className="h-3 w-36 bg-white/10" />
                        <SkeletonBox className="h-12 w-72 bg-white/10" />
                        <SkeletonBox className="h-5 w-96 bg-white/10" />
                    </div>
                </div>
            </section>

            {/* Featured pick skeleton */}
            <div className="mx-auto mt-14 mb-20 w-full max-w-[1440px] px-6 lg:px-[86px] flex flex-col lg:flex-row items-start gap-10">
                <SkeletonBox className="w-full max-w-[430px] aspect-[4/5] shrink-0" />
                <div className="flex flex-col gap-6 flex-1 pt-4">
                    <SkeletonBox className="h-4 w-28" />
                    <SkeletonBox className="h-10 w-full" />
                    <SkeletonBox className="h-10 w-3/4" />
                    <SkeletonBox className="h-5 w-5/6 mt-2" />
                    <SkeletonBox className="h-5 w-4/5" />
                    <SkeletonBox className="h-12 w-40 mt-4" />
                </div>
            </div>

            {/* Grid skeleton */}
            <div className="mx-auto mb-20 w-full max-w-[1440px] px-6 lg:px-[92px]">
                <SkeletonBox className="h-9 w-40 mb-10" />
                <SkeletonArticleGrid count={6} />
            </div>
        </main>
    );
}
