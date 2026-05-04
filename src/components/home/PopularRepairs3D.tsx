"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { interpolate } from "@/lib/animation";
import {
  Smartphone,
  Battery,
  Camera,
  SlidersHorizontal,
  Plug,
  Mic,
  Wrench,
  ChevronLeft,
} from "lucide-react";
import Link from "next/link";

// Map repair type names to icons
const ICON_MAP: Record<string, React.ElementType> = {
  "תיקון מסך": Smartphone,
  "החלפת סוללה": Battery,
  "תיקון מצלמה": Camera,
  "כפתורים ועוצמה": SlidersHorizontal,
  "שקע טעינה": Plug,
  "מיקרופון ורמקול": Mic,
};

interface ModelRepairData {
  id: string;
  price: number;
  duration_min: number;
  models: {
    id: string;
    name: string;
    slug: string;
    brands: {
      name: string;
      slug: string;
    };
  };
}

interface RepairTypeData {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon_url: string | null;
  model_repairs: ModelRepairData[];
}

interface PopularRepairs3DProps {
  repairTypes: RepairTypeData[];
}

function Repair3DCard({
  repair,
  index,
  scrollProgress,
  totalCards,
}: {
  repair: RepairTypeData;
  index: number;
  scrollProgress: number;
  totalCards: number;
}) {
  const Icon = ICON_MAP[repair.name] || Wrench;
  const minPrice =
    repair.model_repairs.length > 0
      ? Math.min(...repair.model_repairs.map((mr) => mr.price))
      : null;
  const modelCount = repair.model_repairs.length;

  // 3D transforms based on distance from viewport center.
  // Memoized so desktop (where scrollProgress is fixed at 0.5) computes once
  // per card rather than on every render.
  const { rotateY, scale, translateZ, cardOpacity } = useMemo(() => {
    const cardCenter = (index + 0.5) / totalCards;
    const distance = scrollProgress - cardCenter;
    return {
      rotateY: interpolate(distance, [-0.4, 0, 0.4], [15, 0, -15], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      }),
      scale: interpolate(Math.abs(distance), [0, 0.25, 0.5], [1, 0.96, 0.9], {
        extrapolateRight: "clamp",
      }),
      translateZ: interpolate(Math.abs(distance), [0, 0.25, 0.5], [0, -15, -40], {
        extrapolateRight: "clamp",
      }),
      cardOpacity: interpolate(Math.abs(distance), [0, 0.35, 0.6], [1, 0.9, 0.65], {
        extrapolateRight: "clamp",
      }),
    };
  }, [index, scrollProgress, totalCards]);

  return (
    <Link
      href={`/repairs/services/${repair.slug}`}
      className="flex-shrink-0 w-[180px] md:w-auto group block rounded-2xl p-5 text-center cursor-pointer"
      style={{
        background: "rgba(255,255,255,0.04)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        border: "1px solid rgba(255,255,255,0.07)",
        transform: `perspective(800px) rotateY(${rotateY}deg) scale(${scale}) translateZ(${translateZ}px)`,
        opacity: cardOpacity,
        transition: "transform 0.15s ease-out, opacity 0.15s ease-out, background 0.2s ease",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.08)";
        (e.currentTarget as HTMLElement).style.borderColor = "rgba(41,151,255,0.2)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)";
        (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.07)";
      }}
    >
      {/* Icon */}
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-transform duration-200 group-hover:scale-110"
        style={{
          background: "linear-gradient(135deg, rgba(0,113,227,0.2) 0%, rgba(41,151,255,0.1) 100%)",
          boxShadow: "0 4px 16px rgba(0,113,227,0.15)",
        }}
      >
        <Icon size={24} style={{ color: "#2997ff" }} />
      </div>

      {/* Name */}
      <p
        className="font-semibold text-white text-[15px] mb-1"
        style={{ letterSpacing: "-0.12px" }}
      >
        {repair.name}
      </p>

      {/* Model count */}
      <p className="text-[11px] mb-3" style={{ color: "rgba(255,255,255,0.35)" }}>
        {modelCount} דגמים זמינים
      </p>

      {/* Price */}
      {minPrice !== null && (
        <div
          className="inline-flex items-center gap-1 px-3 py-1 rounded-full"
          style={{ background: "rgba(0,113,227,0.12)" }}
        >
          <span className="text-[13px] font-bold" style={{ color: "#2997ff" }}>
            החל מ-₪{minPrice}
          </span>
        </div>
      )}

      {/* Hover hint */}
      <p
        className="text-[10px] mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        style={{ color: "rgba(255,255,255,0.4)" }}
      >
        הצג מחירים לכל הדגמים
      </p>
    </Link>
  );
}

