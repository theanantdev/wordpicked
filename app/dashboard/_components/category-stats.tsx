export function CategoryStats() {
    return (
        <div className="bg-white border border-[#DDD7CC] rounded-[4px] overflow-hidden">
            <div className="px-5 py-4 border-b border-[#EDE7D9] flex items-center justify-between">
                <h2 className="font-heading font-bold text-[15px] text-[#1A1714]">Posts by Category</h2>
                <span className="text-[11px] text-[#8C857C]">All time</span>
            </div>

            <div className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">

                    {/* Literature */}
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-[11px] tracking-[0.1em] uppercase text-[#243D2C] font-medium">Literature</span>
                            <span className="font-heading font-bold text-[17px] text-[#1A1714]">21</span>
                        </div>
                        <div className="flex items-end gap-[3px] h-12 pt-1">
                            <div className="flex-1 rounded-t-[1px] min-h-[4px] bg-[#2E5239] transition-colors hover:bg-[#B5542A]" style={{ height: '60%' }} />
                            <div className="flex-1 rounded-t-[1px] min-h-[4px] bg-[#2E5239] transition-colors hover:bg-[#B5542A]" style={{ height: '40%' }} />
                            <div className="flex-1 rounded-t-[1px] min-h-[4px] bg-[#2E5239] transition-colors hover:bg-[#B5542A]" style={{ height: '80%' }} />
                            <div className="flex-1 rounded-t-[1px] min-h-[4px] bg-[#2E5239] transition-colors hover:bg-[#B5542A]" style={{ height: '55%' }} />
                            <div className="flex-1 rounded-t-[1px] min-h-[4px] bg-[#2E5239] transition-colors hover:bg-[#B5542A]" style={{ height: '90%' }} />
                            <div className="flex-1 rounded-t-[1px] min-h-[4px] bg-[#2E5239] transition-colors hover:bg-[#B5542A]" style={{ height: '70%' }} />
                            <div className="flex-1 rounded-t-[1px] min-h-[4px] bg-[#E3DAC8] transition-colors hover:bg-[#B5542A]" style={{ height: '45%' }} />
                        </div>
                    </div>

                    {/* Films */}
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-[11px] tracking-[0.1em] uppercase text-[#B5542A] font-medium">Films</span>
                            <span className="font-heading font-bold text-[17px] text-[#1A1714]">18</span>
                        </div>
                        <div className="flex items-end gap-[3px] h-12 pt-1">
                            <div className="flex-1 rounded-t-[1px] min-h-[4px] bg-[#B5542A]/20 transition-colors hover:bg-[#B5542A]" style={{ height: '50%' }} />
                            <div className="flex-1 rounded-t-[1px] min-h-[4px] bg-[#B5542A]/30 transition-colors hover:bg-[#B5542A]" style={{ height: '70%' }} />
                            <div className="flex-1 rounded-t-[1px] min-h-[4px] bg-[#B5542A]/20 transition-colors hover:bg-[#B5542A]" style={{ height: '45%' }} />
                            <div className="flex-1 rounded-t-[1px] min-h-[4px] bg-[#B5542A]/40 transition-colors hover:bg-[#B5542A]" style={{ height: '85%' }} />
                            <div className="flex-1 rounded-t-[1px] min-h-[4px] bg-[#B5542A]/30 transition-colors hover:bg-[#B5542A]" style={{ height: '60%' }} />
                            <div className="flex-1 rounded-t-[1px] min-h-[4px] bg-[#B5542A]/35 transition-colors hover:bg-[#B5542A]" style={{ height: '75%' }} />
                            <div className="flex-1 rounded-t-[1px] min-h-[4px] bg-[#B5542A]/20 transition-colors hover:bg-[#B5542A]" style={{ height: '40%' }} />
                        </div>
                    </div>

                    {/* Artists */}
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-[11px] tracking-[0.1em] uppercase text-[#A8812A] font-medium">Artists</span>
                            <span className="font-heading font-bold text-[17px] text-[#1A1714]">8</span>
                        </div>
                        <div className="flex items-end gap-[3px] h-12 pt-1">
                            <div className="flex-1 rounded-t-[1px] min-h-[4px] bg-[#E3DAC8] transition-colors hover:bg-[#B5542A]" style={{ height: '30%' }} />
                            <div className="flex-1 rounded-t-[1px] min-h-[4px] bg-[#E3DAC8] transition-colors hover:bg-[#B5542A]" style={{ height: '20%' }} />
                            <div className="flex-1 rounded-t-[1px] min-h-[4px] bg-[#E3DAC8] transition-colors hover:bg-[#B5542A]" style={{ height: '40%' }} />
                            <div className="flex-1 rounded-t-[1px] min-h-[4px] bg-[#A8812A]/40 transition-colors hover:bg-[#B5542A]" style={{ height: '60%' }} />
                            <div className="flex-1 rounded-t-[1px] min-h-[4px] bg-[#E3DAC8] transition-colors hover:bg-[#B5542A]" style={{ height: '25%' }} />
                            <div className="flex-1 rounded-t-[1px] min-h-[4px] bg-[#E3DAC8] transition-colors hover:bg-[#B5542A]" style={{ height: '35%' }} />
                            <div className="flex-1 rounded-t-[1px] min-h-[4px] bg-[#E3DAC8] transition-colors hover:bg-[#B5542A]" style={{ height: '15%' }} />
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
