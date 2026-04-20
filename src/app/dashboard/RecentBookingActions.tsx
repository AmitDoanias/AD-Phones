"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, Trash2 } from "lucide-react";
import { toast } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";

const STATUS_OPTIONS = [
  { value: "received",    label: "חדש" },
  { value: "in_progress", label: "בטיפול" },
  { value: "done",        label: "הושלם" },
  { value: "cancelled",   label: "בוטל" },
];

const STATUS_LABELS: Record<string, string> = {
  received:    "חדש",
  in_progress: "בטיפול",
  done:        "הושלם",
  cancelled:   "בוטל",
};

const STATUS_COLORS: Record<string, string> = {
  received:    "bg-amber-50 text-amber-700 border-amber-100",
  in_progress: "bg-blue-50 text-blue-700 border-blue-100",
  done:        "bg-emerald-50 text-emerald-700 border-emerald-100",
  cancelled:   "bg-slate-100 text-slate-500 border-slate-200",
};

interface Props {
  id: string;
  initialStatus: string;
  customerName: string;
}

export default function RecentBookingActions({ id, initialStatus, customerName }: Props) {
  const router = useRouter();
  const [status, setStatus] = useState(initialStatus);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function onChangeStatus(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = e.target.value;
    const prev = status;
    setStatus(next);
    setSaving(true);
    try {
      const res = await fetch(`/api/bookings/${id}`, {
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
    if (!confirm(`למחוק את ההזמנה של ${customerName || "הלקוח"}?`)) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/bookings/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast("ההזמנה נמחקה", "success");
      router.refresh();
    } catch {
      toast("שגיאה במחיקת ההזמנה", "error");
      setDeleting(false);
    }
  }

  return (
    <div className="flex items-center gap-1.5">
      <span
        dir="rtl"
        className={cn(
          "relative inline-flex items-center gap-1 rounded-full pr-2 pl-6 py-0.5 text-[11px] font-semibold border cursor-pointer whitespace-nowrap",
          STATUS_COLORS[status] ?? "bg-slate-100 text-slate-500 border-slate-200",
          saving && "opacity-60"
        )}
      >
        {STATUS_LABELS[status] ?? status}
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
        aria-label="מחק הזמנה"
        className="w-6 h-6 rounded-full flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-40"
      >
        <Trash2 size={12} />
      </button>
    </div>
  );
}
