"use client";

import { FormEvent, useState } from "react";

type SubmitState = "idle" | "loading" | "success" | "error";

export function ContactForm() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [status, setStatus] = useState<SubmitState>("idle");
    const [feedback, setFeedback] = useState("");

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!firstName.trim() || !email.trim() || !subject.trim() || !message.trim()) {
            setStatus("error");
            setFeedback("Please fill all required fields.");
            return;
        }

        setStatus("loading");
        setFeedback("");

        try {
            const response = await fetch("/api/public/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    firstName,
                    lastName,
                    email,
                    subject,
                    message,
                }),
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                setStatus("error");
                setFeedback(data.error || "Failed to send your message.");
                return;
            }

            setStatus("success");
            setFeedback(data.message || "Message sent successfully.");
            setFirstName("");
            setLastName("");
            setEmail("");
            setSubject("");
            setMessage("");
        } catch {
            setStatus("error");
            setFeedback("Failed to connect to the server.");
        }
    };

    return (
        <div className="mb-12 rounded-lg p-2 md:p-10">
            <form className="space-y-3" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                        <label htmlFor="first-name" className="block text-sm font-medium text-zinc-700">
                            First name <span aria-hidden="true" className="text-[#DC2828]">*</span>
                        </label>
                        <div className="mt-1">
                            <input
                                type="text"
                                name="first-name"
                                id="first-name"
                                autoComplete="given-name"
                                className="block w-full rounded-md border border-zinc-300 p-3 text-sm shadow-sm focus:border-[#E0BC78] focus:ring-[#E0BC78]"
                                value={firstName}
                                onChange={(event) => setFirstName(event.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="last-name" className="block text-sm font-medium text-zinc-700">Last name</label>
                        <div className="mt-1">
                            <input
                                type="text"
                                name="last-name"
                                id="last-name"
                                autoComplete="family-name"
                                className="block w-full rounded-md border border-zinc-300 p-3 text-sm shadow-sm focus:border-[#E0BC78] focus:ring-[#E0BC78]"
                                value={lastName}
                                onChange={(event) => setLastName(event.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-zinc-700">
                        Email address <span aria-hidden="true" className="text-[#DC2828]">*</span>
                    </label>
                    <div className="mt-1">
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            className="block w-full rounded-md border border-zinc-300 p-3 text-sm shadow-sm focus:border-[#E0BC78] focus:ring-[#E0BC78]"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            required
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-zinc-700">
                        Subject <span aria-hidden="true" className="text-[#DC2828]">*</span>
                    </label>
                    <div className="mt-1">
                        <input
                            type="text"
                            name="subject"
                            id="subject"
                            className="block w-full rounded-md border border-zinc-300 p-3 text-sm shadow-sm focus:border-[#E0BC78] focus:ring-[#E0BC78]"
                            value={subject}
                            onChange={(event) => setSubject(event.target.value)}
                            required
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="message" className="block text-sm font-medium text-zinc-700">
                        Message <span aria-hidden="true" className="text-[#DC2828]">*</span>
                    </label>
                    <div className="mt-1">
                        <textarea
                            id="message"
                            name="message"
                            rows={6}
                            className="block w-full rounded-md border border-zinc-300 p-3 text-sm shadow-sm focus:border-[#E0BC78] focus:ring-[#E0BC78]"
                            value={message}
                            onChange={(event) => setMessage(event.target.value)}
                            required
                        />
                    </div>
                </div>

                <div>
                    <button
                        type="submit"
                        disabled={status === "loading"}
                        className="flex w-full justify-center rounded-md border border-transparent bg-[#E0BC78] px-4 py-3 text-sm font-medium uppercase tracking-widest text-[#141210] shadow-sm transition-colors hover:bg-[#d6af68] focus:outline-none focus:ring-2 focus:ring-[#E0BC78] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                        {status === "loading" ? "Sending..." : "Send Message"}
                    </button>
                </div>

                {status === "error" && <p className="text-sm text-red-600">{feedback}</p>}
                {status === "success" && <p className="text-sm text-green-700">{feedback}</p>}
            </form>
        </div>
    );
}
