import Image from "next/image";
import Link from "next/link";
export function SiteFooter() {
    return (
        <footer className="border-t border-[#a8812a] bg-[#fdf9f2] py-16">
            <div className="mx-auto grid w-full max-w-310 gap-10 px-4 sm:grid-cols-2 md:grid-cols-4 md:px-6">
                <div>
                    <div>
                        <Image src="/logo.png" alt="Logo" width={100} height={100} style={{ width: 'auto', height: 'auto' }} />
                    </div>
                    <p className="mt-4 text-sm text-zinc-600">
                        A digital curator for the modern intellectual. Exploring the intersections of literature, film, and the visual arts.
                    </p>
                </div>

                <div>
                    <h4 className="text-sm font-semibold tracking-[0.12em] text-[#11412a] uppercase">Sections</h4>
                    <ul className="mt-4 space-y-2 font-heading text-zinc-600">
                        <li><Link href="/literature" className="hover:text-[#a8812a] transition-colors">Literature</Link></li>
                        <li><Link href="/films" className="hover:text-[#a8812a] transition-colors">Films</Link></li>
                        <li><Link href="/pick-of-the-day" className="hover:text-[#a8812a] transition-colors">Pick of the Day</Link></li>
                        <li><Link href="/artists" className="hover:text-[#a8812a] transition-colors">Artists</Link></li>
                        <li><Link href="/#newsletter" className="hover:text-[#a8812a] transition-colors">Newsletter</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="text-sm font-semibold tracking-[0.12em] text-[#11412a] uppercase">Journal</h4>
                    <ul className="mt-4 space-y-2 font-heading text-zinc-600">
                        <li><Link href="/about" className="hover:text-[#a8812a] transition-colors">About Us</Link></li>
                        <li><Link href="/terms" className="hover:text-[#a8812a] transition-colors">Terms of Service</Link></li>
                        <li><Link href="/login" className="hover:text-[#a8812a] transition-colors">Sign In</Link></li>
                        <li><Link href="/contact" className="hover:text-[#a8812a] transition-colors">Contact</Link></li>
                        <li><Link href="/privacy" className="hover:text-[#a8812a] transition-colors">Privacy Policy</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="text-sm font-semibold tracking-[0.12em] text-[#11412a] uppercase">Connect</h4>
                    <ul className="mt-4 space-y-2 font-heading text-zinc-600">
                        <li>Instagram</li>
                        <li>Threads</li>
                        <li>LinkedIn</li>
                    </ul>
                </div>
            </div>
            <div className="mx-auto mt-12 w-full max-w-310 border-t border-zinc-200 px-4 pt-6 text-center text-sm text-zinc-500 md:px-6 md:text-left">
                © 2026 The Wordpicked. The Digital Curator. All rights reserved.
            </div>
        </footer>
    );
}
