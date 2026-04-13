"use client"
import { PenTool, Image as ImageIcon, Tag, Globe, Save, Send, CheckCircle2, ChevronDown, AlertCircle } from "lucide-react";
import Image from 'next/image';
import { useEffect, useState } from "react";
import { useSearchParams } from 'next/navigation';
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
    if (typeof node.text === "string") return node.text;
    return (node.content || [])
        .map((child) => extractText(child))
        .join(" ")
        .replace(/\s+/g, " ")
        .trim();
}

function tiptapToArticleContent(doc: JSONContent): ArticleContent {
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

        if (node.type === "paragraph") {
            blocks.push({ id: crypto.randomUUID(), type: "paragraph", data: { text: extractText(node) } });
        }
    }

    return { time: Date.now(), version: "2.30.0", blocks };
}

export default function NewPostPage() {
    const searchParams = useSearchParams();
    const [isSaved, setIsSaved] = useState(false);
    const [isPublished, setIsPublished] = useState(false);
    const [title, setTitle] = useState("");
    const [subtitle, setSubtitle] = useState("");
    const [category, setCategory] = useState("films");
    const [subcategory, setSubcategory] = useState(SUBCATEGORY_OPTIONS.films[0]);
    const [tags, setTags] = useState(["Film", "Review"]);
    const [tagInput, setTagInput] = useState("");
    const [publishNow, setPublishNow] = useState(false);
    const [schedule, setSchedule] = useState(false);
    const [publishDate, setPublishDate] = useState("2026-04-30T09:00");
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [editorJson, setEditorJson] = useState<JSONContent>({ type: "doc", content: [{ type: "paragraph" }] });
    const [featuredImageUrl, setFeaturedImageUrl] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const incomingCategory = (searchParams.get('category') || '').toLowerCase();
        if (incomingCategory === 'literature' || incomingCategory === 'films' || incomingCategory === 'artists') {
            setCategory(incomingCategory);
        }
    }, [searchParams]);

    useEffect(() => {
        const options = SUBCATEGORY_OPTIONS[category] || [];
        if (!options.length) {
            setSubcategory('');
            return;
        }

        if (!options.includes(subcategory)) {
            setSubcategory(options[0]);
        }
    }, [category, subcategory]);

    const createArticleRequest = async (status: 'draft' | 'published') => {
        const response = await fetch('/api/articles', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title: title.trim(),
                subtitle: subtitle.trim(),
                category,
                subcategory,
                tags: Array.from(new Set([subcategory, ...tags].filter(Boolean))),
                content: tiptapToArticleContent(editorJson),
                featuredImageUrl: featuredImageUrl || null,
                status,
                publishAt: schedule ? publishDate : null,
            }),
        });

        const data = await response.json();
        return { response, data };
    };

    const persistArticle = async (status: 'draft' | 'published') => {
        setErrorMessage('');

        if (!title.trim()) {
            setErrorMessage('Article title is required.');
            return;
        }

        const contentPayload = tiptapToArticleContent(editorJson);

        if (!contentPayload.blocks?.length) {
            setErrorMessage('Article content is required.');
            return;
        }

        setIsSubmitting(true);

        try {
            const { response, data } = await createArticleRequest(status);

            if (!response.ok || !data.success) {
                throw new Error(data.error || 'Failed to save article.');
            }

            if (status === 'draft') {
                setIsSaved(true);
                setTimeout(() => setIsSaved(false), 2000);
            } else {
                setIsPublished(true);
                setTimeout(() => setIsPublished(false), 2000);
            }
        } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : 'Failed to save article.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSaveDraft = async () => persistArticle('draft');

    const handlePublish = async () => persistArticle('published');

    const handleAddTag = () => {
        if (tagInput.trim() && !tags.includes(tagInput.trim())) {
            setTags([...tags, tagInput.trim()]);
            setTagInput("");
        }
    };

    const handleRemoveTag = (index: number) => {
        setTags(tags.filter((_, i) => i !== index));
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleAddTag();
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            (async () => {
                try {
                    setErrorMessage('');
                    const signRes = await fetch('/api/cloudinary/signature', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                    });
                    const signData = await signRes.json();

                    if (!signRes.ok || !signData.success) {
                        throw new Error(signData.error || 'Failed to create upload signature.');
                    }

                    const formData = new FormData();
                    formData.append('file', file);
                    formData.append('api_key', signData.apiKey);
                    formData.append('timestamp', String(signData.timestamp));
                    formData.append('signature', signData.signature);
                    if (signData.folder) {
                        formData.append('folder', signData.folder);
                    }

                    const uploadRes = await fetch(signData.uploadUrl, {
                        method: 'POST',
                        body: formData,
                    });
                    const uploadData = await uploadRes.json();

                    if (!uploadRes.ok || !uploadData.secure_url) {
                        throw new Error(uploadData.error?.message || 'Failed to upload image.');
                    }

                    setFeaturedImageUrl(uploadData.secure_url);
                } catch (error) {
                    setErrorMessage(error instanceof Error ? error.message : 'Featured image upload failed.');
                }
            })();
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 pb-16">
            {/* Success Notifications */}
            {isSaved && (
                <div className="fixed top-4 right-4 bg-green-50 border border-green-200 text-green-800 px-4 py-3 shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-4 z-50">
                    <CheckCircle2 className="w-5 h-5 shrink-0" />
                    <span className="font-medium">Draft saved successfully!</span>
                </div>
            )}

            {isPublished && (
                <div className="fixed top-4 right-4 bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-4 z-50">
                    <CheckCircle2 className="w-5 h-5 shrink-0" />
                    <span className="font-medium">Article published successfully!</span>
                </div>
            )}

            {errorMessage && (
                <div className="fixed top-4 left-4 right-4 sm:right-auto sm:w-fit bg-red-50 border border-red-200 text-red-800 px-4 py-3 shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-4 z-50">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <span className="font-medium">{errorMessage}</span>
                </div>
            )}

            <div className="max-w-360 mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                {/* Header with Actions */}
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6 sm:mb-8">
                    <div className="flex-1 min-w-0">
                        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2 wrap-break-word">Create New Article</h1>
                        <p className="text-slate-600 flex items-center gap-1 text-sm sm:text-base flex-wrap">
                            <PenTool className="w-4 h-4 shrink-0" />
                            <span>Write, save, and publish your amazing story</span>
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="hidden sm:flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                        <button
                            onClick={handleSaveDraft}
                            disabled={isSubmitting}
                            className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 bg-[#F7F3EC] text-slate-700 font-medium text-sm sm:text-base hover:bg-slate-50 transition-all hover:shadow-md active:scale-95"
                        >
                            <Save className="w-4 h-4 shrink-0" />
                            <span className="hidden sm:inline">Save Draft</span>
                            <span className="sm:hidden">Save</span>
                        </button>
                        <button
                            onClick={handlePublish}
                            disabled={isSubmitting}
                            className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 bg-[#E0BC78] font-medium text-sm sm:text-base hover:shadow-lg hover:shadow-blue-200 transition-all transform hover:scale-105 active:scale-95"
                        >
                            <Send className="w-4 h-4 shrink-0" />
                            <span>Publish</span>
                        </button>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">

                    {/* Left Column - Editor (3/4 width) */}
                    <div className="lg:col-span-3 space-y-4 sm:space-y-6">
                        {/* Title Section */}
                        <div className="bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow p-4 sm:p-6">
                            <label className="block text-sm font-semibold text-slate-900 mb-3">Article Title *</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full font-heading text-2xl sm:text-3xl font-bold text-slate-900 border-none bg-transparent outline-none pb-3 sm:pb-4 border-b-2 border-slate-200 focus:border-blue-500 transition-colors placeholder:text-slate-400"
                                placeholder="Enter your article title…"
                            />
                            <input
                                type="text"
                                value={subtitle}
                                onChange={(e) => setSubtitle(e.target.value)}
                                className="w-full text-sm sm:text-base text-slate-600 border-none bg-transparent outline-none pt-3 sm:pt-4 placeholder:text-slate-400 italic"
                                placeholder="Add a subtitle or brief summary (optional)…"
                            />
                        </div>

                        {/* Rich Text Editor */}
                        <div className="bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col">
                            <div className="flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white">
                                <div className="w-8 sm:w-10 h-8 sm:h-10 bg-blue-100 flex items-center justify-center shrink-0">
                                    <PenTool className="w-4 sm:w-5 h-4 sm:h-5 text-blue-600" />
                                </div>
                                <div className="min-w-0">
                                    <h3 className="font-bold text-slate-900 text-sm sm:text-base">Article Content</h3>
                                    <p className="text-xs text-slate-500 hidden sm:block">Write your article with rich formatting</p>
                                </div>
                            </div>

                            {/* Editor Component */}
                            <SimpleEditor
                                className="w-full max-w-none border-0 editor-full-width"
                                onContentChange={setEditorJson}
                            />
                        </div>
                    </div>

                    {/* Right Column - Settings (1/4 width) */}
                    <div className="lg:col-span-1 space-y-4 sm:space-y-6">

                        {/* Publishing Status Card */}
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 p-3 sm:p-4 shadow-sm">
                            <div className="flex items-start gap-2 sm:gap-3">
                                <AlertCircle className="w-4 sm:w-5 h-4 sm:h-5 text-blue-600 shrink-0 mt-0.5" />
                                <div className="min-w-0">
                                    <p className="font-semibold text-blue-900 text-xs sm:text-sm mb-0.5 sm:mb-1">Not Published</p>
                                    <p className="text-xs text-blue-700">Your article is in draft mode. Click &quot;Publish&quot; to make it live.</p>
                                </div>
                            </div>
                        </div>

                        {/* Featured Image */}
                        <div className="bg-white border border-slate-200 shadow-sm overflow-hidden">
                            <div className="flex items-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 border-b border-slate-200 bg-slate-50">
                                <ImageIcon className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-slate-600 shrink-0" />
                                <h3 className="font-semibold text-slate-900 text-xs sm:text-sm">Featured Image</h3>
                            </div>
                            <div className="p-3 sm:p-4">
                                <label className="border-2 border-dashed border-slate-300 bg-gradient-to-br from-slate-50 to-slate-100 p-4 sm:p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all hover:border-blue-500 hover:bg-blue-50 group">
                                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                                    <div className="w-10 sm:w-12 h-10 sm:h-12 bg-slate-200 flex items-center justify-center mb-2 group-hover:bg-blue-200 transition-colors">
                                        <ImageIcon className="w-5 sm:w-6 h-5 sm:h-6 text-slate-600 group-hover:text-blue-600 transition-colors" />
                                    </div>
                                    <p className="text-xs sm:text-sm font-medium text-slate-900 mb-0.5">Drop image here</p>
                                    <p className="text-xs text-slate-500 mb-2">or click to browse</p>
                                    <div className="text-xs text-slate-600 bg-white px-2 sm:px-2.5 py-0.5 sm:py-1 rounded border border-slate-200">1200 × 630px</div>
                                </label>
                                {featuredImageUrl && (
                                    <div className="mt-3 overflow-hidden rounded border border-slate-200">
                                        <Image src={featuredImageUrl} alt="Featured" width={640} height={256} className="h-32 w-full object-cover" />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Category & Tags */}
                        <div className="bg-white border border-slate-200 shadow-sm overflow-hidden">
                            <div className="flex items-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 border-b border-slate-200 bg-slate-50">
                                <Tag className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-slate-600 shrink-0" />
                                <h3 className="font-semibold text-slate-900 text-xs sm:text-sm">Category & Tags</h3>
                            </div>
                            <div className="p-3 sm:p-4 flex flex-col gap-3 sm:gap-4">
                                <div className="flex flex-col gap-1.5 sm:gap-2">
                                    <label className="text-xs font-semibold text-slate-900 uppercase tracking-wide">Category</label>
                                    <div className="relative">
                                        <select
                                            value={category}
                                            onChange={(e) => setCategory(e.target.value)}
                                            className="w-full bg-white border border-slate-300 text-xs sm:text-sm px-3 py-2 text-slate-900 outline-none appearance-none cursor-pointer hover:border-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                                        >
                                            <option value="literature">Literature</option>
                                            <option value="films">Films</option>
                                            <option value="artists">Artists</option>
                                        </select>
                                        <ChevronDown className="w-3.5 sm:w-4 h-3.5 sm:h-4 absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none" />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-1.5 sm:gap-2">
                                    <label className="text-xs font-semibold text-slate-900 uppercase tracking-wide">Subcategory</label>
                                    <div className="relative">
                                        <select
                                            value={subcategory}
                                            onChange={(e) => setSubcategory(e.target.value)}
                                            className="w-full bg-white border border-slate-300 text-xs sm:text-sm px-3 py-2 text-slate-900 outline-none appearance-none cursor-pointer hover:border-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                                        >
                                            {(SUBCATEGORY_OPTIONS[category] || []).map((option) => (
                                                <option key={option} value={option}>{option}</option>
                                            ))}
                                        </select>
                                        <ChevronDown className="w-3.5 sm:w-4 h-3.5 sm:h-4 absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none" />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-1.5 sm:gap-2">
                                    <label className="text-xs font-semibold text-slate-900 uppercase tracking-wide">Tags</label>
                                    <div className="flex flex-wrap gap-1 p-2 bg-slate-50 border border-slate-300 transition-all focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-500">
                                        {tags.map((tag, index) => (
                                            <div key={index} className="inline-flex items-center gap-1 bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 text-xs px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md font-medium border border-blue-200">
                                                <span className="truncate">{tag}</span>
                                                <button
                                                    onClick={() => handleRemoveTag(index)}
                                                    className="text-blue-600 hover:text-blue-800 font-bold ml-0.5 hover:bg-blue-200 rounded px-0.5 transition-colors"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                        <input
                                            type="text"
                                            value={tagInput}
                                            onChange={(e) => setTagInput(e.target.value)}
                                            onKeyPress={handleKeyPress}
                                            className="flex-1 min-w-16 sm:min-w-24 bg-transparent border-none outline-none text-xs sm:text-sm py-0.5 placeholder:text-slate-400"
                                            placeholder="Add tag…"
                                        />
                                    </div>
                                    {tagInput && (
                                        <button
                                            onClick={handleAddTag}
                                            className="text-xs text-blue-600 hover:text-blue-700 font-medium self-end"
                                        >
                                            Add tag
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Publish Settings */}
                        <div className="bg-white border border-slate-200 shadow-sm overflow-hidden">
                            <div className="flex items-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 border-b border-slate-200 bg-slate-50">
                                <Globe className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-slate-600 shrink-0" />
                                <h3 className="font-semibold text-slate-900 text-xs sm:text-sm">Publish Settings</h3>
                            </div>
                            <div className="p-3 sm:p-4 flex flex-col gap-3 sm:gap-4">

                                <label className="flex items-center gap-2 sm:gap-3 cursor-pointer group">
                                    <div
                                        onClick={() => setPublishNow(!publishNow)}
                                        className={`relative inline-flex items-center h-5 w-9 rounded-full transition-colors duration-200 ${publishNow ? 'bg-blue-600' : 'bg-slate-300 group-hover:bg-slate-400'}`}
                                    >
                                        <span className={`inline-block w-4 h-4 bg-white rounded-full transform transition-transform duration-200 shadow-sm ${publishNow ? 'translate-x-4.5' : 'translate-x-0.5'}`} />
                                    </div>
                                    <div className="flex flex-col min-w-0">
                                        <span className="text-xs sm:text-sm font-semibold text-slate-900">Publish Now</span>
                                        <span className="text-xs text-slate-500">Make live immediately</span>
                                    </div>
                                </label>

                                <label className="flex items-center gap-2 sm:gap-3 cursor-pointer group">
                                    <div
                                        onClick={() => setSchedule(!schedule)}
                                        className={`relative inline-flex items-center h-5 w-9 rounded-full transition-colors duration-200 ${schedule ? 'bg-blue-600' : 'bg-slate-300 group-hover:bg-slate-400'}`}
                                    >
                                        <span className={`inline-block w-4 h-4 bg-white rounded-full transform transition-transform duration-200 shadow-sm ${schedule ? 'translate-x-4.5' : 'translate-x-0.5'}`} />
                                    </div>
                                    <div className="flex flex-col min-w-0">
                                        <span className="text-xs sm:text-sm font-semibold text-slate-900">Schedule</span>
                                        <span className="text-xs text-slate-500">Publish at a later time</span>
                                    </div>
                                </label>

                                {schedule && (
                                    <div className="flex flex-col gap-1.5 sm:gap-2 mt-1 p-2.5 sm:p-3 bg-slate-50 border border-slate-200 animate-in fade-in slide-in-from-top-2">
                                        <label className="text-xs font-semibold text-slate-900 uppercase tracking-wide">Publish Date</label>
                                        <input
                                            type="datetime-local"
                                            value={publishDate}
                                            onChange={(e) => setPublishDate(e.target.value)}
                                            className="w-full bg-white border border-slate-300 text-xs sm:text-sm px-2.5 sm:px-3 py-1.5 sm:py-2 text-slate-900 outline-none hover:border-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                                        />
                                    </div>
                                )}

                            </div>
                        </div>

                        {/* Advanced Options */}
                        <div className="bg-gradient-to-br from-slate-50 to-gray-50 border border-slate-200 p-3 sm:p-4 overflow-hidden">
                            <button
                                onClick={() => setShowAdvanced(!showAdvanced)}
                                className="w-full flex items-center justify-between p-2 hover:bg-white transition-colors active:bg-slate-100"
                            >
                                <span className="font-semibold text-slate-900 text-xs sm:text-sm">⚙ Advanced Options</span>
                                <ChevronDown className={`w-4 h-4 text-slate-600 transition-transform duration-200 ${showAdvanced ? 'rotate-180' : ''}`} />
                            </button>
                            {showAdvanced && (
                                <div className="text-xs text-slate-600 space-y-1.5 sm:space-y-2 mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-slate-200 animate-in fade-in slide-in-from-top-2">
                                    <div className="flex items-center gap-2 p-2 hover:bg-white rounded cursor-pointer transition-colors">
                                        <span>✓</span>
                                        <span>SEO metadata</span>
                                    </div>
                                    <div className="flex items-center gap-2 p-2 hover:bg-white rounded cursor-pointer transition-colors">
                                        <span>✓</span>
                                        <span>Custom URL slug</span>
                                    </div>
                                    <div className="flex items-center gap-2 p-2 hover:bg-white rounded cursor-pointer transition-colors">
                                        <span>✓</span>
                                        <span>Author attribution</span>
                                    </div>
                                    <div className="flex items-center gap-2 p-2 hover:bg-white rounded cursor-pointer transition-colors">
                                        <span>✓</span>
                                        <span>Comment settings</span>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="sm:hidden flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                            <button
                                onClick={handleSaveDraft}
                                disabled={isSubmitting}
                                className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 bg-[#F7F3EC] text-slate-700 font-medium text-sm sm:text-base hover:bg-slate-50 transition-all hover:shadow-md active:scale-95"
                            >
                                <Save className="w-4 h-4 shrink-0" />
                                <span className="hidden sm:inline">Save Draft</span>
                                <span className="sm:hidden">Save</span>
                            </button>
                            <button
                                onClick={handlePublish}
                                disabled={isSubmitting}
                                className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 bg-[#E0BC78] font-medium text-sm sm:text-base hover:shadow-lg hover:shadow-blue-200 transition-all transform hover:scale-105 active:scale-95"
                            >
                                <Send className="w-4 h-4 shrink-0" />
                                <span>Publish</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}