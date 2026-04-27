"use client";

import Link from "next/link";
import { LayoutDashboard, FileText, PenLine, Users, Settings, X, Star, MessageSquare, Mail, type LucideIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { logoutUser } from "@/app/account/v1/auth/login/actions";
import type { AuthSession } from "@/utils/auth-session";

interface SidebarProps {
    onLinkClick?: () => void;
    session?: AuthSession | null;
}

type NavItem = {
    name: string;
    href: string;
    icon: LucideIcon;
    badge?: string;
};

export function Sidebar({ onLinkClick, session }: SidebarProps) {
    const pathname = usePathname();
    const isAdmin = session?.isAdmin === true || session?.is_admin === true;

    const navItems: Array<{ label: string; items: NavItem[] }> = [
        { label: "Overview", items: [{ name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard }] },
        {
            label: "Content",
            items: [
                { name: "Literature", href: "/admin/literature", icon: FileText },
                { name: "Films", href: "/admin/films", icon: PenLine },
                { name: "Artists", href: "/admin/artists", icon: Users },
                { name: "Home Hero", href: "/admin/hero", icon: Star },
                { name: "Pick of the Day", href: "/admin/pick-of-the-day", icon: Star },
                { name: "Newsletter", href: "/admin/newsletter", icon: Mail },
                { name: "Contact", href: "/admin/contact", icon: Mail },
                { name: "Comments", href: "/admin/comments", icon: MessageSquare },
            ]
        },
    ];

    if (isAdmin) {
        navItems.push({
            label: "Management",
            items: [
                { name: "Users", href: "/admin/users", icon: Users },
                // { name: "Google Ads", href: "/admin/ads", icon: Settings },
                // { name: "Settings", href: "/admin/settings", icon: Settings },
            ],
        });
    }

    return (
        <aside className="flex flex-col w-60 shrink-0 h-dvh overflow-y-auto bg-[#1A1714] text-[#F5F0E8] shadow-xl md:shadow-none relative">

            {/* Mobile Close Button */}
            {onLinkClick && (
                <button
                    onClick={onLinkClick}
                    className="md:hidden absolute top-6.5 right-4 text-[#F5F0E8]/50 hover:text-[#F5F0E8] transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>
            )}

            {/* Brand */}
            <div className="px-6 pt-7 pb-5 border-b border-white/10">
                <div className="font-heading text-[17px] font-bold tracking-[0.01em] text-[#F5F0E8]">
                    The <em className="italic text-[#C9A24E] font-normal">Word</em>picked
                </div>
                <div className="text-[10px] tracking-widest uppercase text-[#F5F0E8]/30 mt-1">
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
                                    <Icon className={`w-3.75 h-3.75 shrink-0 ${isActive ? 'opacity-100' : 'opacity-70'}`} />
                                    {item.name}
                                    {item.badge && (
                                        <span className="ml-auto bg-[#B5542A] text-white text-[9px] font-semibold px-1.75 py-0.5 rounded-full">
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
                        {(session?.name?.[0] || "A").toUpperCase()}
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[12px] font-medium text-[#F5F0E8]/75">{session?.name || "Admin User"}</span>
                        <span className="text-[10px] text-[#F5F0E8]/30 tracking-[0.04em] uppercase">{isAdmin ? "Admin" : "Staff"}</span>
                    </div>
                </div>
                <form action={logoutUser} className="mt-4">
                    <button
                        type="submit"
                        className="w-full rounded-xs border border-white/10 bg-white/5 px-3 py-2 text-[11px] font-medium uppercase tracking-[0.08em] text-[#F5F0E8] transition-colors hover:bg-white/10"
                    >
                        Logout
                    </button>
                </form>
            </div>
        </aside>
    );
}
