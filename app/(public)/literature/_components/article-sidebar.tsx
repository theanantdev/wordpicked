"use client";

import Image from "next/image";
import { useState } from "react";

export function ArticleSidebar() {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim() || !email.includes("@")) {
            setStatus("error");
            setMessage("Please enter a valid email address.");
            return;
        }

        setStatus("loading");
        try {
            const response = await fetch("/api/public/newsletter/subscribe", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: email.trim() }),
            });

            const data = await response.json();
            if (data.success) {
                setStatus("success");
                setMessage(data.message || "Thank you for subscribing!");
                setEmail("");
            } else {
                setStatus("error");
                setMessage(data.error || "Something went wrong. Please try again.");
            }
        } catch {
            setStatus("error");
            setMessage("Failed to connect to the server.");
        }
    };
    return (
        <aside className="flex h-full w-full flex-col">

            {/* Related Critiques */}
            <div className="flex flex-col gap-8 px-4 min-[360px]:px-5 md:px-0">
                <div className="border-b border-[#2B5940] pb-2">
                    <h3 className="font-sans text-[22px] leading-6.75 text-[#1C1C18]">Related Critiques</h3>
                </div>

                <div className="flex flex-col gap-10">
                    <div className="flex flex-col gap-4 group cursor-pointer">
                        <div className="relative aspect-video w-full overflow-hidden">
                            <Image
                                src="https://images.unsplash.com/photo-1516979187457-637abb4f9353?q=80&w=600&auto=format&fit=crop"
                                fill
                                alt="Essays"
                                className="object-cover group-hover:scale-105 transition-transform duration-700 grayscale group-hover:grayscale-0"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <span className="font-sans text-[14px] leading-4.25 tracking-[1px] font-semibold uppercase text-[#11412A]">
                                Essays
                            </span>
                            <h4 className="font-heading text-[18px] leading-6 font-normal text-[#1C1C18]">
                                The Death of the Novel in the Digital Age
                            </h4>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4 group cursor-pointer">
                        <div className="relative aspect-video w-full overflow-hidden">
                            <Image
                                src="https://images.unsplash.com/photo-1491841550275-ad7854e35ca6?q=80&w=600&auto=format&fit=crop"
                                fill
                                alt="Poetry"
                                className="object-cover group-hover:scale-105 transition-transform duration-700 grayscale group-hover:grayscale-0"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <span className="font-sans text-[14px] leading-4.25 tracking-[1px] font-semibold uppercase text-[#11412A]">
                                Poetry
                            </span>
                            <h4 className="font-heading text-[18px] leading-6 font-normal text-[#1C1C18]">
                                Rhythmic Despair: Modern Verse and the Void
                            </h4>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sidebar Ad */}
            <div className="mt-12 flex h-86.25 flex-col items-center justify-center gap-8 border border-[#C1C9C1]/30 bg-[#EBE8E1] p-6 min-[360px]:p-8">
                <span className="font-sans font-medium text-[14px] tracking-[1px] uppercase text-[#A8A29E]">
                    Advertisement
                </span>
                <div className="flex flex-col items-center gap-6">
                    <span className="font-heading text-[16px] leading-5.25 text-center font-normal text-[#57534E]">
                        Support Independent Literary Criticism
                    </span>
                    <button className="bg-[#11412A] hover:bg-[#1a5b3d] text-white px-6 py-2 transition-colors">
                        <span className="font-heading text-[14px] leading-4 font-semibold uppercase tracking-[1.1px]">
                            Join the Circle
                        </span>
                    </button>
                </div>
            </div>

            {/* Newsletter */}
            <div className="mt-12 flex flex-col border-l-4 border-[#EBC164] bg-white pb-6 shadow-sm">
                <div className="flex flex-col gap-4 p-3 min-[360px]:p-4">
                    <h3 className="font-heading text-[22px] leading-7.25 font-normal text-[#1C1C18]">
                        The Weekly Dispatch
                    </h3>
                    <p className="font-heading text-[14px] leading-4.75 font-normal italic text-[#1A1A1A]">
                        Essential reading and cultural curation delivered to your inbox every Sunday morning.
                    </p>
                    <form onSubmit={handleSubmit} className="  transition-colors flex flex-col gap-4">
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={status === "loading"}
                            placeholder="Your email address"
                            className="w-full bg-transparent border border-[#D6D3D1] outline-none p-2 font-sans font-extralight text-[16px] placeholder:text-[#1C1C18]/50 text-[#1C1C18]"
                        />
                        <button
                            type="submit"
                            disabled={status === "loading"}
                            className="h-11 w-full bg-[#EBC164] px-6 text-[11px] uppercase tracking-[0.14em] text-white transition hover:bg-[#d9a44c] disabled:opacity-50 min-[480px]:px-8 min-[640px]:h-12 min-[640px]:w-auto"
                        >
                            {status === "loading" ? "Subscribing..." : "Subscribe"}
                        </button>
                        {status === "error" && <p className="mt-2 text-red-600 text-sm">{message}</p>}
                        {status === "success" && <p className="mt-2 text-green-600 text-sm">{message}</p>}
                    </form>
                </div>
            </div>

        </aside>
    );
}
