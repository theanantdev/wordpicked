"use client";

import { AlertCircle, CheckCircle2, ChevronDown, Globe, Image as ImageIcon, Loader, PenTool, Save, Send, Tag } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import type { JSONContent } from "@tiptap/core";
import { SimpleEditor } from "@/editor/components/tiptap-templates/simple/simple-editor";

type ArticleBlock = {
    id?: string;
    type: string;
    data: Record<string, unknown>;
};

type ArticleContent = {
    time?: number;
    version?: string;
    blocks: ArticleBlock[];
};

type TiptapNode = {
    type?: string;
    text?: string;
    attrs?: Record<string, unknown>;
    content?: TiptapNode[];
};

const SUBCATEGORY_OPTIONS: Record<string, string[]> = {
    literature: ["Poetry", "Novels", "Essays", "Short Stories", "Criticism"],
    films: ["Reviews", "Trailers", "Interviews", "Box Office", "OTT Releases"],
    artists: ["Profiles", "Exhibitions", "Interviews", "Techniques", "Awards"],
};

function extractText(node?: TiptapNode): string {
    if (!node) return "";
    if (node.text) return node.text;
    return (node.content || [])
        .map((child) => extractText(child))
        .join(" ")
        .replace(/\s+/g, " ")
        .trim();
}

