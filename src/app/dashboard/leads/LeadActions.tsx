"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, Trash2 } from "lucide-react";
import { LEAD_STATUS_COLORS, LEAD_STATUS_LABELS } from "@/constants";
import type { LeadStatus } from "@/types";
import { toast } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";

const STATUS_OPTIONS: { value: LeadStatus; label: string }[] = [
  { value: "new",       label: "חדש" },
  { value: "contacted", label: "פנו ללקוח" },
  { value: "converted", label: "הפך ללקוח" },
  { value: "closed",    label: "נסגר" },
];

interface Props {
  id: string;
  initialStatus: LeadStatus;
  customerName: string;
}

export default function LeadActions({ id, initialStatus, customerName }: Props) {
  const router = useRouter();
  const [status, setStatus] = useState<LeadStatus>(initialStatus);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function onChangeStatus(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = e.target.value as LeadStatus;
    const prev = status;
    setStatus(next);
    setSaving(true);
    try {
      const res = await fetch(`/api/leads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      if (!res.ok) throw new Error();
      toast("הסטטוס עודכן בהצלחה", "success");
      router.refresh();
    } catch {
      setStatus(prev);
      toast("שגיאה בעדכון הסטטוס", "error");
    } finally {
      setSaving(false);
    }
  }

  async function onDelete() {
    if (!confirm(`למחוק את הפנייה של ${customerName || "הלקוח"}?`)) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/leads/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast("הפנייה נמחקה", "success");
      router.refresh();
    } catch {
      toast("שגיאה במחיקת הפנייה", "error");
      setDeleting(false);
    }
  }

  const badgeColor = LEAD_STATUS_COLORS[status] ?? "bg-muted text-muted-foreground";

  return (
    <div className="flex items-center gap-1.5">
      <span
        dir="rtl"
        className={cn(
          "relative inline-flex items-center gap-1 rounded-full pr-2 pl-6 py-0.5 text-[11px] font-semibold cursor-pointer whitespace-nowrap",
          badgeColor,
          saving && "opacity-60"
        )}
      >
        {LEAD_STATUS_LABELS[status] ?? status}
        <ChevronDown
          size={11}
          className="absolute left-1.5 top-1/2 -translate-y-1/2 pointer-events-none opacity-70"
        />
        <select
          dir="rtl"
          value={status}
          onChange={onChangeStatus}
          disabled={saving}
          aria-label="שינוי סטטוס"
          className="absolute inset-0 opacity-0 cursor-pointer"
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </span>
      <button
        type="button"
        onClick={onDelete}
        disabled={deleting}
        aria-label="מחק פנייה"
        className="w-7 h-7 rounded-full flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-40"
      >
        <Trash2 size={13} />
      </button>
    </div>
  );
}
