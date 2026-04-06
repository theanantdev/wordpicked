import { Settings as SettingsIcon } from "lucide-react";

export default function AdsSettingsPage() {
    return (
        <div className="max-w-[1000px] mx-auto w-full pb-10">
            {/* Header */}
            <div className="flex justify-between items-end mb-6">
                <div>
                    <h2 className="font-heading font-bold text-[22px] text-[#1A1714]">Google Ads Configuration</h2>
                    <div className="text-[12.5px] text-[#8C857C] mt-1">Manage AdSense slots across the public website</div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">

                {/* Left: Toggles */}
                <div className="bg-white border border-[#DDD7CC] rounded-[4px] shadow-[0_2px_4px_rgba(26,23,20,0.02)]">
                    <div className="flex items-center gap-2 px-5 py-3 border-b border-[#EDE7D9]">
                        <SettingsIcon className="w-4 h-4 text-[#8C857C]" />
                        <h3 className="font-heading font-bold text-[15px] text-[#1A1714]">Ad Slot Configuration</h3>
                    </div>

                    <div className="p-5 flex flex-col">

                        <div className="flex flex-col gap-0 border border-[#DDD7CC] rounded-[4px] overflow-hidden mb-5">

                            {[
                                { label: "Leaderboard — 728×90", sub: "Below navigation bar", checked: true },
                                { label: "Sidebar — 300×250", sub: "Listing + post pages", checked: true },
                                { label: "In-Content — After ¶2", sub: "Within post body", checked: true },
                                { label: "In-Content — After ¶4", sub: "Within post body", checked: false },
                                { label: "Footer Banner", sub: "Above site footer", checked: true },
                            ].map((item, i, arr) => (
                                <div key={i} className={`flex items-center justify-between p-4 bg-white ${i !== arr.length - 1 ? 'border-b border-[#EDE7D9]' : ''}`}>
                                    <div className="flex flex-col">
                                        <div className="text-[13px] font-medium text-[#1A1714]">{item.label}</div>
                                        <div className="text-[11.5px] text-[#8C857C]">{item.sub}</div>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" defaultChecked={item.checked} />
                                        <div className="w-[36px] h-[20px] bg-[#DDD7CC] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-white after:rounded-full after:h-[14px] after:w-[14px] after:transition-all peer-checked:bg-[#B5542A]"></div>
                                    </label>
                                </div>
                            ))}

                        </div>

                        <div className="flex flex-col gap-1.5 mb-4">
                            <label className="text-[11px] font-medium tracking-[0.08em] uppercase text-[#1A1714]">AdSense Publisher ID</label>
                            <input type="text" placeholder="pub-XXXXXXXXXXXXXXXXX" className="w-full bg-white border border-[#DDD7CC] text-[13px] px-3 py-2 rounded-[2px] text-[#1A1714] outline-none hover:border-[#1A1714] focus:border-[#1A1714] transition-colors" />
                        </div>

                        <button className="bg-[#B5542A] self-start text-white text-[11px] font-medium tracking-[0.08em] uppercase px-5 py-2.5 rounded-[2px] transition-colors hover:bg-[#C96840]">
                            Save Configuration
                        </button>
                    </div>
                </div>

                {/* Right: Compliance */}
                <div className="bg-white border border-[#DDD7CC] rounded-[4px] shadow-[0_2px_4px_rgba(26,23,20,0.02)] self-start">
                    <div className="px-5 py-3 border-b border-[#EDE7D9] font-heading font-bold text-[15px] text-[#1A1714] bg-[#FAFAFA]">
                        Compliance Status
                    </div>
                    <div className="p-4 flex flex-col gap-2.5 text-[12.5px] text-[#1A1714]">

                        <div className="flex items-center gap-2.5 p-2.5 bg-[#243D2C]/[0.06] rounded-[2px]">
                            <div className="w-2 h-2 rounded-full bg-[#3A6648] shrink-0" />
                            Better Ads Standards compliant
                        </div>

                        <div className="flex items-center gap-2.5 p-2.5 bg-[#243D2C]/[0.06] rounded-[2px]">
                            <div className="w-2 h-2 rounded-full bg-[#3A6648] shrink-0" />
                            Ads loading asynchronously
                        </div>

                        <div className="flex items-center gap-2.5 p-2.5 bg-[#A8812A]/[0.08] rounded-[2px]">
                            <div className="w-2 h-2 rounded-full bg-[#A8812A] shrink-0" />
                            AdSense approval pending
                        </div>

                        <div className="flex items-center gap-2.5 p-2.5 bg-[#243D2C]/[0.06] rounded-[2px]">
                            <div className="w-2 h-2 rounded-full bg-[#3A6648] shrink-0" />
                            Mobile ad sizes configured
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
}
