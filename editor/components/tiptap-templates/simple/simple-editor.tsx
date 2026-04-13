"use client"

import { useEffect, useRef, useState } from "react"
import { EditorContent, EditorContext, useEditor } from "@tiptap/react"
import type { JSONContent } from "@tiptap/core"

// --- Tiptap Core Extensions ---
import { StarterKit } from "@tiptap/starter-kit"
import { Image } from "@tiptap/extension-image"
import { TaskItem, TaskList } from "@tiptap/extension-list"
import { TextAlign } from "@tiptap/extension-text-align"
import { Typography } from "@tiptap/extension-typography"
import { Highlight } from "@tiptap/extension-highlight"
import { Subscript } from "@tiptap/extension-subscript"
import { Superscript } from "@tiptap/extension-superscript"
import { Selection } from "@tiptap/extensions"

// --- UI Primitives ---
import { Button } from "@/editor/components/tiptap-ui-primitive/button"
import { Spacer } from "@/editor/components/tiptap-ui-primitive/spacer"
import {
  Toolbar,
  ToolbarGroup,
  ToolbarSeparator,
} from "@/editor/components/tiptap-ui-primitive/toolbar"

// --- Tiptap Node ---
import { ImageUploadNode } from "@/editor/components/tiptap-node/image-upload-node/image-upload-node-extension"
import { HorizontalRule } from "@/editor/components/tiptap-node/horizontal-rule-node/horizontal-rule-node-extension"
import "@/editor/components/tiptap-node/blockquote-node/blockquote-node.scss"
import "@/editor/components/tiptap-node/code-block-node/code-block-node.scss"
import "@/editor/components/tiptap-node/horizontal-rule-node/horizontal-rule-node.scss"
import "@/editor/components/tiptap-node/list-node/list-node.scss"
import "@/editor/components/tiptap-node/image-node/image-node.scss"
import "@/editor/components/tiptap-node/heading-node/heading-node.scss"
import "@/editor/components/tiptap-node/paragraph-node/paragraph-node.scss"

// --- Tiptap UI ---
import { HeadingDropdownMenu } from "@/editor/components/tiptap-ui/heading-dropdown-menu"
import { ImageUploadButton } from "@/editor/components/tiptap-ui/image-upload-button"
import { ListDropdownMenu } from "@/editor/components/tiptap-ui/list-dropdown-menu"
import { BlockquoteButton } from "@/editor/components/tiptap-ui/blockquote-button"
import { CodeBlockButton } from "@/editor/components/tiptap-ui/code-block-button"
import {
  ColorHighlightPopover,
  ColorHighlightPopoverContent,
  ColorHighlightPopoverButton,
} from "@/editor/components/tiptap-ui/color-highlight-popover"
import {
  LinkPopover,
  LinkContent,
  LinkButton,
} from "@/editor/components/tiptap-ui/link-popover"
import { MarkButton } from "@/editor/components/tiptap-ui/mark-button"
import { TextAlignButton } from "@/editor/components/tiptap-ui/text-align-button"
import { UndoRedoButton } from "@/editor/components/tiptap-ui/undo-redo-button"

// --- Icons ---
import { ArrowLeftIcon } from "@/editor/components/tiptap-icons/arrow-left-icon"
import { HighlighterIcon } from "@/editor/components/tiptap-icons/highlighter-icon"
import { LinkIcon } from "@/editor/components/tiptap-icons/link-icon"

// --- Hooks ---
import { useIsBreakpoint } from "@/editor/hooks/use-is-breakpoint"
import { useWindowSize } from "@/editor/hooks/use-window-size"
import { useCursorVisibility } from "@/editor/hooks/use-cursor-visibility"

// --- Components ---
import { ThemeToggle } from "@/editor/components/tiptap-templates/simple/theme-toggle"

// --- Lib ---
import { handleImageUpload, MAX_FILE_SIZE } from "@/editor/lib/tiptap-utils"

// --- Styles ---
import "@/editor/components/tiptap-templates/simple/simple-editor.scss"

import content from "@/editor/components/tiptap-templates/simple/data/content.json"

type UploadHandler = (
  file: File,
  onProgress?: (event: { progress: number }) => void,
  abortSignal?: AbortSignal
) => Promise<string>

type SimpleEditorProps = {
  initialContent?: JSONContent
  onContentChange?: (content: JSONContent) => void
  onEditorReady?: (getter: () => Promise<JSONContent>) => void
  onImageUpload?: UploadHandler
  onImageUploadStateChange?: (isUploading: boolean) => void
  className?: string
}

