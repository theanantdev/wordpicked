"use client";

import { useActionState, useEffect, useState, useRef } from "react";
import Image from "next/image";
import { Plus, Trash2, Image as ImageIcon, Loader2 } from "lucide-react";
import { Artist } from "@/utils/server-artists";
import { createArtistAction, deleteArtistAction, ActionState } from "../actions";

interface ArtistsClientProps {
    initialArtists: Artist[];
}

const initialState: ActionState = {};

type ArtistFormValues = {
    full_name: string;
    art_form: string;
    quote: string;
    biography: string;
    instagram: string;
    twitter: string;
    website: string;
    is_featured: boolean;
};

const defaultFormValues: ArtistFormValues = {
    full_name: "",
    art_form: "",
    quote: "",
    biography: "",
    instagram: "",
    twitter: "",
    website: "",
    is_featured: false,
};

function isCloudinaryUrl(url: string): boolean {
    return /^https:\/\/res\.cloudinary\.com\//i.test(url);
}

export function ArtistsClient({ initialArtists }: ArtistsClientProps) {
    const [artists, setArtists] = useState<Artist[]>(initialArtists);
    const [state, formAction, isPending] = useActionState<ActionState, FormData>(createArtistAction, initialState);
    const [editingArtistId, setEditingArtistId] = useState<string | null>(null);
    const [formValues, setFormValues] = useState<ArtistFormValues>(defaultFormValues);

    // Cloudinary state
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isUploadingImage, setIsUploadingImage] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const handledSuccessRef = useRef<string | null>(null);

    const isSaving = isPending || isUploadingImage;

    const resetForm = () => {
        setEditingArtistId(null);
        setFormValues(defaultFormValues);
        setImageFile(null);
        setImagePreview(null);
        setUploadError(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleAddArtist = () => {
        if (isFormOpen && !editingArtistId) {
            setIsFormOpen(false);
            return;
        }
        resetForm();
        setIsFormOpen(true);
    };

    const handleEditArtist = (artist: Artist) => {
        setEditingArtistId(artist.id);
        setFormValues({
            full_name: artist.full_name || "",
            art_form: artist.art_form || "",
            quote: artist.quote || "",
            biography: artist.biography || "",
            instagram: artist.instagram || "",
            twitter: artist.twitter || "",
            website: artist.website || "",
            is_featured: artist.is_featured === true,
        });
        setImageFile(null);
        setImagePreview(artist.image_url || null);
        setUploadError(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        setIsFormOpen(true);
    };

    const handleCancel = () => {
        setIsFormOpen(false);
        resetForm();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this artist?')) return;
        const res = await deleteArtistAction(id);
        if (res.success) {
            setArtists((prev) => prev.filter((a) => a.id !== id));
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setUploadError(null);

        const form = e.currentTarget;
        const formData = new FormData(form);

        // Preserve only valid Cloudinary URLs from existing records.
        if (!imageFile && imagePreview && isCloudinaryUrl(imagePreview)) {
            formData.set('image_url', imagePreview);
        } else {
            formData.delete('image_url');
        }

        if (imageFile) {
            setIsUploadingImage(true);
            try {
                // Get Signature
                const sigRes = await fetch('/api/cloudinary/signature', { method: 'POST' });
                const sigData = await sigRes.json();

                if (!sigData.success) {
                    throw new Error(sigData.error || 'Failed to get signature');
                }

                // Upload to Cloudinary
                const cloudinaryData = new FormData();
                cloudinaryData.append('file', imageFile);
                cloudinaryData.append('api_key', sigData.apiKey);
                cloudinaryData.append('timestamp', sigData.timestamp.toString());
                cloudinaryData.append('signature', sigData.signature);
                cloudinaryData.append('folder', sigData.folder);

                const uploadRes = await fetch(sigData.uploadUrl, {
                    method: 'POST',
                    body: cloudinaryData,
                });

                const uploadResult = await uploadRes.json();

                if (uploadResult.secure_url) {
                    formData.set('image_url', uploadResult.secure_url);
                    setImagePreview(uploadResult.secure_url);
                } else {
                    throw new Error('Failed to upload image');
                }
            } catch (err) {
                console.error(err);
                setUploadError(err instanceof Error ? err.message : 'Image upload failed');
                setIsUploadingImage(false);
                return;
            }
            setIsUploadingImage(false);
        }

        // Call the useActionState action with updated formData
        if (editingArtistId) {
            formData.append('artist_id', editingArtistId);
        }
        formAction(formData);
    };

    useEffect(() => {
        if (!state.success || !state.artist) return;

        const token = `${state.artist.id}:${state.message || "ok"}`;
        if (handledSuccessRef.current === token) return;
        handledSuccessRef.current = token;

        const savedArtist = state.artist;
        setArtists((prev) => {
            const alreadyExists = prev.some((artist) => artist.id === savedArtist.id);
            return alreadyExists
                ? prev.map((artist) => (artist.id === savedArtist.id ? savedArtist : artist))
                : [savedArtist, ...prev];
        });

        setIsFormOpen(false);
        setEditingArtistId(null);
        setFormValues(defaultFormValues);
        setImageFile(null);
        setImagePreview(null);
        setUploadError(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    }, [state.success, state.artist, state.message]);

    // Note: To automatically prepend our optimistically added artist or refresh, Next.js revalidatePath runs on the server, 
    // but the client component might not get the fresh initialArtists without a prop update or transition. 
    // Usually, we'd wrap this in a router.refresh() after success, but we'll let useActionState / revalidatePath do its thing.

    return (
        <div className="max-w-[1240px] mx-auto w-full pb-10">
            {/* Header */}
            <div className="flex justify-between items-end mb-6">
                <div>
                    <h2 className="font-heading font-bold text-[22px] text-[#1A1714]">Artist Profiles</h2>
                    <div className="text-[12.5px] text-[#8C857C] mt-1">{artists.length} active profiles</div>
                </div>
                <button
                    onClick={handleAddArtist}
                    className="flex items-center gap-1.5 bg-[#B5542A] text-white text-[11px] font-medium tracking-[0.08em] uppercase px-4 py-2 rounded-[2px] transition-colors hover:bg-[#C96840]"
                >
                    <Plus className="w-[14px] h-[14px]" />
                    {isFormOpen && !editingArtistId ? "Close Form" : "Add Artist"}
                </button>
            </div>
            {/* Add Artist Form Placeholder Box */}
            {isFormOpen && (
                <div className="bg-white border text-left border-[#DDD7CC] rounded-[4px] shadow-[0_2px_4px_rgba(26,23,20,0.02)] overflow-hidden max-w-[800px] mb-10">
                    <form onSubmit={handleSubmit}>
                        <div className="px-6 py-4 border-b border-[#EDE7D9] flex justify-between items-center bg-[#FAFAFA]">
                            <div className="font-heading font-bold text-[16px] text-[#1A1714]">{editingArtistId ? "Edit Artist Profile" : "Add New Artist Profile"}</div>
                            <span className="text-[11px] text-[#8C857C]">Takes less than 2 minutes</span>
                        </div>

                        {state.error && (
                            <div className="px-6 py-3 bg-red-50 border-b border-red-100 text-red-600 text-sm">
                                {state.error}
                            </div>
                        )}
                        {uploadError && (
                            <div className="px-6 py-3 bg-red-50 border-b border-red-100 text-red-600 text-sm">
                                {uploadError}
                            </div>
                        )}
                        {state.success && (
                            <div className="px-6 py-3 bg-green-50 border-b border-green-100 text-green-600 text-sm">
                                {editingArtistId ? "Artist profile successfully updated!" : "Artist profile successfully created!"}
                            </div>
                        )}

                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-4">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[11px] font-medium tracking-[0.08em] uppercase text-[#1A1714]">Full Name *</label>
                                    <input name="full_name" required type="text" value={formValues.full_name} onChange={(e) => setFormValues((prev) => ({ ...prev, full_name: e.target.value }))} placeholder="Artist's full name" className="w-full bg-white border border-[#DDD7CC] text-[13px] px-3 py-2 rounded-[2px] text-[#1A1714] outline-none hover:border-[#1A1714] focus:border-[#1A1714] transition-colors" />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[11px] font-medium tracking-[0.08em] uppercase text-[#1A1714]">Art Form *</label>
                                    <input name="art_form" required type="text" value={formValues.art_form} onChange={(e) => setFormValues((prev) => ({ ...prev, art_form: e.target.value }))} placeholder="Writer, Filmmaker, Poet..." className="w-full bg-white border border-[#DDD7CC] text-[13px] px-3 py-2 rounded-[2px] text-[#1A1714] outline-none hover:border-[#1A1714] focus:border-[#1A1714] transition-colors" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-4">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[11px] font-medium tracking-[0.08em] uppercase text-[#1A1714]">Profile Image</label>
                                    <div className="flex items-start gap-4">
                                        {imagePreview ? (
                                            <div className="relative w-16 h-16 rounded-[2px] overflow-hidden border border-[#DDD7CC]">
                                                <Image loading="lazy" src={imagePreview} alt="Preview" fill unoptimized className="object-cover" />
                                                <button
                                                    type="button"
                                                    onClick={() => { setImageFile(null); setImagePreview(null); if (fileInputRef.current) fileInputRef.current.value = ""; }}
                                                    className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                                                >
                                                    <Trash2 className="w-4 h-4 text-white" />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="w-16 h-16 rounded-[2px] bg-[#FAFAFA] border border-[#DDD7CC] flex items-center justify-center text-[#8C857C]">
                                                <ImageIcon className="w-5 h-5" />
                                            </div>
                                        )}
                                        <div className="flex-1">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleFileChange}
                                                ref={fileInputRef}
                                                className="hidden"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => fileInputRef.current?.click()}
                                                className="text-[11px] font-medium text-[#1A1714] bg-white border border-[#DDD7CC] px-3 py-1.5 rounded-[2px] hover:bg-[#EDE7D9] transition-colors"
                                            >
                                                {isUploadingImage ? "Uploading..." : "Upload Image"}
                                            </button>
                                            <div className="text-[10px] text-[#8C857C] mt-1.5">Recommended: 800x1000px, under 2MB</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex w-full items-center pl-2 pt-2">
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <div className="relative flex items-center">
                                            <input
                                                type="checkbox"
                                                name="is_featured"
                                                value="true"
                                                checked={formValues.is_featured}
                                                onChange={(e) => setFormValues((prev) => ({ ...prev, is_featured: e.target.checked }))}
                                                className="peer h-4 w-4 cursor-pointer appearance-none rounded-[2px] border border-[#DDD7CC] checked:border-[#A8812A] checked:bg-[#A8812A] hover:border-[#1A1714]"
                                            />
                                            <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                        </div>
                                        <span className="text-[11px] font-medium tracking-[0.08em] uppercase text-[#1A1714] group-hover:text-[#A8812A] transition-colors">Featured Artist</span>
                                    </label>
                                </div>
                            </div>

                            <div className="flex flex-col gap-1.5 mb-4">
                                <label className="text-[11px] font-medium tracking-[0.08em] uppercase text-[#1A1714]">Quote</label>
                                <textarea name="quote" value={formValues.quote} onChange={(e) => setFormValues((prev) => ({ ...prev, quote: e.target.value }))} placeholder="Signature quote..." className="w-full min-h-[60px] bg-white border border-[#DDD7CC] text-[13px] px-3 py-2 rounded-[2px] text-[#1A1714] outline-none hover:border-[#1A1714] focus:border-[#1A1714] transition-colors resize-y" />
                            </div>

                            <div className="flex flex-col gap-1.5 mb-4">
                                <label className="text-[11px] font-medium tracking-[0.08em] uppercase text-[#1A1714]">Biography</label>
                                <textarea name="biography" value={formValues.biography} onChange={(e) => setFormValues((prev) => ({ ...prev, biography: e.target.value }))} placeholder="Short biography for profile page..." className="w-full min-h-[80px] bg-white border border-[#DDD7CC] text-[13px] px-3 py-2 rounded-[2px] text-[#1A1714] outline-none hover:border-[#1A1714] focus:border-[#1A1714] transition-colors resize-y" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[11px] font-medium tracking-[0.08em] uppercase text-[#1A1714]">Instagram</label>
                                    <input name="instagram" type="text" value={formValues.instagram} onChange={(e) => setFormValues((prev) => ({ ...prev, instagram: e.target.value }))} placeholder="@handle or URL" className="w-full bg-white border border-[#DDD7CC] text-[13px] px-3 py-2 rounded-[2px] text-[#1A1714] outline-none hover:border-[#1A1714] focus:border-[#1A1714] transition-colors" />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[11px] font-medium tracking-[0.08em] uppercase text-[#1A1714]">Twitter / X</label>
                                    <input name="twitter" type="text" value={formValues.twitter} onChange={(e) => setFormValues((prev) => ({ ...prev, twitter: e.target.value }))} placeholder="@handle or URL" className="w-full bg-white border border-[#DDD7CC] text-[13px] px-3 py-2 rounded-[2px] text-[#1A1714] outline-none hover:border-[#1A1714] focus:border-[#1A1714] transition-colors" />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[11px] font-medium tracking-[0.08em] uppercase text-[#1A1714]">Website</label>
                                    <input name="website" type="url" value={formValues.website} onChange={(e) => setFormValues((prev) => ({ ...prev, website: e.target.value }))} placeholder="https://..." className="w-full bg-white border border-[#DDD7CC] text-[13px] px-3 py-2 rounded-[2px] text-[#1A1714] outline-none hover:border-[#1A1714] focus:border-[#1A1714] transition-colors" />
                                </div>
                            </div>

                            <div className="flex gap-2.5">
                                <button
                                    disabled={isSaving}
                                    type="submit"
                                    className="bg-[#B5542A] disabled:opacity-70 disabled:cursor-not-allowed text-white text-[11px] font-medium tracking-[0.08em] uppercase px-5 py-2.5 rounded-[2px] transition-colors hover:bg-[#C96840] flex items-center justify-center gap-2 min-w-[150px]"
                                >
                                    {isSaving ? (
                                        <>
                                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                            {isUploadingImage ? "Uploading..." : editingArtistId ? "Updating..." : "Saving..."}
                                        </>
                                    ) : (
                                        editingArtistId ? "Update Artist Profile" : "Save Artist Profile"
                                    )}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="bg-white border border-[#DDD7CC] text-[#1A1714] text-[11px] font-medium tracking-[0.08em] uppercase px-5 py-2.5 rounded-[2px] transition-colors hover:bg-[#EDE7D9]"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            )}
            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
                {artists.map((artist) => (
                    <div key={artist.id} className="bg-white border border-[#DDD7CC] rounded-[4px] shadow-[0_2px_4px_rgba(26,23,20,0.02)] flex flex-col p-5">

                        <div className="flex items-center gap-4 mb-4">
                            {artist.image_url ? (
                                <Image loading="lazy" src={artist.image_url} alt={artist.full_name} width={48} height={48} className="rounded-[2px] object-cover shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)]" />
                            ) : (
                                <div className={`w-12 h-12 rounded-[2px] flex items-center justify-center font-heading font-bold text-[18px] text-[rgba(255,255,255,0.9)] bg-gradient-to-br ${artist.gradient} shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)]`}>
                                    {artist.full_name.substring(0, 2).toUpperCase()}
                                </div>
                            )}
                            <div>
                                <div className="font-heading font-bold text-[18px] text-[#1A1714] leading-[1.2] flex items-center gap-2">
                                    {artist.full_name}
                                    {artist.is_featured && (
                                        <span className="text-[#A8812A] text-[10px]">★</span>
                                    )}
                                </div>
                                <div className="text-[12px] text-[#8C857C] mt-0.5">{artist.art_form}</div>
                            </div>
                        </div>

                        <div className="text-[13.5px] leading-[1.6] text-[#1A1714] mb-5 flex-1 line-clamp-3">
                            {artist.biography || "No biography provided."}
                        </div>

                        {artist.quote && (
                            <blockquote className="text-[12px] italic text-[#8C857C] border-l-2 border-[#8C857C]/30 pl-3 mb-4 leading-relaxed line-clamp-2">
                                &quot;{artist.quote}&quot;
                            </blockquote>
                        )}

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
                            <button onClick={() => handleEditArtist(artist)} className="flex-1 text-[11px] font-medium text-[#1A1714] bg-white border border-[#DDD7CC] px-2 py-1.5 rounded-[2px] hover:bg-[#EDE7D9] transition-colors">Edit</button>
                            {/* <button className="flex-1 text-[11px] font-medium text-[#1A1714] bg-white border border-[#DDD7CC] px-2 py-1.5 rounded-[2px] hover:bg-[#EDE7D9] transition-colors">View Posts</button> */}
                            <button onClick={() => handleDelete(artist.id)} className="text-[11px] font-medium text-[#B5542A] bg-white border border-[#B5542A]/30 px-3 py-1.5 rounded-[2px] hover:bg-[#B5542A]/10 transition-colors flex items-center justify-center gap-1">
                                <Trash2 className="w-3 h-3" />
                            </button>
                        </div>
                    </div>
                ))}

                {artists.length === 0 && (
                    <div className="col-span-full py-10 text-center text-[13px] text-[#8C857C]">
                        No artists found. Add one below.
                    </div>
                )}
            </div>


        </div>
    );
}
