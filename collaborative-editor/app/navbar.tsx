"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function NavBar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 z-50 w-full backdrop-blur-md transition-all duration-300 ${
        scrolled ? "bg-slate-900/75 shadow-lg shadow-blue-500/10" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-center">
          <div className="flex space-x-8">
            {[
              { href: "/", label: "Home" },
              { href: "/about", label: "About" },
              { href: "/apply", label: "Apply" },
              { href: "/editor", label: "Editor" },
              { href: "/courses", label: "Courses" },
            ].map(({ href, label }) => (
              <Link key={href} href={href} className="relative group">
                {pathname === href && (
                  <motion.div
                    layoutId="underline"
                    className="absolute left-0 right-0 -bottom-2 h-px bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400"
                  />
                )}
                <div className="relative px-3 py-2">
                  <span
                    className={`text-sm font-medium transition-colors ${
                      pathname === href ? "text-cyan-400" : "text-slate-300 hover:text-cyan-300"
                    }`}
                  >
                    {label}
                  </span>
                  <div className="absolute inset-0 -z-10 rounded-lg opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 blur" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
} 