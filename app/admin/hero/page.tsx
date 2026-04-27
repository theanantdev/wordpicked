"use client";

import Image from "next/image";
import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import { Edit3, Eye, EyeOff, ImagePlus, Loader2, Plus, Save, Trash2, X } from "lucide-react";

type HeroSlide = {
    id: string;
    eyebrow: string;
    image_url: string;
    mobile_image_url: string;
    sort_order: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
};

type CloudinarySignature = {
    success: boolean;
    timestamp: number;
    signature: string;
    apiKey: string;
    cloudName: string;
    folder: string;
    uploadUrl: string;
    error?: string;
};

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

const INITIAL_FORM = {
    eyebrow: "",
    image_url: "",
    mobile_image_url: "",
    sort_order: 0,
    is_active: true,
};

async function validateImageFile(file: File, minWidth: number, minHeight: number) {
    if (!ALLOWED_TYPES.includes(file.type)) {
        throw new Error("Only JPG, PNG, and WEBP files are allowed.");
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
        throw new Error("Image size must be 5MB or less.");
    }

    const url = URL.createObjectURL(file);

    try {
        const dimensions = await new Promise<{ width: number; height: number }>((resolve, reject) => {
            const nativeImage = new window.Image();
            nativeImage.onload = () => resolve({ width: nativeImage.width, height: nativeImage.height });
            nativeImage.onerror = () => reject(new Error("Unable to read image dimensions."));
            nativeImage.src = url;
        });

        if (dimensions.width < minWidth || dimensions.height < minHeight) {
            throw new Error(`Image must be at least ${minWidth}x${minHeight}px.`);
        }
    } finally {
        URL.revokeObjectURL(url);
    }
}

