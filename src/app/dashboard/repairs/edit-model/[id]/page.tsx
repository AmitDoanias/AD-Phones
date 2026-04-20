"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import RepairForm from "../../RepairForm";
import { Button } from "@/components/ui/Button";
import { Trash2, Loader2 } from "lucide-react";

// ── Delete button ────────────────────────────────────────────────────────────

function DeleteModelButton({ modelId }: { modelId: string }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!window.confirm("למחוק את הדגם לצמיתות? פעולה זו אינה הפיכה.")) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/models/${modelId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed");
      router.push("/dashboard/repairs");
      router.refresh();
    } catch {
      alert("שגיאה במחיקה — נסה שוב.");
      setDeleting(false);
    }
  }

  return (
    <Button
      variant="danger"
      onClick={handleDelete}
      disabled={deleting}
      className="w-full gap-2"
    >
      {deleting ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
      מחק דגם
    </Button>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

interface Model {
  id: string;
  name: string;
  brand_id: string;
  sort_order: number;
  is_active: boolean;
  image_url: string | null;
  alt_text: string | null;
  seo_title: string | null;
  seo_description: string | null;
}

interface Brand {
  id: string;
  name: string;
}

export default function EditModelPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [model, setModel] = useState<Model | null>(null);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [modelId, setModelId] = useState<string>("");

  useEffect(() => {
    async function load() {
      const { id } = await params;
      setModelId(id);
      const supabase = createClient();
      const [{ data: m }, { data: b }] = await Promise.all([
        supabase.from("models").select("*").eq("id", id).single(),
        supabase.from("brands").select("id, name").order("sort_order"),
      ]);
      if (!m) { router.replace("/dashboard/repairs"); return; }
      setModel(m as Model);
      setBrands(b ?? []);
      setLoading(false);
    }
    load();
  }, [params, router]);

  if (loading) {
    return (
      <div className="max-w-xl flex items-center justify-center py-16">
        <Loader2 size={24} className="animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!model) return null;

  return (
    <div className="max-w-xl flex flex-col gap-5">
      <div>
        <p className="text-[14px] font-semibold text-slate-800">עריכת דגם</p>
        <p className="text-[12px] text-muted-foreground mt-0.5">{model.name}</p>
      </div>

      <RepairForm
        type="model"
        brands={brands}
        models={[]}
        repairTypes={[]}
        initial={{
          name: model.name,
          brand_id: model.brand_id,
          sort_order: model.sort_order,
          is_active: model.is_active,
          image_url: model.image_url ?? "",
          alt_text: model.alt_text ?? "",
          seo_title: model.seo_title ?? "",
          seo_description: model.seo_description ?? "",
        }}
        editId={model.id}
      />

      {/* Danger zone */}
      <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex flex-col gap-3">
        <div>
          <p className="text-[12px] font-semibold text-red-800">אזור מסוכן</p>
          <p className="text-[11px] text-red-600 mt-0.5">
            מחיקת הדגם תמחק גם את כל התיקונים המשויכים אליו. פעולה זו אינה הפיכה.
          </p>
        </div>
        <DeleteModelButton modelId={modelId} />
      </div>
    </div>
  );
}
