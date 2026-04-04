"use client";

import Link from "next/link";
import { LayoutDashboard, FileText, PenLine, Users, Calendar, Settings, Bell, Search, CirclePlus, X } from "lucide-react";
import { usePathname } from "next/navigation";

interface SidebarProps {
    onLinkClick?: () => void;
}

export function Sidebar({ onLinkClick }: SidebarProps) {
    const pathname = usePathname();

    const navItems = [
        { label: "Overview", items: [{ name: "Dashboard", href: "/dashboard", icon: LayoutDashboard }] },
        {
            label: "Content",
            items: [
                { name: "All Posts", href: "/dashboard/posts", icon: FileText, badge: "47" },
                { name: "New Post", href: "/dashboard/new-post", icon: PenLine },
                { name: "Artists", href: "/dashboard/artists", icon: Users },
                { name: "Pick Scheduler", href: "/dashboard/scheduler", icon: Calendar, badge: "3" },
            ]
        },
        {
            label: "Settings",
            items: [
                { name: "Google Ads", href: "/dashboard/ads", icon: Settings },
                { name: "Settings", href: "/dashboard/settings", icon: Settings },
            ]
        }
    ];

    return (
        <aside className="flex flex-col w-[240px] shrink-0 h-[100dvh] overflow-y-auto bg-[#1A1714] text-[#F5F0E8] shadow-xl md:shadow-none relative">

            {/* Mobile Close Button */}
            {onLinkClick && (
                <button
                    onClick={onLinkClick}
                    className="md:hidden absolute top-[26px] right-4 text-[#F5F0E8]/50 hover:text-[#F5F0E8] transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>
            )}

            {/* Brand */}
            <div className="px-6 pt-7 pb-5 border-b border-white/10">
                <div className="font-heading text-[17px] font-bold tracking-[0.01em] text-[#F5F0E8]">
                    The <em className="italic text-[#C9A24E] font-normal">Word</em>picked
                </div>
                <div className="text-[10px] tracking-[0.1em] uppercase text-[#F5F0E8]/30 mt-1">
                    Admin Panel
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-4">
                {navItems.map((section, idx) => (
                    <div key={idx} className="pb-2">
                        <div className="text-[9px] tracking-[0.16em] uppercase text-[#F5F0E8]/25 px-6 pb-2 pt-4">
                            {section.label}
                        </div>
                        {section.items.map((item) => {
                            const isActive = pathname === item.href;
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={onLinkClick}
                                    className={`flex items-center gap-2.5 px-6 py-2.5 text-[12.5px] font-medium border-l-2 transition-colors relative ${isActive ? 'text-[#F5F0E8] bg-white/5 border-[#B5542A]' : 'text-[#F5F0E8]/55 border-transparent hover:text-[#F5F0E8] hover:bg-white/5'}`}
                                >
                                    <Icon className={`w-[15px] h-[15px] shrink-0 ${isActive ? 'opacity-100' : 'opacity-70'}`} />
                                    {item.name}
                                    {item.badge && (
                                        <span className="ml-auto bg-[#B5542A] text-white text-[9px] font-semibold px-[7px] py-[2px] rounded-full">
                                            {item.badge}
                                        </span>
                                    )}
                                </Link>
                            );
                        })}
                    </div>
                ))}
            </nav>

            {/* Footer Profile */}
            <div className="mt-auto px-6 py-4 border-t border-white/10">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-[#243D2C] flex items-center justify-center font-heading font-bold text-[13px] text-[#F5F0E8] shrink-0">
                        A
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[12px] font-medium text-[#F5F0E8]/75">Admin User</span>
                        <span className="text-[10px] text-[#F5F0E8]/30 tracking-[0.04em] uppercase">Editor</span>
                    </div>
                </div>
            </div>
        </aside>
    );
}
