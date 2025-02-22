"use client";

import React, { useEffect, useState } from "react";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { NavBar } from "./navbar";
import type { ReactNode } from "react";

// any page content wrapped inside layout
interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  // so animations run only on client
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return ( // html body struct
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen text-white relative">
        {/* wrap entire layout in theme provider */}
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <NavBar />
          <main className="pt-16">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
};

export default Layout;
