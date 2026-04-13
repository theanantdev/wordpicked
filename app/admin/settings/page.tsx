"use client";

import { useState } from "react";
import { Bell, Globe, Lock, Palette, Save } from "lucide-react";

type SettingsState = {
    siteTitle: string;
    supportEmail: string;
    maintenanceMode: boolean;
    allowComments: boolean;
    autoPublish: boolean;
    newsletterEnabled: boolean;
    showTrending: boolean;
    locale: "en" | "hi";
};

const initialSettings: SettingsState = {
    siteTitle: "Wordpicked",
    supportEmail: "support@wordpicked.com",
    maintenanceMode: false,
    allowComments: true,
    autoPublish: false,
    newsletterEnabled: true,
    showTrending: true,
    locale: "en",
};

function Toggle({
    checked,
    onChange,
    label,
    description,
}: {
    checked: boolean;
    onChange: (value: boolean) => void;
    label: string;
    description: string;
}) {
    return (
        <label className="flex items-start justify-between gap-4 rounded-[6px] border border-[#E3DAC8] bg-[#FFFFFF] px-4 py-3">
            <div>
                <div className="text-[13px] font-semibold text-[#1A1714]">{label}</div>
                <div className="mt-0.5 text-[12px] text-[#7C7469]">{description}</div>
            </div>
            <button
                type="button"
                onClick={() => onChange(!checked)}
                className={`relative h-6 w-10 shrink-0 rounded-full transition-colors ${checked ? "bg-[#11412A]" : "bg-[#E3DAC8]"}`}
                aria-pressed={checked}
                aria-label={label}
            >
                <span
                    className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-transform ${checked ? "translate-x-5" : "translate-x-1"}`}
                />
            </button>
        </label>
    );
}

export default function SettingsPage() {
    const [settings, setSettings] = useState<SettingsState>(initialSettings);
    const [isSaving, setIsSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    const update = <K extends keyof SettingsState>(key: K, value: SettingsState[K]) => {
        setSettings((prev) => ({ ...prev, [key]: value }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        setSaved(false);

        await new Promise((resolve) => setTimeout(resolve, 800));

        setIsSaving(false);
        setSaved(true);
    };

    return (
        <div className="max-w-[1240px] mx-auto w-full pb-10">
            <div className="mb-6 flex items-end justify-between gap-4">
                <div>
                    <h1 className="font-heading text-[24px] font-bold text-[#1A1714]">Settings</h1>
                    <p className="mt-1 text-[12.5px] text-[#7C7469]">Manage global app configuration and admin controls.</p>
                </div>

                <button
                    type="button"
                    onClick={() => void handleSave()}
                    disabled={isSaving}
                    className="inline-flex items-center gap-2 rounded-[4px] bg-[#A8812A] px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.06em] text-white transition-colors hover:bg-[#8E6D22] disabled:cursor-not-allowed disabled:opacity-70"
                >
                    <Save className="h-4 w-4" />
                    {isSaving ? "Saving..." : "Save Settings"}
                </button>
            </div>

            {saved && (
                <div className="mb-5 rounded-[4px] border border-[#11412A]/20 bg-[#11412A]/10 px-4 py-3 text-[12px] font-medium text-[#11412A]">
                    Settings updated successfully.
                </div>
            )}

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
                <section className="rounded-[6px] border border-[#E3DAC8] bg-[#FFFFFF] shadow-[0_2px_4px_rgba(26,23,20,0.02)] lg:col-span-2">
                    <div className="border-b border-[#E3DAC8] bg-[#FDF9F2] px-5 py-3">
                        <div className="flex items-center gap-2 text-[13px] font-semibold text-[#1A1714]">
                            <Globe className="h-4 w-4 text-[#A8812A]" />
                            General Settings
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 p-5 md:grid-cols-2">
                        <div>
                            <label className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.08em] text-[#6E675D]">Site Title</label>
                            <input
                                value={settings.siteTitle}
                                onChange={(e) => update("siteTitle", e.target.value)}
                                className="w-full rounded-[4px] border border-[#E3DAC8] bg-[#FFFFFF] px-3 py-2 text-[13px] text-[#1A1714] outline-none focus:border-[#A8812A]"
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.08em] text-[#6E675D]">Support Email</label>
                            <input
                                value={settings.supportEmail}
                                onChange={(e) => update("supportEmail", e.target.value)}
                                className="w-full rounded-[4px] border border-[#E3DAC8] bg-[#FFFFFF] px-3 py-2 text-[13px] text-[#1A1714] outline-none focus:border-[#A8812A]"
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.08em] text-[#6E675D]">Default Locale</label>
                            <select
                                value={settings.locale}
                                onChange={(e) => update("locale", e.target.value as SettingsState["locale"])}
                                className="w-full rounded-[4px] border border-[#E3DAC8] bg-[#FFFFFF] px-3 py-2 text-[13px] text-[#1A1714] outline-none focus:border-[#A8812A]"
                            >
                                <option value="en">English</option>
                                <option value="hi">Hindi</option>
                            </select>
                        </div>
                    </div>
                </section>

                <section className="rounded-[6px] border border-[#E3DAC8] bg-[#FFFFFF] shadow-[0_2px_4px_rgba(26,23,20,0.02)]">
                    <div className="border-b border-[#E3DAC8] bg-[#FDF9F2] px-5 py-3">
                        <div className="flex items-center gap-2 text-[13px] font-semibold text-[#1A1714]">
                            <Palette className="h-4 w-4 text-[#A8812A]" />
                            Theme Colors
                        </div>
                    </div>

                    <div className="space-y-3 p-5">
                        <div className="flex items-center justify-between text-[12px]"><span className="text-[#6E675D]">Primary</span><span className="font-semibold text-[#1A1714]">#A8812A</span></div>
                        <div className="h-2 rounded bg-[#A8812A]" />
                        <div className="flex items-center justify-between text-[12px]"><span className="text-[#6E675D]">Surface</span><span className="font-semibold text-[#1A1714]">#E3DAC8</span></div>
                        <div className="h-2 rounded bg-[#E3DAC8]" />
                        <div className="flex items-center justify-between text-[12px]"><span className="text-[#6E675D]">Base</span><span className="font-semibold text-[#1A1714]">#FDF9F2</span></div>
                        <div className="h-2 rounded bg-[#FDF9F2] border border-[#E3DAC8]" />
                    </div>
                </section>

                <section className="rounded-[6px] border border-[#E3DAC8] bg-[#FFFFFF] shadow-[0_2px_4px_rgba(26,23,20,0.02)] lg:col-span-2">
                    <div className="border-b border-[#E3DAC8] bg-[#FDF9F2] px-5 py-3">
                        <div className="flex items-center gap-2 text-[13px] font-semibold text-[#1A1714]">
                            <Bell className="h-4 w-4 text-[#A8812A]" />
                            Content & Notifications
                        </div>
                    </div>

                    <div className="space-y-3 p-5">
                        <Toggle
                            checked={settings.allowComments}
                            onChange={(value) => update("allowComments", value)}
                            label="Allow Comments"
                            description="Enable comments on public articles and films."
                        />
                        <Toggle
                            checked={settings.newsletterEnabled}
                            onChange={(value) => update("newsletterEnabled", value)}
                            label="Newsletter"
                            description="Send newsletter updates to subscribed users."
                        />
                        <Toggle
                            checked={settings.showTrending}
                            onChange={(value) => update("showTrending", value)}
                            label="Show Trending Modules"
                            description="Display trending sections across public pages."
                        />
                        <Toggle
                            checked={settings.autoPublish}
                            onChange={(value) => update("autoPublish", value)}
                            label="Auto Publish Approved Drafts"
                            description="Automatically publish drafts after moderation approval."
                        />
                    </div>
                </section>

                <section className="rounded-[6px] border border-[#E3DAC8] bg-[#FFFFFF] shadow-[0_2px_4px_rgba(26,23,20,0.02)]">
                    <div className="border-b border-[#E3DAC8] bg-[#FDF9F2] px-5 py-3">
                        <div className="flex items-center gap-2 text-[13px] font-semibold text-[#1A1714]">
                            <Lock className="h-4 w-4 text-[#A8812A]" />
                            Security
                        </div>
                    </div>

                    <div className="space-y-3 p-5">
                        <Toggle
                            checked={settings.maintenanceMode}
                            onChange={(value) => update("maintenanceMode", value)}
                            label="Maintenance Mode"
                            description="Temporarily restrict public access while updates are deployed."
                        />

                        <button
                            type="button"
                            className="w-full rounded-[4px] border border-[#DC2828]/30 bg-[#DC2828]/10 px-3 py-2 text-[12px] font-semibold text-[#DC2828] transition-colors hover:bg-[#DC2828]/15"
                        >
                            Revoke All Active Sessions
                        </button>
                    </div>
                </section>
            </div>
        </div>
    );
}