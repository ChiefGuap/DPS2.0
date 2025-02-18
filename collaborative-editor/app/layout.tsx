import type { Metadata } from "next"
import "./globals.css"
import Link from "next/link"
import type React from "react"
import { ThemeProvider } from "next-themes"

export const metadata: Metadata = {
  title: "Product Space",
  description: "Created with Raq and Akash",
  generator: "Product Space",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <nav className="fixed top-0 w-full z-50 backdrop-blur-sm border-b bg-background/80 text-foreground">
            <div className="max-w-7xl mx-auto flex items-center gap-6 p-4">
              <Link href="/" className="mr-auto">
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
                  Product Space
                </span>
              </Link>
              <Link href="/editor">
                <span className="text-sm font-medium hover:text-primary transition-colors">Editor</span>
              </Link>
              <Link href="/courses">
                <span className="text-sm font-medium hover:text-primary transition-colors">Courses</span>
              </Link>
              <Link href="/about">
                <span className="text-sm font-medium hover:text-primary transition-colors">About Us</span>
              </Link>
              <Link href="/apply">
                <span className="text-sm font-medium hover:text-primary transition-colors">Apply</span>
              </Link>
            </div>
          </nav>
          <main className="pt-16">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  )
}

