import { Sidebar } from "./_components/sidebar";
import { Topbar } from "./_components/topbar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-screen overflow-hidden bg-[#F5F0E8] text-[#1A1714] font-sans text-[14px] leading-[1.6]">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Topbar />
                <main className="flex-1 overflow-y-auto p-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
                    {children}
                </main>
            </div>
        </div>
    );
}
