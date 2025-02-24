"use client"

import { useState } from "react"
import { ChevronDown, ChevronRight, CheckCircle2, PanelLeft } from "lucide-react"
import ContentForm from '@/components/content-form'

// Mock data for the Motion course
const courseData = {
  title: "Motion for React",
  chapters: [
    {
      title: "Introduction",
      lessons: [
        { id: "00", title: "Framer Motion rebrand to Motion for React", completed: false },
        { id: "01", title: "What you'll learn in this course", completed: false },
        { id: "02", title: "How to get the most out of this course", completed: false },
      ],
    },
    {
      title: "Fundamentals",
      lessons: [
        { id: "03", title: "Animate CSS properties", completed: false },
        { id: "04", title: "Transition options", completed: false },
        { id: "05", title: "Keyframes", completed: false },
        { id: "06", title: "Initial animation", completed: false },
      ],
    },
    {
      title: "Gestures",
      lessons: [
        { id: "07", title: "Hover animations", completed: false },
        { id: "08", title: "Tap animations", completed: false },
        { id: "09", title: "Drag animations", completed: false },
      ],
    },
  ],
}

function CoursePage() {
  const [expandedChapters, setExpandedChapters] = useState<number[]>([0])
  const [selectedLesson, setSelectedLesson] = useState(courseData.chapters[0].lessons[0])
  const [completedLessons, setCompletedLessons] = useState<string[]>([])
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const toggleChapter = (index: number) => {
    setExpandedChapters((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]))
  }

  const handleLessonClick = (lesson: { id: string; title: string }) => {
    setSelectedLesson(lesson)
    if (!completedLessons.includes(lesson.id)) {
      setCompletedLessons((prev) => [...prev, lesson.id])
    }
  }

  return (
    <div className="relative flex min-h-screen bg-background">
      {/* Sidebar Toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-4 left-4 z-50 p-2 rounded-md hover:bg-accent/50 transition-colors"
        aria-label="Toggle Sidebar"
      >
        <PanelLeft className="h-5 w-5" />
      </button>

      {/* Sidebar with Chapters and Lessons */}
      <aside
        className={`fixed top-0 left-0 h-full bg-background border-r border-border transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ width: "240px" }}
      >
        <div className="pt-16 h-full overflow-y-auto">
          <div className="space-y-1">
            {courseData.chapters.map((chapter, chapterIndex) => (
              <div key={chapterIndex} className="border-b border-border/50 last:border-0">
                <button
                  className="w-full text-left p-4 flex items-center justify-between hover:bg-accent/50 transition-colors"
                  onClick={() => toggleChapter(chapterIndex)}
                >
                  <span className="font-medium">{chapter.title}</span>
                  {expandedChapters.includes(chapterIndex) ? (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  )}
                </button>
                {expandedChapters.includes(chapterIndex) && (
                  <ul className="bg-accent/30">
                    {chapter.lessons.map((lesson) => (
                      <li key={lesson.id}>
                        <button
                          className={`w-full text-left p-3 pl-8 flex items-center justify-between hover:bg-accent/50 transition-colors ${
                            selectedLesson.id === lesson.id ? "bg-primary text-primary-foreground" : ""
                          }`}
                          onClick={() => handleLessonClick(lesson)}
                        >
                          <span className="flex items-center gap-2 text-sm">
                            <span className="opacity-60">{lesson.id}</span>
                            <span>{lesson.title}</span>
                          </span>
                          {completedLessons.includes(lesson.id) && (
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                          )}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* Main Content including the Text Editor */}
      <main
        className={`flex-1 transition-[padding] duration-300 ease-in-out ${
          sidebarOpen ? "pl-[256px]" : "pl-16"
        }`}
      >
        <div className="p-8">
          <h1 className="text-3xl font-bold mb-4">{selectedLesson.title}</h1>
          {/* Render ContentForm text editor in the main area */}
          <ContentForm />
        </div>
      </main>
    </div>
  )
}

export default function Home() {
  return <CoursePage />
}
