import { Plus } from "lucide-react";

export default function ArtistsPage() {
    const artists = [
        {
            initials: "OV",
            name: "Ocean Vuong",
            form: "Poet · Novelist",
            bio: "Author of On Earth We're Briefly Gorgeous and Time Is a Mother. Winner of the T.S. Eliot Prize.",
            posts: "2",
            views: "3.1k",
            gradient: "from-[#1a1208] to-[#321e0e]"
        },
        {
            initials: "CS",
            name: "Celine Song",
            form: "Filmmaker",
            bio: "Director of Past Lives. On longing, distance, and the cinematic grammar of the heart across borders.",
            posts: "1",
            views: "1.8k",
            gradient: "from-[#08101a] to-[#10203a]"
        },
        {
            initials: "HY",
            name: "Hanya Yanagihara",
            form: "Novelist",
            bio: "Author of A Little Life and To Paradise. On suffering, beauty, and the ethics of difficult fiction.",
            posts: "1",
            views: "2.2k",
            gradient: "from-[#100a1a] to-[#201535]"
        }
    ];

    return (
        <div className="max-w-[1240px] mx-auto w-full pb-10">
            {/* Header */}
            <div className="flex justify-between items-end mb-6">
                <div>
                    <h2 className="font-heading font-bold text-[22px] text-[#1A1714]">Artist Profiles</h2>
                    <div className="text-[12.5px] text-[#8C857C] mt-1">12 active profiles · 3 art forms covered</div>
                </div>
                <button className="flex items-center gap-1.5 bg-[#B5542A] text-white text-[11px] font-medium tracking-[0.08em] uppercase px-4 py-2 rounded-[2px] transition-colors hover:bg-[#C96840]">
                    <Plus className="w-[14px] h-[14px]" />
                    Add Artist
                </button>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
                {artists.map((artist, idx) => (
                    <div key={idx} className="bg-white border border-[#DDD7CC] rounded-[4px] shadow-[0_2px_4px_rgba(26,23,20,0.02)] flex flex-col p-5">

                        <div className="flex items-center gap-4 mb-4">
                            <div className={`w-12 h-12 rounded-[2px] flex items-center justify-center font-heading font-bold text-[18px] text-[rgba(255,255,255,0.9)] bg-gradient-to-br ${artist.gradient} shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)]`}>
                                {artist.initials}
                            </div>
                            <div>
                                <div className="font-heading font-bold text-[18px] text-[#1A1714] leading-[1.2]">{artist.name}</div>
                                <div className="text-[12px] text-[#8C857C] mt-0.5">{artist.form}</div>
                            </div>
                        </div>

                        <div className="text-[13.5px] leading-[1.6] text-[#1A1714] mb-5 flex-1">
                            {artist.bio}
                        </div>

                        <div className="flex gap-6 mb-5">
                            <div>
                                <div className="font-heading font-bold text-[20px] text-[#1A1714] leading-none mb-1">{artist.posts}</div>
                                <div className="text-[10px] tracking-[0.08em] uppercase font-bold text-[#8C857C]">Posts</div>
                            </div>
                            <div>
                                <div className="font-heading font-bold text-[20px] text-[#1A1714] leading-none mb-1">{artist.views}</div>
                                <div className="text-[10px] tracking-[0.08em] uppercase font-bold text-[#8C857C]">Views</div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 pt-4 border-t border-[#EDE7D9]">
                            <button className="flex-1 text-[11px] font-medium text-[#1A1714] bg-white border border-[#DDD7CC] px-2 py-1.5 rounded-[2px] hover:bg-[#EDE7D9] transition-colors">Edit</button>
                            <button className="flex-1 text-[11px] font-medium text-[#1A1714] bg-white border border-[#DDD7CC] px-2 py-1.5 rounded-[2px] hover:bg-[#EDE7D9] transition-colors">View Posts</button>
                            <button className="text-[11px] font-medium text-[#B5542A] bg-white border border-[#B5542A]/30 px-3 py-1.5 rounded-[2px] hover:bg-[#B5542A]/10 transition-colors">Remove</button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Add Artist Form Placeholder Box */}
            <div className="bg-white border text-left border-[#DDD7CC] rounded-[4px] shadow-[0_2px_4px_rgba(26,23,20,0.02)] overflow-hidden max-w-[800px]">
                <div className="px-6 py-4 border-b border-[#EDE7D9] flex justify-between items-center bg-[#FAFAFA]">
                    <div className="font-heading font-bold text-[16px] text-[#1A1714]">Add New Artist Profile</div>
                    <span className="text-[11px] text-[#8C857C]">Takes less than 2 minutes</span>
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-4">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[11px] font-medium tracking-[0.08em] uppercase text-[#1A1714]">Full Name</label>
                            <input type="text" placeholder="Artist's full name" className="w-full bg-white border border-[#DDD7CC] text-[13px] px-3 py-2 rounded-[2px] text-[#1A1714] outline-none hover:border-[#1A1714] focus:border-[#1A1714] transition-colors" />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[11px] font-medium tracking-[0.08em] uppercase text-[#1A1714]">Art Form</label>
                            <select className="w-full bg-white border border-[#DDD7CC] text-[13px] px-3 py-2 rounded-[2px] text-[#1A1714] outline-none hover:border-[#1A1714] focus:border-[#1A1714] transition-colors">
                                <option>Writer</option>
                                <option>Filmmaker</option>
                                <option>Musician</option>
                                <option>Visual Artist</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex flex-col gap-1.5 mb-4">
                        <label className="text-[11px] font-medium tracking-[0.08em] uppercase text-[#1A1714]">Biography</label>
                        <textarea placeholder="Short biography for profile page…" className="w-full min-h-[80px] bg-white border border-[#DDD7CC] text-[13px] px-3 py-2 rounded-[2px] text-[#1A1714] outline-none hover:border-[#1A1714] focus:border-[#1A1714] transition-colors resize-y" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[11px] font-medium tracking-[0.08em] uppercase text-[#1A1714]">Instagram Handle</label>
                            <input type="text" placeholder="@handle" className="w-full bg-white border border-[#DDD7CC] text-[13px] px-3 py-2 rounded-[2px] text-[#1A1714] outline-none hover:border-[#1A1714] focus:border-[#1A1714] transition-colors" />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[11px] font-medium tracking-[0.08em] uppercase text-[#1A1714]">Twitter / X</label>
                            <input type="text" placeholder="@handle" className="w-full bg-white border border-[#DDD7CC] text-[13px] px-3 py-2 rounded-[2px] text-[#1A1714] outline-none hover:border-[#1A1714] focus:border-[#1A1714] transition-colors" />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[11px] font-medium tracking-[0.08em] uppercase text-[#1A1714]">Website</label>
                            <input type="url" placeholder="https://…" className="w-full bg-white border border-[#DDD7CC] text-[13px] px-3 py-2 rounded-[2px] text-[#1A1714] outline-none hover:border-[#1A1714] focus:border-[#1A1714] transition-colors" />
                        </div>
                    </div>

                    <div className="flex gap-2.5">
                        <button className="bg-[#B5542A] text-white text-[11px] font-medium tracking-[0.08em] uppercase px-5 py-2.5 rounded-[2px] transition-colors hover:bg-[#C96840]">
                            Save Artist Profile
                        </button>
                        <button className="bg-white border border-[#DDD7CC] text-[#1A1714] text-[11px] font-medium tracking-[0.08em] uppercase px-5 py-2.5 rounded-[2px] transition-colors hover:bg-[#EDE7D9]">
                            Cancel
                        </button>
                    </div>
                </div>
            </div>

        </div>
    );
}
