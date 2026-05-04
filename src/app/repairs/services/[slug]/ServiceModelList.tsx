"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, Clock, ChevronLeft } from "lucide-react";
import { getRepairVisual } from "@/lib/repairIcons";

export type Entry = {
  modelRepairId: string;
  price: number;
  duration_min: number | null;
  brandName: string;
  brandSlug: string;
  brandSortOrder: number;
  modelName: string;
  modelSlug: string;
  modelSortOrder: number;
};

interface Props {
  entries: Entry[];
  repairName: string;
  repairSlug: string;
}

export default function ServiceModelList({ entries, repairName, repairSlug }: Props) {
  const [search, setSearch] = useState("");
  const { Icon, accent, bg } = getRepairVisual(repairName);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return entries;
    return entries.filter((e) => e.modelName.toLowerCase().includes(q));
  }, [entries, search]);

  const grouped = useMemo(() => {
    const byBrand = new Map<string, { brandName: string; brandSortOrder: number; items: Entry[] }>();
    for (const e of filtered) {
      const key = e.brandSlug;
      const existing = byBrand.get(key);
      if (existing) {
        existing.items.push(e);
      } else {
        byBrand.set(key, {
          brandName: e.brandName,
          brandSortOrder: e.brandSortOrder,
          items: [e],
        });
      }
    }
    const groups = Array.from(byBrand.entries()).map(([brandSlug, g]) => ({
      brandSlug,
      brandName: g.brandName,
      brandSortOrder: g.brandSortOrder,
      items: g.items.slice().sort((a, b) => a.modelSortOrder - b.modelSortOrder),
    }));
    groups.sort((a, b) => a.brandSortOrder - b.brandSortOrder);
    return groups;
  }, [filtered]);

  return (
    <div className="flex flex-col gap-6">
      {/* Search - centered, compact */}
      <div
        className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white w-full max-w-[360px] mx-auto"
        style={{ boxShadow: "rgba(0,0,0,0.05) 0px 1px 6px 0px" }}
      >
        <Search size={13} style={{ color: "rgba(0,0,0,0.4)" }} />
        <input
          type="text"
          placeholder="חיפוש דגם..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-transparent text-[12px] outline-none placeholder:text-[12px]"
          style={{ letterSpacing: "-0.1px", color: "#1d1d1f" }}
        />
        <span className="text-[10px]" style={{ color: "rgba(0,0,0,0.35)" }}>
          {filtered.length} דגמים
        </span>
      </div>

      {filtered.length === 0 ? (
        <div
          className="bg-white rounded-[16px] p-10 text-center"
          style={{ boxShadow: "rgba(0,0,0,0.06) 0px 2px 10px 0px" }}
        >
          <p style={{ color: "rgba(0,0,0,0.48)" }}>
            לא נמצאו דגמים עבור חיפוש זה
          </p>
        </div>
      ) : (
        grouped.map((group) => (
          <div key={group.brandSlug} className="flex flex-col gap-3">
            <div className="flex items-center gap-2 px-1">
              <span
                className="text-[11px] font-semibold tracking-widest uppercase"
                style={{ color: "rgba(0,0,0,0.48)" }}
              >
                {group.brandName}
              </span>
              <div className="flex-1 h-px" style={{ background: "rgba(0,0,0,0.08)" }} />
              <span className="text-[11px]" style={{ color: "rgba(0,0,0,0.4)" }}>
                {group.items.length} דגמים
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {group.items.map((entry) => (
                <div
                  key={entry.modelRepairId}
                  className="relative bg-white rounded-[18px] p-5 flex flex-col gap-4 transition-all duration-200 hover:-translate-y-0.5"
                  style={{ boxShadow: "rgba(0,0,0,0.06) 0px 2px 10px 0px" }}
                >
                  {/* Header row: brand chip + icon */}
                  <div className="flex items-start justify-between gap-3">
                    <span
                      className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
                      style={{
                        background: "rgba(0,113,227,0.08)",
                        color: "#0071e3",
                        letterSpacing: "0.04em",
                      }}
                    >
                      {entry.brandName}
                    </span>
                    <div
                      className="w-10 h-10 rounded-[12px] flex items-center justify-center flex-shrink-0"
                      style={{ background: bg }}
                    >
                      <Icon size={18} style={{ color: accent }} strokeWidth={2} />
                    </div>
                  </div>

                  {/* Title */}
                  <h3
                    className="text-[16px] font-semibold text-[#1d1d1f]"
                    style={{ letterSpacing: "-0.2px", lineHeight: 1.3 }}
                  >
                    {repairName} ל{entry.modelName}
                  </h3>

                  {/* Price row */}
                  <div className="flex items-end justify-between gap-3 pt-1 border-t" style={{ borderColor: "#f5f5f7" }}>
                    <div>
                      <p
                        className="text-[10px] font-semibold uppercase tracking-wider"
                        style={{ color: "rgba(0,0,0,0.40)" }}
                      >
                        מחיר
                      </p>
                      <p
                        className="text-[26px] font-bold text-[#1d1d1f] tabular-nums leading-none mt-0.5"
                        style={{ letterSpacing: "-0.5px" }}
                        aria-label={`מחיר ${entry.price} שקלים`}
                      >
                        ₪{entry.price}
                      </p>
                    </div>
                    {entry.duration_min && (
                      <span
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-medium flex-shrink-0"
                        style={{ background: "#f5f5f7", color: "rgba(0,0,0,0.56)" }}
                      >
                        <Clock size={10} />
                        {entry.duration_min < 60
                          ? `${entry.duration_min} דקות`
                          : `${Math.round(entry.duration_min / 60)} שעות`}
                      </span>
                    )}
                  </div>

                  {/* CTA */}
                  <Link
                    href={`/repairs/${entry.brandSlug}/${entry.modelSlug}/${repairSlug}`}
                    className="inline-flex items-center justify-center gap-1 h-11 rounded-[12px] text-sm font-semibold text-white transition-all"
                    style={{
                      background: "#0071e3",
                      letterSpacing: "-0.2px",
                      boxShadow: "rgba(0,113,227,0.25) 0px 4px 12px",
                    }}
                  >
                    הזמן תיקון
                    <ChevronLeft size={14} />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
