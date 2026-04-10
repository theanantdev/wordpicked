"use client";

import { useState } from "react";

export function NewsletterSection() {
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
        } catch (err) {
            setStatus("error");
            setMessage("Failed to connect to the server.");
        }
    };

    return (
        <section className="bg-[#ebe8e1] py-24">
            <div className="mx-auto flex w-full max-w-4xl flex-col items-center gap-8 px-4 text-center">
                <p className="text-2xl text-[#4b3600]">
                    <svg width="33" height="30" viewBox="0 0 33 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16.5 29.25C15.3 28.3 14 27.5625 12.6 27.0375C11.2 26.5125 9.75 26.25 8.25 26.25C7.2 26.25 6.16875 26.3875 5.15625 26.6625C4.14375 26.9375 3.175 27.325 2.25 27.825C1.725 28.1 1.21875 28.0875 0.73125 27.7875C0.24375 27.4875 0 27.05 0 26.475V8.4C0 8.125 0.06875 7.8625 0.20625 7.6125C0.34375 7.3625 0.55 7.175 0.825 7.05C1.975 6.45 3.175 6 4.425 5.7C5.675 5.4 6.95 5.25 8.25 5.25C9.7 5.25 11.1188 5.4375 12.5063 5.8125C13.8938 6.1875 15.225 6.75 16.5 7.5V25.65C17.775 24.85 19.1125 24.25 20.5125 23.85C21.9125 23.45 23.325 23.25 24.75 23.25C25.65 23.25 26.5312 23.325 27.3937 23.475C28.2562 23.625 29.125 23.85 30 24.15V6.15C30.375 6.275 30.7438 6.40625 31.1063 6.54375C31.4688 6.68125 31.825 6.85 32.175 7.05C32.45 7.175 32.6562 7.3625 32.7938 7.6125C32.9313 7.8625 33 8.125 33 8.4V26.475C33 27.05 32.7562 27.4875 32.2687 27.7875C31.7812 28.0875 31.275 28.1 30.75 27.825C29.825 27.325 28.8563 26.9375 27.8438 26.6625C26.8312 26.3875 25.8 26.25 24.75 26.25C23.25 26.25 21.8 26.5125 20.4 27.0375C19 27.5625 17.7 28.3 16.5 29.25ZM19.5 21.75V7.5L27 0V15L19.5 21.75ZM13.5 24.1875V9.3375C12.675 8.9875 11.8187 8.71875 10.9312 8.53125C10.0437 8.34375 9.15 8.25 8.25 8.25C7.325 8.25 6.425 8.3375 5.55 8.5125C4.675 8.6875 3.825 8.95 3 9.3V24.1875C3.875 23.8625 4.74375 23.625 5.60625 23.475C6.46875 23.325 7.35 23.25 8.25 23.25C9.15 23.25 10.0312 23.325 10.8938 23.475C11.7563 23.625 12.625 23.8625 13.5 24.1875ZM13.5 24.1875V9.3375V24.1875Z" fill="#4B3600" />
                    </svg>
                </p>
                <blockquote className="font-heading text-3xl leading-tight text-[#11412a] md:text-5xl">
                    &ldquo;Curating is the art of deciding what stays in the room
                    <br className="hidden md:block" />
                    when everyone else has left. It is the final word on what truly matters.&rdquo;
                </blockquote>

                <div className="w-full max-w-xl">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
                        <input
                            className="h-12 flex-1 bg-[#fdf9f2] px-4 text-sm text-zinc-700 placeholder:text-zinc-500 focus:outline-none disabled:opacity-50"
                            placeholder="Enter your email for our weekly dispatch"
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={status === "loading"}
                        />
                        <button
                            type="submit"
                            disabled={status === "loading"}
                            className="h-12 bg-[#11412a] px-8 text-xs tracking-[0.14em] text-white uppercase transition hover:bg-[#0a2f1e] disabled:opacity-50"
                        >
                            {status === "loading" ? "Subscribing..." : "Subscribe"}
                        </button>
                    </form>

                    {status === "success" && (
                        <p className="mt-3 text-sm text-[#11412a] font-medium">{message}</p>
                    )}
                    {status === "error" && (
                        <p className="mt-3 text-sm text-[#DC2828] font-medium">{message}</p>
                    )}
                </div>
            </div>
        </section>
    );
}
