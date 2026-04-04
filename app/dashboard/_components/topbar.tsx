"use client";

import { usePathname } from "next/navigation";
import { Search, Bell, Plus, Menu } from "lucide-react";
import Link from "next/link";

interface TopbarProps {
    onMenuClick?: () => void;
}

export function Topbar({ onMenuClick }: TopbarProps) {
    const pathname = usePathname();

    // Mapping pathnames to titles
    const titleMap: Record<string, React.ReactNode> = {
        "/dashboard": <>Dashboard <span className="italic text-[#B5542A] font-normal hidden sm:inline">Overview</span></>,
        "/dashboard/posts": <>All Posts <span className="italic text-[#B5542A] font-normal hidden sm:inline">Manage Content</span></>,
        "/dashboard/new-post": <>New Post <span className="italic text-[#B5542A] font-normal hidden sm:inline">Editor</span></>,
        "/dashboard/artists": <>Artists <span className="italic text-[#B5542A] font-normal hidden sm:inline">Profiles</span></>,
        "/dashboard/scheduler": <>Scheduler <span className="italic text-[#B5542A] font-normal hidden sm:inline">Calendar</span></>,
    }

    const title = titleMap[pathname] || <>Admin <span className="italic text-[#B5542A] font-normal hidden sm:inline">Panel</span></>;

    return (
        <header className="h-[60px] bg-white border-b border-[#DDD7CC] shrink-0 flex items-center px-4 md:px-8 gap-3 md:gap-4 justify-between w-full">

            <div className="flex items-center gap-3">
                <button
                    onClick={onMenuClick}
                    className="md:hidden flex items-center justify-center p-1.5 text-[#1A1714] hover:bg-[#EDE7D9] rounded-[2px] transition-colors"
                >
                    <Menu className="w-[18px] h-[18px]" />
                </button>

                <h1 className="font-heading text-[18px] md:text-[20px] font-bold text-[#1A1714] tracking-[-0.01em] flex-1 line-clamp-1">
                    {title}
                </h1>
            </div>

            <div className="flex items-center gap-2 md:gap-4 ml-auto">
                <div className="hidden md:flex items-center gap-2 bg-[#F5F0E8] border border-[#DDD7CC] rounded-[2px] px-3.5 py-2 w-[220px]">
                    <Search className="w-[13px] h-[13px] text-[#8C857C] shrink-0" />
                    <input
                        type="text"
                        placeholder="Search posts, artists…"
                        className="bg-transparent border-none outline-none text-[12.5px] text-[#1A1714] w-full placeholder:text-[#8C857C]"
                    />
                </div>

                <button className="relative w-9 h-9 shrink-0 flex items-center justify-center border border-[#DDD7CC] rounded-[2px] cursor-pointer transition-colors hover:bg-[#EDE7D9]">
                    <Bell className="w-[15px] h-[15px] text-[#8C857C]" />
                    <div className="absolute top-2 right-2 w-[7px] h-[7px] bg-[#B5542A] rounded-full" />
                </button>

                <Link href="/dashboard/new-post" className="hidden sm:flex shrink-0 items-center gap-1.5 bg-[#B5542A] text-white text-[11px] font-medium tracking-[0.08em] uppercase px-4.5 py-[9px] rounded-[2px] transition-colors hover:bg-[#C96840]">
                    <Plus className="w-[13px] h-[13px]" />
                    New Post
                </Link>
            </div>
        </header>
    );
}
