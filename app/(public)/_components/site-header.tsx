"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { GlobalSearch } from "./global-search";

export function SiteHeader() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const pathname = usePathname();

    const navLinks = [
        { name: "Home", href: "/" },
        { name: "Literature", href: "/literature" },
        { name: "Films", href: "/films" },
        { name: "Pick Of The Day", href: "/pick-of-the-day" },
        { name: "Artists", href: "/artists" },
        { name: "About", href: "/about" },
    ];

    return (
        <header className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-[#141210]">
            <div className="mx-auto flex h-[70px] w-full max-w-[1240px] items-center justify-between px-4 md:px-6 relative">

                {/* Desktop Logo */}
                <Link href="/" className="font-heading text-[26px] font-semibold text-[#f5f0e8] tracking-[0.26px]">
                    <Image src="/logo.png" alt="Logo" width={80} height={80} style={{ width: 'auto', height: 'auto' }} />
                </Link>

                {/* Desktop Navigation */}
                <div className="flex items-center gap-6 justify-between">
                    <GlobalSearch />

                    <nav className="hidden items-center gap-8 md:flex">
                        {navLinks.map((link) => {
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className={`text-sm font-medium tracking-[0.5px] font-heading transition-colors hover:text-[#e0bc78] ${isActive ? "text-[#e0bc78]" : "text-[#f5f0e8]"}`}
                                >
                                    {link.name}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* Mobile Menu Toggle */}
                <div className="md:hidden">
                    <button onClick={() => setIsMenuOpen(true)}>
                        <Menu className="size-[28px] text-white" strokeWidth={1.5} />
                    </button>
                </div>

                {/* Desktop Actions */}
                {/* <div className="hidden items-center gap-4 md:flex">
                    <button className="text-white hover:text-[#e0bc78] transition-colors">
                        <Search className="size-[18px]" strokeWidth={2} />
                    </button>
                    <div className="w-[1px] h-4 bg-zinc-700 mx-1"></div>
                    <Link href="/login" className="px-3 py-2 text-[11px] font-semibold tracking-[0.12em] text-[#f5f0e8] uppercase hover:text-[#e0bc78] transition-colors">
                        Log In
                    </Link>
                    <Link href="/register" className="bg-[#e0bc78] px-5 py-2.5 text-[11px] font-bold tracking-[0.12em] text-[#141210] uppercase rounded-[2px] hover:bg-white transition-colors">
                        Join Free
                    </Link> 
                </div>*/}
            </div>

            {/* Mobile Dropdown Menu Formatted to Spec */}
            {isMenuOpen && (
                <div className="absolute top-0 left-0 w-full h-[362px] bg-[#141210] flex flex-col items-center z-50 md:hidden shadow-2xl animate-in slide-in-from-top-2 duration-200 border-b border-zinc-800">
                    <div className="flex justify-center items-center w-full h-[70px] relative">
                        {/* Centered Mobile Logo */}
                        <Link href="/" onClick={() => setIsMenuOpen(false)} className="font-heading text-[26px] font-semibold text-[#f5f0e8] tracking-[0.26px]">
                            The <span className="italic text-[#E0BC78]">Word</span>picked
                        </Link>

                        {/* Close button positioned strictly matching Vector layout */}
                        <button onClick={() => setIsMenuOpen(false)} className="absolute right-4 top-1/2 -translate-y-1/2">
                            <X className="size-[28px] text-white" strokeWidth={1} />
                        </button>
                    </div>

                    {/* Centered Links exactly 18px apart */}
                    <nav className="flex flex-col items-start gap-[18px] mt-[16px]">
                        {navLinks.map((link) => {
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    onClick={() => setIsMenuOpen(false)}
                                    className={`font-heading text-[18px] capitalize tracking-[1px] leading-[24px] transition-colors ${isActive ? "text-[#E0BC78]" : "text-white"
                                        }`}
                                >
                                    {link.name}
                                </Link>
                            );
                        })}
                    </nav>
                </div>
            )}
        </header>
    );
}
