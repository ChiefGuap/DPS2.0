import Editor from "./editor"

export default function Page() {
  return (
    <main className="min-h-screen bg-background p-4">
      <div className="mx-auto max-w-4xl space-y-4">
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="p-6">
            <h1 className="text-2xl font-bold">Collaborative Text Editor</h1>
            <p className="text-sm text-muted-foreground">Edit and collaborate in real-time</p>
          </div>
        </div>
        <Editor />
      </div>
    </main>
  )
}

