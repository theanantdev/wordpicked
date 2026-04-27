import MaxWidthWrapper from "@/components/max-width-wraper";
import Image from "next/image";
import Link from "next/link";
export function SiteFooter() {
    return (
        <footer className="border-t border-[#a8812a] bg-[#fdf9f2]">
            <MaxWidthWrapper className="px-2 py-5 min-[360px]:px-4 min-[360px]:py-2 min-[480px]:px-5 min-[640px]:py-4 min-[768px]:px-6 min-[768px]:py-6 min-[1024px]:px-8 min-[1024px]:py-8 min-[1200px]:px-10 min-[1200px]:py-10 min-[1440px]:py-5 min-[1920px]:py-8">
                <div className="mx-auto grid w-full gap-10 sm:grid-cols-2 md:grid-cols-4">
                    <div>
                        <div>
                            <Image loading="lazy" src="/logo.png" alt="Logo" width={100} height={100} style={{ width: 'auto', height: 'auto' }} />
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
                <div className="mx-auto w-full pt-6 text-center text-sm text-zinc-500 border-t border-zinc-200 mt-5 sm:text-left">
                    © 2026 The Wordpicked. The Digital Curator. All rights reserved.
                </div>
            </MaxWidthWrapper>
        </footer>
    );
}
