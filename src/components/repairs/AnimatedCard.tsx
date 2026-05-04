"use client";

import { useEffect, useRef, useState } from "react";
import { spring, interpolate } from "@/lib/animation";

interface AnimatedCardProps {
  children: React.ReactNode;
  delay?: number; // ms to wait after entering viewport
  className?: string;
}

export default function AnimatedCard({
  children,
  delay = 0,
  className,
}: AnimatedCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [frame, setFrame] = useState(-1);
  const rafRef = useRef<number>(0);
  const startRef = useRef<number | undefined>(undefined);
  const triggeredRef = useRef(false);

  useEffect(() => {
    // Respect prefers-reduced-motion
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) {
      setFrame(60); // jump to end state
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !triggeredRef.current) {
          triggeredRef.current = true;
          setTimeout(() => {
            startRef.current = undefined;

            const animate = (timestamp: number) => {
              if (startRef.current === undefined) {
                startRef.current = timestamp;
              }
              const elapsed = timestamp - startRef.current;
              const currentFrame = Math.floor(elapsed / (1000 / 60));
              setFrame(currentFrame);
              if (currentFrame < 60) {
                rafRef.current = requestAnimationFrame(animate);
              }
            };
            rafRef.current = requestAnimationFrame(animate);
          }, delay);
        }
      },
      { threshold: 0.08 }
    );

    const el = ref.current;
    if (el) observer.observe(el);

    return () => {
      observer.disconnect();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [delay]);

  const s =
    frame >= 0
      ? spring({
          frame,
          fps: 60,
          config: { damping: 100, mass: 0.8, stiffness: 200 },
        })
      : 0;

  const opacity = interpolate(s, [0, 1], [0, 1]);
  const translateY = interpolate(s, [0, 1], [24, 0]);

  return (
    <div
      ref={ref}
      style={{
        opacity,
        transform: `translateY(${translateY}px)`,
        willChange: frame >= 0 && frame < 60 ? "transform, opacity" : "auto",
      }}
      className={className}
    >
      {children}
    </div>
  );
}
