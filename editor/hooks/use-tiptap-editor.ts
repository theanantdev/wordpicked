"use client"

import type { Editor } from "@tiptap/react"
import { useCurrentEditor, useEditorState } from "@tiptap/react"
import { useCallback, useSyncExternalStore } from "react"

function getActivePageEditor(editor: Editor): Editor | null {
  const storage = editor.storage as unknown as Record<string, unknown>
  const pages = storage.pages as { activeEditor?: Editor | null } | undefined
  if (!pages || !("activeEditor" in pages)) return null
  return pages.activeEditor ?? null
}

export function useTiptapEditor(providedEditor?: Editor | null): {
  editor: Editor | null
  editorState?: Editor["state"]
  canCommand?: Editor["can"]
} {
  const { editor: coreEditor } = useCurrentEditor()
  const mainEditor = providedEditor ?? coreEditor

  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      if (!mainEditor) return () => { }

      const notify = () => onStoreChange()

      mainEditor.on("update", notify)
      mainEditor.on("selectionUpdate", notify)
      mainEditor.on("transaction", notify)
      mainEditor.on("destroy", notify)

      return () => {
        mainEditor.off("update", notify)
        mainEditor.off("selectionUpdate", notify)
        mainEditor.off("transaction", notify)
        mainEditor.off("destroy", notify)
      }
    },
    [mainEditor]
  )

  const storageEditor = useSyncExternalStore(
    subscribe,
    () => (mainEditor ? getActivePageEditor(mainEditor) : null),
    () => null
  )

  const editorState = useEditorState({
    editor: storageEditor ?? mainEditor,
    selector(context) {
      if (!context.editor) {
        return { editor: null, editorState: undefined, canCommand: undefined }
      }

      return {
        editor: context.editor,
        editorState: context.editor.state,
        canCommand: context.editor.can,
      }
    },
  })

  return editorState ?? { editor: null }
}
