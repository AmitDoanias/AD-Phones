"use client";

import { useState, useEffect } from "react";
import { Smartphone, Battery, Camera, Wrench } from "lucide-react";

const SLIDES = [
  {
    label: "תיקון מסך",
    sub: "אייפון · סמסונג · אייפד",
    Icon: Smartphone,
    bg: "#1a2540",
    accent: "#2997ff",
  },
  {
    label: "החלפת סוללה",
    sub: "שחזור קיבולת מלאה",
    Icon: Battery,
    bg: "#0f2a1a",
    accent: "#34c759",
  },
  {
    label: "תיקון מצלמה",
    sub: "קדמית ואחורית",
    Icon: Camera,
    bg: "#251a35",
    accent: "#bf5af2",
  },
  {
    label: "שירות כללי",
    sub: "כל תקלה · כל דגם",
    Icon: Wrench,
    bg: "#2a1e0e",
    accent: "#ff9f0a",
  },
];

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full max-w-sm mx-auto md:mx-0 md:max-w-none md:w-96 lg:w-[460px] flex-shrink-0">
      {/* Card stack */}
      <div
        className="relative rounded-[16px] overflow-hidden"
        style={{ aspectRatio: "1 / 1" }}
      >
        {SLIDES.map((slide, i) => (
          <div
            key={i}
            className="absolute inset-0 flex flex-col items-center justify-center p-8 transition-opacity duration-700"
            style={{
              background: slide.bg,
              opacity: i === current ? 1 : 0,
              pointerEvents: i === current ? "auto" : "none",
            }}
            aria-hidden={i !== current}
          >
            {/* Icon */}
            <div
              className="w-24 h-24 rounded-[20px] flex items-center justify-center mb-6"
              style={{ background: `${slide.accent}22` }}
            >
              <slide.Icon size={48} style={{ color: slide.accent }} />
            </div>

            <p
              className="text-2xl font-bold text-white mb-1 text-center"
              style={{ letterSpacing: "-0.28px", lineHeight: 1.1 }}
            >
              {slide.label}
            </p>
            <p
              className="text-sm text-center"
              style={{ color: "rgba(255,255,255,0.5)" }}
            >
              {slide.sub}
            </p>
          </div>
        ))}

        {/* Dot indicators */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === current ? 20 : 7,
                height: 7,
                background: i === current ? "white" : "rgba(255,255,255,0.3)",
              }}
              aria-label={`שקופית ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