const MainToolbarContent = ({
  onHighlighterClick,
  onLinkClick,
  isMobile,
}: {
  onHighlighterClick: () => void
  onLinkClick: () => void
  isMobile: boolean
}) => {
  return (
    <>
      <Spacer />

      <ToolbarGroup>
        <UndoRedoButton action="undo" />
        <UndoRedoButton action="redo" />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <HeadingDropdownMenu modal={false} levels={[1, 2, 3, 4]} />
        <ListDropdownMenu
          modal={false}
          types={["bulletList", "orderedList", "taskList"]}
        />
        <BlockquoteButton />
        <CodeBlockButton />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <MarkButton type="bold" />
        <MarkButton type="italic" />
        <MarkButton type="strike" />
        <MarkButton type="code" />
        <MarkButton type="underline" />
        {!isMobile ? (
          <ColorHighlightPopover />
        ) : (
          <ColorHighlightPopoverButton onClick={onHighlighterClick} />
        )}
        {!isMobile ? <LinkPopover /> : <LinkButton onClick={onLinkClick} />}
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <MarkButton type="superscript" />
        <MarkButton type="subscript" />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <TextAlignButton align="left" />
        <TextAlignButton align="center" />
        <TextAlignButton align="right" />
        <TextAlignButton align="justify" />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <ImageUploadButton text="Add" />
      </ToolbarGroup>

      <Spacer />

      {isMobile && <ToolbarSeparator />}

      <ToolbarGroup>
        <ThemeToggle />
      </ToolbarGroup>
    </>
  )
}

const MobileToolbarContent = ({
  type,
  onBack,
}: {
  type: "highlighter" | "link"
  onBack: () => void
}) => (
  <>
    <ToolbarGroup>
      <Button variant="ghost" onClick={onBack}>
        <ArrowLeftIcon className="tiptap-button-icon" />
        {type === "highlighter" ? (
          <HighlighterIcon className="tiptap-button-icon" />
        ) : (
          <LinkIcon className="tiptap-button-icon" />
        )}
      </Button>
    </ToolbarGroup>

    <ToolbarSeparator />

    {type === "highlighter" ? (
      <ColorHighlightPopoverContent />
    ) : (
      <LinkContent />
    )}
  </>
)

export function SimpleEditor({
  initialContent,
  onContentChange,
  onEditorReady,
  onImageUpload,
  onImageUploadStateChange,
  className,
}: SimpleEditorProps) {
  const isMobile = useIsBreakpoint()
  const { height } = useWindowSize()
  const [mobileView, setMobileView] = useState<"main" | "highlighter" | "link">(
    "main"
  )
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const toolbarRef = useRef<HTMLDivElement>(null)
  const lastAppliedInitialContent = useRef<string | null>(null)

  const uploadHandler: UploadHandler = async (file, onProgress, abortSignal) => {
    setIsUploadingImage(true)
    try {
      const uploader = onImageUpload || handleImageUpload
      const uploadedUrl = await uploader(file, onProgress, abortSignal)
      return uploadedUrl
    } finally {
      setIsUploadingImage(false)
    }
  }

  const editor = useEditor({
    immediatelyRender: false,
    editorProps: {
      attributes: {
        autocomplete: "off",
        autocorrect: "off",
        autocapitalize: "off",
        "aria-label": "Main content area, start typing to enter text.",
        class: "simple-editor",
      },
    },
    extensions: [
      StarterKit.configure({
        horizontalRule: false,
        link: {
          openOnClick: false,
          enableClickSelection: true,
        },
      }),
      HorizontalRule,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Highlight.configure({ multicolor: true }),
      Image,
      Typography,
      Superscript,
      Subscript,
      Selection,
      ImageUploadNode.configure({
        accept: "image/*",
        maxSize: MAX_FILE_SIZE,
        limit: 3,
        upload: uploadHandler,
        onError: (error) => console.error("Upload failed:", error),
      }),
    ],
    content: initialContent || (content as JSONContent),
    onUpdate: ({ editor: currentEditor }) => {
      onContentChange?.(currentEditor.getJSON())
    },
  })

  const rect = useCursorVisibility({
    editor,
    overlayHeight: toolbarRef.current?.getBoundingClientRect().height ?? 0,
  })

  useEffect(() => {
    if (!isMobile && mobileView !== "main") {
      setMobileView("main")
    }
  }, [isMobile, mobileView])

  useEffect(() => {
    if (!editor || !initialContent) return

    const nextContent = JSON.stringify(initialContent)
    const currentContent = JSON.stringify(editor.getJSON())

    if (
      nextContent === currentContent ||
      nextContent === lastAppliedInitialContent.current
    ) {
      return
    }

    lastAppliedInitialContent.current = nextContent
    editor.commands.setContent(initialContent, { emitUpdate: false })
  }, [editor, initialContent])

  useEffect(() => {
    if (!editor || !onEditorReady) return
    onEditorReady(async () => editor.getJSON())
  }, [editor, onEditorReady])

  useEffect(() => {
    onImageUploadStateChange?.(isUploadingImage)
  }, [isUploadingImage, onImageUploadStateChange])


  return (
    <div className={`simple-editor-wrapper border border-zinc-300 ${className || ""}`}>
      <EditorContext.Provider value={{ editor }}>
        <Toolbar
          ref={toolbarRef}
          style={{
            ...(isMobile
              ? {
                bottom: `calc(100% - ${height - rect.y}px)`,
              }
              : {}),
          }}
        >
          {mobileView === "main" ? (
            <MainToolbarContent
              onHighlighterClick={() => setMobileView("highlighter")}
              onLinkClick={() => setMobileView("link")}
              isMobile={isMobile}
            />
          ) : (
            <MobileToolbarContent
              type={mobileView === "highlighter" ? "highlighter" : "link"}
              onBack={() => setMobileView("main")}
            />
          )}
        </Toolbar>

        <EditorContent
          editor={editor}
          role="presentation"
          className="simple-editor-content"
        />
      </EditorContext.Provider>

    </div>
  )
}
