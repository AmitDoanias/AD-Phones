import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Plus, Pencil, ChevronLeft, AlertTriangle } from "lucide-react";
import Button from "@/components/ui/Button";
import AppleModelTabs from "./AppleModelTabs";
import {
  DEVICE_CATEGORY_LABELS,
  DEVICE_CATEGORY_ORDER,
  isValidDeviceCategory,
} from "@/lib/deviceCategory";

export default async function RepairsPage() {
  const supabase = await createClient();

  const { data: brands } = await supabase
    .from("brands")
    .select("id, name, slug")
    .order("sort_order");

  const { data: models } = await supabase
    .from("models")
    .select("id, name, slug, brand_id, is_active, sort_order, image_url, alt_text, seo_title, seo_description")
    .order("sort_order");

  const { data: repairTypes } = await supabase
    .from("repair_types")
    .select("id, name, slug, device_category")
    .order("name");

  const { data: modelRepairs } = await supabase
    .from("model_repairs")
    .select("id, model_id, repair_type_id, price, is_active");

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[14px] font-semibold text-slate-800">ניהול תיקונים</p>
          <p className="text-[12px] text-muted-foreground mt-0.5">מותגים, דגמים וסוגי תיקון</p>
        </div>
        <div className="flex gap-2 flex-wrap justify-end">
          <Link href="/dashboard/repairs/new?type=brand">
            <Button size="sm" variant="outline">
              <Plus size={14} /> מותג חדש
            </Button>
          </Link>
          <Link href="/dashboard/repairs/new?type=model">
            <Button size="sm" variant="outline">
              <Plus size={14} /> דגם חדש
            </Button>
          </Link>
          <Link href="/dashboard/repairs/new?type=repair">
            <Button size="sm">
              <Plus size={14} /> סוג תיקון
            </Button>
          </Link>
        </div>
      </div>

      {/* Repair Types — grouped by device category */}
      {repairTypes && repairTypes.length > 0 && (
        <div className="flex flex-col gap-3">
          {DEVICE_CATEGORY_ORDER.map((category) => {
            const items = repairTypes.filter(
              (rt) => rt.device_category === category
            );
            return (
              <RepairTypeGroup
                key={category}
                label={DEVICE_CATEGORY_LABELS[category]}
                items={items}
              />
            );
          })}
          {(() => {
            const uncategorized = repairTypes.filter(
              (rt) => !isValidDeviceCategory(rt.device_category)
            );
            if (uncategorized.length === 0) return null;
            return <RepairTypeGroup label="לא מסווג" items={uncategorized} warn />;
          })()}
        </div>
      )}

      {/* Brands + Models tree */}
      <div className="grid gap-4">
        {brands?.map((brand) => {
          const brandModels =
            models?.filter((m) => m.brand_id === brand.id) ?? [];
          const activeModels = brandModels.filter((m) => m.is_active);
          const inactiveModels = brandModels.filter((m) => !m.is_active);

          return (
            <div
              key={brand.id}
              className="bg-card rounded-2xl border border-border shadow-[0_1px_4px_rgba(0,0,0,0.06),0_4px_20px_rgba(0,0,0,0.05)] overflow-hidden"
            >
              {/* Brand header */}
              <div className="px-5 py-3.5 bg-[#0f172a] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <h2 className="font-bold text-white text-[14px]">{brand.name}</h2>
                  <span className="text-[11px] text-slate-400">
                    {activeModels.length} דגמים פעילים
                  </span>
                </div>
                <Link href={`/dashboard/repairs/edit-brand/${brand.id}`}>
                  <Button size="sm" variant="ghost" className="text-slate-400 hover:text-white hover:bg-white/10 h-7 px-2">
                    <Pencil size={13} />
                  </Button>
                </Link>
              </div>

              {brandModels.length === 0 ? (
                <div className="px-5 py-5 text-[13px] text-muted-foreground">
                  אין דגמים —{" "}
                  <Link
                    href={`/dashboard/repairs/new?type=model`}
                    className="text-primary hover:underline font-medium"
                  >
                    הוסף דגם ראשון
                  </Link>
                </div>
              ) : brand.name.toLowerCase() === "apple" ? (
                <AppleModelTabs
                  models={brandModels}
                  modelRepairs={modelRepairs ?? []}
                  repairTypes={repairTypes ?? []}
                />
              ) : (
                <div className="divide-y divide-border/60">
                  {activeModels.map((model) => {
                    const repairs =
                      modelRepairs?.filter((r) => r.model_id === model.id) ?? [];
                    return (
                      <ModelRow
                        key={model.id}
                        model={model}
                        repairs={repairs}
                        repairTypes={repairTypes ?? []}
                      />
                    );
                  })}
                  {inactiveModels.map((model) => {
                    const repairs =
                      modelRepairs?.filter((r) => r.model_id === model.id) ?? [];
                    return (
                      <ModelRow
                        key={model.id}
                        model={model}
                        repairs={repairs}
                        repairTypes={repairTypes ?? []}
                        inactive
                      />
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {(!brands || brands.length === 0) && (
        <div className="bg-card rounded-2xl border border-border shadow-[0_1px_4px_rgba(0,0,0,0.06)] p-12 text-center">
          <p className="text-[13px] text-muted-foreground mb-4">עוד אין מותגים במערכת</p>
          <Link href="/dashboard/repairs/new?type=brand">
            <Button>
              <Plus size={15} /> הוסף מותג ראשון
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}

function RepairTypeGroup({
  label,
  items,
  warn = false,
}: {
  label: string;
  items: { id: string; name: string }[];
  warn?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-4 ${
        warn
          ? "bg-amber-50 border-amber-200"
          : "bg-card border-border shadow-[0_1px_4px_rgba(0,0,0,0.06)]"
      }`}
    >
      <div className="flex items-center gap-2 mb-3">
        {warn && <AlertTriangle size={13} className="text-amber-600" />}
        <p
          className={`text-[10px] font-bold uppercase tracking-widest ${
            warn ? "text-amber-700" : "text-muted-foreground"
          }`}
        >
          {label}
        </p>
        <span
          className={`text-[10px] font-medium ${
            warn ? "text-amber-600" : "text-muted-foreground/60"
          }`}
        >
          ({items.length})
        </span>
        {warn && (
          <p className="text-[11px] text-amber-700 font-medium mr-auto">
            בחר קטגוריה עבור סוגי התיקון למטה דרך עריכה
          </p>
        )}
      </div>
      {items.length === 0 ? (
        <p className="text-[11px] text-muted-foreground">אין סוגי תיקון בקטגוריה זו.</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {items.map((rt) => (
            <Link
              key={rt.id}
              href={`/dashboard/repairs/edit-repair-type/${rt.id}`}
              className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors ${
                warn
                  ? "bg-white border border-amber-300 text-amber-800 hover:bg-amber-100"
                  : "bg-muted text-muted-foreground hover:bg-primary hover:text-white"
              }`}
            >
              {rt.name}
            </Link>
          ))}
        </div>
      )}
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
  model: { id: string; name: string; is_active: boolean; image_url?: string | null; alt_text?: string | null; seo_title?: string | null; seo_description?: string | null };
  repairs: { id: string; repair_type_id: string; price: number; is_active: boolean }[];
  repairTypes: { id: string; name: string }[];
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
          <span className="text-[11px] text-muted-foreground">
            {activeRepairs.length} תיקונים
          </span>
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
          אין תיקונים — לחץ &quot;הוסף תיקון&quot; כדי להתחיל
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
