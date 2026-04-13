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

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">
        {type === "brand" && "מותג חדש"}
        {type === "model" && "דגם חדש"}
        {type === "repair" && "סוג תיקון חדש"}
        {type === "model_repair" && "הוספת תיקון לדגם"}
      </h1>

      <RepairForm
        type={(type as "brand" | "model" | "repair" | "model_repair") ?? "repair"}
        brands={brands ?? []}
        models={models ?? []}
        repairTypes={repairTypes ?? []}
        defaultModelId={model_id}
      />
    </div>
  );
}
