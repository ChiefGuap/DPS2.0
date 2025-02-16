import type { Metadata } from 'next'
import './globals.css'
import Link from 'next/link'
import React from 'react'

export const metadata: Metadata = {
  title: 'Capstone',
  description: 'Created with Raq and Akash',
  generator: 'Capstone',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <nav className="flex items-center gap-4 p-4 border-b">
          <Link href="/">
            <span className="text-lg font-medium">Editor</span>
          </Link>
          <Link href="/apply">
            <span className="text-lg font-medium">Apply</span>
          </Link>
        </nav>
        <main>{children}</main>
      </body>
    </html>
  )
}
