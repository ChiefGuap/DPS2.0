"use client"

import * as React from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TooltipProvider } from "@/components/ui/tooltip"
import { FloatingToolbar } from "@/components/floating-toolbar"
import { SlashCommand } from "@/components/slash-command"

export default function TextEditor() {
  const [content, setContent] = React.useState("")
  const [selection, setSelection] = React.useState({
    isVisible: false,
    position: { x: 0, y: 0 },
    hasHighlight: false,
  })
  const [slashCommand, setSlashCommand] = React.useState({
    isOpen: false,
    position: { x: 0, y: 0 },
  })
  const editorRef = React.useRef<HTMLDivElement>(null)

  const formatText = (command: string, value?: string) => {
    document.execCommand(command, false, value)
    editorRef.current?.focus()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Tab") {
      e.preventDefault()
      formatText("indent")
    }

    // Handle slash command
    if (e.key === "/" && !slashCommand.isOpen) {
      e.preventDefault()
      const selection = window.getSelection()
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0)
        const rect = range.getBoundingClientRect()
        setSlashCommand({
          isOpen: true,
          position: {
            x: rect.left,
            y: rect.bottom + window.scrollY + 10,
          },
        })
      }
    }

    // Close slash command on escape
    if (e.key === "Escape") {
      setSlashCommand((prev) => ({ ...prev, isOpen: false }))
    }
  }

  const handleSelectionChange = () => {
    const selection = window.getSelection()
    if (selection && !selection.isCollapsed) {
      const range = selection.getRangeAt(0)
      const rect = range.getBoundingClientRect()

      // Check if selection has highlight
      const hasHighlight = (() => {
        const container = range.commonAncestorContainer
        if (container.nodeType === 3) {
          // Text node
          return container.parentElement?.style.backgroundColor === "yellow"
        }
        return (container as HTMLElement).style?.backgroundColor === "yellow"
      })()

      setSelection({
        isVisible: true,
        position: {
          x: rect.left + rect.width / 2,
          y: rect.top,
        },
        hasHighlight,
      })
    } else {
      setSelection((prev) => ({ ...prev, isVisible: false }))
    }
  }

  const handleSlashCommand = (type: string) => {
    switch (type) {
      case "text":
        formatText("formatBlock", "p")
        break
      case "h1":
        formatText("formatBlock", "h1")
        break
      case "h2":
        formatText("formatBlock", "h2")
        break
      case "h3":
        formatText("formatBlock", "h3")
        break
      case "bullet":
        formatText("insertUnorderedList")
        break
      case "todo":
        // Insert checkbox list item
        document.execCommand(
          "insertHTML",
          false,
          '<div class="flex items-center gap-2"><input type="checkbox" /><div contenteditable="true">New todo</div></div>',
        )
        break
      case "code":
        formatText("formatBlock", "pre")
        break
      case "quote":
        formatText("formatBlock", "blockquote")
        break
      case "callout":
        // Insert callout block
        document.execCommand(
          "insertHTML",
          false,
          '<div class="flex gap-2 p-4 bg-muted rounded-lg"><span>💡</span><div contenteditable="true">Type something...</div></div>',
        )
        break
    }
  }

  React.useEffect(() => {
    document.addEventListener("selectionchange", handleSelectionChange)
    return () => {
      document.removeEventListener("selectionchange", handleSelectionChange)
    }
  }, [handleSelectionChange]) // Added handleSelectionChange to dependencies

  React.useEffect(() => {
    // Enable styleWithCSS for better control over styling
    document.execCommand("styleWithCSS", false, "true")
  }, [])

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background p-8">
        <div className="mx-auto max-w-4xl space-y-4">
          <FloatingToolbar
            isVisible={selection.isVisible}
            position={selection.position}
            onFormat={formatText}
            hasHighlight={selection.hasHighlight}
            formatText={formatText}
            editorRef={editorRef}
          />

          <SlashCommand
            isOpen={slashCommand.isOpen}
            position={slashCommand.position}
            onClose={() => setSlashCommand((prev) => ({ ...prev, isOpen: false }))}
            onSelect={handleSlashCommand}
          />

          {/* Clickable editor container */}
          <div
            className="border p-4 rounded-lg cursor-text"
            onClick={() => editorRef.current?.focus()}
          >
            <div 
              ref={editorRef}
              className="prose prose-sm max-w-none focus:outline-none [&_p]:mb-2 [&_ul]:my-0 [&_ol]:my-0"
              contentEditable
              onKeyDown={handleKeyDown}
              style={{ fontFamily: "Inter, sans-serif" }}
            />
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}