function stripHtml(html: string): string {
    return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function outputDataToTiptap(content: ArticleContent): JSONContent {
    const blocks = content.blocks || [];

    const docContent: JSONContent[] = blocks.map((block) => {
        if (block.type === "header") {
            const data = block.data as { text?: string; level?: number };
            const level = Number(data?.level || 2);
            const text = String(data?.text || "");
            return { type: "heading", attrs: { level }, content: text ? [{ type: "text", text }] : [] };
        }

        if (block.type === "list") {
            const data = block.data as { style?: string; items?: string[] };
            const items = (data?.items || []).filter(Boolean);
            const listType = data?.style === "ordered" ? "orderedList" : "bulletList";
            return {
                type: listType,
                content: items.map((item) => ({
                    type: "listItem",
                    content: [{ type: "paragraph", content: [{ type: "text", text: item }] }],
                })),
            };
        }

        if (block.type === "quote") {
            const data = block.data as { text?: string };
            const text = String(data?.text || "");
            return { type: "blockquote", content: [{ type: "paragraph", content: text ? [{ type: "text", text }] : [] }] };
        }

        if (block.type === "image") {
            const data = block.data as { file?: { url?: string }; url?: string; caption?: string };
            const src = data?.file?.url || data?.url || "";
            if (!src) return { type: "paragraph" };
            const caption = String(data?.caption || "");
            return { type: "image", attrs: { src, alt: caption, title: caption } };
        }

        if (block.type === "raw") {
            const data = block.data as { html?: string };
            const text = stripHtml(String(data?.html || ""));
            return { type: "codeBlock", content: text ? [{ type: "text", text }] : [] };
        }

        if (block.type === "delimiter") {
            return { type: "horizontalRule" };
        }

        const text = String((block.data as { text?: string })?.text || "");
        return { type: "paragraph", content: text ? [{ type: "text", text }] : [] };
    });

    return { type: "doc", content: docContent.length ? docContent : [{ type: "paragraph" }] };
}

function tiptapToOutputData(doc: JSONContent): ArticleContent {
    const nodes = Array.isArray(doc?.content) ? (doc.content as TiptapNode[]) : [];
    const blocks: ArticleContent["blocks"] = [];

    for (const node of nodes) {
        if (!node?.type) continue;

        if (node.type === "heading") {
            blocks.push({
                id: crypto.randomUUID(),
                type: "header",
                data: { text: extractText(node), level: Number(node.attrs?.level || 2) },
            });
            continue;
        }

        if (node.type === "bulletList" || node.type === "orderedList") {
            const items = (node.content || []).map((item) => extractText(item)).filter(Boolean);
            blocks.push({
                id: crypto.randomUUID(),
                type: "list",
                data: { style: node.type === "orderedList" ? "ordered" : "unordered", items },
            });
            continue;
        }

        if (node.type === "blockquote") {
            blocks.push({
                id: crypto.randomUUID(),
                type: "quote",
                data: { text: extractText(node), caption: "" },
            });
            continue;
        }

        if (node.type === "image") {
            const src = typeof node.attrs?.src === "string" ? node.attrs.src : "";
            const caption = typeof node.attrs?.title === "string" ? node.attrs.title : "";
            if (src) {
                blocks.push({
                    id: crypto.randomUUID(),
                    type: "image",
                    data: {
                        file: { url: src },
                        caption,
                        withBorder: false,
                        withBackground: false,
                        stretched: false,
                    },
                });
            }
            continue;
        }

        if (node.type === "horizontalRule") {
            blocks.push({ id: crypto.randomUUID(), type: "delimiter", data: {} });
            continue;
        }

        if (node.type === "codeBlock") {
            const text = extractText(node);
            blocks.push({
                id: crypto.randomUUID(),
                type: "raw",
                data: { html: text ? `<pre><code>${text}</code></pre>` : "" },
            });
            continue;
        }

        if (node.type === "paragraph") {
            blocks.push({ id: crypto.randomUUID(), type: "paragraph", data: { text: extractText(node) } });
        }
    }

    return { time: Date.now(), version: "2.30.0", blocks };
}

export default function NewPostPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const articleId = searchParams.get("id");

    const editorGetterRef = useRef<null | (() => Promise<JSONContent>)>(null);

    const [isSaved, setIsSaved] = useState(false);
    const [isPublished, setIsPublished] = useState(false);
    const [isLoadingArticle, setIsLoadingArticle] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isEditorUploadingImage, setIsEditorUploadingImage] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const [title, setTitle] = useState("");
    const [subtitle, setSubtitle] = useState("");
    const [category, setCategory] = useState("literature");
    const [subcategory, setSubcategory] = useState(SUBCATEGORY_OPTIONS.literature[0]);
    const [tags, setTags] = useState(["Fiction", "Award-Winner"]);
    const [tagInput, setTagInput] = useState("");
    const [publishNow, setPublishNow] = useState(false);
    const [schedule, setSchedule] = useState(false);
    const [publishDate, setPublishDate] = useState("2026-04-30T09:00");
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [isPickOfTheDay, setIsPickOfTheDay] = useState(false);
    const [featuredImageUrl, setFeaturedImageUrl] = useState("");

    const [editorJson, setEditorJson] = useState<JSONContent>({
        type: "doc",
        content: [{ type: "paragraph" }],
    });

    useEffect(() => {
        const incomingCategory = (searchParams.get("category") || "").toLowerCase();
        if (incomingCategory === "literature" || incomingCategory === "films" || incomingCategory === "artists") {
            setCategory(incomingCategory);
        }
    }, [searchParams]);

    useEffect(() => {
        const options = SUBCATEGORY_OPTIONS[category] || [];
        if (!options.length) {
            setSubcategory("");
            return;
        }

        if (!options.includes(subcategory)) {
            setSubcategory(options[0]);
        }
    }, [category, subcategory]);

    useEffect(() => {
        if (!articleId) return;

        let cancelled = false;
        setIsLoadingArticle(true);

        (async () => {
            try {
                const res = await fetch(`/api/articles?id=${encodeURIComponent(articleId)}`, { cache: "no-store" });
                const data = await res.json();

                if (!res.ok || !data.success || !data.data) {
                    throw new Error(data.error || "Failed to load article for editing.");
                }

                if (cancelled) return;

                const article = data.data;
                setTitle(article.title || "");
                setSubtitle(article.subtitle || "");
                setCategory(article.category || "literature");
                setSubcategory(article.subcategory || SUBCATEGORY_OPTIONS.literature[0]);
                setTags(Array.isArray(article.tags) ? article.tags : []);
                setFeaturedImageUrl(article.featured_image_url || "");
                setIsPickOfTheDay(article.is_pick_of_the_day === true);

                const output = (article.content as ArticleContent) || { blocks: [], version: "" };
                setEditorJson(outputDataToTiptap(output));
            } catch (error) {
                if (!cancelled) {
                    setErrorMessage(error instanceof Error ? error.message : "Failed to load article.");
                }
            } finally {
                if (!cancelled) {
                    setIsLoadingArticle(false);
                }
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [articleId]);

    const uploadImageBySignedUrl = useCallback(async (file: File, onProgress?: (event: { progress: number }) => void, abortSignal?: AbortSignal) => {
        const signRes = await fetch("/api/cloudinary/signature", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            signal: abortSignal,
        });
        const signData = await signRes.json();

        if (!signRes.ok || !signData.success) {
            throw new Error(signData.error || "Failed to create upload signature.");
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("api_key", signData.apiKey);
        formData.append("timestamp", String(signData.timestamp));
        formData.append("signature", signData.signature);
        if (signData.folder) {
            formData.append("folder", signData.folder);
        }

        onProgress?.({ progress: 20 });
        const uploadRes = await fetch(signData.uploadUrl, {
            method: "POST",
            body: formData,
            signal: abortSignal,
        });
        const uploadData = await uploadRes.json();

        if (!uploadRes.ok || !uploadData.secure_url) {
            throw new Error(uploadData.error?.message || "Failed to upload image.");
        }

        onProgress?.({ progress: 100 });
        return uploadData.secure_url as string;
    }, []);

    const createArticleRequest = async (status: "draft" | "published", contentPayload: ArticleContent) => {
        const response = await fetch(articleId ? `/api/articles?id=${encodeURIComponent(articleId)}` : "/api/articles", {
            method: articleId ? "PUT" : "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                title: title.trim(),
                subtitle: subtitle.trim(),
                category,
                subcategory,
                tags: Array.from(new Set([subcategory, ...tags].filter(Boolean))),
                content: contentPayload,
                featuredImageUrl: featuredImageUrl || null,
                isPickOfTheDay,
                status,
                publishAt: schedule ? publishDate : null,
            }),
        });

        const data = await response.json();
        return { response, data };
    };

    const persistArticle = async (status: "draft" | "published") => {
        setErrorMessage("");

        if (isEditorUploadingImage) {
            setErrorMessage("Image upload is in progress. Please wait, then try again.");
            return;
        }

        if (!title.trim()) {
            setErrorMessage("Article title is required.");
            return;
        }

        let latestJson = editorJson;
        if (editorGetterRef.current) {
            try {
                latestJson = await editorGetterRef.current();
                setEditorJson(latestJson);
            } catch (error) {
                setErrorMessage(error instanceof Error ? error.message : "Failed to sync editor content.");
                return;
            }
        }

        const latestEditorContent = tiptapToOutputData(latestJson);
        if (!latestEditorContent.blocks?.length) {
            setErrorMessage("Article content is required.");
            return;
        }

        setIsSubmitting(true);
        try {
            const { response, data } = await createArticleRequest(status, latestEditorContent);
            if (!response.ok || !data.success) {
                throw new Error(data.error || "Failed to save article.");
            }

            if (status === "draft") {
                setIsSaved(true);
                setTimeout(() => {
                    setIsSaved(false);
                    router.push("/admin/literature");
                }, 1500);
            } else {
                setIsPublished(true);
                setTimeout(() => {
                    setIsPublished(false);
                    router.push("/admin/literature");
                }, 1500);
            }
        } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : "Failed to save article.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        void (async () => {
            try {
                setErrorMessage("");
                const url = await uploadImageBySignedUrl(file);
                setFeaturedImageUrl(url);
            } catch (error) {
                setErrorMessage(error instanceof Error ? error.message : "Featured image upload failed.");
            }
        })();
    };

    return (
        <div className="min-h-screen bg-linear-to-b from-white to-gray-50 pb-16">
            {isSaved && (
                <div className="fixed top-4 right-4 bg-green-50 border border-green-200 text-green-800 px-4 py-3 shadow-lg flex items-center gap-2 z-50">
                    <CheckCircle2 className="w-5 h-5 shrink-0" />
                    <span className="font-medium">Draft saved successfully!</span>
                </div>
            )}

            {isPublished && (
                <div className="fixed top-4 right-4 bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 shadow-lg flex items-center gap-2 z-50">
                    <CheckCircle2 className="w-5 h-5 shrink-0" />
                    <span className="font-medium">Article published successfully!</span>
                </div>
            )}

            {errorMessage && (
                <div className="fixed top-4 left-4 right-4 sm:right-auto sm:w-fit bg-red-50 border border-red-200 text-red-800 px-4 py-3 shadow-lg flex items-center gap-2 z-50">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <span className="font-medium">{errorMessage}</span>
                </div>
            )}

            <div className="max-w-360 mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6 sm:mb-8">
                    <div className="flex-1 min-w-0">
                        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">{articleId ? "Edit Article" : "Create New Article"}</h1>
                        <p className="text-slate-600 flex items-center gap-1 text-sm sm:text-base flex-wrap">
                            <PenTool className="w-4 h-4 shrink-0" />
                            <span>{articleId ? "Update and republish your article" : "Write, save, and publish your amazing story"}</span>
                        </p>
                    </div>

                    <div className="hidden sm:flex flex-row gap-2 w-full sm:w-auto">
                        <button onClick={() => void persistArticle("draft")} disabled={isSubmitting || isLoadingArticle} className={`flex items-center justify-center gap-2 px-4 py-2.5 font-medium text-sm transition-all duration-200 ${isSubmitting ? "bg-[#E8E3D6] text-slate-500 cursor-not-allowed" : "bg-[#F7F3EC] text-slate-700 hover:bg-[#EDE7D9]"
                            }`}>
                            {isSubmitting ? <Loader className="w-4 h-4 shrink-0 animate-spin" /> : <Save className="w-4 h-4 shrink-0" />}
                            {isSubmitting ? "Saving..." : "Save Draft"}
                        </button>
                        <button onClick={() => void persistArticle("published")} disabled={isSubmitting || isLoadingArticle} className={`flex items-center justify-center gap-2 px-6 py-2.5 font-medium text-sm transition-all duration-200 ${isSubmitting ? "bg-[#D4A857] text-slate-50 cursor-not-allowed" : "bg-[#E0BC78] text-slate-900 hover:bg-[#D4A857]"
                            }`}>
                            {isSubmitting ? <Loader className="w-4 h-4 shrink-0 animate-spin" /> : <Send className="w-4 h-4 shrink-0" />}
                            {isSubmitting ? "Processing..." : articleId ? "Update" : "Publish"}
                        </button>
                    </div>
                </div>

                {isLoadingArticle && (
                    <div className="mb-4 rounded border border-[#DDD7CC] bg-white px-4 py-3 text-sm text-[#8C857C]">Loading article data...</div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
                    <div className="lg:col-span-3 space-y-4 sm:space-y-6">
                        <div className="bg-white border border-slate-200 shadow-sm p-4 sm:p-6">
                            <label className="block text-sm font-semibold text-slate-900 mb-3">Article Title *</label>
                            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full font-heading text-2xl sm:text-3xl font-bold text-slate-900 border-none bg-transparent outline-none pb-3 border-b-2 border-slate-200" placeholder="Enter your article title..." />
                            <input type="text" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} className="w-full text-sm sm:text-base text-slate-600 border-none bg-transparent outline-none pt-3 italic" placeholder="Add a subtitle or brief summary (optional)..." />
                        </div>

                        <div className="bg-white border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                            <div className="flex items-center gap-2 px-4 sm:px-6 py-3 border-b border-slate-200 bg-linear-to-r from-slate-50 to-white">
                                <div className="w-8 h-8 bg-blue-100 flex items-center justify-center shrink-0">
                                    <PenTool className="w-4 h-4 text-blue-600" />
                                </div>
                                <div className="min-w-0">
                                    <h3 className="font-bold text-slate-900 text-sm sm:text-base">Article Content</h3>
                                </div>
                            </div>

                            <SimpleEditor
                                className="w-full max-w-none border-0"
                                initialContent={editorJson}
                                onContentChange={setEditorJson}
                                onEditorReady={(getter) => {
                                    editorGetterRef.current = getter;
                                }}
                                onImageUpload={uploadImageBySignedUrl}
                                onImageUploadStateChange={setIsEditorUploadingImage}
                            />
                        </div>
                    </div>

                    <div className="lg:col-span-1 space-y-4 sm:space-y-6">
                        <div className="bg-linear-to-br from-blue-50 to-indigo-50 border border-blue-200 p-3 sm:p-4 shadow-sm">
                            <div className="flex items-start gap-2 sm:gap-3">
                                <AlertCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                                <div className="min-w-0">
                                    <p className="font-semibold text-blue-900 text-xs sm:text-sm mb-1">{articleId ? "Editing Mode" : "Not Published"}</p>
                                    <p className="text-xs text-blue-700">{isEditorUploadingImage ? "Uploading image to Cloudinary..." : "All content is synced before draft/publish."}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white border border-slate-200 shadow-sm overflow-hidden">
                            <div className="flex items-center gap-2 px-3 sm:px-4 py-2.5 border-b border-slate-200 bg-slate-50">
                                <ImageIcon className="w-4 h-4 text-slate-600 shrink-0" />
                                <h3 className="font-semibold text-slate-900 text-xs sm:text-sm">Featured Image</h3>
                            </div>
                            <div className="p-3 sm:p-4">
                                <label className="border-2 border-dashed border-slate-300 bg-linear-to-br from-slate-50 to-slate-100 p-4 sm:p-6 flex flex-col items-center justify-center text-center cursor-pointer">
                                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                                    <p className="text-xs sm:text-sm font-medium text-slate-900">Click to upload</p>
                                </label>
                                {featuredImageUrl && (
                                    <div className="mt-3 overflow-hidden rounded border border-slate-200">
                                        <Image src={featuredImageUrl} alt="Featured" width={640} height={256} className="h-32 w-full object-cover" />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="bg-white border border-slate-200 shadow-sm overflow-hidden">
                            <div className="flex items-center gap-2 px-3 sm:px-4 py-2.5 border-b border-slate-200 bg-slate-50">
                                <Tag className="w-4 h-4 text-slate-600 shrink-0" />
                                <h3 className="font-semibold text-slate-900 text-xs sm:text-sm">Category & Tags</h3>
                            </div>
                            <div className="p-3 sm:p-4 flex flex-col gap-3">
                                <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-white border border-slate-300 text-xs sm:text-sm px-3 py-2">
                                    <option value="literature">Literature</option>
                                    <option value="films">Films</option>
                                    <option value="artists">Artists</option>
                                </select>

                                <select value={subcategory} onChange={(e) => setSubcategory(e.target.value)} className="w-full bg-white border border-slate-300 text-xs sm:text-sm px-3 py-2">
                                    {(SUBCATEGORY_OPTIONS[category] || []).map((option) => (
                                        <option key={option} value={option}>{option}</option>
                                    ))}
                                </select>

                                <div className="flex flex-wrap gap-1 p-2 bg-slate-50 border border-slate-300">
                                    {tags.map((tag, index) => (
                                        <div key={index} className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-md">
                                            <span>{tag}</span>
                                            <button onClick={() => setTags(tags.filter((_, i) => i !== index))}>×</button>
                                        </div>
                                    ))}
                                    <input
                                        type="text"
                                        value={tagInput}
                                        onChange={(e) => setTagInput(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                e.preventDefault();
                                                if (tagInput.trim() && !tags.includes(tagInput.trim())) {
                                                    setTags([...tags, tagInput.trim()]);
                                                    setTagInput("");
                                                }
                                            }
                                        }}
                                        className="flex-1 min-w-20 bg-transparent border-none outline-none text-xs"
                                        placeholder="Add tag..."
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white border border-slate-200 shadow-sm overflow-hidden">
                            <div className="flex items-center gap-2 px-3 sm:px-4 py-2.5 border-b border-slate-200 bg-slate-50">
                                <Globe className="w-4 h-4 text-slate-600 shrink-0" />
                                <h3 className="font-semibold text-slate-900 text-xs sm:text-sm">Publish Settings</h3>
                            </div>
                            <div className="p-3 sm:p-4 flex flex-col gap-3">
                                <label className="flex items-center justify-between text-xs sm:text-sm">
                                    <span>Publish Now</span>
                                    <input type="checkbox" checked={publishNow} onChange={() => setPublishNow((v) => !v)} />
                                </label>
                                <label className="flex items-center justify-between text-xs sm:text-sm">
                                    <span>Schedule</span>
                                    <input type="checkbox" checked={schedule} onChange={() => setSchedule((v) => !v)} />
                                </label>
                                {schedule && (
                                    <input type="datetime-local" value={publishDate} onChange={(e) => setPublishDate(e.target.value)} className="w-full bg-white border border-slate-300 text-xs sm:text-sm px-3 py-2" />
                                )}
                                <label className="flex items-center justify-between text-xs sm:text-sm">
                                    <span>Pick of the Day</span>
                                    <input type="checkbox" checked={isPickOfTheDay} onChange={() => setIsPickOfTheDay((v) => !v)} />
                                </label>
                            </div>
                        </div>

                        <div className="bg-linear-to-br from-slate-50 to-gray-50 border border-slate-200 p-3 sm:p-4 overflow-hidden">
                            <button onClick={() => setShowAdvanced((v) => !v)} className="w-full flex items-center justify-between p-2 hover:bg-white transition-colors">
                                <span className="font-semibold text-slate-900 text-xs sm:text-sm">Advanced Options</span>
                                <ChevronDown className={`w-4 h-4 text-slate-600 transition-transform ${showAdvanced ? "rotate-180" : ""}`} />
                            </button>
                        </div>

                        <div className="sm:hidden flex flex-col gap-2 w-full">
                            <button onClick={() => void persistArticle("draft")} disabled={isSubmitting || isLoadingArticle} className={`flex items-center justify-center gap-2 px-3 py-2.5 font-medium text-sm transition-all duration-200 ${isSubmitting ? "bg-[#E8E3D6] text-slate-500 cursor-not-allowed" : "bg-[#F7F3EC] text-slate-700 hover:bg-[#EDE7D9]"
                                }`}>
                                {isSubmitting ? <Loader className="w-4 h-4 shrink-0 animate-spin" /> : <Save className="w-4 h-4 shrink-0" />}
                                {isSubmitting ? "Saving..." : "Save Draft"}
                            </button>
                            <button onClick={() => void persistArticle("published")} disabled={isSubmitting || isLoadingArticle} className={`flex items-center justify-center gap-2 px-4 py-2.5 font-medium text-sm transition-all duration-200 ${isSubmitting ? "bg-[#D4A857] text-slate-50 cursor-not-allowed" : "bg-[#E0BC78] text-slate-900 hover:bg-[#D4A857]"
                                }`}>
                                {isSubmitting ? <Loader className="w-4 h-4 shrink-0 animate-spin" /> : <Send className="w-4 h-4 shrink-0" />}
                                {isSubmitting ? "Processing..." : articleId ? "Update" : "Publish"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
