import { ArticleHero } from "../_components/article-hero";
import { ArticleBody } from "../_components/article-body";
import { ArticleSidebar } from "../_components/article-sidebar";
import { ArticleRelated } from "../_components/article-related";

export default function LiteraturePostPage() {
    return (
        <main className="w-full bg-[#FDF9F2] min-h-screen">
            <ArticleHero />

            <div className="max-w-[1240px] mx-auto px-6 md:px-[60px] lg:px-[80px] pb-[80px] md:pb-[120px] relative">
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-16 xl:gap-[100px] relative">
                    <ArticleBody />

                    {/* Optional separator line visible only on large screens if desired */}
                    {/* <div className="hidden lg:block absolute left-[calc(100%-350px-50px)] xl:left-[calc(100%-350px-50px)] top-0 bottom-0 w-px bg-[#E7E5E4]" /> */}

                    <ArticleSidebar />
                </div>
            </div>

            <ArticleRelated />
        </main>
    );
}