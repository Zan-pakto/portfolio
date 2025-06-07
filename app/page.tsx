"use client";
import React, { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import SmoothFollower from "./cursor";
import "./globals.css";
import Particlesbackground from "./Particlesbackground";

export default function Home() {
  const [first, setFirst] = useState(true);

  return (
    useEffect(() => {
      setTimeout(() => {
        setFirst(false);
      }, 1300);
    }, []),
    first ? (
      <div className="flex items-center justify-center w-full min-h-screen bg-black transition-discrete duration-1000 ease-in-out">
        <div className="border-2 border-amber-50 rounded-xl px-4 py-4 w-fit text-4xl text-white ">
          Arvind Shahi
        </div>
      </div>
    ) : (
      <div className="relative w-full min-h-screen ">
        <SmoothFollower />
        <Particlesbackground />
        <Navbar />
        <div className="absolute top-1/3 w-full text-center text-white z-10 px-4">
          <p className="text-4xl italic">I’m a</p>
          <h1 className="text-4xl sm:text-7xl font-extrabold leading-tight tracking-tight flex flex-wrap justify-center gap-x-6 italic">
            <span>FULL-STACK</span>
            <span className="text-orange-400">DEVELOPER</span>
            <span> & SOFTWARE</span>
            <span>ENGINEER</span>
          </h1>
        </div>
      </div>
    )
  );
}
