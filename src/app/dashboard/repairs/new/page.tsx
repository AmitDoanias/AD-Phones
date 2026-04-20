import { createClient } from "@/lib/supabase/server";
import RepairForm from "../RepairForm";

interface Props {
  searchParams: Promise<{ type?: string; model_id?: string }>;
}

export default async function NewRepairPage({ searchParams }: Props) {
  const { type, model_id } = await searchParams;
  const supabase = await createClient();

  const { data: brands } = await supabase
    .from("brands")
    .select("id, name")
    .order("sort_order");

  const { data: models } = await supabase
    .from("models")
    .select("id, name, brand_id")
    .eq("is_active", true)
    .order("sort_order");

  const { data: repairTypes } = await supabase
    .from("repair_types")
    .select("id, name")
    .order("name");

  // Build brand → model count map for auto sort_order on new models
  const { data: allModels } = await supabase
    .from("models")
    .select("brand_id");

  const brandModelCounts = (allModels ?? []).reduce<Record<string, number>>((acc, m) => {
    acc[m.brand_id] = (acc[m.brand_id] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="max-w-xl flex flex-col gap-5">
      <div>
        <p className="text-[14px] font-semibold text-slate-800">
          {type === "brand" && "מותג חדש"}
          {type === "model" && "דגם חדש"}
          {type === "repair" && "סוג תיקון חדש"}
          {type === "model_repair" && "הוספת תיקון לדגם"}
        </p>
      </div>

      <RepairForm
        type={(type as "brand" | "model" | "repair" | "model_repair") ?? "repair"}
        brands={brands ?? []}
        models={models ?? []}
        repairTypes={repairTypes ?? []}
        defaultModelId={model_id}
        brandModelCounts={brandModelCounts}
      />
    </div>
  );
}
