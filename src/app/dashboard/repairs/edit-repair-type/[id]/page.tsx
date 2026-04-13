import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import EditRepairTypeForm from "./EditRepairTypeForm";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditRepairTypePage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: rt } = await supabase
    .from("repair_types")
    .select("*")
    .eq("id", id)
    .single();

  if (!rt) notFound();

  // How many models use this repair type?
  const { count } = await supabase
    .from("model_repairs")
    .select("*", { count: "exact", head: true })
    .eq("repair_type_id", id);

  return (
    <div className="max-w-md">
      <h1 className="text-2xl font-bold text-slate-800 mb-1">עריכת סוג תיקון</h1>
      <p className="text-slate-400 text-sm mb-6">
        סוג תיקון זה משויך ל-{count ?? 0} דגמים
      </p>
      <EditRepairTypeForm
        id={id}
        initialName={rt.name}
        usageCount={count ?? 0}
      />
    </div>
  );
}
