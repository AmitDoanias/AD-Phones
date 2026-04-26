"use client";

import { useEffect, useRef, useState } from "react";
import { SERVICE_STEPS } from "@/constants/serviceProcess";

export default function ServiceProcess() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<(HTMLLIElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [progress, setProgress] = useState(0);

  // Track which step is currently in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = stepRefs.current.findIndex((el) => el === entry.target);
            if (idx !== -1) {
              setActiveIndex((prev) => Math.max(prev, idx));
            }
          }
        });
      },
      {
        threshold: 0.45,
        rootMargin: "0px 0px -25% 0px",
      }
    );

    stepRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Track scroll progress for the vertical line fill
  useEffect(() => {
    const handleScroll = () => {
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const scrolled = viewportHeight * 0.55 - rect.top;
      const ratio = scrolled / rect.height;
      const clamped = Math.max(0, Math.min(1, ratio));
      setProgress(clamped * 100);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative">
      {/* Background line */}
      <div
        className="absolute top-0 bottom-0 w-[2px] bg-black/10"
        style={{ right: "23px" }}
        aria-hidden
      />
      {/* Progress line */}
      <div
        className="absolute top-0 w-[2px]"
        style={{
          right: "23px",
          height: `${progress}%`,
          background: "#0071e3",
          transition: "height 0.5s cubic-bezier(0.22, 1, 0.36, 1)",
        }}
        aria-hidden
      />

      <ol className="space-y-10 md:space-y-14 list-none p-0 m-0">
        {SERVICE_STEPS.map((step, i) => {
          const isActive = i <= activeIndex;
          return (
            <li
              key={i}
              ref={(el) => {
                stepRefs.current[i] = el;
              }}
              className="relative grid grid-cols-[48px_1fr] gap-5 md:gap-6 items-start"
            >
              {/* Number circle */}
              <div
                className="relative z-10 w-12 h-12 rounded-full flex items-center justify-center font-bold tabular-nums"
                style={{
                  fontSize: "0.95rem",
                  letterSpacing: "0.5px",
                  background: isActive ? "#0071e3" : "#ffffff",
                  color: isActive ? "#ffffff" : "rgba(0,0,0,0.4)",
                  border: isActive
                    ? "2px solid #0071e3"
                    : "2px solid rgba(0,0,0,0.1)",
                  transform: isActive ? "scale(1)" : "scale(0.92)",
                  boxShadow: isActive
                    ? "0 6px 20px rgba(0,113,227,0.28)"
                    : "0 1px 3px rgba(0,0,0,0.04)",
                  transition:
                    "background 0.4s ease, color 0.4s ease, border-color 0.4s ease, transform 0.4s ease, box-shadow 0.4s ease",
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </div>

              {/* Card content */}
              <div
                className="bg-white rounded-[16px] p-6 md:p-7"
                style={{
                  boxShadow: isActive
                    ? "rgba(0,0,0,0.08) 0px 8px 24px 0px"
                    : "rgba(0,0,0,0.04) 0px 2px 8px 0px",
                  opacity: isActive ? 1 : 0.55,
                  transition:
                    "box-shadow 0.4s ease, opacity 0.4s ease",
                }}
              >
                <h3
                  className="font-bold mb-2"
                  style={{
                    fontSize: "clamp(1.15rem, 2.5vw, 1.5rem)",
                    color: "#1d1d1f",
                    letterSpacing: "-0.28px",
                    lineHeight: 1.2,
                  }}
                >
                  {step.title}
                </h3>
                <p
                  style={{
                    color: "rgba(0,0,0,0.6)",
                    letterSpacing: "-0.224px",
                    lineHeight: 1.55,
                    fontSize: "0.95rem",
                  }}
                >
                  {step.description}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

