"use client"

import { useEffect, useState, useRef } from "react"
import { io } from "socket.io-client"
import {
  EditorCommand,
  EditorCommandEmpty,
  EditorCommandItem,
  EditorCommandList,
  EditorContent,
  type EditorInstance,
  EditorRoot,
  type JSONContent
} from "novel"

import { ImageResizer, handleCommandNavigation } from "novel/extensions"
import { handleImageDrop, handleImagePaste } from "novel/plugins"

import { slashCommand, suggestionItems } from "@/components/editor/slash-command"
import EditorMenu from "@/components/editor/editor-menu"
import { uploadFn } from "@/components/editor/image-upload"
import { defaultExtensions } from "@/components/editor/extensions"
import { TextButtons } from "@/components/editor/selectors/text-buttons"
import { LinkSelector } from "@/components/editor/selectors/link-selector"
import { NodeSelector } from "@/components/editor/selectors/node-selector"
import { MathSelector } from "@/components/editor/selectors/math-selector"
import { ColorSelector } from "@/components/editor/selectors/color-selector"

import { Separator } from "@/components/ui/separator"

const hljs = require("highlight.js")

const extensions = [...defaultExtensions, slashCommand]

// Default JSON for an empty document
export const defaultEditorContent: JSONContent = {
  type: "doc",
  content: [
    {
      type: "paragraph",
      content: []
    }
  ]
}

interface EditorProps {
  initialValue?: JSONContent
  onChange: (content: string) => void
}

export default function Editor({ initialValue, onChange }: EditorProps) {
  const [openNode, setOpenNode] = useState(false)
  const [openColor, setOpenColor] = useState(false)
  const [openLink, setOpenLink] = useState(false)
  const [openAI, setOpenAI] = useState(false)
  const [loadedContent, setLoadedContent] = useState<JSONContent>(defaultEditorContent)
  const [isLoaded, setIsLoaded] = useState(false)
  const editorInstance = useRef<EditorInstance | null>(null)
  const socketRef = useRef<any>(null)
  const isRemoteUpdate = useRef(false)
  const docId = "default"

  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Setup socket RT collab using JSON
  useEffect(() => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5001"
    const socket = io(baseUrl, { transports: ["websocket"] })
    socketRef.current = socket
    socket.emit("join-document", docId)

    // Load initial document content as JSON
    socket.on("load-document", (serverContent: string) => {
      let jsonContent: JSONContent = defaultEditorContent
      try {
        jsonContent = JSON.parse(serverContent)
      } catch (err) {
        console.error("Failed to parse content, using default", err)
      }
      setLoadedContent(jsonContent)
      setIsLoaded(true)
      if (editorInstance.current) {
        isRemoteUpdate.current = true
        editorInstance.current.commands.setContent(jsonContent)
        setTimeout(() => {
          isRemoteUpdate.current = false
        }, 100)
      }
    })

    // Listen for remote updates (as JSON)
    socket.on("update-document", (content: string) => {
      let jsonContent: JSONContent = defaultEditorContent
      try {
        jsonContent = JSON.parse(content)
      } catch (err) {
        console.error("Failed to parse updated content, ignoring update", err)
        return
      }
      if (editorInstance.current) {
        // Always update the content regardless of equality
        isRemoteUpdate.current = true
        editorInstance.current.commands.setContent(jsonContent)
        setTimeout(() => {
          isRemoteUpdate.current = false
        }, 100)
      }
    })

    return () => {
      socket.disconnect()
    }
  }, [])

  // Send local changes (as JSON) via socket, with debounced save to Supabase
  const handleEditorUpdate = ({ editor }: { editor: EditorInstance }) => {
    if (!isRemoteUpdate.current) {
      const jsonContent = editor.getJSON()
      const jsonString = JSON.stringify(jsonContent)
      onChange(jsonString)
      socketRef.current?.emit("edit-document", { docId, content: jsonString })
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
      saveTimeoutRef.current = setTimeout(() => {
        socketRef.current?.emit("save-document", { docId, content: jsonString })
      }, 1500)
    }
  }

  // Until loaded, show a loading state
  if (!isLoaded) return <div>Loading document...</div>

  return (
    <div className="relative w-full max-w-screen-lg">
      <EditorRoot>
        <EditorContent
          immediatelyRender={false}
          initialContent={loadedContent}
          extensions={extensions}
          className="min-h-96 rounded-xl border p-4"
          editorProps={{
            handleDOMEvents: {
              keydown: (_view, event) => handleCommandNavigation(event)
            },
            handlePaste: (view, event) =>
              handleImagePaste(view, event, uploadFn),
            handleDrop: (view, event, _slice, moved) =>
              handleImageDrop(view, event, moved, uploadFn),
            attributes: {
              class:
                "prose dark:prose-invert prose-headings:font-title font-default focus:outline-none max-w-full"
            }
          }}
          onUpdate={(update) => {
            if (!editorInstance.current) {
              editorInstance.current = update.editor
            }
            handleEditorUpdate(update)
          }}
          slotAfter={<ImageResizer />}
        >
          <EditorCommand className="z-50 h-auto max-h-[330px] overflow-y-auto rounded-md border border-muted bg-background px-1 py-2 shadow-md transition-all">
            <EditorCommandEmpty className="px-2 text-muted-foreground">
              No results
            </EditorCommandEmpty>
            <EditorCommandList>
              {suggestionItems.map((item) => (
                <EditorCommandItem
                  value={item.title}
                  onCommand={(val) => item.command?.(val)}
                  className="flex w-full items-center space-x-2 rounded-md px-2 py-1 text-left text-sm hover:bg-accent aria-selected:bg-accent"
                  key={item.title}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-md border border-muted bg-background">
                    {item.icon}
                  </div>
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </EditorCommandItem>
              ))}
            </EditorCommandList>
          </EditorCommand>

          <EditorMenu open={openAI} onOpenChange={setOpenAI}>
            <Separator orientation="vertical" />
            <NodeSelector open={openNode} onOpenChange={setOpenNode} />
            <Separator orientation="vertical" />
            <LinkSelector open={openLink} onOpenChange={setOpenLink} />
            <Separator orientation="vertical" />
            <MathSelector />
            <Separator orientation="vertical" />
            <TextButtons />
            <Separator orientation="vertical" />
            <ColorSelector open={openColor} onOpenChange={setOpenColor} />
          </EditorMenu>
        </EditorContent>
      </EditorRoot>
    </div>
  )
}
