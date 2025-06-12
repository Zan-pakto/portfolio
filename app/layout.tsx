import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SmoothFollower from "./cursor";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Arvind Shahi - Portfolio",
  description: "Full Stack Developer Portfolio showcasing projects and skills",
  keywords: ["Full Stack Developer", "Web Development", "Portfolio", "React", "Next.js"],
  authors: [{ name: "Arvind Shahi" }],
  creator: "Arvind Shahi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="antialiased cursor-none">
        <SmoothFollower />
        {children}
      </body>
    </html>
  );
}
