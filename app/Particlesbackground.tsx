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
            value: isMobile ? 20 : 40,
            density: { enable: true, area: 1500 },
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
              enable: false,
            },
            onDiv: {
              enable: false,
            },
            onClick: {
              enable: false,
            },
          },
        },
        fpsLimit: 30,
        pauseOnBlur: true,
        pauseOnOutsideViewport: true,
        detectRetina: false,
      }}
      className="absolute inset-0 -z-10"
    />
  );
};

export default Particlesbackground;
