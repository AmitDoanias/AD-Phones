import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
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
    .select("id, model_id, repair_type_id, price, is_active")
    .eq("is_active", true);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-800">ניהול תיקונים</h1>
        <div className="flex gap-2">
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
            <Button size="sm">
              <Plus size={15} /> תיקון חדש
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-6">
        {brands?.map((brand) => {
          const brandModels = models?.filter((m) => m.brand_id === brand.id) ?? [];
          return (
            <div
              key={brand.id}
              className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden"
            >
              <div className="px-5 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <h2 className="font-bold text-slate-700">{brand.name}</h2>
                <Link href={`/dashboard/repairs/${brand.id}?type=brand`}>
                  <Button size="sm" variant="ghost">
                    <Pencil size={14} />
                  </Button>
                </Link>
              </div>

              <div className="divide-y divide-slate-100">
                {brandModels.map((model) => {
                  const repairs =
                    modelRepairs?.filter((r) => r.model_id === model.id) ?? [];
                  return (
                    <div key={model.id} className="px-5 py-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-slate-700 text-sm">
                            {model.name}
                          </span>
                          {!model.is_active && (
                            <Badge className="bg-slate-100 text-slate-500">
                              לא פעיל
                            </Badge>
                          )}
                        </div>
                        <Link
                          href={`/dashboard/repairs/${model.id}?type=model`}
                        >
                          <Button size="sm" variant="ghost">
                            <Pencil size={14} />
                          </Button>
                        </Link>
                      </div>

                      {repairs.length === 0 ? (
                        <p className="text-xs text-slate-400">
                          אין תיקונים מוגדרים לדגם זה
                        </p>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {repairs.map((r) => {
                            const rt = repairTypes?.find(
                              (rt) => rt.id === r.repair_type_id
                            );
                            return (
                              <Link
                                key={r.id}
                                href={`/dashboard/repairs/${r.id}?type=model_repair`}
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium hover:bg-blue-100 transition-colors"
                              >
                                {rt?.name}
                                <span className="text-blue-500">
                                  ₪{r.price}
                                </span>
                              </Link>
                            );
                          })}
                          <Link
                            href={`/dashboard/repairs/new?type=model_repair&model_id=${model.id}`}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-dashed border-slate-300 text-slate-400 text-xs hover:border-primary hover:text-primary transition-colors"
                          >
                            <Plus size={11} /> הוסף
                          </Link>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
