import { Metadata } from 'next';
import { ContactForm } from './_components/contact-form';

export const metadata: Metadata = {
    title: 'Contact Us',
    description: 'Get in touch with the Wordpicked editorial team for inquiries, submissions, or support.',
};

export default function ContactPage() {
    return (
        <main className="w-full bg-[#FAFAFA] min-h-screen">
            <div className="mx-auto max-w-310 px-1 py-20 md:px-15 md:py-30 lg:px-10">
                <div className="max-w-2xl mx-auto">
                    <h1 className="font-playfair text-4xl md:text-5xl text-[#141210] mb-4 text-center">
                        Contact Us
                    </h1>
                    <p className="text-zinc-600 font-sans leading-relaxed mb-12 text-center text-lg">
                        Have a question, feedback, or a submission? We would love to hear from you.
                    </p>

                    <ContactForm />

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
