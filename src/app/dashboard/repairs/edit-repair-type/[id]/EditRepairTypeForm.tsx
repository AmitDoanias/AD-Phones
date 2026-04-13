"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Trash2, AlertTriangle } from "lucide-react";

interface Props {
  id: string;
  initialName: string;
  usageCount: number;
}

export default function EditRepairTypeForm({ id, initialName, usageCount }: Props) {
  const router = useRouter();
  const [name, setName] = useState(initialName);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const supabase = createClient();
    const { error } = await supabase
      .from("repair_types")
      .update({ name })
      .eq("id", id);
    if (error) { setError("שגיאה בשמירה"); setLoading(false); return; }
    router.push("/dashboard/repairs");
    router.refresh();
  }

  async function handleDelete() {
    const msg = usageCount > 0
      ? `סוג תיקון זה משויך ל-${usageCount} דגמים. מחיקתו תסיר אותו מכולם. להמשיך?`
      : `למחוק את "${initialName}"?`;
    if (!confirm(msg)) return;
    setDeleting(true);
    const supabase = createClient();
    await supabase.from("repair_types").delete().eq("id", id);
    router.push("/dashboard/repairs");
    router.refresh();
  }

  return (
    <form
      onSubmit={handleSave}
      className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col gap-4"
    >
      <Input
        label="שם סוג התיקון"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      {usageCount > 0 && (
        <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-700">
          <AlertTriangle size={16} className="shrink-0 mt-0.5" />
          <span>
            שינוי השם יתעדכן בכל {usageCount} הדגמים שמשויכים לתיקון זה
          </span>
        </div>
      )}

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex items-center justify-between mt-1">
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
