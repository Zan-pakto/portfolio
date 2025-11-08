"use client";

import { useCallback, useEffect, useState, useRef } from "react";
import Particles from "react-tsparticles";
import { Engine } from "tsparticles-engine";
import { loadSlim } from "tsparticles-slim";

const Particlesbackground = () => {
  const [isMobile, setIsMobile] = useState(false);
  const particlesRef = useRef<any>(null);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  useEffect(() => {
    if (isMobile || !particlesRef.current) return;

    const handleMouseMove = (e: MouseEvent) => {
      const container = particlesRef.current?.container;
      if (container) {
        const interactivity = container.interactivity;
        if (interactivity) {
          interactivity.mouse.position = {
            x: e.clientX,
            y: e.clientY,
          };
        }
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isMobile]);

  return (
    <Particles
      ref={particlesRef}
      id="tsparticles"
      init={particlesInit}
      options={{
        fullScreen: { enable: false },
        background: { color: "#000000" },
        particles: {
          number: {
            value: isMobile ? 80 : 150,
            density: { enable: true, area: 800 },
          },
          shape: { 
            type: "circle",
          },
          color: { value: ["#ff5500", "#ffffff", "#ff9900"] },
          opacity: {
            value: { min: 0.5, max: 1 },
            animation: {
              enable: false,
            },
          },
          size: {
            value: { min: 2, max: 4 },
            animation: {
              enable: false,
            },
          },
          rotate: {
            value: 0,
            animation: {
              enable: false,
            },
          },
          move: {
            enable: true,
            speed: { min: 1, max: 3 },
            direction: "bottom",
            straight: false,
            random: false,
            outModes: {
              default: "out",
              bottom: "out",
            },
            path: {
              enable: false,
            },
          },
          links: {
            enable: false,
          },
        },
        interactivity: {
          detectsOn: "window",
          events: {
            onHover: { 
              enable: !isMobile,
              mode: "grab",
            },
            onDiv: {
              enable: false,
            },
            onClick: {
              enable: false,
            },
          },
          modes: {
            grab: {
              distance: 250,
              links: { 
                opacity: 1,
                blink: false,
                color: "#ffffff",
                width: 2,
              },
            },
          },
        },
        detectRetina: true,
      }}
      className="absolute inset-0 -z-10"
    />
  );
};

export default Particlesbackground;
