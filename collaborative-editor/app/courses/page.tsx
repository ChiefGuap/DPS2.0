"use client"

import { useState } from "react"
import { Check } from "lucide-react"

// Mock data for courses
const coursesData = [
  {
    id: 1,
    title: "Introduction to React",
    chapters: [
      {
        id: 1,
        title: "Getting Started",
        topics: [
          { id: 1, title: "What is React?", completed: false },
          { id: 2, title: "Setting up your environment", completed: false },
        ],
      },
      {
        id: 2,
        title: "React Basics",
        topics: [
          { id: 3, title: "Components and Props", completed: false },
          { id: 4, title: "State and Lifecycle", completed: false },
        ],
      },
    ],
  },
  // Add more courses as needed
]

export default function CoursesPage() {
  const [selectedCourse, setSelectedCourse] = useState(coursesData[0])
  const [selectedChapter, setSelectedChapter] = useState(selectedCourse.chapters[0])
  const [selectedTopic, setSelectedTopic] = useState(selectedChapter.topics[0])
  const [completedTopics, setCompletedTopics] = useState<number[]>([])

  const handleTopicClick = (topic: { id: number; title: string; completed: boolean }) => {
    setSelectedTopic(topic)
    if (!completedTopics.includes(topic.id)) {
      setCompletedTopics([...completedTopics, topic.id])
    }
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 bg-card text-card-foreground p-4 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">{selectedCourse.title}</h2>
        {selectedCourse.chapters.map((chapter) => (
          <div key={chapter.id} className="mb-4">
            <h3 className="font-semibold mb-2">{chapter.title}</h3>
            <ul>
              {chapter.topics.map((topic) => (
                <li
                  key={topic.id}
                  className={`flex items-center justify-between p-2 rounded cursor-pointer ${
                    selectedTopic.id === topic.id ? "bg-primary text-primary-foreground" : "hover:bg-accent"
                  }`}
                  onClick={() => handleTopicClick(topic)}
                >
                  <span>{topic.title}</span>
                  {completedTopics.includes(topic.id) && <Check className="h-4 w-4" />}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-4">{selectedTopic.title}</h1>
        <p className="text-muted-foreground">
          This is where the content for {selectedTopic.title} would go. You can add text, images, videos, or any other
          content related to this topic here.
        </p>
      </main>
    </div>
  )
}

