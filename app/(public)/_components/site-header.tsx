import { Search } from "lucide-react";

export function SiteHeader() {
    return (
        <header className="sticky top-0 z-30 border-b border-zinc-800 bg-[#141210]/95 backdrop-blur">
            <div className="mx-auto flex h-17.25 w-full max-w-310 items-center justify-between px-4 md:px-6">
                <p className="font-heading text-2xl text-[#f5f0e8]">The Wordpicked</p>
                <nav className="hidden items-center gap-8 md:flex">
                    {["Home", "Literature", "Films", "Pick Of The Day", "Artists", "About"].map((item) => (
                        <a
                            key={item}
                            className={`font-heading text-base tracking-wide ${item === "Home" ? "text-[#e0bc78]" : "text-white"}`}
                            href="#"
                        >
                            {item}
                        </a>
                    ))}
                </nav>
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
