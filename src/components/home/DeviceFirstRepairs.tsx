"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ChevronLeft, Search, X } from "lucide-react";

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

const DEFAULT_LIMIT = 6;

// Hebrew → English aliases. The DB stores model names in English ("iPhone 14",
// "Galaxy S22 Ultra"). Without this, a user typing "אייפון" gets nothing.
const ALIASES: ReadonlyArray<readonly [RegExp, string]> = [
  [/אייפון/g, "iphone"],
  [/אייפד/g, "ipad"],
  [/סמסונג/g, "samsung galaxy"],
  [/גלקסי/g, "galaxy"],
  [/פרו\b/g, "pro"],
  [/מקס\b/g, "max"],
  [/מיני\b/g, "mini"],
  [/אולטרה/g, "ultra"],
  [/אולטרא/g, "ultra"],
  [/פלוס/g, "plus"],
  [/אייר\b/g, "air"],
  [/נוט\b/g, "note"],
];

function expandQuery(raw: string): string[] {
  let q = raw.toLowerCase().trim();
  for (const [hebrew, english] of ALIASES) {
    q = q.replace(hebrew, english);
  }
  return q.split(/\s+/).filter(Boolean);
}

function modelMatches(name: string, tokens: string[]): boolean {
  const lower = name.toLowerCase();
  return tokens.every((t) => lower.includes(t));
}

type SearchResult = {
  model: DeviceModel;
  brandSlug: string;
  brandLabel: string;
};

export default function DeviceFirstRepairs({ tabs }: Props) {
  const initial = tabs.find((t) => t.models.length > 0)?.slug ?? tabs[0]?.slug;
  const [active, setActive] = useState<DeviceTab["slug"] | undefined>(initial);
  const [query, setQuery] = useState("");

  const trimmed = query.trim();
  const searching = trimmed.length > 0;

  const searchResults = useMemo<SearchResult[]>(() => {
    if (!searching) return [];
    const tokens = expandQuery(trimmed);
    if (tokens.length === 0) return [];
    return tabs.flatMap((t) =>
      t.models
        .filter((m) => modelMatches(m.name, tokens))
        .map((m) => ({ model: m, brandSlug: t.brandSlug, brandLabel: t.label }))
    );
  }, [searching, trimmed, tabs]);

  const current = tabs.find((t) => t.slug === active);
  if (!current) return null;

  const visibleTabModels = current.models.slice(0, DEFAULT_LIMIT);

  return (
    <section
      className="bg-[#fafafa] py-16 md:py-20 px-4"
      style={{ borderTop: "1px solid rgba(0,0,0,0.04)" }}
    >
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
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

        {/* Search */}
        <div className="relative max-w-md mx-auto mb-7">
          <Search
            size={18}
            className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: "rgba(0,0,0,0.4)" }}
            aria-hidden="true"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="חפש דגם..."
            aria-label="חיפוש מכשיר"
            className="w-full pr-11 pl-11 py-3 rounded-[12px] bg-white text-sm focus:outline-2 focus:outline-[#0071e3] transition-shadow"
            style={{
              border: "1px solid rgba(0,0,0,0.08)",
              boxShadow: "rgba(0,0,0,0.04) 0px 1px 4px 0px",
              letterSpacing: "-0.12px",
              color: "#1d1d1f",
            }}
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="נקה חיפוש"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center hover:bg-black/5 transition-colors"
              style={{ color: "rgba(0,0,0,0.5)" }}
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Tabs - always visible. When searching, they're informational only. */}
        <div
          className="flex justify-center gap-2 mb-10"
          role="tablist"
          aria-label="בחר מכשיר"
        >
          {tabs.map((tab) => {
            const isActive = !searching && tab.slug === active;
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
                onClick={() => {
                  setQuery("");
                  setActive(tab.slug);
                }}
                className="px-6 py-2.5 rounded-[980px] text-sm font-medium transition-all min-h-[44px] disabled:opacity-40 disabled:cursor-not-allowed"
                style={{
                  background: isActive ? "#0071e3" : "white",
                  color: isActive ? "white" : "#1d1d1f",
                  boxShadow: isActive
                    ? "0 4px 14px rgba(0,113,227,0.25)"
                    : "rgba(0,0,0,0.06) 0px 1px 4px 0px",
                  letterSpacing: "-0.224px",
                  opacity: searching ? 0.55 : 1,
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Panel */}
        {searching ? (
          <SearchResultsGrid results={searchResults} query={trimmed} />
        ) : (
          <div
            role="tabpanel"
            id={`device-panel-${current.slug}`}
            aria-labelledby={`device-tab-${current.slug}`}
            key={current.slug}
          >
            {visibleTabModels.length === 0 ? (
              <p
                className="text-center py-12"
                style={{ color: "rgba(0,0,0,0.6)" }}
              >
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
                  {visibleTabModels.map((model) => (
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
                  {visibleTabModels.map((model) => (
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
        )}

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

function SearchResultsGrid({ results, query }: { results: SearchResult[]; query: string }) {
  if (results.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-sm mb-1" style={{ color: "rgba(0,0,0,0.7)" }}>
          לא נמצא דגם בשם <span className="font-semibold">&quot;{query}&quot;</span>
        </p>
        <p className="text-xs" style={{ color: "rgba(0,0,0,0.5)" }}>
          נסה חיפוש אחר או דפדף בלשוניות
        </p>
      </div>
    );
  }

  return (
    <>
      <p className="text-center text-xs mb-5" style={{ color: "rgba(0,0,0,0.55)" }}>
        {results.length} {results.length === 1 ? "דגם" : "דגמים"} תואמים
      </p>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {results.map(({ model, brandSlug, brandLabel }) => (
          <ModelCard
            key={`${brandSlug}-${model.id}`}
            model={model}
            brandSlug={brandSlug}
            brandLabel={brandLabel}
          />
        ))}
      </div>
    </>
  );
}

function ModelCard({
  model,
  brandSlug,
  brandLabel,
  className,
}: {
  model: DeviceModel;
  brandSlug: string;
  brandLabel?: string;
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
            sizes="(max-width: 768px) 50vw, 33vw"
            className="object-cover scale-105"
          />
        ) : (
          <span className="text-5xl font-bold" style={{ color: "rgba(0,0,0,0.15)" }}>
            {model.name.charAt(0)}
          </span>
        )}
        {brandLabel && (
          <span
            className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-semibold backdrop-blur"
            style={{
              background: "rgba(255,255,255,0.85)",
              color: "#1d1d1f",
              letterSpacing: "0.196px",
            }}
          >
            {brandLabel}
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
