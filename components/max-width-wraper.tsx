"use client";

import { cn } from "@/lib/utils";
export default function MaxWidthWrapper({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <div className={cn("mx-auto w-full max-w-310 px-1 ", "min-[370px]:max-w-100", "min-[480px]:max-w-120", "min-[425px]:max-w-140", "min-[640px]:max-w-160", "min-[768px]:max-w-3xl", "min-[1024px]:max-w-5xl", "min-[1200px]:max-w-300", "min-[1440px]:max-w-360", "min-[1920px]:max-w-420", "p-2", className)}>
            {children}
        </div>
    );
}