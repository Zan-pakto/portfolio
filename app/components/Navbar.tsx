"use strict";
import { useState } from "react";
import Link from "next/link";
export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="w-full bg-transparent text-amber-50 p-4">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="border-2 border-amber-50 rounded-4xl px-4 py-2 w-fit text-xl">
          <Link href={"/"} target="_parent">
            Arvind Shahi
          </Link>
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
          <NavLinks />
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
          <NavLinks onClick={() => setOpen(false)} />
        </div>
      )}
    </nav>
  );
}

function NavLinks({ onClick }: { onClick?: () => void }) {
  return (
    <>
      <div className="px-4 py-2 text-lg font-light rounded-xl hover:border-2 hover:border-amber-50 transition-all cursor-pointer">
        <Link href="/" target="_parent" onClick={onClick}>
          Home
        </Link>
      </div>
      <div className="px-4 py-2 text-lg font-light rounded-xl hover:border-2 hover:border-amber-50 transition-all cursor-pointer">
        <Link href="/about" target="_parent" onClick={onClick}>
          About
        </Link>
      </div>
      <div className="px-4 py-2 text-lg font-light rounded-xl hover:border-2 hover:border-amber-50 transition-all cursor-pointer">
        <Link href="/projects" target="_parent" onClick={onClick}>Projects</Link>
      </div>
      <div className="px-4 py-2 text-lg font-light rounded-xl hover:border-2 hover:border-amber-50 transition-all cursor-pointer">
        <Link href="/contact" target="_parent" onClick={onClick}>Contact</Link>
      </div>
    </>
  );
}
