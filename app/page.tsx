"use client";
import React, { useEffect, useState, useRef } from "react";
import Navbar from "./components/Navbar";
import SmoothFollower from "./cursor";
import "./globals.css";
import Particlesbackground from "./Particlesbackground";
import { motion } from "framer-motion";
import Image from "next/image";

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);
  const [animateOut, setAnimateOut] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // About section states
  const [showText, setShowText] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const [showResume, setShowResume] = useState(false);
  const [resmetext, setresmetext] = useState(false);
  const [showLaptop, setShowLaptop] = useState(false);
  const [showBottomTexts, setShowBottomTexts] = useState(false);
  const [showSkills, setShowSkills] = useState(false);
  const [showWork, setShowWork] = useState(false);
  const [showCert, setShowCert] = useState(false);
  const [showGridImages, setShowGridImages] = useState(false);
  
  const resumeRef = useRef<HTMLHeadingElement>(null);
  const resmetextRef = useRef<HTMLHeadingElement>(null);
  const laptopRef = useRef<HTMLImageElement>(null);
  const bottomTextsRef = useRef<HTMLDivElement>(null);
  const skillsRef = useRef<HTMLDivElement>(null);
  const workRef = useRef<HTMLDivElement>(null);
  const certRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const animateTimer = setTimeout(() => setAnimateOut(true), 500);
    const hideTimer = setTimeout(() => setShowSplash(false), 1000);
    return () => {
      clearTimeout(animateTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  // Show text and image on mount
  useEffect(() => {
    setShowText(true);
    const timer = setTimeout(() => setShowImage(true), 200);
    return () => clearTimeout(timer);
  }, []);

  // Combined Intersection Observer for better performance
  useEffect(() => {
    const observer = new window.IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (entry.target === resumeRef.current) setShowResume(true);
            if (entry.target === resmetextRef.current) setresmetext(true);
            if (entry.target === laptopRef.current) setShowLaptop(true);
            if (entry.target === bottomTextsRef.current) setShowBottomTexts(true);
            if (entry.target === skillsRef.current) setShowSkills(true);
            if (entry.target === workRef.current) setShowWork(true);
            if (entry.target === certRef.current) setShowCert(true);
            if (entry.target === gridRef.current) setShowGridImages(true);
          }
        });
      },
      { threshold: 0.1, rootMargin: "50px" }
    );

    const refs = [
      resumeRef.current,
      resmetextRef.current,
      laptopRef.current,
      bottomTextsRef.current,
      skillsRef.current,
      workRef.current,
      certRef.current,
      gridRef.current,
    ].filter(Boolean);

    refs.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative w-full">
      {showSplash && (
        <div
          className={`fixed inset-0 flex items-center justify-center bg-black z-50 transition-all duration-700 ease-in-out will-change-transform
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

      {!isMobile && <SmoothFollower />}
      <Particlesbackground />
      <Navbar />
      
      {/* Home Section */}
      <section id="home" className="relative w-full min-h-screen">
        <motion.div
          className="absolute top-1/3 w-full text-center text-white z-10 px-4 will-change-transform"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: showSplash ? 0 : 1, y: showSplash ? 40 : 0 }}
          transition={{ duration: isMobile ? 0.2 : 0.3, delay: 0.01 }}
        >
          <motion.p
            className="text-2xl sm:text-4xl italic mb-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: showSplash ? 0 : 1, y: showSplash ? 20 : 0 }}
            transition={{ duration: isMobile ? 0.15 : 0.2, delay: 0.05 }}
          >
            I&apos;m a
          </motion.p>
          <motion.h1
            className="text-3xl sm:text-5xl md:text-7xl font-extrabold leading-tight tracking-tight flex flex-wrap justify-center gap-x-4 sm:gap-x-6 italic"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: showSplash ? 0 : 1, y: showSplash ? 40 : 0 }}
            transition={{ duration: isMobile ? 0.2 : 0.25, delay: 0.1 }}
          >
            <span>FULL-STACK</span>
            <span className="text-orange-400">DEVELOPER</span>
            <span>&nbsp;SOFTWARE</span>
            <span>ENGINEER</span>
          </motion.h1>
        </motion.div>
      </section>

      {/* About Section */}
      <section id="about" className="relative w-full min-h-screen">
        <div className="flex flex-col md:flex-row items-center justify-center min-h-[80vh] px-4">
          {/* Text Block */}
          <div className="flex-1 flex flex-col justify-center items-center md:items-center mb-8 md:mb-0 md:pr-12">
            <span
              className={`
                text-4xl md:text-6xl font-bold italic text-amber-300 mb-4 text-center
                transition-all duration-700
                ${
                  showText
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 -translate-y-5"
                }
              `}
            >
              hi there I&apos;m
            </span>
            <span
              className={`
                text-7xl md:text-9xl font-extrabold italic text-white leading-tight text-center
                transition-all duration-700
                ${
                  showText
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 -translate-y-5"
                }
              `}
            >
              Arvind Shahi
            </span>
          </div>
          {/* Image Block */}
          <div className="flex-1 flex justify-center items-center">
            <Image
              src="/shahi.jpg"
              alt="Arvind Shahi"
              width={448}
              height={448}
              className={`
                w-[20rem] h-[20rem] md:w-[28rem] md:h-[28rem] object-cover shadow-2xl rounded-full border-4 border-orange-400
                transition-all duration-700
                ${
                  showImage
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-5"
                }
              `}
            />
          </div>
        </div>
        
        {/* The resume heading */}
        <h1
          ref={resumeRef}
          className={`
            text-amber-50 text-5xl font-bold text-center transition-all duration-700 mt-8 italic
            ${
              showResume
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }
          `}
        >
          the resume
        </h1>
        {/* Resume text */}
        <div className="flex justify-center w-full mt-9">
          <div
            ref={resmetextRef}
            className={`
              text-amber-50 text-4xl text-center transition-all duration-700 max-w-2xl font-light
              ${
                resmetext
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }
            `}
          >
            I have been working for the past 7 years with Javascript. I&apos;ve
            been writing/refactoring code and connecting restful apis using
            Angular, React and Vuejs for a couple of years but I also worked
            with different stacks in the past. I can help/guide your developers
            with best practices as well.
          </div>
        </div>
        {/* Laptop image */}
        <div className="flex justify-center w-full mt-12">
          <Image
            ref={laptopRef}
            src="/alptop.jpg"
            alt="Laptop"
            width={1040}
            height={640}
            className={`
              w-80 h-52 md:w-[65rem] md:h-[40rem] object-cover rounded-xl shadow-lg
              transition-all duration-700
              ${
                showLaptop
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }
            `}
          />
        </div>
        {/* Bottom texts in two columns */}
        <div
          ref={bottomTextsRef}
          className="flex flex-col md:flex-row justify-center items-stretch gap-8 w-full mt-12 px-4 md:px-16"
        >
          <div
            className={`
              flex-1 bg-transparent
              text-amber-50 text-2xl md:text-3xl text-center md:text-left font-sans transition-all duration-700 p-4 rounded-xl
              ${
                showBottomTexts
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }
            `}
          >
            As a Senior JavaScript Developer, I have had the opportunity to work
            with both mid-sized and large clients on a variety of projects in
            different industries. My experience has given me the opportunity to
            hone my skills and develop an understanding of the unique challenges
            that come with working on projects for these types of clients. I
            have worked on projects for clients in industries ranging from
            healthcare to finance to retail, and my experience has helped me
            understand the different coding requirements for each type of
            project.
          </div>
          <div
            className={`
              flex-1 bg-transparent
              text-amber-50 text-2xl md:text-3xl text-center md:text-left font-sans transition-all duration-700 p-4 rounded-xl
              ${
                showBottomTexts
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }
            `}
          >
            I have also been able to build strong relationships with clients, as
            I am able to understand their needs and provide solutions that meet
            their expectations. My familiarity with the different coding
            languages used in today&apos;s web development projects has been
            extremely beneficial. I am able to quickly debug code, test and
            optimize the code, and ensure that it meets the standards of the
            client. I also have experience with building APIs and integrating
            them with other web services.
          </div>
        </div>
        {/* Skills section */}
        <div
          ref={skillsRef}
          className={`
            w-full flex flex-col justify-start mt-16
            transition-all duration-700
            ${
              showSkills
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }
            pl-8 md:pl-24 pr-4
          `}
        >
          <h1 className="text-amber-300 text-3xl md:text-4xl font-bold mb-8 text-left w-full">
            01 Software Skills
          </h1>
          <div className="bg-transparent w-full py-8 rounded-xl shadow-lg flex flex-col items-start relative">
            <div className="grid grid-cols-4 grid-rows-5 gap-x-12 gap-y-6 text-amber-50 text-lg md:text-2xl font-medium text-left w-full ">
              <span>JavaScript</span>
              <span>Angular JS</span>
              <span>React.js</span>
              <span>Next.js</span>
              <span>Express</span>
              <span>Php</span>
              <span>Java</span>
              <span>Python</span>
              <span>Serverless</span>
              <span>HTML5</span>
              <span>Git/SVN/CVS</span>
              <span>V.C. Software</span>
              <span>Agile Methodologies</span>
              <span>Design Systems</span>
              <span>CSS3/Less/Sass</span>
              <span>C&C++</span>
              <span>NodeJS</span>
              <span>MongoDB</span>
              <span>Docker</span>
              <span>Oracle/SQL Server</span>
            </div>
            <div
              className="absolute left-0 -bottom-2 h-1  bg-amber-50 transition-all duration-700"
              style={{
                width: showSkills ? "100%" : "0%",
              }}
            />
          </div>
        </div>
        {/* Work Experience Section */}
        <div
          ref={workRef}
          className={`
    w-full flex flex-col justify-start mt-24
    transition-all duration-700
    ${showWork ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}
    pl-8 md:pl-24 pr-4
  `}
        >
          <h1 className="text-amber-300 text-3xl md:text-4xl font-bold mb-8 text-left w-full relative">
            02 Work Experience
          </h1>
          <div className="bg-transparent w-full py-8 rounded-xl shadow-lg flex flex-col items-start relative">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-12 gap-y-6 text-amber-50 text-lg md:text-2xl font-medium text-left w-full pb-6">
              <div>
                <div className="font-bold">SDE-Intern</div>
                <div> Full-Stack Developesr</div>
                <div className="text-amber-300">2025 - Present</div>
              </div>
              <div>
                <div className="font-bold">Freelance</div>
                <div> Software Engineer & Full-Stack Developer</div>
                <div className="text-amber-300">2023 - Present</div>
              </div>
              <div>
                <div className="font-bold">Volunteer</div>
                <div> Inter At Vasudev Kutumbh Ngo</div>
                <div className="text-amber-300">2024</div>
              </div>
            </div>
            <div
              className="absolute left-0 -bottom-2 h-1 bg-amber-50 rounded transition-all duration-700"
              style={{
                width: showWork ? "100%" : "0%",
              }}
            />
          </div>
        </div>
        {/* Licenses & Certifications Section */}
        <div
          ref={certRef}
          className={`
    w-full flex flex-col justify-start mt-24
    transition-all duration-700
    ${showCert ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}
    pl-8 md:pl-24 pr-4
  `}
        >
          <h1 className="text-amber-300 text-3xl md:text-4xl font-bold mb-8 text-left w-full relative">
            03 Licenses & Certifications
          </h1>
          <div className="bg-transparent w-full py-8 rounded-xl shadow-lg flex flex-col items-start relative">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-12 gap-y-6 text-amber-50 text-lg md:text-2xl font-medium text-left w-full pb-6">
              <div>
                <div>
                  <span className="text-amber-300">2025</span>
                  <span className="mx-2">-</span>
                  <span>Cloud Computing Certification</span>
                  <span className="mx-2">-</span>
                  <span>Nptel</span>
                </div>
                <a
                  className="text-amber-200 hover:text-amber-50 transition-colors duration-300 text-sm mt-1"
                  target="_arvind"
                  href="https://drive.google.com/file/d/1KI9j3Ex9Vj0MjuofORbllr3dGk8f-5Ln/view?usp=drive_link"
                >
                  HKFXXZK8NKOV
                </a>
              </div>
              <div>
                <div>
                  <span className="text-amber-300">2024</span>
                  <span className="mx-2">-</span>
                  <span>Java & DSA</span>
                  <span className="mx-2">-</span>
                  <span>Physics wallah</span>
                </div>
                <a
                  href="https://pwskills.com/learn/certificate/cd09544b-fb3c-43e7-8500-a344be33a96c/"
                  target="_arvind"
                  className="text-amber-200 hover:text-amber-50 transition-colors duration-300 text-sm mt-1"
                >
                  7CTC7W7AQA
                </a>
              </div>
            </div>
            <div
              className="absolute left-0 -bottom-2 h-1 bg-amber-50 rounded transition-all duration-700"
              style={{
                width: showCert ? "100%" : "0%",
              }}
            />
          </div>
        </div>
        <div className="flex items-end justify-center mt-24 mb-24">
          <div className="text-amber-50 text-2xl md:text-3xl font-bold italic mr-4">
            my
          </div>
          <div className="text-amber-50 text-6xl md:text-8xl italic font-medium leading-none">
            Universe
          </div>
        </div>

        {/* Universities and Hosts Section */}
        <div
          ref={gridRef}
          className="relative w-full min-h-[1200px] mt-16 mb-24"
        >
          <div
            className={`
            grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-12 gap-4 md:gap-6 px-4 md:px-8 lg:px-24
            transition-all duration-700
            ${
              showGridImages
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }
          `}
          >
            <div className="lg:col-span-4 lg:row-span-2">
              <Image
                src="/random1.jpg"
                alt="Random 1"
                width={400}
                height={400}
                className="w-full h-[300px] md:h-[400px] object-cover rounded-xl shadow-lg hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="lg:col-span-3 lg:col-start-6">
              <Image
                src="/random2.jpg"
                alt="Random 2"
                width={300}
                height={300}
                className="w-full h-[250px] md:h-[300px] object-cover rounded-xl shadow-lg hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="lg:col-span-3 lg:col-start-9">
              <Image
                src="/random3.jpg"
                alt="Random 3"
                width={250}
                height={250}
                className="w-full h-[200px] md:h-[250px] object-cover rounded-xl shadow-lg hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="lg:col-span-3 lg:col-start-6 lg:row-start-2">
              <Image
                src="/random4.jpg"
                alt="Random 4"
                width={350}
                height={350}
                className="w-full h-[300px] md:h-[350px] object-cover rounded-xl shadow-lg hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="lg:col-span-3 lg:col-start-9 lg:row-start-2">
              <Image
                src="/random5.jpg"
                alt="Random 5"
                width={300}
                height={300}
                className="w-full h-[250px] md:h-[300px] object-cover rounded-xl shadow-lg hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="lg:col-span-4 lg:col-start-1 lg:row-start-3 mt-6">
              <Image
                src="/random6.jpg"
                alt="Random 6"
                width={350}
                height={350}
                className="w-full h-[300px] md:h-[350px] object-cover rounded-xl shadow-lg hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="lg:col-span-4 lg:col-start-5 lg:row-start-3 mt-6">
              <Image
                src="/random7.jpg"
                alt="Random 7"
                width={400}
                height={400}
                className="w-full h-[350px] md:h-[400px] object-cover rounded-xl shadow-lg hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="lg:col-span-3 lg:col-start-1 lg:row-start-4 mt-6">
              <Image
                src="/random8.webp"
                alt="Random 8"
                width={280}
                height={280}
                className="w-full h-[250px] md:h-[280px] object-cover rounded-xl shadow-lg hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="lg:col-span-4 lg:col-start-4 lg:row-start-4 mt-6">
              <Image
                src="/random9.jpg"
                alt="Random 9"
                width={320}
                height={320}
                className="w-full h-[280px] md:h-[320px] object-cover rounded-xl shadow-lg hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="lg:col-span-3 lg:col-start-8 lg:row-start-4 mt-6">
              <Image
                src="/random10.jpg"
                alt="Random 10"
                width={300}
                height={300}
                className="w-full h-[250px] md:h-[300px] object-cover rounded-xl shadow-lg hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="lg:col-span-5 lg:col-start-1 lg:row-start-5 mt-6">
              <Image
                src="/random11.jpg"
                alt="Random 11"
                width={380}
                height={380}
                className="w-full h-[320px] md:h-[380px] object-cover rounded-xl shadow-lg hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="lg:col-span-4 lg:col-start-6 lg:row-start-5 mt-6">
              <Image
                src="/random12.jpg"
                alt="Random 12"
                width={350}
                height={350}
                className="w-full h-[300px] md:h-[350px] object-cover rounded-xl shadow-lg hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>
        </div>
        <div className="h-24"></div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="relative w-full min-h-screen text-white">
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
      </section>

      {/* Contact Section */}
      <section id="contact" className="relative w-full min-h-screen overflow-hidden">
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4 pt-24">
          <div className="max-w-4xl w-full grid md:grid-cols-2 gap-10">
            {/* Contact Information Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="group bg-black/40 backdrop-blur-2xl p-10 rounded-3xl border border-amber-50/20 shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-amber-100/20"
            >
              <motion.h2
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-3xl font-extrabold text-amber-50 mb-8 tracking-tight"
              >
                Contact Info
              </motion.h2>
              <div className="space-y-6 text-lg">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="flex items-center gap-4"
                >
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-amber-50/10 border border-amber-50/20">
                    <svg
                      className="w-6 h-6 text-amber-200"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </span>
                  <span className="text-amber-100 font-medium">
                    <a 
                      href="mailto:arvindshahi555@gmail.com" 
                      className="hover:text-amber-300 transition-colors cursor-pointer"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => {
                        e.preventDefault();
                        window.location.href = "mailto:arvindshahi555@gmail.com";
                      }}
                    >
                      arvindshahi555@gmail.com
                    </a>
                  </span>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="flex items-center gap-4"
                >
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-amber-50/10 border border-amber-50/20">
                    <svg
                      className="w-6 h-6 text-amber-200"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                  </span>
                  <span className="text-amber-100 font-medium">
                    +91 7310970546
                  </span>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="flex items-center gap-4"
                >
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-amber-50/10 border border-amber-50/20">
                    <svg
                      className="w-6 h-6 text-amber-200"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </span>
                  <span className="text-amber-100 font-medium">
                    Dehradun, Uttarakhand, India
                  </span>
                </motion.div>
              </div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="mt-10"
              >
                <h3 className="text-xl font-semibold text-amber-50 mb-4">
                  Connect
                </h3>
                <div className="flex gap-4">
                  <motion.a
                    whileHover={{ y: -5, scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    href="https://x.com/Shahi_Arvind_"
                    className="transition-colors"
                  >
                    <svg
                      className="w-8 h-8 text-amber-200 hover:text-amber-400"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                    </svg>
                  </motion.a>
                  <motion.a
                    whileHover={{ y: -5, scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    href="https://www.linkedin.com/in/arvindshahi555/"
                    className="transition-colors"
                  >
                    <svg
                      className="w-8 h-8 text-amber-200 hover:text-amber-400"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                  </motion.a>
                  <motion.a
                    whileHover={{ y: -5, scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    href="https://github.com/Zan-pakto"
                    className="transition-colors"
                  >
                    <svg
                      className="w-8 h-8 text-amber-200 hover:text-amber-400"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                  </motion.a>
                  <motion.a
                    whileHover={{ y: -5, scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    href="https://www.instagram.com/arvind_shahi_/"
                    className="transition-colors"
                  >
                    <svg
                      className="w-8 h-8 text-amber-200 hover:text-amber-400"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </motion.a>
                </div>
              </motion.div>
            </motion.div>

            {/* Contact Form Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="group bg-black/40 backdrop-blur-2xl p-10 rounded-3xl border border-amber-50/20 shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-amber-100/20"
            >
              <motion.h2
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-3xl font-extrabold text-amber-50 mb-8 tracking-tight"
              >
                Send a Message
              </motion.h2>
              <form className="space-y-7">
                <div className="grid md:grid-cols-2 gap-6">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="relative"
                  >
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-200">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5.121 17.804A13.937 13.937 0 0112 15c2.485 0 4.797.657 6.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </span>
                    <input
                      type="text"
                      id="name"
                      className="w-full pl-10 pr-4 py-3 bg-black/60 border border-amber-50/30 rounded-lg text-amber-50 focus:outline-none focus:border-amber-50 transition-colors placeholder-amber-200"
                      placeholder="Your name"
                    />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="relative"
                  >
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-200">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M16 12a4 4 0 01-8 0m8 0a4 4 0 00-8 0m8 0V8a4 4 0 00-8 0v4m8 0v4a4 4 0 01-8 0v-4"
                        />
                      </svg>
                    </span>
                    <input
                      type="email"
                      id="email"
                      className="w-full pl-10 pr-4 py-3 bg-black/60 border border-amber-50/30 rounded-lg text-amber-50 focus:outline-none focus:border-amber-50 transition-colors placeholder-amber-200"
                      placeholder="Your email"
                    />
                  </motion.div>
                </div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="relative"
                >
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-200">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8 12h8m-4-4v8"
                      />
                    </svg>
                  </span>
                  <input
                    type="text"
                    id="subject"
                    className="w-full pl-10 pr-4 py-3 bg-black/60 border border-amber-50/30 rounded-lg text-amber-50 focus:outline-none focus:border-amber-50 transition-colors placeholder-amber-200"
                    placeholder="Subject"
                  />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                  className="relative"
                >
                  <span className="absolute left-3 top-6 text-amber-200">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8 12h8m-4-4v8"
                      />
                    </svg>
                  </span>
                  <textarea
                    id="message"
                    rows={5}
                    className="w-full pl-10 pr-4 py-3 bg-black/60 border border-amber-50/30 rounded-lg text-amber-50 focus:outline-none focus:border-amber-50 transition-colors placeholder-amber-200 resize-none"
                    placeholder="Your message"
                  ></textarea>
                </motion.div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="w-full py-4 px-6 bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500 text-black font-bold rounded-xl shadow-lg hover:from-amber-300 hover:to-amber-400 transition-all duration-200"
                >
                  Send Message
                </motion.button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
