"use client";

import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Particlesbackground from "../Particlesbackground";

export default function Projects() {
  return (
    <main className="relative min-h-screen  text-white">
      <Particlesbackground />
      <Navbar />
      
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4 pt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl w-full space-y-8"
        >
          <div className="text-center space-y-4">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent"
            >
              Projects
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg md:text-xl text-gray-300"
            >
              Showcasing my work and achievements
            </motion.p>
          </div>

          {/* Coming Soon Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500/10 to-amber-600/10 backdrop-blur-lg border border-amber-500/20 p-8"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 to-transparent animate-gradient-x" />
            
            <div className="relative space-y-6">
              <div className="flex items-center justify-center space-x-3">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="w-12 h-12 rounded-full border-2 border-amber-500/30 border-t-amber-500"
                />
                <h2 className="text-2xl md:text-3xl font-bold text-amber-400">
                  Coming Soon
                </h2>
              </div>
              
              <p className="text-center text-gray-300 max-w-2xl mx-auto">
                I&apos;m currently working on some exciting projects that I can&apos;t wait to share with you. 
                Stay tuned for updates as I continue to build and refine these works.
              </p>
              
              <div className="flex justify-center">
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="px-6 py-3 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-white font-medium shadow-lg shadow-amber-500/20"
                >
                  In Development
                </motion.div>
              </div>
            </div>
          </motion.div>

          <p className="text-amber-50 text-lg">
            I&apos;ve been working on a variety of projects, from small personal
            experiments to large-scale applications. Here&apos;s a selection of my
            work.
          </p>
        </motion.div>
      </div>
    </main>
  );
} 