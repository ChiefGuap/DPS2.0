"use client"

import { useState } from "react"
import { ChevronDown, ChevronRight, CheckCircle2 } from "lucide-react"

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
    // Add more chapters as needed
  ],
}

export default function CoursesPage() {
  const [expandedChapters, setExpandedChapters] = useState<number[]>([0])
  const [selectedLesson, setSelectedLesson] = useState(courseData.chapters[0].lessons[0])
  const [completedLessons, setCompletedLessons] = useState<string[]>([])

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
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-80 bg-card text-card-foreground border-r border-border overflow-y-auto">
        <div className="p-4 border-b border-border">
          <h2 className="text-xl font-bold">{courseData.title}</h2>
        </div>
        {courseData.chapters.map((chapter, chapterIndex) => (
          <div key={chapterIndex} className="border-b border-border">
            <button
              className="w-full text-left p-4 flex items-center justify-between hover:bg-accent/50 transition-colors"
              onClick={() => toggleChapter(chapterIndex)}
            >
              <span className="font-medium">{chapter.title}</span>
              {expandedChapters.includes(chapterIndex) ? (
                <ChevronDown className="h-5 w-5" />
              ) : (
                <ChevronRight className="h-5 w-5" />
              )}
            </button>
            {expandedChapters.includes(chapterIndex) && (
              <ul className="bg-background/50">
                {chapter.lessons.map((lesson) => (
                  <li key={lesson.id}>
                    <button
                      className={`w-full text-left p-3 pl-8 flex items-center justify-between hover:bg-accent/50 transition-colors ${
                        selectedLesson.id === lesson.id ? "bg-primary text-primary-foreground" : ""
                      }`}
                      onClick={() => handleLessonClick(lesson)}
                    >
                      <span className="flex items-center gap-2">
                        <span className="text-sm">{lesson.id}</span>
                        <span>{lesson.title}</span>
                      </span>
                      {completedLessons.includes(lesson.id) && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-4">{selectedLesson.title}</h1>
        <p className="text-muted-foreground">
          This is where the content for lesson {selectedLesson.id}: {selectedLesson.title} would go. You can add text,
          images, videos, or any other content related to this lesson here.
        </p>
      </main>
    </div>
  )
}

