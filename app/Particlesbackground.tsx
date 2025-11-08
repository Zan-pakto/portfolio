"use client";

import { useCallback, useEffect, useState, useRef } from "react";
import Particles from "react-tsparticles";
import { Engine, Container } from "tsparticles-engine";
import { loadSlim } from "tsparticles-slim";

const Particlesbackground = () => {
  const [isMobile, setIsMobile] = useState(false);
  const particlesRef = useRef<Container | null>(null);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  useEffect(() => {
    if (isMobile || !particlesRef.current) return;

    let ticking = false;
    const handleMouseMove = (e: MouseEvent) => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const container = particlesRef.current;
          if (container) {
            const interactivity = container.interactivity;
            if (interactivity && interactivity.mouse) {
              interactivity.mouse.position = {
                x: e.clientX,
                y: e.clientY,
              };
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isMobile]);

  const particlesLoaded = useCallback(async (container?: Container) => {
    if (container) {
      particlesRef.current = container;
    }
  }, []);

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      loaded={particlesLoaded}
      options={{
        fullScreen: { enable: false },
        background: { color: "#000000" },
        particles: {
          number: {
            value: isMobile ? 30 : 60,
            density: { enable: true, area: 1200 },
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
            value: { min: 2, max: 3 },
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
            speed: { min: 0.5, max: 2 },
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
              distance: 150,
              links: { 
                opacity: 0.8,
                blink: false,
                color: "#ffffff",
                width: 1,
              },
            },
          },
        },
        fpsLimit: 60,
        detectRetina: false,
      }}
      className="absolute inset-0 -z-10"
    />
  );
};

export default Particlesbackground;
