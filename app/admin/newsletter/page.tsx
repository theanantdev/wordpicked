"use client";

import { useEffect, useState } from "react";
import { Mail, Trash2, Search, Download } from "lucide-react";

type Subscriber = {
    id: string;
    email: string;
    created_at: string;
};

export default function NewsletterPage() {
    const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState("");

    const fetchSubscribers = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/newsletter");
            const data = await res.json();
            if (data.success) {
                setSubscribers(data.data);
            } else {
                setError(data.error);
            }
        } catch (err) {
            setError("Failed to fetch subscribers.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSubscribers();
    }, []);

    const handleDelete = async (id: string, email: string) => {
        if (!confirm(`Are you sure you want to remove ${email}?`)) return;

        try {
            const res = await fetch("/api/admin/newsletter", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id }),
            });
            const data = await res.json();
            if (data.success) {
                setSubscribers(subscribers.filter(s => s.id !== id));
            } else {
                alert(data.error);
            }
        } catch (err) {
            alert("Failed to delete subscriber.");
        }
    };

    const handleExport = () => {
        const csvContent = "data:text/csv;charset=utf-8," 
            + "Email,Subscribed At\n"
            + subscribers.map(s => `${s.email},${s.created_at}`).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "newsletter_subscribers.csv");
        document.body.appendChild(link);
        link.click();
    };

    const filtered = subscribers.filter(s => 
        s.email.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="max-w-[1240px] mx-auto w-full pb-10">
            {/* Header */}
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h2 className="font-heading font-bold text-[28px] text-[#1A1714]">Newsletter Subscribers</h2>
                    <p className="text-[13px] text-[#8C857C] mt-1">Manage all email signups from your weekly dispatch.</p>
                </div>
                <button 
                    onClick={handleExport}
                    className="flex items-center gap-2 bg-[#11412a] text-white text-[11px] font-bold tracking-[0.1em] uppercase px-5 py-2.5 rounded-[2px] transition hover:bg-black"
                >
                    <Download className="w-4 h-4" /> Export CSV
                </button>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-[4px] border border-[#DDD7CC] shadow-sm">
                    <div className="flex items-center gap-3 text-[#11412a] mb-2">
                        <Mail className="w-5 h-5" />
                        <span className="text-[11px] font-bold tracking-widest uppercase opacity-70">Total Subscribers</span>
                    </div>
                    <div className="text-3xl font-heading font-bold">{subscribers.length}</div>
                </div>
                <div className="bg-white p-6 rounded-[4px] border border-[#DDD7CC] shadow-sm">
                    <div className="flex items-center gap-3 text-[#11412a] mb-2">
                        <Mail className="w-5 h-5" />
                        <span className="text-[11px] font-bold tracking-widest uppercase opacity-70">New This Week</span>
                    </div>
                    <div className="text-3xl font-heading font-bold">
                        {subscribers.filter(s => new Date(s.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length}
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="bg-white border border-[#DDD7CC] rounded-[4px] overflow-hidden shadow-sm">
                {/* Search Bar */}
                <div className="px-6 py-4 border-b border-[#EDE7D9] bg-[#FAFAFA] flex items-center justify-between">
                    <div className="relative w-full max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C857C]" />
                        <input 
                            type="text"
                            placeholder="Search subscribers by email..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-white border border-[#DDD7CC] pl-10 pr-4 py-2 text-[13px] rounded-[2px] focus:outline-none focus:border-[#11412a] transition-colors"
                        />
                    </div>
                    <p className="text-[12px] text-[#8C857C] font-medium">Showing {filtered.length} entries</p>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-[#11412a]/5 text-left border-b border-[#EDE7D9]">
                                <th className="px-6 py-4 text-[10px] tracking-[0.16em] uppercase font-bold text-[#11412a]">Email Address</th>
                                <th className="px-6 py-4 text-[10px] tracking-[0.16em] uppercase font-bold text-[#11412a]">Subscribed On</th>
                                <th className="px-6 py-4 text-[10px] tracking-[0.16em] uppercase font-bold text-[#11412a] text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={3} className="px-6 py-12 text-center text-[13px] text-[#8C857C]">Loading subscribers...</td></tr>
                            ) : error ? (
                                <tr><td colSpan={3} className="px-6 py-12 text-center text-[13px] text-[#DC2828]">{error}</td></tr>
                            ) : filtered.length === 0 ? (
                                <tr><td colSpan={3} className="px-6 py-12 text-center text-[13px] text-[#8C857C]">No subscribers found.</td></tr>
                            ) : (
                                filtered.map((subscriber) => (
                                    <tr key={subscriber.id} className="border-b border-[#EDE7D9] hover:bg-[#FAFAFA] transition-colors group">
                                        <td className="px-6 py-4 text-[14px] font-medium text-[#1A1714]">{subscriber.email}</td>
                                        <td className="px-6 py-4 text-[13px] text-[#8C857C]">
                                            {new Date(subscriber.created_at).toLocaleDateString("en-US", {
                                                month: "short",
                                                day: "2-digit",
                                                year: "numeric"
                                            })}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button 
                                                onClick={() => handleDelete(subscriber.id, subscriber.email)}
                                                className="opacity-0 group-hover:opacity-100 transition-all p-2 text-[#8C857C] hover:text-[#DC2828] hover:bg-[#DC2828]/5 rounded-full"
                                                title="Remove Subscriber"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
