export function SiteFooter() {
    return (
        <footer className="border-t border-[#a8812a] bg-[#fdf9f2] py-16">
            <div className="mx-auto grid w-full max-w-310 gap-10 px-4 sm:grid-cols-2 md:grid-cols-4 md:px-6">
                <div>
                    <h3 className="font-heading text-4xl text-[#1c1c18]">The Wordpicked</h3>
                    <p className="mt-4 text-sm text-zinc-600">
                        A digital curator for the modern intellectual. Exploring the intersections of literature, film, and the visual arts.
                    </p>
                </div>

                <div>
                    <h4 className="text-sm font-semibold tracking-[0.12em] text-[#11412a] uppercase">Sections</h4>
                    <ul className="mt-4 space-y-2 font-heading text-zinc-600">
                        <li>Literature</li>
                        <li>Films</li>
                        <li>Pick of the Day</li>
                        <li>Artists</li>
                        <li>Newsletter</li>
                    </ul>
                </div>

                <div>
                    <h4 className="text-sm font-semibold tracking-[0.12em] text-[#11412a] uppercase">Journal</h4>
                    <ul className="mt-4 space-y-2 font-heading text-zinc-600">
                        <li>About Us</li>
                        <li>Editorial Policy</li>
                        <li>Sign In</li>
                        <li>Contact</li>
                        <li>Privacy Policy</li>
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
