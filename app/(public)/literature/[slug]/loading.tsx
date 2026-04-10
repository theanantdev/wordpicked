import { SkeletonHero, SkeletonBox } from "../../_components/skeleton";

export default function ArticleLoading() {
    return (
        <main className="w-full bg-[#FDF9F2] min-h-screen">
            {/* Article hero skeleton */}
            <SkeletonHero dark />

            {/* Article body + sidebar skeleton */}
            <div className="max-w-[1240px] mx-auto px-6 md:px-[60px] lg:px-[80px] py-[60px] md:py-[80px]">
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-16 xl:gap-[100px]">
                    {/* Body */}
                    <div className="flex flex-col gap-6">
                        <SkeletonBox className="h-5 w-full" />
                        <SkeletonBox className="h-5 w-5/6" />
                        <SkeletonBox className="h-5 w-full" />
                        <SkeletonBox className="h-5 w-4/6" />
                        <SkeletonBox className="h-5 w-full mt-4" />
                        <SkeletonBox className="h-5 w-5/6" />
                        <SkeletonBox className="h-5 w-3/4" />
                        <SkeletonBox className="h-5 w-full mt-4" />
                        <SkeletonBox className="h-5 w-5/6" />
                        <SkeletonBox className="h-5 w-full" />
                        <SkeletonBox className="h-64 w-full mt-6" />
                        <SkeletonBox className="h-5 w-full mt-4" />
                        <SkeletonBox className="h-5 w-4/5" />
                        <SkeletonBox className="h-5 w-5/6" />
                    </div>
                    {/* Sidebar */}
                    <div className="hidden lg:flex flex-col gap-6">
                        <SkeletonBox className="h-8 w-32" />
                        <SkeletonBox className="h-40 w-full" />
                        <SkeletonBox className="h-8 w-24" />
                        <SkeletonBox className="h-24 w-full" />
                        <SkeletonBox className="h-24 w-full" />
                    </div>
                </div>
            </div>
        </main>
    );
}
