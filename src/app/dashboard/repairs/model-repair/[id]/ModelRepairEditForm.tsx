"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Trash2 } from "lucide-react";

interface Props {
  id: string;
  initialPrice: number;
  initialDuration: number;
  initialActive: boolean;
  modelName: string;
  repairName: string;
}

export default function ModelRepairEditForm({
  id,
  initialPrice,
  initialDuration,
  initialActive,
  modelName,
  repairName,
}: Props) {
  const router = useRouter();
  const [price, setPrice] = useState(String(initialPrice));
  const [duration, setDuration] = useState(String(initialDuration));
  const [isActive, setIsActive] = useState(initialActive);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const supabase = createClient();
    const { error } = await supabase
      .from("model_repairs")
      .update({ price: Number(price), duration_min: Number(duration), is_active: isActive })
      .eq("id", id);
    if (error) { setError("שגיאה בשמירה"); setLoading(false); return; }
    router.push("/dashboard/repairs");
    router.refresh();
  }

  async function handleDelete() {
    if (!confirm(`למחוק את ${repairName} מ-${modelName}?`)) return;
    setDeleting(true);
    const supabase = createClient();
    await supabase.from("model_repairs").delete().eq("id", id);
    router.push("/dashboard/repairs");
    router.refresh();
  }

  return (
    <form
      onSubmit={handleSave}
      className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col gap-4"
    >
      <Input
        label="מחיר (₪)"
        type="number"
        min="0"
        step="0.01"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        required
      />
      <Input
        label="זמן תיקון משוער (דקות)"
        type="number"
        min="15"
        value={duration}
        onChange={(e) => setDuration(e.target.value)}
      />
      <label className="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer">
        <input
          type="checkbox"
          checked={isActive}
          onChange={(e) => setIsActive(e.target.checked)}
          className="rounded"
        />
        פעיל
      </label>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex items-center justify-between mt-1 gap-3">
        <div className="flex gap-2">
          <Button type="submit" loading={loading}>שמור</Button>
          <Button type="button" variant="ghost" onClick={() => router.back()}>ביטול</Button>
        </div>
        <Button
          type="button"
          variant="danger"
          size="sm"
          loading={deleting}
          onClick={handleDelete}
        >
          <Trash2 size={14} /> מחק
        </Button>
      </div>
    </form>
  );
}
