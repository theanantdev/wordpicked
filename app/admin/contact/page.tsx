"use client";

import { useEffect, useMemo, useState } from "react";
import { Eye, Mail, Search, Trash2, X } from "lucide-react";

type ContactMessage = {
    id: string;
    first_name: string;
    last_name: string | null;
    email: string;
    subject: string;
    message: string;
    created_at: string;
};

export default function AdminContactPage() {
    const [messages, setMessages] = useState<ContactMessage[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState("");
    const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

    const fetchMessages = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch("/api/admin/contact");
            const data = await response.json();

            if (!response.ok || !data.success) {
                setError(data.error || "Failed to fetch contact messages.");
                return;
            }

            setMessages(data.data || []);
        } catch {
            setError("Failed to fetch contact messages.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, []);

    const filteredMessages = useMemo(() => {
        const query = search.trim().toLowerCase();
        if (!query) return messages;

        return messages.filter((item) => {
            const fullName = `${item.first_name} ${item.last_name || ""}`.toLowerCase();
            return (
                fullName.includes(query)
                || item.email.toLowerCase().includes(query)
                || item.subject.toLowerCase().includes(query)
                || item.message.toLowerCase().includes(query)
            );
        });
    }, [messages, search]);

    const handleDelete = async (id: string, email: string) => {
        if (!confirm(`Delete message from ${email}?`)) return;

        try {
            const response = await fetch("/api/admin/contact", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id }),
            });

            const data = await response.json();
            if (!response.ok || !data.success) {
                alert(data.error || "Failed to delete message.");
                return;
            }

            setMessages((prev) => prev.filter((item) => item.id !== id));
        } catch {
            alert("Failed to delete message.");
        }
    };

    const openMessage = (message: ContactMessage) => {
        setSelectedMessage(message);
    };

    const closeMessage = () => {
        setSelectedMessage(null);
    };

    return (
        <div className="mx-auto w-full max-w-310 pb-10">
            <div className="mb-8 flex items-end justify-between gap-4">
                <div>
                    <h2 className="font-heading text-[28px] font-bold text-[#1A1714]">Contact Messages</h2>
                    <p className="mt-1 text-[13px] text-[#8C857C]">Messages submitted from the public contact page.</p>
                </div>
                <div className="rounded-lg border border-[#DDD7CC] bg-white px-4 py-3 text-right">
                    <div className="text-[10px] uppercase tracking-[0.16em] text-[#8C857C]">Total</div>
                    <div className="font-heading text-[24px] font-bold text-[#1A1714]">{messages.length}</div>
                </div>
            </div>

            <div className="overflow-hidden rounded-lg border border-[#DDD7CC] bg-white shadow-sm">
                <div className="flex flex-col gap-3 border-b border-[#EDE7D9] bg-[#FAFAFA] px-6 py-4 md:flex-row md:items-center md:justify-between">
                    <div className="relative w-full md:max-w-md">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8C857C]" />
                        <input
                            type="text"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Search name, email, subject, message..."
                            className="w-full rounded-xs border border-[#DDD7CC] bg-white py-2 pl-10 pr-4 text-[13px] focus:border-[#11412a] focus:outline-none"
                        />
                    </div>
                    <p className="text-[12px] font-medium text-[#8C857C]">Showing {filteredMessages.length} entries</p>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="border-b border-[#EDE7D9] bg-[#11412a]/5 text-left">
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.16em] text-[#11412a]">Sender</th>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.16em] text-[#11412a]">Subject & Message</th>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.16em] text-[#11412a]">Received</th>
                                <th className="px-6 py-4 text-right text-[10px] font-bold uppercase tracking-[0.16em] text-[#11412a]">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-[13px] text-[#8C857C]">Loading messages...</td>
                                </tr>
                            ) : error ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-[13px] text-[#DC2828]">{error}</td>
                                </tr>
                            ) : filteredMessages.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-[13px] text-[#8C857C]">No messages found.</td>
                                </tr>
                            ) : (
                                filteredMessages.map((item) => (
                                    <tr key={item.id} className="group border-b border-[#EDE7D9] align-top transition-colors hover:bg-[#FAFAFA]">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-[#1A1714]">
                                                {item.first_name} {item.last_name || ""}
                                            </div>
                                            <div className="mt-0.5 flex items-center gap-1 text-[12px] text-[#8C857C]">
                                                <Mail className="h-3.5 w-3.5" />
                                                <a href={`mailto:${item.email}`} className="hover:text-[#11412a] hover:underline">{item.email}</a>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-[#1A1714]">{item.subject}</div>
                                            <p className="mt-1 line-clamp-3 max-w-145 text-[13px] text-[#57534E]">{item.message}</p>
                                        </td>
                                        <td className="px-6 py-4 text-[13px] text-[#8C857C]">
                                            {new Date(item.created_at).toLocaleDateString("en-US", {
                                                month: "short",
                                                day: "2-digit",
                                                year: "numeric",
                                            })}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => openMessage(item)}
                                                className="mr-2 inline-flex items-center gap-1 rounded-full border border-[#DDD7CC] px-3 py-1.5 text-[11px] font-medium text-[#1A1714] transition-colors hover:border-[#11412a] hover:text-[#11412a]"
                                                title="View message details"
                                            >
                                                <Eye className="h-3.5 w-3.5" />
                                                View
                                            </button>
                                            <button
                                                onClick={() => handleDelete(item.id, item.email)}
                                                className="rounded-full p-2 text-[#8C857C] transition-all hover:bg-[#DC2828]/5 hover:text-[#DC2828] md:opacity-0 md:group-hover:opacity-100"
                                                title="Delete message"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {selectedMessage && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6" onClick={closeMessage}>
                    <div
                        className="relative w-full max-w-3xl overflow-hidden rounded-lg bg-white shadow-2xl"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="flex items-start justify-between border-b border-[#EDE7D9] px-5 py-4 sm:px-6">
                            <div>
                                <p className="text-[10px] uppercase tracking-[0.16em] text-[#8C857C]">Contact Message</p>
                                <h3 className="mt-1 font-heading text-[22px] font-bold text-[#1A1714]">{selectedMessage.subject}</h3>
                            </div>
                            <button
                                onClick={closeMessage}
                                className="rounded-full p-2 text-[#8C857C] transition-colors hover:bg-[#F5F0E8] hover:text-[#1A1714]"
                                aria-label="Close message details"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="grid gap-6 px-5 py-5 sm:px-6 md:grid-cols-[1.1fr_1.9fr]">
                            <div className="space-y-4">
                                <div>
                                    <div className="text-[10px] uppercase tracking-[0.16em] text-[#8C857C]">Sender</div>
                                    <div className="mt-1 font-medium text-[#1A1714]">
                                        {selectedMessage.first_name} {selectedMessage.last_name || ""}
                                    </div>
                                </div>

                                <div>
                                    <div className="text-[10px] uppercase tracking-[0.16em] text-[#8C857C]">Email</div>
                                    <a href={`mailto:${selectedMessage.email}`} className="mt-1 block text-[#11412a] hover:underline">
                                        {selectedMessage.email}
                                    </a>
                                </div>

                                <div>
                                    <div className="text-[10px] uppercase tracking-[0.16em] text-[#8C857C]">Received</div>
                                    <div className="mt-1 text-[#1A1714]">
                                        {new Date(selectedMessage.created_at).toLocaleString("en-US", {
                                            month: "short",
                                            day: "2-digit",
                                            year: "numeric",
                                            hour: "numeric",
                                            minute: "2-digit",
                                        })}
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-lg border border-[#EDE7D9] bg-[#FAFAFA] p-4 sm:p-5">
                                <div className="text-[10px] uppercase tracking-[0.16em] text-[#8C857C]">Message</div>
                                <p className="mt-3 whitespace-pre-wrap text-[14px] leading-7 text-[#2B2927]">
                                    {selectedMessage.message}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
