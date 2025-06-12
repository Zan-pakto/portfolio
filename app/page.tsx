"use client";
import React, { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import SmoothFollower from "./cursor";
import "./globals.css";
import Particlesbackground from "./Particlesbackground";
import { motion } from "framer-motion";

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);
  const [animateOut, setAnimateOut] = useState(false);

  useEffect(() => {
    const animateTimer = setTimeout(() => setAnimateOut(true), 500); // Start animation after 0.5s
    const hideTimer = setTimeout(() => setShowSplash(false), 1000); // Remove splash after 0.9s
    return () => {
      clearTimeout(animateTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  return (
    <div className="relative w-full min-h-screen ">
      {showSplash && (
        <div
          className={`fixed inset-0 flex items-center justify-center bg-black z-50 transition-all duration-700 ease-in-out
            ${
              animateOut
                ? "opacity-0 -translate-y-32 pointer-events-none"
                : "opacity-100 translate-y-0"
            }
          `}
        >
          <div className="border-2 border-amber-50 rounded-xl px-6 py-6 w-fit text-3xl sm:text-5xl md:text-6xl text-white text-center">
            Arvind Shahi
          </div>
        </div>
      )}

      <SmoothFollower />
      <Particlesbackground />
      <Navbar />
      <motion.div
        className="absolute top-1/3 w-full text-center text-white z-10 px-4"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: showSplash ? 0 : 1, y: showSplash ? 40 : 0 }}
        transition={{ duration: 0.3, delay: 0.01 }}
      >
        <motion.p
          className="text-2xl sm:text-4xl italic mb-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: showSplash ? 0 : 1, y: showSplash ? 20 : 0 }}
          transition={{ duration: 0.2, delay: 0.05 }}
        >
          I’m a
        </motion.p>
        <motion.h1
          className="text-3xl sm:text-5xl md:text-7xl font-extrabold leading-tight tracking-tight flex flex-wrap justify-center gap-x-4 sm:gap-x-6 italic"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: showSplash ? 0 : 1, y: showSplash ? 40 : 0 }}
          transition={{ duration: 0.25, delay: 0.1 }}
        >
          <span>FULL-STACK</span>
          <span className="text-orange-400">DEVELOPER</span>
          <span>&nbsp;SOFTWARE</span>
          <span>ENGINEER</span>
        </motion.h1>
      </motion.div>
    </div>
  );
}
