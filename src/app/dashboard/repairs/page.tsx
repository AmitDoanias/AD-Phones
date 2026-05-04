import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Plus, AlertTriangle } from "lucide-react";
import Button from "@/components/ui/Button";
import BrandTabs from "./BrandTabs";
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

      {/* Repair Types - grouped by device category */}
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

      {/* Brands + Models - tabbed */}
      {brands && brands.length > 0 && (
        <BrandTabs
          brands={brands}
          models={models ?? []}
          modelRepairs={modelRepairs ?? []}
          repairTypes={repairTypes ?? []}
        />
      )}

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

