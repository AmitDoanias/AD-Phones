"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import AnimatedCard from "@/components/repairs/AnimatedCard";
import { isIPhoneModel, isIPadModel } from "@/lib/utils";

type Model = {
  id: string;
  name: string;
  slug: string;
  image_url: string | null;
  alt_text: string | null;
};

type Tab = "all" | "iphone" | "ipad";

type Props = {
  models: Model[];
  brandSlug: string;
  brandName: string;
  showLineTabs: boolean;
};

const TAB_LABELS: Record<Tab, string> = {
  all: "הכל",
  iphone: "iPhone",
  ipad: "iPad",
};

function filterByTab(models: Model[], tab: Tab): Model[] {
  if (tab === "all") return models;
  if (tab === "iphone") return models.filter((m) => isIPhoneModel(m.name));
  return models.filter((m) => isIPadModel(m.name));
}

export default function BrandModelGrid({ models, brandSlug, brandName, showLineTabs }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("all");

  const visible = filterByTab(models, activeTab);

  return (
    <>
      {/* Tabs — only shown for Apple (or any brand with multiple product lines) */}
      {showLineTabs && (
        <div className="flex justify-center gap-2 mb-8">
          {(["all", "iphone", "ipad"] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="px-5 py-2 rounded-[980px] text-sm font-medium transition-colors"
              style={{
                background: activeTab === tab ? "#0071e3" : "white",
                color: activeTab === tab ? "white" : "#1d1d1f",
                boxShadow:
                  activeTab === tab
                    ? "none"
                    : "rgba(0,0,0,0.10) 0px 1px 6px 0px",
              }}
            >
              {TAB_LABELS[tab]}
            </button>
          ))}
        </div>
      )}

      {/* Model grid */}
      {visible.length === 0 ? (
        <div className="py-16 text-center">
          <p style={{ color: "rgba(0,0,0,0.48)" }}>אין דגמים זמינים בקטגוריה זו</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {visible.map((model, i) => (
            <AnimatedCard key={model.id} delay={i * 60}>
              <Link
                href={`/repairs/${brandSlug}/${model.slug}`}
                className="group block bg-white rounded-[14px] overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[rgba(0,0,0,0.12)_0px_8px_24px_0px] focus-visible:outline-2 focus-visible:outline-[#0071e3]"
                style={{ boxShadow: "rgba(0,0,0,0.06) 0px 2px 8px 0px" }}
              >
                <div className="aspect-square relative flex items-center justify-center bg-white overflow-hidden">
                  {model.image_url ? (
                    <Image
                      src={model.image_url}
                      alt={model.alt_text ?? model.name}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover scale-110"
                    />
                  ) : (
                    <span className="text-6xl font-bold" style={{ color: "rgba(0,0,0,0.15)" }}>
                      {brandName.charAt(0)}
                    </span>
                  )}
                </div>
                <div className="px-4 pt-2 pb-4 text-center bg-white">
                  <p
                    className="text-[15px] font-semibold text-[#1d1d1f] leading-tight mb-1"
                    style={{ letterSpacing: "0.196px" }}
                  >
                    {model.name}
                  </p>
                  <span className="inline-flex items-center gap-0.5 text-xs text-[#0066cc] group-hover:underline">
                    תיקונים ומחירים
                    <ChevronLeft size={12} />
                  </span>
                </div>
              </Link>
            </AnimatedCard>
          ))}
        </div>
      )}
    </>
  );
}
