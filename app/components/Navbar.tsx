"use client";
import { useState } from "react";

declare global {
  interface Window {
    locomotiveScroll?: {
      scrollTo: (
        target: HTMLElement | string | number,
        options?: {
          offset?: number;
          duration?: number;
          easing?: number[];
          disableLerp?: boolean;
        }
      ) => void;
      destroy: () => void;
    };
  }
}

const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId);
  if (element) {
    const navbarHeight = 80;

    // Try Locomotive Scroll first
    if (window.locomotiveScroll) {
      window.locomotiveScroll.scrollTo(element, {
        offset: -navbarHeight,
        duration: 1000,
      });
    } else {
      // Fallback to native scroll
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - navbarHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  }
};

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const handleNavClick = (sectionId: string) => {
    scrollToSection(sectionId);
    setOpen(false);
  };

  return (
    <nav className="w-full bg-transparent text-amber-50 p-4 fixed top-0 left-0 right-0 z-50">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div
          onClick={() => handleNavClick("home")}
          className="border-2 border-amber-50 rounded-4xl px-4 py-2 w-fit text-xl cursor-pointer hover:bg-amber-50/10 transition-all"
        >
          Arvind Shahi
        </div>

        <button
          className="md:hidden flex flex-col justify-center items-center"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          <span
            className={`block h-1 w-6 bg-amber-50 my-1 transition-all ${
              open ? "rotate-45 translate-y-2" : ""
            }`}
          ></span>
          <span
            className={`block h-1 w-6 bg-amber-50 my-1 transition-all ${
              open ? "opacity-0" : ""
            }`}
          ></span>
          <span
            className={`block h-1 w-6 bg-amber-50 my-1 transition-all ${
              open ? "-rotate-45 -translate-y-2" : ""
            }`}
          ></span>
        </button>

        <div className="hidden md:flex gap-10">
          <NavLinks onNavClick={handleNavClick} />
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 bg-black/80 z-50 flex flex-col items-center justify-center md:hidden">
          {/* Close button */}
          <button
            className="absolute top-6 right-8 text-4xl text-amber-50"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          >
            &times;
          </button>
          <NavLinks onNavClick={handleNavClick} />
        </div>
      )}
    </nav>
  );
}

function NavLinks({ onNavClick }: { onNavClick: (sectionId: string) => void }) {
  return (
    <>
      <div
        onClick={() => onNavClick("home")}
        className="px-4 py-2 text-lg font-light rounded-xl hover:border-2 hover:border-amber-50 transition-all cursor-pointer"
      >
        Home
      </div>
      <div
        onClick={() => onNavClick("about")}
        className="px-4 py-2 text-lg font-light rounded-xl hover:border-2 hover:border-amber-50 transition-all cursor-pointer"
      >
        About
      </div>
      <div
        onClick={() => onNavClick("projects")}
        className="px-4 py-2 text-lg font-light rounded-xl hover:border-2 hover:border-amber-50 transition-all cursor-pointer"
      >
        Projects
      </div>
      <div
        onClick={() => onNavClick("contact")}
        className="px-4 py-2 text-lg font-light rounded-xl hover:border-2 hover:border-amber-50 transition-all cursor-pointer"
      >
        Contact
      </div>
    </>
  );
}
