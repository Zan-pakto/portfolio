"use client";

import { useState, useEffect, useRef } from "react";

export default function SmoothFollower() {
  const mousePosition = useRef({ x: 0, y: 0 });
  const dotPosition = useRef({ x: 0, y: 0 });
  const borderDotPosition = useRef({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);

  const [renderPos, setRenderPos] = useState({
    dot: { x: 0, y: 0 },
    border: { x: 0, y: 0 },
  });
  const [isHovering, setIsHovering] = useState(false);

  const DOT_SMOOTHNESS = 0.2;
  const BORDER_DOT_SMOOTHNESS = 0.1;

  useEffect(() => {
    // Check if device is mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkMobile();
    
    // Add resize listener
    window.addEventListener('resize', checkMobile);

    const handleMouseMove = (e: MouseEvent) => {
      mousePosition.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseEnter = () => setIsHovering(true);
    const handleMouseLeave = () => setIsHovering(false);

    // Only add mouse event listeners if not mobile
    if (!isMobile) {
      window.addEventListener("mousemove", handleMouseMove);

      const interactiveElements = document.querySelectorAll(
        "a, button, img, input, textarea, select"
      );
      interactiveElements.forEach((element) => {
        element.addEventListener("mouseenter", handleMouseEnter);
        element.addEventListener("mouseleave", handleMouseLeave);
      });

      // Animation function for smooth movement
      const animate = () => {
        const lerp = (start: number, end: number, factor: number) => {
          return start + (end - start) * factor;
        };

        dotPosition.current.x = lerp(
          dotPosition.current.x,
          mousePosition.current.x,
          DOT_SMOOTHNESS
        );
        dotPosition.current.y = lerp(
          dotPosition.current.y,
          mousePosition.current.y,
          DOT_SMOOTHNESS
        );

        borderDotPosition.current.x = lerp(
          borderDotPosition.current.x,
          mousePosition.current.x,
          BORDER_DOT_SMOOTHNESS
        );
        borderDotPosition.current.y = lerp(
          borderDotPosition.current.y,
          mousePosition.current.y,
          BORDER_DOT_SMOOTHNESS
        );

        setRenderPos({
          dot: { x: dotPosition.current.x, y: dotPosition.current.y },
          border: {
            x: borderDotPosition.current.x,
            y: borderDotPosition.current.y,
          },
        });

        requestAnimationFrame(animate);
      };

      // Start animation loop
      const animationId = requestAnimationFrame(animate);

      // Clean up
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener('resize', checkMobile);

        interactiveElements.forEach((element) => {
          element.removeEventListener("mouseenter", handleMouseEnter);
          element.removeEventListener("mouseleave", handleMouseLeave);
        });

        cancelAnimationFrame(animationId);
      };
    }

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, [isMobile]);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || isMobile) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50">
      <div
        className="absolute rounded-full dark:bg-white bg-black "
        style={{
          width: "8px",
          height: "8px",
          transform: "translate(-50%, -50%)",
          left: `${renderPos.dot.x}px`,
          top: `${renderPos.dot.y}px`,
        }}
      />

      <div
        className="absolute rounded-full border dark:border-white border-black "
        style={{
          width: isHovering ? "44px" : "28px",
          height: isHovering ? "44px" : "28px",
          transform: "translate(-50%, -50%)",
          left: `${renderPos.border.x}px`,
          top: `${renderPos.border.y}px`,
          transition: "width 0.3s, height 0.3s",
        }}
      />
    </div>
  );
}
