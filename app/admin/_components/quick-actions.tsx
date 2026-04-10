import Link from "next/link";
import { PenLine, Calendar, Users } from "lucide-react";

export function QuickActions() {
    return (
        <div className="bg-white border border-[#DDD7CC] rounded-[4px] overflow-hidden flex flex-col">
            <div className="px-5 py-4 border-b border-[#EDE7D9]">
                <h2 className="font-heading font-bold text-[15px] text-[#1A1714]">Quick Actions</h2>
            </div>

            <div className="p-5 flex flex-col gap-2.5">
                <Link href="/admin/literature/add?category=literature" className="flex items-center justify-center gap-[6px] w-full bg-[#B5542A] text-white px-4 py-2.5 rounded-[2px] transition-colors hover:bg-[#C96840]">
                    <PenLine className="w-[15px] h-[15px]" />
                    <span className="font-sans text-[11px] font-medium tracking-[0.08em] uppercase">Write New Post</span>
                </Link>


                <Link href="/admin/artists" className="flex items-center justify-center gap-[6px] w-full bg-[#EDE7D9] text-[#1A1714] border border-[#DDD7CC] px-4 py-2.5 rounded-[2px] transition-colors hover:bg-[#E3DAC8]">
                    <Users className="w-[15px] h-[15px]" />
                    <span className="font-sans text-[11px] font-medium tracking-[0.08em] uppercase">Add Artist Profile</span>
                </Link>
            </div>
        </div>
    );
}
