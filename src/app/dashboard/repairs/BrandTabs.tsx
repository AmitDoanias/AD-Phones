"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, ChevronLeft } from "lucide-react";
import Button from "@/components/ui/Button";
import AppleModelTabs from "./AppleModelTabs";
import { cn } from "@/lib/utils";

type Brand = { id: string; name: string; slug: string };

type Model = {
  id: string;
  name: string;
  is_active: boolean;
  sort_order: number;
  brand_id: string;
  image_url?: string | null;
  alt_text?: string | null;
  seo_title?: string | null;
  seo_description?: string | null;
};

type ModelRepair = {
  id: string;
  model_id: string;
  repair_type_id: string;
  price: number;
  is_active: boolean;
};

type RepairType = { id: string; name: string };

interface Props {
  brands: Brand[];
  models: Model[];
  modelRepairs: ModelRepair[];
  repairTypes: RepairType[];
}

const STORAGE_KEY = "dashboard.repairs.activeBrand";

export default function BrandTabs({ brands, models, modelRepairs, repairTypes }: Props) {
  const [activeBrandId, setActiveBrandId] = useState<string>(brands[0]?.id ?? "");

  useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
    if (saved && brands.some((b) => b.id === saved)) {
      setActiveBrandId(saved);
    }
  }, [brands]);

  function selectBrand(id: string) {
    setActiveBrandId(id);
    if (typeof window !== "undefined") localStorage.setItem(STORAGE_KEY, id);
  }

  const activeBrand = brands.find((b) => b.id === activeBrandId) ?? brands[0];
  if (!activeBrand) return null;

  const brandModels = models.filter((m) => m.brand_id === activeBrand.id);
  const activeModels = brandModels.filter((m) => m.is_active);
  const inactiveModels = brandModels.filter((m) => !m.is_active);

  return (
    <div className="flex flex-col gap-3">
      {/* Brand tabs */}
      <div className="flex items-center gap-1 bg-muted/40 rounded-xl p-1 w-fit">
        {brands.map((brand) => {
          const count = models.filter((m) => m.brand_id === brand.id && m.is_active).length;
          const isActive = brand.id === activeBrand.id;
          return (
            <button
              key={brand.id}
              type="button"
              onClick={() => selectBrand(brand.id)}
              className={cn(
                "px-4 py-1.5 rounded-lg text-[13px] font-semibold transition-all flex items-center gap-1.5",
                isActive
                  ? "bg-white text-slate-900 shadow-[0_1px_2px_rgba(0,0,0,0.08)]"
                  : "text-muted-foreground hover:text-slate-700"
              )}
            >
              {brand.name}
              <span
                className={cn(
                  "text-[10px] font-medium px-1.5 py-0.5 rounded-full",
                  isActive ? "bg-slate-100 text-slate-500" : "bg-transparent"
                )}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active brand content */}
      <div className="bg-card rounded-2xl border border-border shadow-[0_1px_4px_rgba(0,0,0,0.06),0_4px_20px_rgba(0,0,0,0.05)] overflow-hidden">
        <div className="px-5 py-3.5 bg-[#0f172a] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <h2 className="font-bold text-white text-[14px]">{activeBrand.name}</h2>
            <span className="text-[11px] text-slate-400">{activeModels.length} דגמים פעילים</span>
          </div>
          <Link href={`/dashboard/repairs/edit-brand/${activeBrand.id}`}>
            <Button size="sm" variant="ghost" className="text-slate-400 hover:text-white hover:bg-white/10 h-7 px-2">
              <Pencil size={13} />
            </Button>
          </Link>
        </div>

        {brandModels.length === 0 ? (
          <div className="px-5 py-5 text-[13px] text-muted-foreground">
            אין דגמים -{" "}
            <Link href="/dashboard/repairs/new?type=model" className="text-primary hover:underline font-medium">
              הוסף דגם ראשון
            </Link>
          </div>
        ) : activeBrand.name.toLowerCase() === "apple" ? (
          <AppleModelTabs models={brandModels} modelRepairs={modelRepairs} repairTypes={repairTypes} />
        ) : (
          <div className="divide-y divide-border/60">
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
    </div>
  );
}

function seoScore(model: {
  image_url?: string | null;
  alt_text?: string | null;
  seo_title?: string | null;
  seo_description?: string | null;
}): number {
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

function ModelRow({
  model,
  repairs,
  repairTypes,
  inactive = false,
}: {
  model: Model;
  repairs: ModelRepair[];
  repairTypes: RepairType[];
  inactive?: boolean;
}) {
  const activeRepairs = repairs.filter((r) => r.is_active);

  return (
    <div className={`px-5 py-4 ${inactive ? "opacity-50" : ""}`}>
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2.5">
          <Link
            href={`/dashboard/repairs/model/${model.id}`}
            className="font-semibold text-[13px] text-card-foreground hover:text-primary transition-colors"
          >
            {model.name}
          </Link>
          {inactive && (
            <span className="px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground text-[10px] font-semibold">
              לא פעיל
            </span>
          )}
          <span className="text-[11px] text-muted-foreground">{activeRepairs.length} תיקונים</span>
          <Link href={`/dashboard/repairs/edit-model/${model.id}`}>
            <SeoScoreBadge score={seoScore(model)} />
          </Link>
        </div>
        <div className="flex items-center gap-1">
          <Link href={`/dashboard/repairs/new?type=model_repair&model_id=${model.id}`}>
            <Button size="sm" variant="outline" className="h-7 px-2.5 text-[11px]">
              <Plus size={11} /> הוסף תיקון
            </Button>
          </Link>
          <Link href={`/dashboard/repairs/model/${model.id}`}>
            <Button size="sm" variant="ghost" className="h-7 px-2 text-muted-foreground">
              <ChevronLeft size={14} />
            </Button>
          </Link>
        </div>
      </div>

      {repairs.length === 0 ? (
        <p className="text-[11px] text-muted-foreground">
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
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100 text-[11px] font-medium hover:bg-blue-100 transition-colors"
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
