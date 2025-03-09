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

  // Added the Dashboard link to the navigation array
  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/apply", label: "Apply" },
    { href: "/editor", label: "Editor" },
    { href: "/courses", label: "Courses" },
    { href: "/dashboard", label: "Dashboard" },
  ];

  return (
    <nav
      className={`fixed top-5 left-1/2 transform -translate-x-1/2 px-6 py-2 rounded-full backdrop-blur-md transition-all duration-300 shadow-md
        ${scrolled ? "bg-slate-900/90 shadow-lg shadow-blue-500/10" : "bg-slate-800/70"} 
      `}
    >
      <div className="flex items-center space-x-6">
        {navLinks.map(({ href, label }) => (
          <Link key={href} href={href} className="relative group">
            {pathname === href && (
              <motion.div
                layoutId="underline"
                className="absolute left-0 right-0 -bottom-1 h-px"
              />
            )}
            <span
              className={`text-sm font-medium transition-colors ${
                pathname === href ? "text-cyan-400" : "text-slate-300 hover:text-cyan-300"
              }`}
            >
              {label}
            </span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
