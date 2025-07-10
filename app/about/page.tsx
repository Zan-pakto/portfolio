"use client";
import { useEffect, useState, useRef } from "react";
import Navbar from "../components/Navbar";
import Particlesbackground from "../Particlesbackground";
import Image from "next/image";

export default function About() {
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

  // Show text and image on mount
  useEffect(() => {
    setShowText(true);
    const timer = setTimeout(() => setShowImage(true), 200);
    return () => clearTimeout(timer);
  }, []);

  // Intersection Observer for "the resume"
  useEffect(() => {
    const observer = new window.IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setShowResume(true);
      },
      { threshold: 0.2 }
    );
    if (resumeRef.current) observer.observe(resumeRef.current);
    return () => observer.disconnect();
  }, []);

  // Intersection Observer for resume text
  useEffect(() => {
    const observer = new window.IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setresmetext(true);
      },
      { threshold: 0.2 }
    );
    if (resmetextRef.current) observer.observe(resmetextRef.current);
    return () => observer.disconnect();
  }, []);

  // Intersection Observer for laptop image
  useEffect(() => {
    const observer = new window.IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setShowLaptop(true);
      },
      { threshold: 0.2 }
    );
    if (laptopRef.current) observer.observe(laptopRef.current);
    return () => observer.disconnect();
  }, []);

  // Intersection Observer for bottom texts
  useEffect(() => {
    const observer = new window.IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setShowBottomTexts(true);
      },
      { threshold: 0.2 }
    );
    if (bottomTextsRef.current) observer.observe(bottomTextsRef.current);
    return () => observer.disconnect();
  }, []);

  // Intersection Observer for skills section
  useEffect(() => {
    const observer = new window.IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setShowSkills(true);
      },
      { threshold: 0.2 }
    );
    if (skillsRef.current) observer.observe(skillsRef.current);
    return () => observer.disconnect();
  }, []);

  // Intersection Observer for work experience section
  useEffect(() => {
    const observer = new window.IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setShowWork(true);
      },
      { threshold: 0.2 }
    );
    if (workRef.current) observer.observe(workRef.current);
    return () => observer.disconnect();
  }, []);

  // Intersection Observer for licenses & certifications section
  useEffect(() => {
    const observer = new window.IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setShowCert(true);
      },
      { threshold: 0.2 }
    );
    if (certRef.current) observer.observe(certRef.current);
    return () => observer.disconnect();
  }, []);

  // Intersection Observer for image grid
  useEffect(() => {
    const observer = new window.IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setShowGridImages(true);
      },
      { threshold: 0.2 }
    );
    if (gridRef.current) observer.observe(gridRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div>
      <div className="relative w-full h-full ">
        <Particlesbackground />
        <Navbar />
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
        {/* Spacer to allow scrolling */}
        <div className="" />
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
            {/* Animated border under the grid */}
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
            {/* Animated border under the grid */}
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
              {/* <div>
                <div className="text-sm text-amber-200 mt-1">5SEZYXMKQA</div>
              </div> */}
              {/* <div>
                <div>
                  <span className="text-amber-300">2018</span>
                  <span className="mx-2">-</span>
                  <span>Open Water Diver</span>
                  <span className="mx-2">-</span>
                  <span>PADI</span>
                </div>
              </div> */}
            </div>
            {/* Animated border under the grid */}
            <div
              className="absolute left-0 -bottom-2 h-1 bg-amber-50 rounded transition-all duration-700"
              style={{
                width: showWork ? "100%" : "0%",
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
      </div>
    </div>
  );
}
