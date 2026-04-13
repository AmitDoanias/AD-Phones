import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import RepairForm from "../../RepairForm";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditModelPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: model } = await supabase
    .from("models")
    .select("*")
    .eq("id", id)
    .single();

  if (!model) notFound();

  const { data: brands } = await supabase
    .from("brands")
    .select("id, name")
    .order("sort_order");

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">עריכת דגם</h1>
      <RepairForm
        type="model"
        brands={brands ?? []}
        models={[]}
        repairTypes={[]}
        initial={{
          name: model.name,
          brand_id: model.brand_id,
          sort_order: model.sort_order,
          is_active: model.is_active,
        }}
        editId={id}
      />
    </div>
  );
}
