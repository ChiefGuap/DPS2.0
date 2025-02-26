"use client"

import { useEffect, useState } from "react"
import { createBlogAction } from "@/lib/actions"
import { toast } from "sonner"

import Editor, { defaultEditorContent as defaultValue } from "@/components/editor/editor"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function ContentForm() {
  const [title, setTitle] = useState("")
  const [slug, setSlug] = useState("")
  // Store JSON in state; user sees only the rich text in Editor
  const [content, setContent] = useState(JSON.stringify(defaultValue))
  const [pending, setPending] = useState(false)

  useEffect(() => {
    const name = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "")
    setSlug(name)
  }, [title])

  async function handleSubmit() {
    setPending(true)
    const result = await createBlogAction({ title, slug, content })
    if (result?.error) {
      toast.error(result.error)
    }
    setPending(false)
  }

  return (
    <div className="mt-6 flex max-w-2xl flex-col gap-4">
      <div className="flex gap-4">
        <Input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Input
          type="text"
          placeholder="Slug"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
        />
      </div>

      <Editor
        initialValue={content ? JSON.parse(content) : defaultValue}
        onChange={(val) => setContent(val)}
      />

      <Button onClick={handleSubmit} disabled={pending}>
        {pending ? "Submitting..." : "Create"}
      </Button>
    </div>
  )
}
