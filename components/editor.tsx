'use client';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import type { OutputData } from '@editorjs/editorjs';
import { Bold, Italic, Underline, Strikethrough, List as ListIcon, ListOrdered, Quote, Link as LinkIcon, Image as ImageIcon, Video, Code2, Zap } from "lucide-react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type EditorInstance = any;

interface EditorProps {
    onContentChange?: (content: OutputData) => void;
    initialContent?: OutputData;
}

const Editor = ({ onContentChange, initialContent }: EditorProps) => {
    const ejInstance = useRef<EditorInstance>(null);
    const isReady = useRef(false);
    const [, setRefreshCounter] = useState(0);

    const updateStats = useCallback((content: OutputData) => {
        if (ejInstance.current) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const text = (content.blocks as any[])
                .map((block: { data?: { text?: string } }) => block.data?.text || '')
                .join(' ');

            const words = text.trim().split(/\s+/).filter((w: string) => w.length > 0).length;
            const chars = text.length;
            const estimatedReadTime = Math.ceil(words / 200);

            // Keep lightweight computed stats available for potential UI hooks.
            setRefreshCounter(words + chars + estimatedReadTime);

            onContentChange?.(content);
        }
    }, [onContentChange]);

    const uploadImageToCloudinary = useCallback(async (file: File) => {
        const signRes = await fetch('/api/cloudinary/signature', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
        });

        const signData = await signRes.json();

        if (!signRes.ok || !signData.success) {
            throw new Error(signData.error || 'Failed to create Cloudinary upload signature.');
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
            throw new Error(uploadData.error?.message || 'Image upload failed.');
        }

        return uploadData.secure_url as string;
    }, []);

    const handleInsertBlock = useCallback((type: string, config?: unknown) => {
        if (!ejInstance.current?.blocks) return;

        const cfg = (config ?? {}) as Record<string, unknown>;
        let blockData: Record<string, unknown> = {};

        if (type === 'header') {
            blockData = {
                text: '',
                level: Number(cfg.level ?? 2),
            };
        } else if (type === 'list') {
            blockData = {
                style: String(cfg.style ?? 'unordered'),
                items: [''],
            };
        } else if (type === 'quote') {
            blockData = { text: '', caption: '' };
        } else if (type === 'raw') {
            blockData = { html: '' };
        }

        ejInstance.current.blocks.insert(type, blockData);
    }, []);

    const handleInlineFormat = useCallback((command: string, value?: string) => {
        document.execCommand(command, false, value);
    }, []);

    const initEditor = useCallback(async () => {
        // Import Editor.js and plugins dynamically
        const EditorJS = (await import('@editorjs/editorjs')).default;
        const Header = (await import('@editorjs/header')).default;
        const List = (await import('@editorjs/list')).default;
        const ImageTool = (await import('@editorjs/image')).default;
        const Quote = (await import('@editorjs/quote')).default;
        const Delimiter = (await import('@editorjs/delimiter')).default;
        // @ts-expect-error - No types available
        const Embed = (await import('@editorjs/embed')).default;
        const Table = (await import('@editorjs/table')).default;
        // @ts-expect-error - No types available
        const Marker = (await import('@editorjs/marker')).default;
        const InlineCode = (await import('@editorjs/inline-code')).default;
        const Underline = (await import('@editorjs/underline')).default;
        // @ts-expect-error - No types available
        const LinkTool = (await import('@editorjs/link')).default;
        // @ts-expect-error - No types available
        const Raw = (await import('@editorjs/raw')).default;

        const editor = new EditorJS({
            holder: 'editorjs',
            placeholder: 'Start writing your masterpiece...',
            onReady: () => {
                ejInstance.current = editor;
            },
            autofocus: true,
            onChange: async () => {
                const content = await editor.save();
                updateStats(content);
            },
            data: initialContent || { blocks: [], version: '' },
            tools: {
                header: {
                    class: Header,
                    inlineToolbar: true,
                    config: {
                        levels: [1, 2, 3, 4],
                        defaultLevel: 2
                    }
                },
                list: {
                    class: List,
                    inlineToolbar: true,
                    config: { defaultStyle: 'unordered' }
                },
                image: {
                    class: ImageTool,
                    config: {
                        uploader: {
                            uploadByFile: async (file: File) => {
                                const imageUrl = await uploadImageToCloudinary(file);
                                return {
                                    success: 1,
                                    file: {
                                        url: imageUrl,
                                    },
                                };
                            },
                            uploadByUrl: async (url: string) => ({
                                success: 1,
                                file: {
                                    url,
                                },
                            }),
                        }
                    }
                },
                quote: {
                    class: Quote,
                    inlineToolbar: true,
                    config: { quotePlaceholder: 'Enter a quote', captionPlaceholder: 'Quote\'s author' }
                },
                delimiter: Delimiter,
                embed: {
                    class: Embed,
                    inlineToolbar: true,
                    config: { services: { youtube: true, vimeo: true, twitter: true } }
                },
                table: {
                    class: Table,
                    inlineToolbar: true
                },
                marker: { class: Marker, shortcut: 'CMD+SHIFT+M' },
                inlineCode: { class: InlineCode, shortcut: 'CMD+SHIFT+C' },
                underline: { class: Underline, shortcut: 'CMD+U' },
                linkTool: { class: LinkTool },
                raw: Raw
            },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any);
    }, [initialContent, updateStats, uploadImageToCloudinary]);

    useEffect(() => {
        // Only initialize if it hasn't been already and isn't currently initializing
        if (!ejInstance.current && !isReady.current) {
            isReady.current = true;
            initEditor();
        }

        // Cleanup on unmount
        return () => {
            if (ejInstance.current && ejInstance.current.destroy) {
                try {
                    ejInstance.current.destroy();
                } catch (e) {
                    console.error('Editor cleanup failed', e);
                }
                ejInstance.current = null;
                isReady.current = false;
            }
        };
    }, [initEditor]);

    return (
        <div className="flex flex-col h-full relative bg-linear-to-b from-white to-gray-50">

            {/* Stats Bar */}
            {/* <div className="flex flex-wrap items-center justify-between px-4 py-3 bg-gradient-to-r from-slate-50 to-gray-50 border-b border-slate-200 gap-3">
                <div className="flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-1.5">
                        <span className="text-gray-500 font-medium">Words:</span>
                        <span className="font-bold text-slate-900 bg-blue-50 px-2.5 py-0.5  text-blue-700">{wordCount}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="text-gray-500 font-medium">Characters:</span>
                        <span className="font-bold text-slate-900 bg-purple-50 px-2.5 py-0.5  text-purple-700">{characterCount}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="text-gray-500 font-medium">Read Time:</span>
                        <span className="font-bold text-slate-900 bg-amber-50 px-2.5 py-0.5  text-amber-700">{readTime} min</span>
                    </div>
                </div>
                <button
                    onClick={() => setIsPreview(!isPreview)}
                    className="flex items-center gap-1.5 px-3 py-1.5  hover:bg-gray-200 transition-colors text-gray-600 font-medium text-sm"
                >
                    {isPreview ? (
                        <>
                            <Eye className="w-4 h-4" />
                            Preview
                        </>
                    ) : (
                        <>
                            <EyeOff className="w-4 h-4" />
                            Hide
                        </>
                    )}
                </button>
            </div> */}

            {/* Main Toolbar */}
            <div className="flex items-center flex-row overflow-x-auto gap-2 px-4 py-3 bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm">
                {/* Text Formatting */}
                <div className="flex items-center gap-1 p-1 bg-gray-100 ">
                    <button onMouseDown={(e) => { e.preventDefault(); handleInlineFormat('bold'); }} title="Bold (Cmd+B)" className="w-8 h-8 flex items-center justify-center  hover:bg-white text-slate-600 font-bold transition-colors hover:text-blue-600"><Bold className="w-4 h-4" /></button>
                    <button onMouseDown={(e) => { e.preventDefault(); handleInlineFormat('italic'); }} title="Italic (Cmd+I)" className="w-8 h-8 flex items-center justify-center  hover:bg-white text-slate-600 transition-colors hover:text-blue-600"><Italic className="w-4 h-4" /></button>
                    <button onMouseDown={(e) => { e.preventDefault(); handleInlineFormat('underline'); }} title="Underline (Cmd+U)" className="w-8 h-8 flex items-center justify-center  hover:bg-white text-slate-600 transition-colors hover:text-blue-600"><Underline className="w-4 h-4" /></button>
                    <button onMouseDown={(e) => { e.preventDefault(); handleInlineFormat('strikeThrough'); }} title="Strikethrough" className="w-8 h-8 flex items-center justify-center  hover:bg-white text-slate-600 transition-colors hover:text-blue-600"><Strikethrough className="w-4 h-4" /></button>
                </div>

                <div className="w-px h-6 bg-slate-300"></div>

                {/* Heading Levels */}
                <div className="flex items-center gap-1 p-1 bg-gray-100 ">
                    <button onClick={() => handleInsertBlock('header', { level: 1 })} title="Heading 1" className="w-8 h-8 flex items-center justify-center  hover:bg-white text-slate-600 font-bold transition-colors hover:text-blue-600 text-sm">H1</button>
                    <button onClick={() => handleInsertBlock('header', { level: 2 })} title="Heading 2" className="w-8 h-8 flex items-center justify-center  hover:bg-white text-slate-600 font-bold transition-colors hover:text-blue-600 text-sm">H2</button>
                    <button onClick={() => handleInsertBlock('header', { level: 3 })} title="Heading 3" className="w-8 h-8 flex items-center justify-center  hover:bg-white text-slate-600 font-bold transition-colors hover:text-blue-600 text-sm">H3</button>
                </div>

                <div className="w-px h-6 bg-slate-300"></div>

                {/* Lists & Blocks */}
                <div className="flex items-center gap-1 p-1 bg-gray-100 ">
                    <button onClick={() => handleInsertBlock('list', { style: 'unordered' })} title="Bullet List" className="w-8 h-8 flex items-center justify-center  hover:bg-white text-slate-600 transition-colors hover:text-blue-600"><ListIcon className="w-4 h-4" /></button>
                    <button onClick={() => handleInsertBlock('list', { style: 'ordered' })} title="Numbered List" className="w-8 h-8 flex items-center justify-center  hover:bg-white text-slate-600 transition-colors hover:text-blue-600"><ListOrdered className="w-4 h-4" /></button>
                    <button onClick={() => handleInsertBlock('quote')} title="Quote" className="w-8 h-8 flex items-center justify-center  hover:bg-white text-slate-600 transition-colors hover:text-blue-600"><Quote className="w-4 h-4" /></button>
                    <button onClick={() => handleInsertBlock('delimiter')} title="Divider" className="w-8 h-8 flex items-center justify-center  hover:bg-white text-slate-600 transition-colors hover:text-blue-600"><Zap className="w-4 h-4" /></button>
                </div>

                <div className="w-px h-6 bg-slate-300"></div>

                {/* Media & Code */}
                <div className="flex items-center gap-1 p-1 bg-gray-100 ">
                    <button onMouseDown={(e) => {
                        e.preventDefault();
                        const url = prompt('Enter link URL:');
                        if (url) handleInlineFormat('createLink', url);
                    }} title="Insert Link" className="w-8 h-8 flex items-center justify-center  hover:bg-white text-slate-600 transition-colors hover:text-blue-600">
                        <LinkIcon className="w-4 h-4" />
                    </button>

                    <button onClick={() => {
                        const url = prompt('Paste image URL:');
                        if (!url) return;
                        if (ejInstance.current?.blocks) {
                            ejInstance.current.blocks.insert('image', { file: { url } });
                        }
                    }} title="Insert Image" className="w-8 h-8 flex items-center justify-center  hover:bg-white text-slate-600 transition-colors hover:text-blue-600">
                        <ImageIcon className="w-4 h-4" />
                    </button>

                    <button onClick={() => {
                        const source = prompt('Paste YouTube / Vimeo / X URL:');
                        if (!source) return;
                        if (ejInstance.current?.blocks) {
                            ejInstance.current.blocks.insert('embed', {
                                service: 'youtube',
                                source,
                                embed: source,
                                width: 580,
                                height: 320,
                                caption: '',
                            });
                        }
                    }} title="Embed Video" className="w-8 h-8 flex items-center justify-center  hover:bg-white text-slate-600 transition-colors hover:text-blue-600">
                        <Video className="w-4 h-4" />
                    </button>

                    <button onClick={() => handleInsertBlock('raw')} title="Code Block" className="w-8 h-8 flex items-center justify-center  hover:bg-white text-slate-600 transition-colors hover:text-blue-600">
                        <Code2 className="w-4 h-4" />
                    </button>
                </div>

            </div>

            {/* Editor Canvas */}
            <div
                id="editorjs"
                className="prose  prose-sm md:prose-base max-w-full flex-1 px-10 md:px-10 py-8 font-sans text-slate-900 focus:outline-none focus-visible:outline-none overflow-y-auto"
            ></div>

            {/* Global style overrides to make EditorJS look clean and match our brand */}
            <style jsx global>{`
                .ce-block__content, .ce-toolbar__content {
                    max-width: 900px !important;
                }
                .ce-toolbar__actions {
                    right: auto !important;
                    left: -40px !important;
                }
                .cdx-block {
                    padding: 0.6em 0 !important;
                }
                .ce-paragraph.cdx-block {
                    line-height: 1.8;
                    font-size: 1.05em;
                }
                .ce-header {
                  font-weight: 700;
                  margin-top: 1.5em;
                  margin-bottom: 0.75em;
                  line-height: 1.25;
                  color: #1e293b;
                }

                h1.ce-header { 
                    font-size: 2.5rem; 
                    letter-spacing: -0.02em;
                }
                h2.ce-header { 
                    font-size: 2rem; 
                    letter-spacing: -0.01em;
                }
                h3.ce-header { 
                    font-size: 1.5rem; 
                }

                .ce-inline-toolbar {
                  z-index: 50 !important;
                  background: white !important;
                  border: 1.5px solid #e2e8f0 !important;
                  border-radius: 8px !important;
                  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1) !important;
                }

                .ce-popover {
                  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15) !important;
                  border-radius: 8px !important;
                }

                .ce-inline-toolbar__buttons {
                  gap: 2px !important;
                }

                .ce-inline-toolbar__button {
                  font-size: 14px !important;
                  padding: 6px 10px !important;
                  border-radius: 6px !important;
                  transition: all 0.2s ease !important;
                }

                .ce-inline-toolbar__button:hover {
                  background: #f1f5f9 !important;
                  color: #3b82f6 !important;
                }

                .ce-toolbar__plus {
                  color: #64748b !important;
                  transition: color 0.2s ease !important;
                }

                .ce-toolbar__plus:hover {
                  color: #3b82f6 !important;
                }

                .cdx-quote {
                  border-left: 4px solid #3b82f6 !important;
                  padding: 1.2em !important;
                  background: #f0f9ff !important;
                  border-radius: 4px !important;
                }

                .cdx-quote__text {
                  font-style: italic !important;
                  color: #334155 !important;
                }

                .ce-code {
                  background: #1e293b !important;
                  color: #e2e8f0 !important;
                  padding: 1.2em !important;
                  border-radius: 6px !important;
                  font-family: 'Fira Code', monospace !important;
                  font-size: 0.9em !important;
                }

                .cdx-table {
                  border-collapse: collapse !important;
                  width: 100% !important;
                  margin: 1.2em 0 !important;
                }

                .cdx-table td, .cdx-table th {
                  border: 1px solid #e2e8f0 !important;
                  padding: 0.8em !important;
                  text-align: left !important;
                }

                .cdx-table th {
                  background: #f1f5f9 !important;
                  font-weight: 600 !important;
                }
            `}</style>
        </div>
    );
}

export default Editor;