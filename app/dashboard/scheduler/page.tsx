import { Plus } from "lucide-react";

export default function SchedulerPage() {
    return (
        <div className="max-w-[1240px] mx-auto w-full pb-10">
            {/* Header */}
            <div className="flex justify-between items-end mb-6">
                <div>
                    <h2 className="font-heading font-bold text-[22px] text-[#1A1714]">Pick of the Day Scheduler</h2>
                    <div className="text-[12.5px] text-[#8C857C] mt-1">Schedule picks up to 90 days in advance · No duplicates within 30 days</div>
                </div>
                <button className="flex items-center gap-1.5 bg-[#B5542A] text-white text-[11px] font-medium tracking-[0.08em] uppercase px-4 py-2 rounded-[2px] transition-colors hover:bg-[#C96840]">
                    <Plus className="w-[14px] h-[14px]" />
                    Add Pick
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-6">

                {/* Calendar */}
                <div className="bg-white border border-[#DDD7CC] rounded-[4px] shadow-[0_2px_4px_rgba(26,23,20,0.02)] flex flex-col overflow-hidden">

                    {/* Cal Header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-[#EDE7D9] bg-[#FAFAFA]">
                        <button className="text-[16px] text-[#8C857C] hover:text-[#1A1714] px-2">→</button> {/* Replicating left arrow */}
                        <span className="font-heading font-bold text-[18px] text-[#1A1714]">March 2026</span>
                        <button className="text-[16px] text-[#8C857C] hover:text-[#1A1714] px-2">→</button>
                    </div>

                    {/* Days Header */}
                    <div className="grid grid-cols-7 border-b border-[#EDE7D9] bg-white">
                        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                            <div key={day} className="py-2.5 text-center text-[10px] tracking-[0.08em] uppercase font-semibold text-[#8C857C] border-r border-[#EDE7D9] last:border-r-0">
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Grid (Mocked for visual accuracy) */}
                    <div className="grid grid-cols-7 grid-rows-5 bg-[#EDE7D9] gap-[1px]">
                        {/* We will just create 35 cells to mock the grid and apply styles to replicate the admin panel */}
                        {Array.from({ length: 35 }).map((_, i) => {
                            const isToday = i === 25; // 26th

                            // Mocking the data structure
                            const dayNum = i >= 0 && i < 31 ? i + 1 : "";
                            let type = null;
                            let title = "";

                            if (dayNum) {
                                if ([1, 5, 8, 12, 15, 19, 21, 22, 23, 25, 26, 28, 30].includes(dayNum as number)) { type = 'Novel'; title = 'Book Title...'; }
                                if ([3, 7, 10, 14, 17, 20, 24, 27, 29].includes(dayNum as number)) { type = 'Film'; title = 'Film Title...'; }
                            }

                            return (
                                <div key={i} className={`min-h-[100px] p-2 bg-white flex flex-col relative transition-colors ${!dayNum ? 'bg-[#FAFAFA]' : ''} ${isToday ? 'bg-[#FDF9F2]' : 'hover:bg-[#FAFAFA]'}`}>
                                    {isToday && <div className="absolute inset-0 border-2 border-[#1A1714] pointer-events-none rounded-[2px]" />}

                                    <div className={`text-[12px] font-medium mb-1.5 ${isToday ? 'text-[#1A1714] font-bold' : 'text-[#8C857C]'}`}>
                                        {dayNum}
                                    </div>

                                    {type ? (
                                        <div className={`text-[10.5px] leading-[1.2] px-2 py-1.5 rounded-[2px] font-medium border ${type === 'Film' ? 'bg-[#B5542A]/10 text-[#B5542A] border-[#B5542A]/20' : 'bg-[#243D2C]/10 text-[#243D2C] border-[#243D2C]/20'}`}>
                                            {title}
                                        </div>
                                    ) : dayNum ? (
                                        <div className="text-[10px] text-[#8C857C] italic opacity-0 hover:opacity-100 transition-opacity border border-dashed border-[#DDD7CC] w-full text-center py-1.5 rounded-[2px] cursor-pointer hover:border-[#1A1714] hover:bg-[#EDE7D9] hover:text-[#1A1714]">
                                            + Assign
                                        </div>
                                    ) : null}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Sidebar */}
                <div className="flex flex-col gap-5">

                    {/* Upcoming Picks */}
                    <div className="bg-white border border-[#DDD7CC] rounded-[4px] shadow-[0_2px_4px_rgba(26,23,20,0.02)] overflow-hidden">
                        <div className="px-5 py-3 border-b border-[#EDE7D9] font-heading font-bold text-[14.5px] text-[#1A1714]">
                            Upcoming Picks
                        </div>
                        <div className="p-4 flex flex-col gap-[1px] bg-[#EDE7D9]">
                            {/* Items */}
                            <div className="flex items-center gap-3 bg-white p-3">
                                <div className="w-[38px] h-[38px] shrink-0 bg-[#243D2C]/10 border border-[#243D2C]/20 rounded-[2px] flex flex-col items-center justify-center text-[#243D2C]">
                                    <div className="font-heading font-bold text-[16px] leading-[1.1]">28</div>
                                    <div className="text-[8px] tracking-[0.1em] uppercase font-bold">Mar</div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="text-[12.5px] text-[#1A1714] font-medium truncate">Orbital — Samantha Harvey</div>
                                    <div className="text-[11px] text-[#8C857C]">Novel</div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 bg-white p-3">
                                <div className="w-[38px] h-[38px] shrink-0 bg-[#B5542A]/10 border border-[#B5542A]/20 rounded-[2px] flex flex-col items-center justify-center text-[#B5542A]">
                                    <div className="font-heading font-bold text-[16px] leading-[1.1]">29</div>
                                    <div className="text-[8px] tracking-[0.1em] uppercase font-bold">Mar</div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="text-[12.5px] text-[#1A1714] font-medium truncate">The Brutalist</div>
                                    <div className="text-[11px] text-[#8C857C]">Film</div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 bg-white p-3">
                                <div className="w-[38px] h-[38px] shrink-0 bg-[#243D2C]/10 border border-[#243D2C]/20 rounded-[2px] flex flex-col items-center justify-center text-[#243D2C]">
                                    <div className="font-heading font-bold text-[16px] leading-[1.1]">30</div>
                                    <div className="text-[8px] tracking-[0.1em] uppercase font-bold">Mar</div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="text-[12.5px] text-[#1A1714] font-medium truncate">James — Percival Everett</div>
                                    <div className="text-[11px] text-[#8C857C]">Novel</div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 bg-white p-3">
                                <div className="w-[38px] h-[38px] shrink-0 bg-[#E3DAC8] border border-dashed border-[#DDD7CC] rounded-[2px] flex flex-col items-center justify-center text-[#8C857C]">
                                    <div className="font-heading font-bold text-[14px] leading-[1.1]">+</div>
                                    <div className="text-[8px] tracking-[0.1em] uppercase font-bold">Apr 1</div>
                                </div>
                                <div className="flex-1 min-w-0 cursor-pointer group">
                                    <div className="text-[12.5px] text-[#8C857C] italic group-hover:text-[#1A1714] transition-colors truncate">Unscheduled</div>
                                    <div className="text-[11px] text-[#8C857C]">Click to assign</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Assign Form */}
                    <div className="bg-white border border-[#DDD7CC] rounded-[4px] shadow-[0_2px_4px_rgba(26,23,20,0.02)] overflow-hidden">
                        <div className="px-5 py-3 border-b border-[#EDE7D9] font-heading font-bold text-[14.5px] text-[#1A1714]">
                            Assign a Pick
                        </div>
                        <div className="p-4 flex flex-col gap-3">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[11px] font-medium tracking-[0.08em] uppercase text-[#1A1714]">Date</label>
                                <input type="date" className="w-full bg-white border border-[#DDD7CC] text-[13px] px-3 py-2 rounded-[2px] text-[#1A1714] outline-none" defaultValue="2026-04-01" />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[11px] font-medium tracking-[0.08em] uppercase text-[#1A1714]">Select Post</label>
                                <select className="w-full bg-white border border-[#DDD7CC] text-[13px] px-3 py-2 rounded-[2px] text-[#1A1714] outline-none">
                                    <option>— Choose a post —</option>
                                    <option>Orbital — Samantha Harvey</option>
                                    <option>All Fours — Miranda July</option>
                                    <option>Nickel Boys — RaMell Ross</option>
                                </select>
                            </div>
                            <button className="bg-[#243D2C] text-white text-[11px] font-medium tracking-[0.08em] uppercase px-4 py-2.5 rounded-[2px] transition-colors hover:bg-[#2E5239] w-full mt-1">
                                Confirm Pick
                            </button>
                        </div>
                    </div>

                    {/* Legend */}
                    <div className="bg-white border border-[#DDD7CC] rounded-[4px] shadow-[0_2px_4px_rgba(26,23,20,0.02)] overflow-hidden">
                        <div className="px-5 py-3 border-b border-[#EDE7D9] font-heading font-bold text-[14.5px] text-[#1A1714]">
                            Legend
                        </div>
                        <div className="p-4 flex flex-col gap-2">
                            <div className="flex items-center gap-2 text-[11.5px] text-[#1A1714]">
                                <div className="w-3 h-3 bg-[#243D2C] rounded-[1px]"></div>
                                Novel / Book
                            </div>
                            <div className="flex items-center gap-2 text-[11.5px] text-[#1A1714]">
                                <div className="w-3 h-3 bg-[#B5542A] rounded-[1px]"></div>
                                Film
                            </div>
                            <div className="flex items-center gap-2 text-[11.5px] text-[#1A1714]">
                                <div className="w-3 h-3 border border-dashed border-[#DDD7CC] rounded-[1px]"></div>
                                Unassigned
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
