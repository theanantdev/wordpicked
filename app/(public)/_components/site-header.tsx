"use client";

import { X } from "lucide-react";
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
        { name: "Pick Of The Day", href: "/pick-of-the-day" },
        { name: "Literature", href: "/literature" },
        { name: "Films", href: "/films" },
        { name: "Artists", href: "/artists" },
        { name: "About", href: "/about" },
    ];

    return (
        <header className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-[#141210]">
            <div className="relative mx-auto flex h-10 w-full max-w-[320px] items-center justify-between px-3 min-[360px]:max-w-90 min-[360px]:px-1 min-[480px]:max-w-120 min-[480px]:px-3 min-[640px]:max-w-160 min-[640px]:px-5 min-[768px]:max-w-3xl min-[768px]:h-18 min-[768px]:px-6 min-[1024px]:max-w-5xl min-[1024px]:h-[55px] min-[1024px]:px-8 min-[1200px]:max-w-300 min-[1200px]:px-10 min-[1440px]:max-w-360 min-[1920px]:max-w-580 ">

                {/* Desktop Logo */}
                <Link href="/" className="font-heading text-[26px] font-semibold -mt-1 tracking-[0.26px] text-[#f5f0e8]">
                    <Image
                        src="/logo.png"
                        alt="Logo"
                        width={96}
                        height={96}
                        className="h-7.5 w-auto min-[360px]:h-10 min-[480px]:h-10 min-[640px]:h-11 min-[768px]:h-12 min-[1024px]:h-14"
                    />
                </Link>

                {/* Desktop Navigation */}
                <div className="flex items-center justify-center gap-3 min-[360px]:gap-4 min-[640px]:gap-5 min-[768px]:gap-6 min-[1024px]:gap-8">
                    <GlobalSearch />

                    <nav className="hidden items-center gap-4 min-[1024px]:flex min-[1200px]:gap-6 min-[1440px]:gap-8">
                        {navLinks.map((link) => {
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className={`font-heading text-[13px] font-medium tracking-[0.5px] transition-colors hover:text-[#e0bc78] min-[1200px]:text-sm ${isActive ? "text-[#e0bc78]" : "text-[#f5f0e8]"}`}
                                >
                                    {link.name}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* Mobile Menu Toggle */}
                <div className="min-[1024px]:hidden">
                    <button aria-label="Open menu" onClick={() => setIsMenuOpen(true)}>
                        <svg width="27" height="18" viewBox="0 0 27 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1.45834 17.5C1.04514 17.5 0.699033 17.36 0.420005 17.08C0.140977 16.8 0.000977251 16.4539 5.02873e-06 16.0417C-0.000967194 15.6294 0.139033 15.2833 0.420005 15.0033C0.700977 14.7233 1.04709 14.5833 1.45834 14.5833H24.7917C25.2049 14.5833 25.5515 14.7233 25.8315 15.0033C26.1115 15.2833 26.251 15.6294 26.25 16.0417C26.249 16.4539 26.109 16.8005 25.83 17.0815C25.551 17.3624 25.2049 17.5019 24.7917 17.5H1.45834ZM1.45834 10.2083C1.04514 10.2083 0.699033 10.0683 0.420005 9.78833C0.140977 9.50833 0.000977251 9.16222 5.02873e-06 8.75C-0.000967194 8.33778 0.139033 7.99167 0.420005 7.71167C0.700977 7.43167 1.04709 7.29167 1.45834 7.29167H24.7917C25.2049 7.29167 25.5515 7.43167 25.8315 7.71167C26.1115 7.99167 26.251 8.33778 26.25 8.75C26.249 9.16222 26.109 9.50882 25.83 9.78979C25.551 10.0708 25.2049 10.2103 24.7917 10.2083H1.45834ZM1.45834 2.91667C1.04514 2.91667 0.699033 2.77667 0.420005 2.49667C0.140977 2.21667 0.000977251 1.87056 5.02873e-06 1.45833C-0.000967194 1.04611 0.139033 0.7 0.420005 0.42C0.700977 0.14 1.04709 0 1.45834 0H24.7917C25.2049 0 25.5515 0.14 25.8315 0.42C26.1115 0.7 26.251 1.04611 26.25 1.45833C26.249 1.87056 26.109 2.21715 25.83 2.49812C25.551 2.7791 25.2049 2.91861 24.7917 2.91667H1.45834Z" fill="white" />
                        </svg>
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
                <div className="absolute left-0 top-0 z-50 flex min-h-90 w-full flex-col items-center overflow-y-auto border-b border-zinc-800 bg-[#141210] shadow-2xl animate-in slide-in-from-top-2 duration-200 min-[1024px]:hidden">
                    <div className="relative flex flex-col  h-16 w-full items-start justify-start px-4">
                        {/* Centered Mobile Logo */}
                        <Link href="/" onClick={() => setIsMenuOpen(false)} className="font-heading text-[26px] font-semibold tracking-[0.26px] text-[#f5f0e8]">
                            <Image src="/logo.png" alt="Logo" width={88} height={88} className="h-10" />
                        </Link>

                        {/* Close button positioned strictly matching Vector layout */}
                        <button aria-label="Close menu" onClick={() => setIsMenuOpen(false)} className="absolute right-4 top-1/2 -translate-y-1/2">
                            <X className="size-7 text-white" strokeWidth={1} />
                        </button>
                    </div>

                    {/* Centered Links exactly 18px apart */}
                    <nav className="flex w-full flex-col items-start gap-4.5 px-1pb-8 px-5">
                        {navLinks.map((link) => {
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    onClick={() => setIsMenuOpen(false)}
                                    className={`font-heading text-[18px] capitalize leading-6 tracking-[1px] transition-colors ${isActive ? "text-[#E0BC78]" : "text-white"}`}
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
