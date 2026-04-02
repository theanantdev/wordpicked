import { LiteratureHero } from "./_components/literature-hero"
import { LiteratureContent } from "./_components/literature-content"

export default function LiteraturePage() {
    return (
        <main className="bg-[#FAFAFA] min-h-screen">
            <LiteratureHero />
            <LiteratureContent />
        </main>
    )
}
