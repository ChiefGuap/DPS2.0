"use client";

import React, { useEffect, useState } from "react";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import CountUp from "react-countup";
import { NavBar } from "./navbar";
import type { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-[#030014] text-white">
        <div className="stars" />
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <NavBar />
          <main className="pt-16">
            {children}
            <div className="container mx-auto px-4 py-12">
              <section className="relative overflow-hidden rounded-lg bg-gradient-to-b from-slate-900/50 to-[#030014]/50 p-8 border border-slate-800/50">
                <div className="relative z-10">
                  {isClient && (
                    <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:gap-12">
                      {[
                        { value: 850, label: "HACKERS", suffix: "+" },
                        { value: 24, label: "HOURS" },
                        { value: 150, label: "PROJECTS", suffix: "+" },
                        { value: 10, label: "PRIZES", prefix: "$", suffix: "k+" },
                      ].map(({ value, label, prefix, suffix }) => (
                        <div key={label} className="text-center">
                          <h2 className="text-4xl font-bold text-cyan-400">
                            {prefix}
                            <CountUp end={value} duration={2} />
                            {suffix}
                          </h2>
                          <p className="mt-2 text-lg text-slate-300">{label}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="mt-12 text-center">
                    <button className="px-8 py-3 text-lg font-medium rounded-lg bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 text-white hover:opacity-90 transition-opacity">
                      Sponsor 2025
                    </button>
                  </div>
                </div>
                <div className="absolute left-0 top-0 -translate-x-1/4 -translate-y-1/4 animate-float">
                  <div className="h-48 w-48 rounded-full bg-gradient-radial from-blue-500/20 via-cyan-500/10 to-transparent blur-xl" />
                </div>
                <div className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 animate-float-reverse">
                  <div className="h-72 w-72 rounded-full bg-gradient-radial from-purple-500/20 via-blue-500/10 to-transparent blur-xl" />
                </div>
              </section>
            </div>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
};

export default Layout;

