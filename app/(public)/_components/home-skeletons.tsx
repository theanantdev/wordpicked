"use client";

import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
    return (
        <div className={cn("animate-pulse bg-zinc-200/60 rounded-[2px]", className)} />
    );
}

export function StoryCardSkeleton() {
    return (
        <div className="overflow-hidden border border-zinc-200 bg-[#fdf9f2] flex flex-col">
            <Skeleton className="aspect-[4/3] w-full" />
            <div className="space-y-3 p-5 flex-1">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-3/4" />
                <div className="pt-2">
                    <Skeleton className="h-16 w-full" />
                </div>
                <div className="pt-2 flex gap-4">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-3 w-16" />
                </div>
            </div>
        </div>
    );
}

export function CinemaCardSkeleton() {
    return (
        <div className="bg-[#fdf9f2] p-10 shadow-sm space-y-4">
            <Skeleton className="h-10 w-16" />
            <Skeleton className="h-8 w-full" />
            <div className="pt-4 space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/6" />
            </div>
            <div className="pt-6">
                <Skeleton className="h-4 w-32" />
            </div>
        </div>
    );
}

export function ArtistCardSkeleton() {
    return (
        <div className="text-center space-y-4">
            <Skeleton className="mx-auto aspect-square w-full" />
            <Skeleton className="mx-auto h-8 w-3/4" />
            <div className="space-y-2">
                <Skeleton className="mx-auto h-4 w-full" />
                <Skeleton className="mx-auto h-4 w-5/6" />
            </div>
        </div>
    );
}

export function PickOfDaySkeleton() {
    return (
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_1.9fr] lg:items-start animate-pulse">
            <Skeleton className="aspect-[387/440] w-full" />
            <div className="space-y-8 text-center lg:text-left pt-4">
                <div className="space-y-4">
                    <Skeleton className="mx-auto lg:mx-0 h-3 w-32" />
                    <Skeleton className="mx-auto lg:mx-0 h-4 w-24" />
                    <Skeleton className="mx-auto lg:mx-0 h-12 w-full max-w-xl" />
                    <div className="space-y-2 py-4">
                        <Skeleton className="mx-auto lg:mx-0 h-4 w-full" />
                        <Skeleton className="mx-auto lg:mx-0 h-4 w-5/6" />
                    </div>
                </div>
                <Skeleton className="mx-auto lg:mx-0 h-11 w-40 rounded-full" />
            </div>
        </div>
    );
}
