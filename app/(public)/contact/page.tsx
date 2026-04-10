import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Contact Us',
    description: 'Get in touch with the Wordpicked editorial team for inquiries, submissions, or support.',
};

export default function ContactPage() {
    return (
        <main className="w-full bg-[#FAFAFA] min-h-screen">
            <div className="max-w-[1240px] mx-auto px-6 md:px-[60px] lg:px-[80px] py-[80px] md:py-[120px]">
                <div className="max-w-2xl mx-auto">
                    <h1 className="font-playfair text-4xl md:text-5xl text-[#141210] mb-4 text-center">
                        Contact Us
                    </h1>
                    <p className="text-zinc-600 font-sans leading-relaxed mb-12 text-center text-lg">
                        Have a question, feedback, or a submission? We would love to hear from you.
                    </p>

                    <div className="bg-white p-8 md:p-10 rounded-lg shadow-sm border border-zinc-100 mb-12">
                        <form className="space-y-6" action="#" method="POST">
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <div>
                                    <label htmlFor="first-name" className="block text-sm font-medium text-zinc-700">First name</label>
                                    <div className="mt-1">
                                        <input type="text" name="first-name" id="first-name" autoComplete="given-name" className="block w-full rounded-md border-zinc-300 shadow-sm focus:border-[#E0BC78] focus:ring-[#E0BC78] sm:text-sm p-3 border" required />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="last-name" className="block text-sm font-medium text-zinc-700">Last name</label>
                                    <div className="mt-1">
                                        <input type="text" name="last-name" id="last-name" autoComplete="family-name" className="block w-full rounded-md border-zinc-300 shadow-sm focus:border-[#E0BC78] focus:ring-[#E0BC78] sm:text-sm p-3 border" />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-zinc-700">Email address</label>
                                <div className="mt-1">
                                    <input id="email" name="email" type="email" autoComplete="email" className="block w-full rounded-md border-zinc-300 shadow-sm focus:border-[#E0BC78] focus:ring-[#E0BC78] sm:text-sm p-3 border" required />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="subject" className="block text-sm font-medium text-zinc-700">Subject</label>
                                <div className="mt-1">
                                    <input type="text" name="subject" id="subject" className="block w-full rounded-md border-zinc-300 shadow-sm focus:border-[#E0BC78] focus:ring-[#E0BC78] sm:text-sm p-3 border" required />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-zinc-700">Message</label>
                                <div className="mt-1">
                                    <textarea id="message" name="message" rows={6} className="block w-full rounded-md border-zinc-300 shadow-sm focus:border-[#E0BC78] focus:ring-[#E0BC78] sm:text-sm p-3 border" required defaultValue={''} />
                                </div>
                            </div>

                            <div>
                                <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-[#141210] bg-[#E0BC78] hover:bg-[#d6af68] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#E0BC78] transition-colors uppercase tracking-widest">
                                    Send Message
                                </button>
                            </div>
                        </form>
                    </div>

                    <div className="text-center font-sans">
                        <h2 className="text-xl font-semibold text-[#141210] mb-2 font-playfair">Other Ways to Reach Us</h2>
                        <p className="text-zinc-600 mb-2">For general inquiries: <a href="mailto:hello@wordpicked.com" className="text-[#E0BC78] hover:underline">hello@wordpicked.com</a></p>
                        <p className="text-zinc-600">For editorial pitches: <a href="mailto:editorial@wordpicked.com" className="text-[#E0BC78] hover:underline">editorial@wordpicked.com</a></p>
                    </div>
                </div>
            </div>
        </main>
    );
}
