"use client"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Text, Heading1, Heading2, Heading3, List, Code, Quote, AlertCircle, CheckSquare } from "lucide-react"

interface SlashCommandProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (type: string) => void
  position: { x: number; y: number }
}

export function SlashCommand({ isOpen, onClose, onSelect, position }: SlashCommandProps) {
  const items = [
    {
      name: "Text",
      icon: Text,
      command: "text",
      description: "Just start writing with plain text",
    },
    {
      name: "Heading 1",
      icon: Heading1,
      command: "h1",
      description: "Big section heading",
    },
    {
      name: "Heading 2",
      icon: Heading2,
      command: "h2",
      description: "Medium section heading",
    },
    {
      name: "Heading 3",
      icon: Heading3,
      command: "h3",
      description: "Small section heading",
    },
    {
      name: "To-do list",
      icon: CheckSquare,
      command: "todo",
      description: "Track tasks with a to-do list",
    },
    {
      name: "Bullet list",
      icon: List,
      command: "bullet",
      description: "Create a simple bullet list",
    },
    {
      name: "Code",
      icon: Code,
      command: "code",
      description: "Capture a code snippet",
    },
    {
      name: "Quote",
      icon: Quote,
      command: "quote",
      description: "Capture a quote",
    },
    {
      name: "Callout",
      icon: AlertCircle,
      command: "callout",
      description: "Make a callout to highlight information",
    },
  ]

  if (!isOpen) return null

  return (
    <div
      className="fixed z-50"
      style={{
        top: position.y,
        left: position.x,
      }}
    >
      <Command className="rounded-lg border shadow-md w-[300px]">
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Blocks">
            {items.map((item) => (
              <CommandItem
                key={item.command}
                onSelect={() => {
                  onSelect(item.command)
                  onClose()
                }}
              >
                <item.icon className="mr-2 h-4 w-4" />
                <div>
                  <div className="font-medium">{item.name}</div>
                  <div className="text-xs text-muted-foreground">{item.description}</div>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  )
}

