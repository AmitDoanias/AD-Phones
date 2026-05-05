"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ChevronLeft } from "lucide-react";

export type DeviceModel = {
  id: string;
  name: string;
  slug: string;
  image_url: string | null;
  alt_text: string | null;
  minPrice: number | null;
};

export type DeviceTab = {
  slug: "iphone" | "ipad" | "samsung";
  label: string;
  brandSlug: string;
  models: DeviceModel[];
};

type Props = {
  tabs: DeviceTab[];
};

export default function DeviceFirstRepairs({ tabs }: Props) {
  const initial = tabs.find((t) => t.models.length > 0)?.slug ?? tabs[0]?.slug;
  const [active, setActive] = useState<DeviceTab["slug"] | undefined>(initial);
  const current = tabs.find((t) => t.slug === active);

  if (!current) return null;

  return (
    <section className="bg-[#fafafa] py-16 md:py-20 px-4" style={{ borderTop: "1px solid rgba(0,0,0,0.04)" }}>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <p
            className="text-[11px] font-semibold tracking-widest uppercase mb-3"
            style={{ color: "#0071e3" }}
          >
            תיקון לדגם שלך
          </p>
          <h2
            className="font-bold mb-3"
            style={{
              fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
              lineHeight: 1.08,
              letterSpacing: "-0.28px",
              color: "#1d1d1f",
            }}
          >
            מצא את המכשיר שלך
          </h2>
          <p
            className="text-sm md:text-base mx-auto"
            style={{ color: "rgba(0,0,0,0.6)", letterSpacing: "-0.224px", maxWidth: "44ch" }}
          >
            נתחיל מהדגם — נציג מחיר, זמן עבודה ואחריות לכל תיקון
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-2 mb-10" role="tablist" aria-label="בחר מכשיר">
          {tabs.map((tab) => {
            const isActive = tab.slug === active;
            const disabled = tab.models.length === 0;
            return (
              <button
                key={tab.slug}
                type="button"
                role="tab"
                id={`device-tab-${tab.slug}`}
                aria-selected={isActive}
                aria-controls={`device-panel-${tab.slug}`}
                disabled={disabled}
                onClick={() => setActive(tab.slug)}
                className="px-6 py-2.5 rounded-[980px] text-sm font-medium transition-all min-h-[44px] disabled:opacity-40 disabled:cursor-not-allowed"
                style={{
                  background: isActive ? "#0071e3" : "white",
                  color: isActive ? "white" : "#1d1d1f",
                  boxShadow: isActive
                    ? "0 4px 14px rgba(0,113,227,0.25)"
                    : "rgba(0,0,0,0.06) 0px 1px 4px 0px",
                  letterSpacing: "-0.224px",
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Panel */}
        <div
          role="tabpanel"
          id={`device-panel-${current.slug}`}
          aria-labelledby={`device-tab-${current.slug}`}
          key={current.slug}
        >
          {current.models.length === 0 ? (
            <p className="text-center py-12" style={{ color: "rgba(0,0,0,0.6)" }}>
              אין דגמים זמינים כרגע
            </p>
          ) : (
            <>
              {/* Mobile: horizontal scroll */}
              <div
                className="flex md:hidden gap-3 overflow-x-auto pb-4 -mx-4 px-4 snap-x snap-mandatory scrollbar-hide"
                style={{
                  WebkitOverflowScrolling: "touch",
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                }}
              >
                {current.models.map((model) => (
                  <ModelCard
                    key={model.id}
                    model={model}
                    brandSlug={current.brandSlug}
                    className="snap-center flex-shrink-0 w-[160px]"
                  />
                ))}
              </div>

              {/* Desktop: 3-column grid */}
              <div className="hidden md:grid grid-cols-3 gap-5">
                {current.models.map((model) => (
                  <ModelCard
                    key={model.id}
                    model={model}
                    brandSlug={current.brandSlug}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* CTA */}
        <div className="text-center mt-10">
          <Link
            href="/repairs"
            className="inline-flex items-center gap-1.5 px-7 py-3 rounded-[980px] text-sm font-medium transition-colors hover:bg-black/5"
            style={{
              minHeight: 44,
              color: "#1d1d1f",
              border: "1px solid rgba(0,0,0,0.18)",
              letterSpacing: "-0.224px",
            }}
          >
            כל הדגמים והמחירים
            <ChevronLeft size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}

function ModelCard({
  model,
  brandSlug,
  className,
}: {
  model: DeviceModel;
  brandSlug: string;
  className?: string;
}) {
  return (
    <Link
      href={`/repairs/${brandSlug}/${model.slug}`}
      className={`group block bg-white rounded-[16px] overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[rgba(0,0,0,0.12)_0px_8px_24px_0px] focus-visible:outline-2 focus-visible:outline-[#0071e3] ${className ?? ""}`}
      style={{ boxShadow: "rgba(0,0,0,0.06) 0px 2px 8px 0px" }}
    >
      <div className="aspect-square relative flex items-center justify-center bg-white overflow-hidden">
        {model.image_url ? (
          <Image
            src={model.image_url}
            alt={model.alt_text ?? model.name}
            fill
            sizes="(max-width: 768px) 160px, 33vw"
            className="object-cover scale-105"
          />
        ) : (
          <span className="text-5xl font-bold" style={{ color: "rgba(0,0,0,0.15)" }}>
            {model.name.charAt(0)}
          </span>
        )}
      </div>
      <div className="px-4 py-4 text-center">
        <p
          className="text-[15px] font-semibold mb-1.5 leading-tight"
          style={{ color: "#1d1d1f", letterSpacing: "0.196px" }}
        >
          {model.name}
        </p>
        {model.minPrice !== null ? (
          <p className="text-[13px] font-medium" style={{ color: "#0071e3" }}>
            תיקון מ-₪{model.minPrice}
          </p>
        ) : (
          <p className="text-[12px]" style={{ color: "rgba(0,0,0,0.5)" }}>
            צור קשר למחיר
          </p>
        )}
      </div>
    </Link>
  );
}
