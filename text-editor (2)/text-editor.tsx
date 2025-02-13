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
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="relative min-h-[500px] p-4">
              <div className="font-editor">
                <div
                  ref={editorRef}
                  className="prose prose-sm max-w-none focus:outline-none [&_pre]:bg-muted [&_pre]:p-4 [&_pre]:rounded-lg [&_blockquote]:border-l-4 [&_blockquote]:border-muted [&_blockquote]:pl-4 [&_blockquote]:italic [&_h1]:mb-4 [&_h1]:text-4xl [&_h1]:font-bold [&_h2]:mb-3 [&_h2]:text-2xl [&_h2]:font-semibold [&_h3]:mb-2 [&_h3]:text-xl [&_h3]:font-semibold [&_h4]:mb-2 [&_h4]:text-lg [&_h4]:font-semibold [&_h5]:mb-2 [&_h5]:text-base [&_h5]:font-semibold [&_h6]:mb-2 [&_h6]:text-sm [&_h6]:font-semibold [&_p]:mb-2 [&_ul]:my-0 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:my-0 [&_li]:my-0 [&_li]:leading-normal [&_li>ul]:mt-0 [&_li>ol]:mt-0 [&_li]:marker:text-foreground/80"
                  contentEditable
                  onKeyDown={handleKeyDown}
                  style={{ fontFamily: "Inter, sans-serif" }}
                />
              </div>
              {/* Add block button */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-0 -ml-10 mt-1 opacity-0 transition-opacity group-hover:opacity-100 hover:opacity-100"
                onClick={() => {
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
                }}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

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
        </div>
      </div>
    </TooltipProvider>
  )
}

