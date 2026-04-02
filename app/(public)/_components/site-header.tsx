import { Menu, Search } from "lucide-react";
import Link from "next/link";

export function SiteHeader() {
    const navLinks = [
        { name: "Home", href: "/" },
        { name: "Literature", href: "/literature" },
        { name: "Films", href: "/films" },
        { name: "Pick Of The Day", href: "/pick-of-the-day" },
        { name: "Artists", href: "/artists" },
        { name: "About", href: "/about" },
    ]
    return (
        <header className="sticky top-0 z-30 border-b border-zinc-800 bg-[#141210]/95 backdrop-blur">
            <div className="mx-auto flex h-17.25 w-full max-w-310 items-center justify-between px-4 md:px-6">
                <p className="font-heading text-2xl text-[#f5f0e8]">The Wordpicked</p>
                <nav className="hidden items-center gap-8 md:flex">
                    {navLinks.map((link) => (
                        <Link key={link.name} href={link.href} className="text-sm font-medium text-[#f5f0e8] hover:text-[#e0bc78] transition">
                            {link.name}
                        </Link>
                    ))}
                </nav>
                <div>
                    <Menu className="size-5 text-white md:hidden" />
                </div>
                <div className="hidden items-center gap-3 md:flex">
                    <Search className="size-4 text-white" />
                    <button className="border border-white/20 px-4 py-2 text-[11px] tracking-[0.12em] text-[#f5f0e8b2] uppercase">
                        Log In
                    </button>
                    <button className="bg-[#e0bc78] px-4 py-2 text-[11px] font-medium tracking-[0.12em] text-[#141210] uppercase">
                        Join Free
                    </button>
                </div>
            </div>
        </header>
    );
}
