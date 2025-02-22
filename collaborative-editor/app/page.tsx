"use client"

import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion" // animations
import { useTheme } from "next-themes" // dark vs light mode
import { Sun, Moon } from "lucide-react" // icons for theme toggle
import CountUp from "react-countup"; // count
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Page() {
  const { theme, setTheme } = useTheme()
  const [isClient, setIsClient] = useState(false); // fix isClient issue

  const projects = [
    {
      name: "Sync",
      team: "Team 1155",
      description: "An AI-powered learning assistant for students.",
      members: "Anita Thata, Caitlin Chan, Jason Zhang, Puja Devarasetty",
      image: "/placeholder.png", // Replace with actual image
      link: "#",
    },
    {
      name: "Project Beta",
      team: "By: Team 1155",
      description: "A real-time collaborative platform.",
      members: "",
      image: "/placeholder.png",
      link: "#",
    },
    {
      name: "Project Gamma",
      team: "By: Team 1155",
      description: "A community-driven mentorship hub.",
      members: "",
      image: "/placeholder.png",
      link: "#",
    },
  ];  

  const [currentIndex, setCurrentIndex] = useState(0);

  const nextProject = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % projects.length);
  };

  const prevProject = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? projects.length - 1 : prevIndex - 1
    );
  };

  useEffect(() => {
    setIsClient(true); // ensure animation only runs on client side
  }, []);

  return (
    <main className="min-h-screen bg-background overflow-auto">
      {/* Theme toggle */}
      <button
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="fixed top-4 right-4 p-2 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors"
      >
        {theme === "dark" ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
      </button>

      {/* Our Mission (Hero Section) */}
      <section className="h-screen flex px-8 md:px-16 lg:px-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
          {/* Left: Mission Text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            className="flex flex-col justify-center space-y-6"
          >
            <h1 className="py-5 text-6xl font-bold text-white leading-tight">
              <span className="block">We are</span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
                Product Space.
              </span>
            </h1>
          </motion.div>

          {/* Right: Empty Column to Maintain Alignment */}
          <div></div>
        </div>
      </section>

      {/* Our Mission (Hero Section) */}
      <section className="h-screen flex px-8 md:px-16 lg:px-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
          {/* Left: Mission Text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            className="flex flex-col justify-center space-y-6"
          >
            <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
              Our Mission
            </h1>
            <p className="text-xl text-muted-foreground max-w-lg">
              "Cultivate the product leaders of tomorrow."
            </p>
          </motion.div>

          {/* Right: Empty Column to Maintain Alignment */}
          <div></div>
        </div>
      </section>

      {/* Our Offering */}
      <section className="min-h-screen flex items-center px-8 md:px-16 lg:px-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
          {/* Left: Empty Space to Maintain Layout */}
          <div></div> {/* This keeps the right text aligned properly */}

          {/* Right: Offering Text */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="text-right"
          >
            <h2 className="text-5xl font-bold">Our Offering</h2>
            <p className="text-xl text-muted-foreground mt-4 max-w-lg ml-auto">
              Product Space's primary offering is the Fellowship, an immersive and interactive introduction
              to product management. Our Fellowship is built on one core principle - learn by doing.
            </p>
          </motion.div>
        </div>
      </section>

      {/* YOU LEARN */}
      <section className="min-h-screen flex flex-col justify-center text-center">
        <motion.h2
          className="text-5xl font-bold text-white"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          you learn
        </motion.h2>

        <p className="text-xl text-slate-300 mt-4 max-w-3xl mx-auto">
          We teach you how to be a great product manager.
        </p>

        {/* Stats Section */}
        <section className="py-20 text-center text-white flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="grid grid-cols-3 gap-x-12 max-w-6xl mx-auto items-center"
          >
            {/* "Over" + 8 Weeks */}
            <div className="flex flex-col items-center">
              <p className="text-lg font-semibold uppercase">Over</p>
              <h2 className="text-5xl font-bold leading-none">
                <CountUp end={8} duration={3} />
              </h2>
              <p className="text-lg font-semibold uppercase">Weeks</p>
            </div>

            {/* "Through" + 8 Workshops */}
            <div className="flex flex-col items-center">
              <p className="text-lg font-semibold uppercase">Through</p>
              <h2 className="text-5xl font-bold leading-none">
                <CountUp end={8} duration={3} />
              </h2>
              <p className="text-lg font-semibold uppercase">Workshops</p>
            </div>

            {/* "Led by" + 8 Industry Leaders */}
            <div className="flex flex-col items-center">
              <p className="text-lg font-semibold uppercase">Led by</p>
              <h2 className="text-5xl font-bold leading-none">
                <CountUp end={8} duration={3} />
              </h2>
              <p className="text-lg font-semibold">INDUSTRY PMs</p>
            </div>
          </motion.div>
        </section>
      </section>

      {/* by Doing */}
      <section className="min-h-screen py-20 text-center">
        <motion.h2
          className="text-5xl font-bold text-white"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          by doing.
        </motion.h2>
        <p className="text-xl text-slate-300 mt-4 max-w-3xl mx-auto">
          Build a product from idea to prototype.
        </p>

        {/* Stats Section */}
        <section className="py-5 text-center text-white flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="grid grid-cols-3 gap-x-12 max-w-6xl mx-auto items-center"
          >
            {/* "Over" + 8 Weeks */}
            <div className="flex flex-col items-center">
              <p className="text-lg font-semibold uppercase">Over</p>
              <h2 className="text-5xl font-bold leading-none">
                <CountUp end={8} duration={3} />
              </h2>
              <p className="text-lg font-semibold uppercase">Weeks</p>
            </div>

            {/* "Through" + 8 Workshops */}
            <div className="flex flex-col items-center">
              <p className="text-lg font-semibold uppercase">With</p>
              <h2 className="text-5xl font-bold leading-none">
                <CountUp end={8} duration={3} />
              </h2>
              <p className="text-lg font-semibold uppercase">Work Sessions</p>
            </div>

            {/* "Led by" + 8 Industry Leaders */}
            <div className="flex flex-col items-center">
              <p className="text-lg font-semibold uppercase">and</p>
              <h2 className="text-5xl font-bold leading-none">
                <CountUp end={6} duration={3} />
              </h2>
              <p className="text-lg font-semibold uppercase">Industry Mentors</p>
            </div>
          </motion.div>
        </section>

        {/* Join the Pack */}
        <section className="py-20 flex justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="px-8 py-3 text-lg font-medium rounded-lg bg-white text-black hover:opacity-90 transition-opacity"
          >
            Join the Pack!
          </motion.button>
        </section>
      </section>

      {/* Our Pack’s Past Work Section */}
      <section className="min-h-screen flex flex-col justify-center items-center py-20 text-center">
        <h2 className="text-5xl font-bold mb-6">Our Pack’s Past Work</h2>

        {/* Slide Container */}
        <div className="flex justify-center items-center gap-6 w-full max-w-6xl">
          {/* Left Arrow */}
          <button onClick={prevProject} className="p-4 text-white hover:opacity-80">
            <ChevronLeft size={40} />
          </button>

          {/* Project Slide */}
          <div className="relative w-full max-w-5xl flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={projects[currentIndex].name}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-x-16 items-center p-6"
              >
                {/* Left: Fixed-Size Placeholder Image */}
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1 }}
                  className="w-[400px] h-[300px] bg-gray-800 rounded-lg flex items-center justify-center"
                >
                  <p className="text-white text-lg opacity-60">[ Image Placeholder ]</p>
                </motion.div>

                {/* Right: Text Content (Better Grouping & Alignment) */}
                <div className="w-full max-w-lg flex flex-col justify-between min-h-[300px]">
                  
                  {/* Project Name + Author (Grouped Together at the Top) */}
                  <div>
                    <h3 className="text-4xl font-bold text-white text-left">{projects[currentIndex].name}</h3>
                    <p className="text-md text-gray-400 mt-1 text-left">
                      <span className="font-medium text-gray-300 text-left"></span>
                      {projects[currentIndex].team}
                    </p>
                  </div>

                  {/* Description (Expands in the Middle) */}
                  <p className="text-lg text-gray-300 leading-relaxed flex text-left">
                    {projects[currentIndex].description}
                  </p>

                  {/* Team Members (Stays at the Bottom) */}
                  <div className="pt-4">
                    <p className="text-lg font-semibold text-gray-300 text-left">Team Members:</p>
                    <p className="text-md text-gray-400 leading-relaxed text-left">
                      {projects[currentIndex].members}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Arrow */}
          <button onClick={nextProject} className="p-4 text-white hover:opacity-80">
            <ChevronRight size={40} />
          </button>
        </div>
      </section>
    </main>
  )
}

