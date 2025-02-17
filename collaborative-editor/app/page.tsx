"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { useTheme } from "next-themes"
import { Sun, Moon } from "lucide-react"

export default function Page() {
  const { theme, setTheme } = useTheme()

  return (
    <main className="min-h-screen bg-background overflow-auto">
      {/* Theme toggle */}
      <button
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="fixed top-4 right-4 p-2 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors"
      >
        {theme === "dark" ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
      </button>

      {/* Hero section */}
      <section className="h-screen flex flex-col items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-6"
        >
          <motion.h1 
            className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60"
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Welcome to Product Space
          </motion.h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Your gateway to collaborative learning and innovation
          </p>
        </motion.div>
      </section>

      {/* Features section */}
      <section className="max-w-4xl mx-auto p-4 space-y-8 mb-20">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="group"
          >
            <Link
              href="/editor"
              className="block p-6 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all duration-300 transform hover:-translate-y-1"
            >
              <h2 className="text-2xl font-semibold mb-3">Collaborative Editor</h2>
              <p className="opacity-90">Edit and collaborate in real-time with others.</p>
            </Link>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="group"
          >
            <Link
              href="/courses"
              className="block p-6 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-all duration-300 transform hover:-translate-y-1"
            >
              <h2 className="text-2xl font-semibold mb-3">Courses</h2>
              <p className="opacity-90">Browse our selection of courses and start learning.</p>
            </Link>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="group"
          >
            <Link
              href="/about"
              className="block p-6 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-all duration-300 transform hover:-translate-y-1"
            >
              <h2 className="text-2xl font-semibold mb-3">About Us</h2>
              <p className="opacity-90">Learn more about our platform and mission.</p>
            </Link>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="group"
          >
            <Link
              href="/apply"
              className="block p-6 bg-muted text-muted-foreground rounded-lg hover:bg-muted/90 transition-all duration-300 transform hover:-translate-y-1"
            >
              <h2 className="text-2xl font-semibold mb-3">Apply</h2>
              <p className="opacity-90">Join our community and start your learning journey.</p>
            </Link>
          </motion.div>
        </motion.div>
      </section>
    </main>
  )
}

