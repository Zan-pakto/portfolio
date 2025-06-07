"use client";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

export default function About() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Trigger the animation after mount
    setShow(true);
  }, []);

  return (
    <div className="relative w-full min-h-screen bg-black">
      <Navbar />
      <div className="flex flex-col md:flex-row items-center justify-center min-h-[80vh] px-4">
        {/* Left: Big Name */}
        <div className="flex-1 flex flex-col items-center md:items-start mb-8 md:mb-0">
          <span
            className={`
              text-6xl md:text-9xl font-extrabold italic text-white leading-tight text-center ml-10
              transition-all duration-700
              ${
                show ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
              }
            `}
          >
            I'm Arvind Shahi
          </span>
        </div>
        {/* Right: Image */}
        <div className="flex-1 flex justify-center">
          <img
            src="/anime.png"
            alt="Arvind Shahi"
            className={`
              w-[28rem] h-[28rem] object-cover shadow-2xl rounded-full border-4 border-orange-400
              transition-all duration-700
              ${show ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"}
            `}
          />
        </div>
      </div>
    </div>
  );
}
