'use client';
import React, { useEffect, useRef } from 'react';

const Editor = () => {
    const ejInstance = useRef<any>(null);

    useEffect(() => {
        // Only initialize if it hasn't been already
        if (!ejInstance.current) {
            initEditor();
        }

        // Cleanup on unmount
        return () => {
            if (ejInstance.current && ejInstance.current.destroy) {
                ejInstance.current.destroy();
                ejInstance.current = null;
            }
        };
    }, []);

    const initEditor = async () => {
        // Import Editor.js and plugins dynamically
        const EditorJS = (await import('@editorjs/editorjs')).default;
        const Header = (await import('@editorjs/header')).default;
        const List = (await import('@editorjs/list')).default;
        const ImageTool = (await import('@editorjs/image')).default;
        const Quote = (await import('@editorjs/quote')).default;
        const Delimiter = (await import('@editorjs/delimiter')).default;
        // @ts-ignore
        const Embed = (await import('@editorjs/embed')).default;
        const Table = (await import('@editorjs/table')).default;
        // @ts-ignore
        const Marker = (await import('@editorjs/marker')).default;
        const InlineCode = (await import('@editorjs/inline-code')).default;
        const Underline = (await import('@editorjs/underline')).default;
        // @ts-ignore
        const LinkTool = (await import('@editorjs/link')).default;
        // @ts-ignore
        const Raw = (await import('@editorjs/raw')).default;

        const editor = new EditorJS({
            holder: 'editorjs',
            placeholder: 'Begin writing your review...',
            onReady: () => {
                ejInstance.current = editor;
            },
            autofocus: true,
            data: {},
            tools: {
                header: {
                    class: Header as any,
                    inlineToolbar: true,
                    config: {
                        levels: [1, 2, 3, 4],
                        defaultLevel: 2
                    }
                },
                list: {
                    class: List as any,
                    inlineToolbar: true,
                    config: { defaultStyle: 'unordered' }
                },
                image: {
                    class: ImageTool as any,
                    config: {
                        endpoints: {
                            byFile: '/api/upload-image', // Requires mock or real API implementation
                        }
                    }
                },
                quote: {
                    class: Quote as any,
                    inlineToolbar: true,
                    config: { quotePlaceholder: 'Enter a quote', captionPlaceholder: 'Quote\'s author' }
                },
                delimiter: Delimiter as any,
                embed: {
                    class: Embed as any,
                    inlineToolbar: true,
                    config: { services: { youtube: true, vimeo: true, twitter: true } }
                },
                table: {
                    class: Table as any,
                    inlineToolbar: true
                },
                // @ts-ignore
                marker: { class: Marker, shortcut: 'CMD+SHIFT+M' },
                inlineCode: { class: InlineCode as any, shortcut: 'CMD+SHIFT+C' },
                underline: { class: Underline as any, shortcut: 'CMD+U' },
                // @ts-ignore
                linkTool: { class: LinkTool },
                // @ts-ignore
                raw: Raw
            },
        });
    };

    const saveContent = async () => {
        if (!ejInstance.current) return;
        try {
            const savedData = await ejInstance.current.save();
            console.log('Article Data:', JSON.stringify(savedData, null, 2));
            // Trigger your submit handler or POST request here
        } catch (error) {
            console.error('Saving failed: ', error);
        }
    };

    return (
        <div className="flex flex-col h-full relative">
            <div
                id="editorjs"
                className="prose prose-sm md:prose-base lg:prose-lg max-w-full flex-1 px-4 md:px-8 py-6 font-sans text-[#1A1714] focus:outline-none focus-visible:outline-none"
            ></div>
            <div className="absolute top-4 right-4 hidden md:block">
                {/* Note: In a real app you might want to raise this out to the parent component, 
                   but we'll keep the button visually integrated here for the demo */}
                <button
                    onClick={saveContent}
                    className="px-4 py-2 bg-[#1A1714] text-[#F5F0E8] text-[11px] font-medium tracking-[0.08em] uppercase rounded-[2px] shadow-sm hover:bg-[#B5542A] transition-colors z-10"
                >
                    Auto-Save Trigger
                </button>
            </div>

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
                    padding: 0.4em 0 !important;
                }
                .ce-paragraph.cdx-block {
                    line-height: 1.8;
                }
                    .ce-header {
  font-weight: 700;
  margin-top: 1.5em;
  margin-bottom: 0.5em;
  line-height: 1.25;
}

h1.ce-header { font-size: 2.25rem; } /* text-4xl */
h2.ce-header { font-size: 1.875rem; } /* text-3xl */
h3.ce-header { font-size: 1.5rem; }    /* text-2xl */

/* Ensure the Inline Toolbar has a high z-index */
.ce-inline-toolbar {
  z-index: 50;
  background-color: white;
  border: 1px solid #e2e8f0;
}
                /* Hide the fake toolbar line from the old UI if any */
            `}</style>
        </div>
    );
};

export default Editor;