async function uploadImageWithSignature(file: File): Promise<string> {
    const signatureResponse = await fetch("/api/cloudinary/signature", { method: "POST" });
    const signatureData = (await signatureResponse.json()) as CloudinarySignature;

    if (!signatureResponse.ok || !signatureData.success) {
        throw new Error(signatureData.error || "Failed to generate upload signature.");
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", signatureData.apiKey);
    formData.append("timestamp", signatureData.timestamp.toString());
    formData.append("signature", signatureData.signature);
    formData.append("folder", signatureData.folder);

    const uploadResponse = await fetch(signatureData.uploadUrl, {
        method: "POST",
        body: formData,
    });
    const uploadData = await uploadResponse.json();

    if (!uploadResponse.ok || !uploadData.secure_url) {
        throw new Error(uploadData.error?.message || "Failed to upload image.");
    }

    return uploadData.secure_url as string;
}

export default function AdminHeroPage() {
    const [slides, setSlides] = useState<HeroSlide[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploadingField, setUploadingField] = useState<"desktop" | "mobile" | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState(INITIAL_FORM);

    const isBusy = saving || uploadingField !== null;

    const sortedSlides = useMemo(
        () => [...slides].sort((a, b) => a.sort_order - b.sort_order || a.created_at.localeCompare(b.created_at)),
        [slides],
    );

    const fetchSlides = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch("/api/admin/hero");
            const data = await response.json();

            if (!response.ok || !data.success) {
                setError(data.error || "Failed to fetch hero slides.");
                return;
            }

            setSlides(data.data || []);
        } catch {
            setError("Failed to fetch hero slides.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSlides();
    }, []);

    const resetForm = () => {
        setEditingId(null);
        setForm(INITIAL_FORM);
    };

    const startEdit = (slide: HeroSlide) => {
        setEditingId(slide.id);
        setForm({
            eyebrow: slide.eyebrow,
            image_url: slide.image_url,
            mobile_image_url: slide.mobile_image_url,
            sort_order: slide.sort_order,
            is_active: slide.is_active,
        });
        setError(null);
        setSuccess(null);
    };

    const handleFileUpload = async (event: ChangeEvent<HTMLInputElement>, target: "desktop" | "mobile") => {
        const file = event.target.files?.[0];
        if (!file) return;

        try {
            setError(null);
            setSuccess(null);
            setUploadingField(target);

            if (target === "desktop") {
                await validateImageFile(file, 1200, 600);
            } else {
                await validateImageFile(file, 600, 900);
            }

            const imageUrl = await uploadImageWithSignature(file);
            setForm((prev) => ({
                ...prev,
                image_url: target === "desktop" ? imageUrl : prev.image_url,
                mobile_image_url: target === "mobile" ? imageUrl : prev.mobile_image_url,
            }));

            setSuccess(`${target === "desktop" ? "Desktop" : "Mobile"} image uploaded successfully.`);
        } catch (uploadError) {
            setError(uploadError instanceof Error ? uploadError.message : "Image upload failed.");
        } finally {
            setUploadingField(null);
            event.target.value = "";
        }
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSaving(true);
        setError(null);
        setSuccess(null);

        try {
            const payload = {
                eyebrow: form.eyebrow,
                image_url: form.image_url,
                mobile_image_url: form.mobile_image_url,
                sort_order: form.sort_order,
                is_active: form.is_active,
            };

            const response = await fetch("/api/admin/hero", {
                method: editingId ? "PATCH" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(editingId ? { id: editingId, ...payload } : payload),
            });
            const data = await response.json();

            if (!response.ok || !data.success) {
                setError(data.error || "Failed to save hero slide.");
                return;
            }

            setSuccess(editingId ? "Hero slide updated." : "Hero slide added.");
            resetForm();
            await fetchSlides();
        } catch {
            setError("Failed to save hero slide.");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this hero slide?")) return;

        setError(null);
        setSuccess(null);

        try {
            const response = await fetch("/api/admin/hero", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id }),
            });
            const data = await response.json();

            if (!response.ok || !data.success) {
                setError(data.error || "Failed to delete hero slide.");
                return;
            }

            setSuccess("Hero slide deleted.");
            if (editingId === id) resetForm();
            await fetchSlides();
        } catch {
            setError("Failed to delete hero slide.");
        }
    };

    return (
        <div className="mx-auto w-full max-w-310 pb-10">
            <div className="mb-8 flex items-end justify-between gap-4">
                <div>
                    <h2 className="font-heading text-[28px] font-bold text-[#1A1714]">Home Hero CMS</h2>
                    <p className="mt-1 text-[13px] text-[#8C857C]">Add, edit, delete, and reorder homepage hero slides.</p>
                </div>
                <div className="rounded-lg border border-[#DDD7CC] bg-white px-4 py-3 text-right">
                    <div className="text-[10px] uppercase tracking-[0.16em] text-[#8C857C]">Slides</div>
                    <div className="font-heading text-[24px] font-bold text-[#1A1714]">{slides.length}</div>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1fr_1.25fr]">
                <div className="rounded-lg border border-[#DDD7CC] bg-white p-5 shadow-sm">
                    <h3 className="mb-4 font-heading text-[20px] font-bold text-[#1A1714]">{editingId ? "Edit Slide" : "Add Slide"}</h3>

                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="eyebrow" className="mb-1 block text-[12px] font-medium uppercase tracking-widest text-[#8C857C]">Eyebrow *</label>
                            <input
                                id="eyebrow"
                                value={form.eyebrow}
                                onChange={(event) => setForm((prev) => ({ ...prev, eyebrow: event.target.value }))}
                                maxLength={100}
                                required
                                className="w-full rounded-xs border border-[#DDD7CC] px-3 py-2 text-[14px] text-[#1A1714] outline-none transition-colors focus:border-[#B5542A]"
                                placeholder="Wordpicked presents"
                            />
                        </div>

                        <div>
                            <label htmlFor="sort-order" className="mb-1 block text-[12px] font-medium uppercase tracking-widest text-[#8C857C]">Sort Order *</label>
                            <input
                                id="sort-order"
                                type="number"
                                min={0}
                                max={999}
                                value={form.sort_order}
                                onChange={(event) => setForm((prev) => ({ ...prev, sort_order: Number(event.target.value) || 0 }))}
                                required
                                className="w-full rounded-xs border border-[#DDD7CC] px-3 py-2 text-[14px] text-[#1A1714] outline-none transition-colors focus:border-[#B5542A]"
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-[12px] font-medium uppercase tracking-widest text-[#8C857C]">Desktop Image *</label>
                            <div className="flex items-center gap-2">
                                <input
                                    value={form.image_url}
                                    onChange={(event) => setForm((prev) => ({ ...prev, image_url: event.target.value }))}
                                    required
                                    className="w-full rounded-xs border border-[#DDD7CC] px-3 py-2 text-[13px] text-[#1A1714] outline-none transition-colors focus:border-[#B5542A]"
                                    placeholder="https://..."
                                />
                                <label className="inline-flex cursor-pointer items-center gap-1 rounded-xs border border-[#DDD7CC] px-3 py-2 text-[12px] font-medium hover:bg-[#F5F0E8]">
                                    <ImagePlus className="h-3.5 w-3.5" />
                                    Upload
                                    <input type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={(event) => handleFileUpload(event, "desktop")} />
                                </label>
                            </div>
                            <p className="mt-1 text-[11px] text-[#8C857C]">Allowed: JPG/PNG/WEBP, max 5MB, minimum 1200x600.</p>
                        </div>

                        <div>
                            <label className="mb-1 block text-[12px] font-medium uppercase tracking-widest text-[#8C857C]">Mobile Image *</label>
                            <div className="flex items-center gap-2">
                                <input
                                    value={form.mobile_image_url}
                                    onChange={(event) => setForm((prev) => ({ ...prev, mobile_image_url: event.target.value }))}
                                    required
                                    className="w-full rounded-xs border border-[#DDD7CC] px-3 py-2 text-[13px] text-[#1A1714] outline-none transition-colors focus:border-[#B5542A]"
                                    placeholder="https://..."
                                />
                                <label className="inline-flex cursor-pointer items-center gap-1 rounded-xs border border-[#DDD7CC] px-3 py-2 text-[12px] font-medium hover:bg-[#F5F0E8]">
                                    <ImagePlus className="h-3.5 w-3.5" />
                                    Upload
                                    <input type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={(event) => handleFileUpload(event, "mobile")} />
                                </label>
                            </div>
                            <p className="mt-1 text-[11px] text-[#8C857C]">Allowed: JPG/PNG/WEBP, max 5MB, minimum 600x900.</p>
                        </div>

                        <label className="flex items-center gap-2 text-[13px] text-[#1A1714]">
                            <input
                                type="checkbox"
                                checked={form.is_active}
                                onChange={(event) => setForm((prev) => ({ ...prev, is_active: event.target.checked }))}
                                className="h-4 w-4 rounded border-[#DDD7CC]"
                            />
                            Active slide
                        </label>

                        <div className="flex flex-wrap gap-2">
                            <button
                                type="submit"
                                disabled={isBusy}
                                className="inline-flex items-center gap-1 rounded-xs bg-[#11412A] px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.08em] text-white transition-colors hover:bg-[#0f3623] disabled:cursor-not-allowed disabled:opacity-70"
                            >
                                {isBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : editingId ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                                {editingId ? "Update" : "Add"}
                            </button>

                            {editingId && (
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="inline-flex items-center gap-1 rounded-xs border border-[#DDD7CC] px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.08em] text-[#1A1714] transition-colors hover:bg-[#F5F0E8]"
                                >
                                    <X className="h-4 w-4" /> Cancel
                                </button>
                            )}
                        </div>
                    </form>

                    {uploadingField && <p className="mt-3 text-[12px] text-blue-700">Uploading {uploadingField} image...</p>}
                    {error && <p className="mt-3 text-[12px] text-red-600">{error}</p>}
                    {success && <p className="mt-3 text-[12px] text-green-700">{success}</p>}
                </div>

                <div className="rounded-lg border border-[#DDD7CC] bg-white shadow-sm">
                    <div className="border-b border-[#EDE7D9] px-5 py-4">
                        <h3 className="font-heading text-[20px] font-bold text-[#1A1714]">Current Slides</h3>
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center gap-2 px-5 py-10 text-[#8C857C]">
                            <Loader2 className="h-5 w-5 animate-spin" />
                            <span className="text-[13px]">Loading slides...</span>
                        </div>
                    ) : sortedSlides.length === 0 ? (
                        <div className="px-5 py-10 text-center text-[13px] text-[#8C857C]">No slides found.</div>
                    ) : (
                        <div className="divide-y divide-[#EDE7D9]">
                            {sortedSlides.map((slide) => (
                                <div key={slide.id} className="p-4">
                                    <div className="mb-3 flex items-center justify-between gap-2">
                                        <div>
                                            <p className="font-heading text-[18px] text-[#1A1714]">{slide.eyebrow}</p>
                                            <p className="text-[11px] uppercase tracking-[0.08em] text-[#8C857C]">Order: {slide.sort_order}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className={`inline-flex items-center gap-1 rounded-xs px-2 py-1 text-[10px] uppercase tracking-[0.08em] ${slide.is_active ? "bg-green-100 text-green-700" : "bg-zinc-100 text-zinc-600"}`}>
                                                {slide.is_active ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                                                {slide.is_active ? "Active" : "Hidden"}
                                            </span>
                                            <button
                                                onClick={() => startEdit(slide)}
                                                className="rounded-xs border border-[#DDD7CC] p-2 text-[#1A1714] hover:bg-[#F5F0E8]"
                                                title="Edit slide"
                                            >
                                                <Edit3 className="h-3.5 w-3.5" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(slide.id)}
                                                className="rounded-xs border border-[#DDD7CC] p-2 text-[#8C857C] hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                                                title="Delete slide"
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="grid gap-2 sm:grid-cols-2">
                                        <div className="overflow-hidden rounded-xs border border-[#EDE7D9] bg-[#FAFAFA]">
                                            <div className="relative h-28 w-full">
                                                <Image src={slide.image_url} alt={`${slide.eyebrow} desktop`} fill sizes="280px" className="object-cover" />
                                            </div>
                                            <p className="truncate px-2 py-1 text-[10px] text-[#8C857C]">Desktop</p>
                                        </div>
                                        <div className="overflow-hidden rounded-xs border border-[#EDE7D9] bg-[#FAFAFA]">
                                            <div className="relative h-28 w-full">
                                                <Image src={slide.mobile_image_url} alt={`${slide.eyebrow} mobile`} fill sizes="280px" className="object-cover" />
                                            </div>
                                            <p className="truncate px-2 py-1 text-[10px] text-[#8C857C]">Mobile</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
