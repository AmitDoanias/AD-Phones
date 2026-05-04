import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import ModelRepairEditForm from "./ModelRepairEditForm";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditModelRepairPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: mr } = await supabase
    .from("model_repairs")
    .select("*, model:models(id, name, brand_id), repair_type:repair_types(id, name)")
    .eq("id", id)
    .single();

  if (!mr) notFound();

  return (
    <div className="max-w-md">
      <h1 className="text-2xl font-bold text-slate-800 mb-1">עריכת תיקון</h1>
      <p className="text-slate-500 text-sm mb-6">
        {(mr.model as { name: string })?.name} ←{" "}
        {(mr.repair_type as { name: string })?.name}
      </p>
      <ModelRepairEditForm
        id={id}
        initialPrice={mr.price}
        initialDuration={mr.duration_min}
        initialActive={mr.is_active}
        modelName={(mr.model as { name: string })?.name}
        repairName={(mr.repair_type as { name: string })?.name}
      />
    </div>
  );
}
