"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const SLIDES = [
  { src: "/iPhone_Hero_1.webp", alt: "תיקון אייפון - A&D Phones" },
  { src: "/iPad_Hero.webp",    alt: "תיקון אייפד - A&D Phones" },
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
    <div className="relative w-full max-w-sm mx-auto md:mx-0 md:max-w-none md:w-[420px] lg:w-[520px] flex-shrink-0">
      <div
        className="relative rounded-[16px] overflow-hidden bg-slate-100"
        style={{ aspectRatio: "1 / 1" }}
      >
        {SLIDES.map((slide, i) => (
          <div
            key={slide.src}
            className="absolute inset-0 transition-opacity duration-700"
            style={{
              opacity: i === current ? 1 : 0,
              pointerEvents: i === current ? "auto" : "none",
            }}
            aria-hidden={i !== current}
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              sizes="(min-width: 1024px) 520px, (min-width: 768px) 420px, 100vw"
              className="object-cover"
              priority={i === 0}
            />
          </div>
        ))}

        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === current ? 20 : 7,
                height: 7,
                background: i === current ? "white" : "rgba(255,255,255,0.5)",
              }}
              aria-label={`שקופית ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
