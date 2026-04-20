import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import EditRepairTypeForm from "./EditRepairTypeForm";
import RepairTypeModelsManager from "./RepairTypeModelsManager";
import { isValidDeviceCategory } from "@/lib/deviceCategory";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditRepairTypePage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: rt }, { data: brands }, { data: models }, { data: modelRepairs }] =
    await Promise.all([
      supabase.from("repair_types").select("*").eq("id", id).single(),
      supabase.from("brands").select("id, name").order("sort_order"),
      supabase.from("models").select("id, name, brand_id, is_active").order("sort_order"),
      supabase
        .from("model_repairs")
        .select("id, model_id, price, duration_min, is_active")
        .eq("repair_type_id", id),
    ]);

  if (!rt) notFound();

  const deviceCategory = isValidDeviceCategory(rt.device_category) ? rt.device_category : null;

  const brandList = (brands ?? []).map((brand) => ({
    ...brand,
    models: (models ?? [])
      .filter((m) => m.brand_id === brand.id)
      .map((model) => ({
        ...model,
        existingRepair:
          modelRepairs?.find((mr) => mr.model_id === model.id) ?? null,
      })),
  }));

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">עריכת סוג תיקון</h1>
      <EditRepairTypeForm
        id={id}
        initialName={rt.name}
        initialDescription={rt.description ?? null}
        initialSubtitle={rt.subtitle ?? null}
        initialTrustBadges={Array.isArray(rt.trust_badges) ? (rt.trust_badges as string[]) : null}
        initialDeviceCategory={deviceCategory}
        usageCount={modelRepairs?.length ?? 0}
      />
      <div className="mt-8">
        <RepairTypeModelsManager
          repairTypeId={id}
          brands={brandList}
          deviceCategory={deviceCategory}
        />
      </div>
    </div>
  );
}
