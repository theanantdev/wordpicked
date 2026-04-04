import { PenTool, Image as ImageIcon, Tag, Globe, Type, Heading1, Heading2, Heading3, Bold, Italic, Underline, Strikethrough, List, ListOrdered, Quote, Link as LinkIcon } from "lucide-react";

export default function NewPostPage() {
    return (
        <div className="max-w-[1240px] mx-auto w-full pb-10">
            {/* Header */}
            <div className="flex justify-between items-end mb-5">
                <div>
                    <h2 className="font-heading font-bold text-[22px] text-[#1A1714]">New Post</h2>
                    <div className="text-[12.5px] text-[#8C857C] mt-1">Create and publish a review or interview</div>
                </div>
                <div className="flex gap-2">
                    <button className="bg-white border border-[#DDD7CC] text-[#1A1714] text-[11px] font-medium tracking-[0.08em] uppercase px-4 py-2 rounded-[2px] transition-colors hover:bg-[#EDE7D9]">
                        Save Draft
                    </button>
                    <button className="bg-[#B5542A] text-white text-[11px] font-medium tracking-[0.08em] uppercase px-4 py-2 rounded-[2px] transition-colors hover:bg-[#C96840]">
                        Publish Post
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-5">

                {/* LEFT — Editor */}
                <div className="flex flex-col gap-4">
                    {/* Title */}
                    <div className="bg-white border border-[#DDD7CC] rounded-[4px] shadow-[0_2px_4px_rgba(26,23,20,0.02)] pt-5 pb-5 px-6">
                        <input
                            className="w-full font-heading text-[26px] font-bold text-[#1A1714] border-none bg-transparent outline-none pb-3 border-b border-[#EDE7D9] placeholder:text-[#8C857C]/50"
                            placeholder="Post title…"
                        />
                        <input
                            className="w-full text-[14px] text-[#1A1714] border-none bg-transparent outline-none pt-3 pb-0 placeholder:text-[#8C857C]/60 italic font-sans"
                            placeholder="Subtitle or summary…"
                        />
                    </div>

                    {/* Rich Text Editor */}
                    <div className="bg-white border border-[#DDD7CC] rounded-[4px] shadow-[0_2px_4px_rgba(26,23,20,0.02)] flex flex-col h-full min-h-[500px]">
                        <div className="flex items-center gap-2 px-5 py-3.5 border-b border-[#EDE7D9]">
                            <PenTool className="w-4 h-4 text-[#8C857C]" />
                            <h3 className="font-heading font-bold text-[14.5px] text-[#1A1714]">Review Content</h3>
                        </div>

                        <div className="flex items-center gap-1.5 px-4 py-2 border-b border-[#EDE7D9] bg-[#FAFAFA] flex-wrap">
                            <select className="bg-white border border-[#DDD7CC] text-[12px] px-2 py-1.5 rounded-[2px] text-[#1A1714] outline-none">
                                <option>Paragraph</option>
                                <option>Heading 1</option>
                                <option>Heading 2</option>
                                <option>Heading 3</option>
                            </select>

                            <div className="w-[1px] h-5 bg-[#DDD7CC] mx-1"></div>

                            <button className="w-7 h-7 flex items-center justify-center rounded-[2px] hover:bg-[#EDE7D9] text-[#1A1714] bg-[#EDE7D9] font-bold"><Bold className="w-3.5 h-3.5" /></button>
                            <button className="w-7 h-7 flex items-center justify-center rounded-[2px] hover:bg-[#EDE7D9] text-[#1A1714]"><Italic className="w-3.5 h-3.5" /></button>
                            <button className="w-7 h-7 flex items-center justify-center rounded-[2px] hover:bg-[#EDE7D9] text-[#1A1714]"><Underline className="w-3.5 h-3.5" /></button>
                            <button className="w-7 h-7 flex items-center justify-center rounded-[2px] hover:bg-[#EDE7D9] text-[#1A1714]"><Strikethrough className="w-3.5 h-3.5" /></button>

                            <div className="w-[1px] h-5 bg-[#DDD7CC] mx-1"></div>

                            <button className="w-7 h-7 flex items-center justify-center rounded-[2px] hover:bg-[#EDE7D9] text-[#1A1714]"><List className="w-4 h-4" /></button>
                            <button className="w-7 h-7 flex items-center justify-center rounded-[2px] hover:bg-[#EDE7D9] text-[#1A1714]"><ListOrdered className="w-4 h-4" /></button>
                            <button className="w-7 h-7 flex items-center justify-center rounded-[2px] hover:bg-[#EDE7D9] text-[#1A1714]"><Quote className="w-3.5 h-3.5" /></button>

                            <div className="w-[1px] h-5 bg-[#DDD7CC] mx-1"></div>

                            <button className="w-7 h-7 flex items-center justify-center rounded-[2px] hover:bg-[#EDE7D9] text-[#1A1714]"><LinkIcon className="w-3.5 h-3.5" /></button>
                            <button className="w-7 h-7 flex items-center justify-center rounded-[2px] hover:bg-[#EDE7D9] text-[#1A1714]"><ImageIcon className="w-3.5 h-3.5" /></button>
                            {/* <button className="w-7 h-7 flex items-center justify-center rounded-[2px] hover:bg-[#EDE7D9] text-[#1A1714]"><Youtube className="w-4 h-4" /></button> */}
                        </div>

                        <div className="p-6 flex-1 min-h-[400px]">
                            <span className="text-[#8C857C] text-[15px] italic">Begin writing your review…</span>
                        </div>
                    </div>
                </div>

                {/* RIGHT — Publish Settings */}
                <div className="flex flex-col gap-4">

                    {/* Featured Image */}
                    <div className="bg-white border border-[#DDD7CC] rounded-[4px] shadow-[0_2px_4px_rgba(26,23,20,0.02)]">
                        <div className="flex items-center gap-2 px-4 py-3 border-b border-[#EDE7D9]">
                            <ImageIcon className="w-4 h-4 text-[#8C857C]" />
                            <h3 className="font-heading font-bold text-[14.5px] text-[#1A1714]">Featured Image</h3>
                        </div>
                        <div className="p-4">
                            <div className="border border-dashed border-[#DDD7CC] bg-[#FAFAFA] rounded-[2px] p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors hover:border-[#1A1714] hover:bg-[#F5F0E8]">
                                <ImageIcon className="w-6 h-6 text-[#8C857C] mb-2" />
                                <div className="text-[12.5px] font-medium text-[#1A1714] mb-0.5">Drop image here</div>
                                <div className="text-[12px] text-[#8C857C] mb-2">or click to browse</div>
                                <div className="text-[10px] text-[#8C857C] bg-[#EDE7D9] px-2 py-1 rounded-[2px]">1200 × 630px · JPG, PNG · Max 5MB</div>
                            </div>
                        </div>
                    </div>

                    {/* Category & Tags */}
                    <div className="bg-white border border-[#DDD7CC] rounded-[4px] shadow-[0_2px_4px_rgba(26,23,20,0.02)]">
                        <div className="flex items-center gap-2 px-4 py-3 border-b border-[#EDE7D9]">
                            <Tag className="w-4 h-4 text-[#8C857C]" />
                            <h3 className="font-heading font-bold text-[14.5px] text-[#1A1714]">Category & Tags</h3>
                        </div>
                        <div className="p-4 flex flex-col gap-4">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[11px] font-medium tracking-[0.08em] uppercase text-[#1A1714]">Category</label>
                                <select className="w-full bg-white border border-[#DDD7CC] text-[13px] px-3 py-2 rounded-[2px] text-[#1A1714] outline-none hover:border-[#1A1714] focus:border-[#1A1714] transition-colors">
                                    <option>Literature</option>
                                    <option>Films</option>
                                    <option>Artists</option>
                                </select>
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-[11px] font-medium tracking-[0.08em] uppercase text-[#1A1714]">Tags</label>
                                <div className="flex flex-wrap gap-1.5 p-2 bg-white border border-[#DDD7CC] rounded-[2px] transition-colors focus-within:border-[#1A1714]">
                                    <div className="flex items-center gap-1 bg-[#F5F0E8] text-[#1A1714] text-[11.5px] px-2 py-0.5 rounded-[2px]">
                                        Fiction <button className="text-[#8C857C] hover:text-[#B5542A]">×</button>
                                    </div>
                                    <div className="flex items-center gap-1 bg-[#F5F0E8] text-[#1A1714] text-[11.5px] px-2 py-0.5 rounded-[2px]">
                                        Debut <button className="text-[#8C857C] hover:text-[#B5542A]">×</button>
                                    </div>
                                    <input className="min-w-[80px] bg-transparent border-none outline-none text-[12.5px] flex-1 py-0.5" placeholder="Add tag…" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Publish Settings */}
                    <div className="bg-white border border-[#DDD7CC] rounded-[4px] shadow-[0_2px_4px_rgba(26,23,20,0.02)]">
                        <div className="flex items-center gap-2 px-4 py-3 border-b border-[#EDE7D9]">
                            <Globe className="w-4 h-4 text-[#8C857C]" />
                            <h3 className="font-heading font-bold text-[14.5px] text-[#1A1714]">Publish Settings</h3>
                        </div>
                        <div className="p-4 flex flex-col gap-4">

                            <label className="flex items-center justify-between cursor-pointer group">
                                <div className="flex flex-col">
                                    <div className="text-[13px] font-medium text-[#1A1714]">Published</div>
                                    <div className="text-[11.5px] text-[#8C857C]">Make live on site</div>
                                </div>
                                <div className="relative inline-flex items-center h-[20px] w-[36px] bg-[#DDD7CC] rounded-[20px] transition-colors duration-200">
                                    <span className="inline-block w-[14px] h-[14px] bg-white rounded-full transform translate-x-[3px] transition-transform duration-200" />
                                </div>
                            </label>

                            <label className="flex items-center justify-between cursor-pointer group">
                                <div className="flex flex-col">
                                    <div className="text-[13px] font-medium text-[#1A1714]">Schedule</div>
                                    <div className="text-[11.5px] text-[#8C857C]">Publish at future date</div>
                                </div>
                                <div className="relative inline-flex items-center h-[20px] w-[36px] bg-[#243D2C] rounded-[20px] transition-colors duration-200">
                                    <span className="inline-block w-[14px] h-[14px] bg-white rounded-full transform translate-x-[19px] transition-transform duration-200" />
                                </div>
                            </label>

                            <div className="flex flex-col gap-1.5 mt-2">
                                <label className="text-[11px] font-medium tracking-[0.08em] uppercase text-[#1A1714]">Publish Date</label>
                                <input
                                    type="datetime-local"
                                    className="w-full bg-white border border-[#DDD7CC] text-[13px] px-3 py-2 rounded-[2px] text-[#1A1714] outline-none hover:border-[#1A1714] focus:border-[#1A1714] transition-colors"
                                    defaultValue="2026-03-30T09:00"
                                />
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
