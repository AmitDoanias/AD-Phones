"use client";

import { useEffect, useRef, useState } from "react";

interface AnimatedCardProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

// CSS-driven entrance animation. Replaces a previous JS+RAF spring loop
// that re-rendered ~60 times per card; with 22+ instances on the homepage
// that was the main desktop TBT contributor. Visual result is the same.
export default function AnimatedCard({
  children,
  delay = 0,
  className,
}: AnimatedCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) {
      setVisible(true);
      return;
    }

    let timeoutId: number | undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          observer.disconnect();
          timeoutId = window.setTimeout(() => setVisible(true), delay);
        }
      },
      { threshold: 0.08 }
    );

    const el = ref.current;
    if (el) observer.observe(el);

    return () => {
      observer.disconnect();
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
    };
  }, [delay]);

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition:
          "opacity 600ms cubic-bezier(0.32, 0.72, 0, 1), transform 600ms cubic-bezier(0.32, 0.72, 0, 1)",
      }}
      className={className}
    >
      {children}
    </div>
  );
}
