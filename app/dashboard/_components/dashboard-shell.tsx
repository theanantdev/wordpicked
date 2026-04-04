"use client";

import { useState } from "react";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";

export function DashboardShell({ children }: { children: React.ReactNode }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className="flex h-[100dvh] overflow-hidden bg-[#F5F0E8] text-[#1A1714] font-sans text-[14px] leading-[1.6]">

            {/* Desktop Sidebar */}
            <div className="hidden md:block shrink-0">
                <Sidebar />
            </div>

            {/* Mobile Sidebar Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 z-40 bg-[rgba(26,23,20,0.6)] md:hidden backdrop-blur-[2px]"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Mobile Sidebar Sheet */}
            <div
                className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] md:hidden flex ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                <div className="w-[240px] h-full shadow-2xl">
                    <Sidebar onLinkClick={() => setIsMobileMenuOpen(false)} />
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden w-full min-w-0">
                <Topbar onMenuClick={() => setIsMobileMenuOpen(true)} />
                <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
                    {children}
                </main>
            </div>

        </div>
    );
}
