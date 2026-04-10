import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Terms of Service',
    description: 'Terms and Conditions for utilizing Wordpicked.',
};

export default function TermsPage() {
    return (
        <main className="w-full bg-[#FAFAFA] min-h-screen">
            <div className="max-w-[1240px] mx-auto px-6 md:px-[60px] lg:px-[80px] py-[80px] md:py-[120px]">
                <div className="max-w-3xl">
                    <h1 className="font-playfair text-4xl md:text-5xl text-[#141210] mb-6">
                        Terms of Service
                    </h1>
                    <p className="text-sm text-zinc-500 mb-10 font-sans tracking-wide uppercase">Last Updated: April 2026</p>

                    <div className="prose prose-lg prose-zinc max-w-none font-sans text-zinc-700 space-y-6">
                        <h2 className="font-playfair text-2xl text-[#141210] mt-10 mb-4">1. Agreement to Terms</h2>
                        <p>
                            By viewing or using Wordpicked ("Website", "we", "us", or "our"), you agree to abide by these Terms of Service. If you disagree with any part of the terms, you may not access the Website.
                        </p>

                        <h2 className="font-playfair text-2xl text-[#141210] mt-10 mb-4">2. Intellectual Property</h2>
                        <p>
                            The Website and its original content (including text, features, functionality, articles, critiques, and aesthetic designs), are and will remain the exclusive property of Wordpicked and its licensors. Our content is protected by copyright, trademark, and other laws.
                        </p>

                        <h2 className="font-playfair text-2xl text-[#141210] mt-10 mb-4">3. User Contributions</h2>
                        <p>
                            Users may post comments or submit content. You understand and acknowledge that you are responsible for any User Contributions you submit or contribute, and you, not Wordpicked, have full responsibility for such content, including its legality, reliability, accuracy, and appropriateness. Wordpicked reserves the right to remove any content at our sole discretion.
                        </p>

                        <h2 className="font-playfair text-2xl text-[#141210] mt-10 mb-4">4. Prohibited Uses</h2>
                        <p>
                            You may use the Website only for lawful purposes and in accordance with these Terms. You agree not to use the Website:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>In any way that violates any applicable federal, state, local, or international law or regulation.</li>
                            <li>To engage in any conduct that restricts or inhibits anyone's use or enjoyment of the Website.</li>
                            <li>To impersonate or attempt to impersonate Wordpicked, a Wordpicked employee, another user, or any other person or entity.</li>
                            <li>To attempt to circumvent our security measures or otherwise engage in malicious or strictly destructive actions.</li>
                        </ul>

                        <h2 className="font-playfair text-2xl text-[#141210] mt-10 mb-4">5. Links To Other Websites</h2>
                        <p>
                            Our Service may contain links to third-party web sites or services that are not owned or controlled by Wordpicked. Wordpicked has no control over, and assumes no responsibility for, the content, privacy policies, or practices of any third party web sites or services. We do not warrant the offerings of any of these entities/individuals or their websites.
                        </p>

                        <h2 className="font-playfair text-2xl text-[#141210] mt-10 mb-4">6. Disclaimer of Warranties</h2>
                        <p>
                            The Website and its content are provided on an "as is" and "as available" basis without any warranties of any kind. We disclaim all warranties, including, but not limited to, the warranty of title, merchantability, non-infringement of third parties' rights, and fitness for particular purpose. 
                        </p>

                        <h2 className="font-playfair text-2xl text-[#141210] mt-10 mb-4">7. Limitation of Liability</h2>
                        <p>
                            In no event will Wordpicked, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Website.
                        </p>

                        <h2 className="font-playfair text-2xl text-[#141210] mt-10 mb-4">8. Changes</h2>
                        <p>
                            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms.
                        </p>

                        <h2 className="font-playfair text-2xl text-[#141210] mt-10 mb-4">Contact Us</h2>
                        <p>
                            If you have any questions about these Terms, please contact us at <a href="mailto:legal@wordpicked.com" className="text-[#E0BC78] hover:underline">legal@wordpicked.com</a>.
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}
