"use strict";
import Link from "next/link";
export default function Navbar() {
  return (
    <div className="grid grid-cols-2 items-center text-amber-50 p-4 ml-8">
      <div className="border-2 border-amber-50 rounded-xl px-4 py-2 w-fit text-xl">
        Arvind Shahi
      </div>
      <div className="flex justify-center gap-10">
        <div className="px-4 py-2 text-lg font-light rounded-xl hover:border-2 hover:border-amber-50 transition-all cursor-pointer">
          <Link href="/">Home</Link>
        </div>
        <div className="px-4 py-2 text-lg font-light rounded-xl hover:border-2 hover:border-amber-50 transition-all cursor-pointer">
          <Link href="/about"> About</Link>
        </div>
        <div className="px-4 py-2 text-lg font-light rounded-xl hover:border-2 hover:border-amber-50 transition-all cursor-pointer">
          Projects
        </div>
        <div className="px-4 py-2 text-lg font-light rounded-xl hover:border-2 hover:border-amber-50 transition-all cursor-pointer">
          Contact
        </div>
      </div>
    </div>
  );
}