export default function PopularRepairs3D({ repairTypes }: PopularRepairs3DProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0.5);
  const [hasEnteredView, setHasEnteredView] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Intersection observer for entrance animation
  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      setHasEnteredView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasEnteredView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12 }
    );

    const el = sectionRef.current;
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Track horizontal scroll for 3D effect (mobile)
  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    if (maxScroll <= 0) {
      setScrollProgress(0.5);
      return;
    }
    setScrollProgress(el.scrollLeft / maxScroll);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => el.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <section className="bg-[#1d1d1f] py-20 px-4 overflow-hidden" ref={sectionRef}>
      <div className="max-w-5xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-12">
          <p
            className="text-[11px] font-semibold tracking-widest uppercase mb-3"
            style={{ color: "#2997ff" }}
          >
            שירותים
          </p>
          <h2
            className="font-bold text-white mb-3"
            style={{
              fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
              lineHeight: 1.08,
              letterSpacing: "-0.28px",
            }}
          >
            התיקונים הנפוצים ביותר
          </h2>
          <p
            className="text-sm mx-auto"
            style={{
              color: "rgba(255,255,255,0.45)",
              letterSpacing: "-0.224px",
              maxWidth: "32ch",
            }}
          >
            מחירים קבועים · ללא הפתעות · תשלום רק בסיום
          </p>
        </div>

        {/* Mobile: horizontal scroll with 3D */}
        <div
          ref={scrollRef}
          className="flex md:hidden gap-3 overflow-x-auto pb-4 px-2 snap-x snap-mandatory scrollbar-hide"
          style={{
            WebkitOverflowScrolling: "touch",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {repairTypes.map((repair, i) => (
            <div
              key={repair.id}
              className="snap-center"
              style={{
                opacity: hasEnteredView ? 1 : 0,
                transform: hasEnteredView ? "translateY(0)" : "translateY(24px)",
                transition: `opacity 0.5s cubic-bezier(0.32, 0.72, 0, 1) ${i * 70}ms, transform 0.5s cubic-bezier(0.32, 0.72, 0, 1) ${i * 70}ms`,
              }}
            >
              <Repair3DCard
                repair={repair}
                index={i}
                scrollProgress={scrollProgress}
                totalCards={repairTypes.length}
              />
            </div>
          ))}
        </div>

        {/* Desktop: grid with staggered 3D entrance */}
        <div className="hidden md:grid grid-cols-3 gap-4">
          {repairTypes.map((repair, i) => (
            <div
              key={repair.id}
              style={{
                opacity: hasEnteredView ? 1 : 0,
                transform: hasEnteredView
                  ? "perspective(800px) rotateX(0deg) translateY(0)"
                  : "perspective(800px) rotateX(12deg) translateY(36px)",
                transition: `opacity 0.6s cubic-bezier(0.32, 0.72, 0, 1) ${i * 80}ms, transform 0.6s cubic-bezier(0.32, 0.72, 0, 1) ${i * 80}ms`,
              }}
            >
              <Repair3DCard
                repair={repair}
                index={i}
                scrollProgress={0.5}
                totalCards={repairTypes.length}
              />
            </div>
          ))}
        </div>

        {/* CTA link */}
        <div className="text-center mt-10">
          <Link
            href="/repairs"
            className="inline-flex items-center gap-1.5 px-8 py-3 rounded-[980px] text-sm font-medium text-white border transition-colors"
            style={{
              borderColor: "rgba(255,255,255,0.2)",
              letterSpacing: "-0.224px",
              minHeight: 44,
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.08)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "transparent";
            }}
          >
            כל התיקונים והמחירים
            <ChevronLeft size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
