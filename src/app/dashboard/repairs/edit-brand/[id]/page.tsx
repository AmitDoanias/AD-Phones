import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import RepairForm from "../../RepairForm";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditBrandPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: brand } = await supabase
    .from("brands")
    .select("*")
    .eq("id", id)
    .single();

  if (!brand) notFound();

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">עריכת מותג</h1>
      <RepairForm
        type="brand"
        brands={[]}
        models={[]}
        repairTypes={[]}
        initial={{ name: brand.name, sort_order: brand.sort_order, image_url: brand.icon_url ?? "" }}
        editId={id}
      />
    </div>
  );
}
