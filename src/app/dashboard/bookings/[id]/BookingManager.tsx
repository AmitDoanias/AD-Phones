"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MessageCircle, Save } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";

const STATUS_OPTIONS = [
  { value: "received",    label: "חדש" },
  { value: "in_progress", label: "בטיפול" },
  { value: "done",        label: "הושלם" },
  { value: "cancelled",   label: "בוטל" },
];

const STATUS_LABEL: Record<string, string> = {
  received:    "חדש",
  in_progress: "בטיפול",
  done:        "הושלם",
  cancelled:   "בוטל",
};

type Item = {
  id: string;
  model_name: string;
  repair_name: string;
  price_at_booking: number;
};

interface Props {
  bookingId: string;
  bookingRef: string;
  customerName: string;
  customerPhone: string;
  initialStatus: string;
  initialScheduledAt: string | null;
  items: Item[];
}

function toDateTimeLocal(isoString: string | null): string {
  if (!isoString) return "";
  const d = new Date(isoString);
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

const selectCls =
  "w-full h-10 px-3 py-2 rounded-xl border border-border bg-background text-sm text-card-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring transition-shadow";

export default function BookingManager({
  bookingId,
  bookingRef,
  customerName,
  customerPhone,
  initialStatus,
  initialScheduledAt,
  items,
}: Props) {
  const router = useRouter();
  const [status, setStatus] = useState(initialStatus);
  const [scheduledAt, setScheduledAt] = useState(toDateTimeLocal(initialScheduledAt));
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          scheduled_at: scheduledAt ? new Date(scheduledAt).toISOString() : null,
        }),
      });
      if (!res.ok) throw new Error("Failed");
      toast("ההזמנה נשמרה בהצלחה", "success");
      router.refresh();
    } catch {
      toast("שגיאה בשמירה - נסה שוב", "error");
    } finally {
      setSaving(false);
    }
  }

  function buildWhatsAppUrl() {
    const digits = customerPhone.replace(/\D/g, "");
    const intlPhone = digits.startsWith("972") ? digits : "972" + digits.replace(/^0/, "");
    const repairList = items.map((i) => `• ${i.model_name} - ${i.repair_name}`).join("\n");
    const scheduledText = scheduledAt
      ? `\n📅 מועד: ${new Date(scheduledAt).toLocaleString("he-IL", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })}`
      : "";
    const msg = [
      `שלום ${customerName},`,
      `הזמנתך ${bookingRef} קיבלה סטטוס: *${STATUS_LABEL[status] ?? status}*`,
      "",
      "תיקונים:",
      repairList,
      scheduledText,
      "",
      "לשאלות: 053-483-2573",
      "A&D Phones 🔧",
    ].join("\n").trim();
    return `https://wa.me/${intlPhone}?text=${encodeURIComponent(msg)}`;
  }

  return (
    <div className="bg-card rounded-2xl border border-border shadow-[0_1px_4px_rgba(0,0,0,0.06),0_4px_20px_rgba(0,0,0,0.05)] p-5 flex flex-col gap-4 sticky top-6">
      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
        ניהול הזמנה
      </p>

      {/* Status */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="status">סטטוס</Label>
        <select
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className={selectCls}
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {/* Date/time */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="scheduledAt">מועד תיקון</Label>
        <input
          id="scheduledAt"
          type="datetime-local"
          value={scheduledAt}
          onChange={(e) => setScheduledAt(e.target.value)}
          className={selectCls}
        />
      </div>

      {/* Save button */}
      <Button
        onClick={handleSave}
        disabled={saving}
        loading={saving}
        className="w-full"
      >
        {!saving && <Save size={14} />}
        שמור שינויים
      </Button>

      <div className="border-t border-border" />

      {/* WhatsApp */}
      <a
        href={buildWhatsAppUrl()}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl text-sm font-semibold text-white",
          "transition-opacity hover:opacity-90 active:scale-[0.98]"
        )}
        style={{ background: "#25d366" }}
      >
        <MessageCircle size={14} /> שלח WhatsApp ללקוח
      </a>
    </div>
  );
}
