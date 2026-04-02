import { cn } from "@/lib/utils";
import "../globals.css";
import { SiteHeader } from "./_components/site-header";
import { SiteFooter } from "./_components/site-footer";
export default function PublicWebTemplate({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <div className={cn("h-full", "antialiased", "font-sans")}>
            <SiteHeader />
            {children}
            <SiteFooter />
        </div>
    );
}