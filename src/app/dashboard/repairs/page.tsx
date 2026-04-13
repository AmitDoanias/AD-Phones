import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Plus, Pencil, ChevronLeft } from "lucide-react";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

export default async function RepairsPage() {
  const supabase = await createClient();

  const { data: brands } = await supabase
    .from("brands")
    .select("id, name, slug")
    .order("sort_order");

  const { data: models } = await supabase
    .from("models")
    .select("id, name, slug, brand_id, is_active")
    .order("sort_order");

  const { data: repairTypes } = await supabase
    .from("repair_types")
    .select("id, name, slug")
    .order("name");

  const { data: modelRepairs } = await supabase
    .from("model_repairs")
    .select("id, model_id, repair_type_id, price, is_active");

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-800">ניהול תיקונים</h1>
        <div className="flex gap-2 flex-wrap justify-end">
          <Link href="/dashboard/repairs/new?type=brand">
            <Button size="sm" variant="outline">
              <Plus size={15} /> מותג חדש
            </Button>
          </Link>
          <Link href="/dashboard/repairs/new?type=model">
            <Button size="sm" variant="outline">
              <Plus size={15} /> דגם חדש
            </Button>
          </Link>
          <Link href="/dashboard/repairs/new?type=repair">
            <Button size="sm" variant="secondary">
              <Plus size={15} /> סוג תיקון חדש
            </Button>
          </Link>
        </div>
      </div>

      {/* Repair Types quick reference */}
      {repairTypes && repairTypes.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 mb-6">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
            סוגי תיקון קיימים
          </p>
          <div className="flex flex-wrap gap-2">
            {repairTypes.map((rt) => (
              <span
                key={rt.id}
                className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-medium"
              >
                {rt.name}
              </span>
            ))}
          </div>
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
              className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden"
            >
              {/* Brand header */}
              <div className="px-5 py-3 bg-[#0f172a] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h2 className="font-bold text-white">{brand.name}</h2>
                  <span className="text-xs text-slate-400">
                    ({activeModels.length} דגמים פעילים)
                  </span>
                </div>
                <Link href={`/dashboard/repairs/edit-brand/${brand.id}`}>
                  <Button size="sm" variant="ghost" className="text-slate-400 hover:text-white">
                    <Pencil size={14} />
                  </Button>
                </Link>
              </div>

              {brandModels.length === 0 ? (
                <div className="px-5 py-4 text-sm text-slate-400">
                  אין דגמים —{" "}
                  <Link
                    href={`/dashboard/repairs/new?type=model`}
                    className="text-primary hover:underline"
                  >
                    הוסף דגם ראשון
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {activeModels.map((model) => {
                    const repairs =
                      modelRepairs?.filter((r) => r.model_id === model.id) ??
                      [];
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
                      modelRepairs?.filter((r) => r.model_id === model.id) ??
                      [];
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
        <div className="bg-white rounded-xl border border-slate-200 p-10 text-center shadow-sm">
          <p className="text-slate-400 mb-4">עוד אין מותגים במערכת</p>
          <Link href="/dashboard/repairs/new?type=brand">
            <Button>
              <Plus size={16} /> הוסף מותג ראשון
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}

function ModelRow({
  model,
  repairs,
  repairTypes,
  inactive = false,
}: {
  model: { id: string; name: string; is_active: boolean };
  repairs: { id: string; repair_type_id: string; price: number; is_active: boolean }[];
  repairTypes: { id: string; name: string }[];
  inactive?: boolean;
}) {
  const activeRepairs = repairs.filter((r) => r.is_active);

  return (
    <div className={`px-5 py-3 ${inactive ? "opacity-50" : ""}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-700 text-sm">
            {model.name}
          </span>
          {inactive && (
            <Badge className="bg-slate-100 text-slate-400 text-xs">
              לא פעיל
            </Badge>
          )}
          <span className="text-xs text-slate-400">
            {activeRepairs.length} תיקונים
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Link href={`/dashboard/repairs/new?type=model_repair&model_id=${model.id}`}>
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
          אין תיקונים — לחץ "הוסף תיקון" כדי להתחיל
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
