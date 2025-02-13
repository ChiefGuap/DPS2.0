"use client"
import { motion, AnimatePresence } from "framer-motion"
import {
  Bold,
  Italic,
  Underline,
  Highlighter,
  Type,
  Palette,
  Link,
  Strikethrough,
  List,
  ListOrdered,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useState, useEffect } from "react"

interface FloatingToolbarProps {
  isVisible: boolean
  position: { x: number; y: number }
  onFormat: (command: string, value?: string) => void
  hasHighlight: boolean
  formatText: (command: string) => void
  editorRef: any
}

export function FloatingToolbar({
  isVisible,
  position,
  onFormat,
  hasHighlight,
  formatText,
  editorRef,
}: FloatingToolbarProps) {
  const [isBold, setIsBold] = useState(false);
  const colors = [
    { name: "Black", value: "#000000" },
    { name: "Red", value: "#ef4444" },
    { name: "Blue", value: "#3b82f6" },
    { name: "Green", value: "#22c55e" },
    { name: "Yellow", value: "#eab308" },
    { name: "Purple", value: "#a855f7" },
  ]

  useEffect(() => {
    const checkBold = () => {
      if (document.queryCommandState) {
        setIsBold(document.queryCommandState('bold'));
      }
    };
    
    document.addEventListener('selectionchange', checkBold);
    return () => document.removeEventListener('selectionchange', checkBold);
  }, []);

  return (
    <TooltipProvider>
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="fixed z-50 flex items-center rounded-lg border bg-background shadow-lg"
            style={{
              left: `${position.x}px`,
              top: `${position.y - 70}px`,
            }}
          >
            <div className="flex items-center gap-1 p-1">
              <div className="flex items-center gap-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant={isBold ? "secondary" : "ghost"} 
                      size="icon" 
                      className={`h-8 w-8 ${isBold ? 'bg-blue-500 text-white hover:bg-blue-600' : ''}`}
                      onClick={() => {
                        setIsBold(!isBold);
                        onFormat("bold");
                      }}
                    >
                      <Bold className="h-4 w-4" strokeWidth={3.5} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Bold</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onFormat("italic")}>
                      <Italic className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Italic</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onFormat("underline")}>
                      <Underline className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Underline</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onFormat("strikeThrough")}>
                      <Strikethrough className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Strikethrough</TooltipContent>
                </Tooltip>
              </div>

              <div className="h-4 w-px bg-border" />

              <div className="flex items-center gap-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={hasHighlight ? "secondary" : "ghost"}
                      size="icon"
                      className="h-8 w-8"
                      onClick={() =>
                        onFormat(hasHighlight ? "removeFormat" : "backColor", hasHighlight ? undefined : "yellow")
                      }
                    >
                      <Highlighter className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{hasHighlight ? "Remove highlight" : "Highlight"}</TooltipContent>
                </Tooltip>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Palette className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {colors.map((color) => (
                      <DropdownMenuItem key={color.value} onClick={() => onFormat("foreColor", color.value)}>
                        <div className="flex items-center gap-2">
                          <div className="h-4 w-4 rounded-full border" style={{ backgroundColor: color.value }} />
                          {color.name}
                        </div>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="h-4 w-px bg-border" />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Type className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => onFormat("formatBlock", "h1")} className="flex items-center">
                    <span className="mr-2 text-base font-bold">Title</span>
                    <span className="ml-auto text-xs text-muted-foreground"></span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onFormat("formatBlock", "h2")} className="flex items-center">
                    <span className="mr-2 text-base font-semibold">Heading</span>
                    <span className="ml-auto text-xs text-muted-foreground"></span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onFormat("formatBlock", "h3")} className="flex items-center">
                    <span className="mr-2 text-sm font-semibold">Subheading</span>
                    <span className="ml-auto text-xs text-muted-foreground"></span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onFormat("formatBlock", "p")} className="flex items-center">
                    <span className="mr-2 text-sm">Normal text</span>
                    <span className="ml-auto text-xs text-muted-foreground"></span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <div className="h-4 w-px bg-border" />

              <div className="flex items-center gap-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => {
                        const selection = window.getSelection()
                        if (selection && selection.rangeCount > 0) {
                          const range = selection.getRangeAt(0)
                          const parentList = range.commonAncestorContainer.parentElement?.closest("ul")

                          if (parentList) {
                            // Store the selection
                            const savedRange = range.cloneRange()

                            // If we're in a list, unwrap the content instead of using outdent
                            const listItems = Array.from(parentList.children)
                            const fragment = document.createDocumentFragment()
                            listItems.forEach((li) => {
                              const p = document.createElement("p")
                              p.innerHTML = li.innerHTML
                              fragment.appendChild(p)
                            })
                            parentList.parentNode?.replaceChild(fragment, parentList)

                            // Restore the selection
                            selection.removeAllRanges()
                            selection.addRange(savedRange)
                          } else {
                            // Create new list with proper styling
                            document.execCommand("insertUnorderedList", false)
                            const newList = range.commonAncestorContainer.parentElement?.closest("ul")
                            if (newList) {
                              newList.className = "my-0.5 list-disc pl-6"
                              const items = newList.querySelectorAll("li")
                              items.forEach((item) => {
                                item.className = "my-0.5 leading-normal"
                              })
                            }
                          }
                          editorRef.current?.focus()
                        }
                      }}
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Bullet List</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => {
                        const selection = window.getSelection()
                        if (selection && selection.rangeCount > 0) {
                          const range = selection.getRangeAt(0)
                          const parentList = range.commonAncestorContainer.parentElement?.closest("ol")

                          if (parentList) {
                            // Store the selection
                            const savedRange = range.cloneRange()

                            // If we're in a list, unwrap the content instead of using outdent
                            const listItems = Array.from(parentList.children)
                            const fragment = document.createDocumentFragment()
                            listItems.forEach((li) => {
                              const p = document.createElement("p")
                              p.innerHTML = li.innerHTML
                              fragment.appendChild(p)
                            })
                            parentList.parentNode?.replaceChild(fragment, parentList)

                            // Restore the selection
                            selection.removeAllRanges()
                            selection.addRange(savedRange)
                          } else {
                            // Create new list with proper styling
                            document.execCommand("insertOrderedList", false)
                            const newList = range.commonAncestorContainer.parentElement?.closest("ol")
                            if (newList) {
                              newList.className = "my-0.5 list-decimal pl-6"
                              const items = newList.querySelectorAll("li")
                              items.forEach((item) => {
                                item.className = "my-0.5 leading-normal"
                              })
                            }
                          }
                          editorRef.current?.focus()
                        }
                      }}
                    >
                      <ListOrdered className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Numbered List</TooltipContent>
                </Tooltip>
              </div>

              <div className="h-4 w-px bg-border" />

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => {
                      const url = prompt("Enter URL:")
                      if (url) onFormat("createLink", url)
                    }}
                  >
                    <Link className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Add link</TooltipContent>
              </Tooltip>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </TooltipProvider>
  )
}

