"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Search, Bell, Plus, Menu, LogOut } from "lucide-react";
import Link from "next/link";
import { logoutUser } from "@/app/account/v1/auth/login/actions";
import type { AuthSession } from "@/utils/auth-session";

interface TopbarProps {
    onMenuClick?: () => void;
    session?: AuthSession | null;
}

export function Topbar({ onMenuClick, session }: TopbarProps) {
    const pathname = usePathname();
    const isAdmin = session?.isAdmin === true || session?.is_admin === true;
    const [isCreateMenuOpen, setIsCreateMenuOpen] = useState(false);
    const createMenuRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        function handleOutsideClick(event: MouseEvent) {
            if (!createMenuRef.current) return;
            const target = event.target as Node;
            if (!createMenuRef.current.contains(target)) {
                setIsCreateMenuOpen(false);
            }
        }

        document.addEventListener("mousedown", handleOutsideClick);
        return () => document.removeEventListener("mousedown", handleOutsideClick);
    }, []);

    // Mapping pathnames to titles
    const titleMap: Record<string, React.ReactNode> = {
        "/admin/dashboard": <>Dashboard <span className="italic text-[#B5542A] font-normal hidden sm:inline">Overview</span></>,
        "/admin/literature": <>Literature <span className="italic text-[#B5542A] font-normal hidden sm:inline">Manage Content</span></>,
        "/admin/films": <>Films <span className="italic text-[#B5542A] font-normal hidden sm:inline">Manage Content</span></>,
        "/admin/artists": <>Artists <span className="italic text-[#B5542A] font-normal hidden sm:inline">Profiles</span></>,
    }

    const title = titleMap[pathname] || <>Admin <span className="italic text-[#B5542A] font-normal hidden sm:inline">Panel</span></>;

    return (
        <header className="h-15 bg-white border-b border-[#DDD7CC] shrink-0 flex items-center px-4 md:px-8 gap-3 md:gap-4 justify-between w-full">

            <div className="flex items-center gap-3">
                <button
                    onClick={onMenuClick}
                    className="md:hidden flex items-center justify-center p-1.5 text-[#1A1714] hover:bg-[#EDE7D9] rounded-xs transition-colors"
                >
                    <Menu className="w-4.5 h-4.5" />
                </button>

                <h1 className="font-heading text-[18px] md:text-[20px] font-bold text-[#1A1714] tracking-[-0.01em] flex-1 line-clamp-1">
                    {title}
                </h1>
            </div>

            <div className="flex items-center gap-2 md:gap-4 ml-auto">
                <div className="hidden md:flex items-center gap-2 bg-[#F5F0E8] border border-[#DDD7CC] rounded-xs px-3.5 py-2 w-55">
                    <Search className="w-3.25 h-3.25 text-[#8C857C] shrink-0" />
                    <input
                        type="text"
                        placeholder="Search posts, artists…"
                        className="bg-transparent border-none outline-none text-[12.5px] text-[#1A1714] w-full placeholder:text-[#8C857C]"
                    />
                </div>

                <button className="relative w-9 h-9 shrink-0 flex items-center justify-center border border-[#DDD7CC] rounded-xs cursor-pointer transition-colors hover:bg-[#EDE7D9]">
                    <Bell className="w-3.75 h-3.75 text-[#8C857C]" />
                    <div className="absolute top-2 right-2 w-1.75 h-1.75 bg-[#B5542A] rounded-full" />
                </button>

                <div ref={createMenuRef} className="relative hidden sm:block">
                    <button
                        type="button"
                        onClick={() => setIsCreateMenuOpen((prev) => !prev)}
                        className="flex shrink-0 items-center gap-1.5 bg-[#B5542A] text-white text-[11px] font-medium tracking-[0.08em] uppercase px-4.5 py-2.25 rounded-xs transition-colors hover:bg-[#C96840]"
                    >
                        <Plus className="w-3.25 h-3.25" />

                    </button>

                    {isCreateMenuOpen && (
                        <div className="absolute right-0 mt-2 w-46 bg-white border border-[#DDD7CC] shadow-lg rounded-xs overflow-hidden z-50">
                            <Link
                                href="/admin/literature/add?category=literature"
                                onClick={() => setIsCreateMenuOpen(false)}
                                className="block px-4 py-2.5 text-[12px] font-medium text-[#1A1714] hover:bg-[#F5F0E8]"
                            >
                                Add Literature
                            </Link>
                            <Link
                                href="/admin/films/add?category=films"
                                onClick={() => setIsCreateMenuOpen(false)}
                                className="block px-4 py-2.5 text-[12px] font-medium text-[#1A1714] hover:bg-[#F5F0E8]"
                            >
                                Add Films
                            </Link>
                            <Link
                                href="/admin/artists/add?category=artists"
                                onClick={() => setIsCreateMenuOpen(false)}
                                className="block px-4 py-2.5 text-[12px] font-medium text-[#1A1714] hover:bg-[#F5F0E8]"
                            >
                                Add Artists
                            </Link>
                        </div>
                    )}
                </div>

                <div className="hidden lg:flex items-center rounded-xs border border-[#DDD7CC] bg-[#F5F0E8] px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#1A1714]">
                    {isAdmin ? "Admin" : "Staff"}
                </div>

                <form action={logoutUser}>
                    <button
                        type="submit"
                        className="hidden sm:flex shrink-0 items-center gap-1.5 border border-[#DDD7CC] bg-white px-4.5 py-2.25 text-[11px] font-medium tracking-[0.08em] uppercase text-[#1A1714] rounded-xs transition-colors hover:bg-[#EDE7D9]"
                    >
                        <LogOut className="w-3.25 h-3.25" />
                        Logout
                    </button>
                </form>
            </div>
        </header>
    );
}
