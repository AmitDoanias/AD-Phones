"use client";

import { useState } from "react";
import Link from "next/link";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { isIPhoneModel, isIPadModel } from "@/lib/utils";
import { Plus, ChevronLeft } from "lucide-react";

type Model = {
  id: string;
  name: string;
  is_active: boolean;
  sort_order: number;
  image_url?: string | null;
  alt_text?: string | null;
  seo_title?: string | null;
  seo_description?: string | null;
};

type Repair = {
  id: string;
  model_id: string;
  repair_type_id: string;
  price: number;
  is_active: boolean;
};

type RepairType = {
  id: string;
  name: string;
};

interface Props {
  models: Model[];
  modelRepairs: Repair[];
  repairTypes: RepairType[];
}

function seoScore(model: Model): number {
  return (
    (model.image_url ? 25 : 0) +
    (model.alt_text ? 25 : 0) +
    (model.seo_title ? 25 : 0) +
    (model.seo_description ? 25 : 0)
  );
}

function SeoScoreBadge({ score }: { score: number }) {
  const color =
    score === 100
      ? "bg-emerald-50 text-emerald-700 border-emerald-100"
      : score >= 75
      ? "bg-amber-50 text-amber-700 border-amber-100"
      : score >= 50
      ? "bg-orange-50 text-orange-700 border-orange-100"
      : "bg-red-50 text-red-700 border-red-100";
  return (
    <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-bold border ${color}`}>
      SEO {score}%
    </span>
  );
}

const TABS = [
  { key: "all", label: "הכל" },
  { key: "iphone", label: "iPhone" },
  { key: "ipad", label: "iPad" },
];

function ModelRow({
  model,
  repairs,
  repairTypes,
  inactive = false,
}: {
  model: Model;
  repairs: Repair[];
  repairTypes: RepairType[];
  inactive?: boolean;
}) {
  const activeRepairs = repairs.filter((r) => r.is_active);

  return (
    <div className={`px-5 py-3 ${inactive ? "opacity-50" : ""}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Link
            href={`/dashboard/repairs/model/${model.id}`}
            className="font-semibold text-slate-700 text-sm hover:text-primary transition-colors"
          >
            {model.name}
          </Link>
          {inactive && (
            <Badge className="bg-slate-100 text-slate-400 text-xs">
              לא פעיל
            </Badge>
          )}
          <span className="text-xs text-slate-400">
            {activeRepairs.length} תיקונים
          </span>
          <Link href={`/dashboard/repairs/edit-model/${model.id}`}>
            <SeoScoreBadge score={seoScore(model)} />
          </Link>
        </div>
        <div className="flex items-center gap-1">
          <Link
            href={`/dashboard/repairs/new?type=model_repair&model_id=${model.id}`}
          >
            <Button size="sm" variant="outline" className="text-xs h-7 px-2">
              <Plus size={12} /> הוסף תיקון
            </Button>
          </Link>
          <Link href={`/dashboard/repairs/model/${model.id}`}>
            <Button size="sm" variant="ghost" className="h-7 px-2">
              <ChevronLeft size={15} />
            </Button>
          </Link>
        </div>
      </div>

      {repairs.length === 0 ? (
        <p className="text-xs text-slate-400 mt-1">
          אין תיקונים - לחץ &quot;הוסף תיקון&quot; כדי להתחיל
        </p>
      ) : (
        <div className="flex flex-wrap gap-1.5">
          {activeRepairs.map((r) => {
            const rt = repairTypes.find((rt) => rt.id === r.repair_type_id);
            return (
              <Link
                key={r.id}
                href={`/dashboard/repairs/model-repair/${r.id}`}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium hover:bg-blue-100 transition-colors"
              >
                {rt?.name}
                <span className="text-blue-400 font-normal">₪{r.price}</span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function AppleModelTabs({
  models,
  modelRepairs,
  repairTypes,
}: Props) {
  const [activeTab, setActiveTab] = useState("all");

  const filtered = (() => {
    if (activeTab === "iphone")
      return [...models.filter((m) => isIPhoneModel(m.name))].sort((a, b) => a.sort_order - b.sort_order);
    if (activeTab === "ipad")
      return [...models.filter((m) => isIPadModel(m.name))].sort((a, b) => a.sort_order - b.sort_order);
    // "all" tab: iPhones first (by sort_order), then iPads (by sort_order), then others
    const iphones = [...models.filter((m) => isIPhoneModel(m.name))].sort((a, b) => a.sort_order - b.sort_order);
    const ipads = [...models.filter((m) => isIPadModel(m.name))].sort((a, b) => a.sort_order - b.sort_order);
    const others = models.filter((m) => !isIPhoneModel(m.name) && !isIPadModel(m.name));
    return [...iphones, ...ipads, ...others];
  })();

  const activeModels = filtered.filter((m) => m.is_active);
  const inactiveModels = filtered.filter((m) => !m.is_active);

  const iphoneCount = models.filter((m) =>
    isIPhoneModel(m.name)
  ).length;
  const ipadCount = models.filter((m) =>
    isIPadModel(m.name)
  ).length;

  return (
    <div>
      {/* Tabs */}
      <div className="flex gap-1 px-4 pt-3 pb-2 border-b border-slate-100">
        {TABS.map((tab) => {
          const count =
            tab.key === "all"
              ? models.length
              : tab.key === "iphone"
              ? iphoneCount
              : ipadCount;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                activeTab === tab.key
                  ? "bg-[#0071e3] text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {tab.label}
              <span
                className={`text-xs px-1.5 py-0.5 rounded-full ${
                  activeTab === tab.key
                    ? "bg-white/20 text-white"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Models */}
      {filtered.length === 0 ? (
        <div className="px-5 py-4 text-sm text-slate-400">
          אין דגמים בקטגוריה זו
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {activeModels.map((model) => (
            <ModelRow
              key={model.id}
              model={model}
              repairs={modelRepairs.filter((r) => r.model_id === model.id)}
              repairTypes={repairTypes}
            />
          ))}
          {inactiveModels.map((model) => (
            <ModelRow
              key={model.id}
              model={model}
              repairs={modelRepairs.filter((r) => r.model_id === model.id)}
              repairTypes={repairTypes}
              inactive
            />
          ))}
        </div>
      )}
    </div>
  );
}
