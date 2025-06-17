"use client";

import { useCallback, useEffect, useState } from "react";
import Particles from "react-tsparticles";
import { Engine } from "tsparticles-engine";
import { loadSlim } from "tsparticles-slim";

const Particlesbackground = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={{
        fullScreen: { enable: false },
        background: { color: "#000000" },
        particles: {
          number: {
            value: isMobile ? 50 : 100,
            density: { enable: true, area: 800 },
          },
          shape: { type: "circle" },
          color: { value: ["#ff5500", "#ffffff", "#ff9900"] },
          opacity: {
            value: { min: 0.1, max: 0.8 },
            animation: {
              enable: true,
              speed: isMobile ? 0.3 : 0.5,
              minimumValue: 0.1,
              sync: false,
            },
          },
          size: {
            value: { min: 1, max: 5 },
            animation: {
              enable: true,
              speed: isMobile ? 2 : 3,
              minimumValue: 1,
              sync: false,
            },
          },
          move: {
            enable: true,
            speed: { min: 0.5, max: 2 },
            direction: "bottom",
            straight: false,
            random: true,
            outModes: {
              default: "out",
            },
          },
        },
        interactivity: {
          events: {
            onhover: { enable: !isMobile },
          },
          modes: {
            grab: {
              distance: 140,
              links: { opacity: 1 },
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
