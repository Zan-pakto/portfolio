"use client";

import { useCallback } from "react";
import Particles from "react-tsparticles";
import { Engine } from "tsparticles-engine";
import { loadSlim } from "tsparticles-slim";

const Particlesbackground = () => {
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
            value: 100,
            density: { enable: true, area: 800 },
          },
          shape: { type: "circle" },
          color: { value: ["#ff5500", "#ffffff", "#ff9900"] },
          opacity: {
            value: { min: 0.1, max: 0.8 },
            animation: {
              enable: true,
              speed: 0.5,
              minimumValue: 0.1,
              sync: false,
            },
          },
          size: {
            value: { min: 1, max: 5 },
            animation: {
              enable: true,
              speed: 3,
              minimumValue: 1,
              sync: false,
            },
          },
          move: {
            enable: true,
            speed: { min: 1, max: 3 },
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
            onhover: { enable: true, mode: "grab" },
          },
          modes: {
            grab: {
              distance: 140,
              links: { opacity: 1 }, // Increase this value for higher opacity (max is 1)
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
