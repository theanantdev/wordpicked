"use client";

import { cn } from "@/lib/utils";

interface TabFilterProps {
    activeTab: "recent" | "popular";
    onChange: (tab: "recent" | "popular") => void;
    className?: string;
}

export function TabFilter({ activeTab, onChange, className }: TabFilterProps) {
    return (
        <div className={cn("inline-flex bg-zinc-200/50 p-[2px] rounded-[4px] gap-[2px]", className)}>
            {[
                { label: "Most Recent", value: "recent" },
                { label: "Most Popular", value: "popular" }
            ].map((tab) => (
                <button
                    key={tab.value}
                    onClick={() => onChange(tab.value as "recent" | "popular")}
                    className={cn(
                        "px-4 py-1.5 text-[11px] font-semibold tracking-[0.08em] uppercase rounded-[2px] transition-all duration-200",
                        activeTab === tab.value 
                            ? "bg-white text-[#DC2828] shadow-sm scale-[1.02]" 
                            : "text-zinc-500 hover:text-zinc-800"
                    )}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
}
