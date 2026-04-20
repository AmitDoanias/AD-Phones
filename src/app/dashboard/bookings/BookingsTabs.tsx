"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown, ChevronLeft } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";

export type Booking = {
  id: string;
  customer_name: string;
  customer_phone: string;
  service_type: string;
  total_price: number;
  status: string;
  created_at: string;
  scheduled_at: string | null;
};

const STATUS_TABS = [
  { key: "all",         label: "הכל" },
  { key: "today",       label: "היום" },
  { key: "received",    label: "חדש" },
  { key: "in_progress", label: "בטיפול" },
  { key: "done",        label: "הושלם" },
  { key: "cancelled",   label: "בוטל" },
];

const STATUS_BADGE: Record<string, string> = {
  received:    "bg-amber-50 text-amber-700 border border-amber-100",
  in_progress: "bg-blue-50 text-blue-700 border border-blue-100",
  done:        "bg-emerald-50 text-emerald-700 border border-emerald-100",
  cancelled:   "bg-slate-100 text-slate-500 border border-slate-200",
};

const STATUS_LABEL: Record<string, string> = {
  received:    "חדש",
  in_progress: "בטיפול",
  done:        "הושלם",
  cancelled:   "בוטל",
};

const STATUS_OPTIONS = [
  { value: "received",    label: "חדש" },
  { value: "in_progress", label: "בטיפול" },
  { value: "done",        label: "הושלם" },
  { value: "cancelled",   label: "בוטל" },
];

function StatusSelect({ id, value }: { id: string; value: string }) {
  const router = useRouter();
  const [status, setStatus] = useState(value);
  const [saving, setSaving] = useState(false);

  async function onChange(e: React.ChangeEvent<HTMLSelectElement>) {
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

  const badgeCls =
    STATUS_BADGE[status] ?? "bg-muted text-muted-foreground border border-border";

  return (
    <span
      dir="rtl"
      className={cn(
        "relative inline-flex items-center gap-1 rounded-full pr-2 pl-6 py-0.5 text-[11px] font-semibold cursor-pointer",
        badgeCls,
        saving && "opacity-60"
      )}
    >
      {STATUS_LABEL[status] ?? status}
      <ChevronDown size={12} className="absolute left-1.5 top-1/2 -translate-y-1/2 pointer-events-none opacity-70" />
      <select
        dir="rtl"
        value={status}
        onChange={onChange}
        disabled={saving}
        aria-label="שינוי סטטוס"
        className="absolute inset-0 opacity-0 cursor-pointer"
      >
        {STATUS_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </span>
  );
}

const SERVICE_LABEL: Record<string, string> = {
  lab:        "מעבדה",
  technician: "טכנאי בית",
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("he-IL", {
    day: "2-digit", month: "2-digit", year: "numeric",
  });
}

const todayStr = () => new Date().toDateString();

function getFiltered(bookings: Booking[], key: string) {
  if (key === "all")   return bookings;
  if (key === "today") return bookings.filter((b) => new Date(b.created_at).toDateString() === todayStr());
  return bookings.filter((b) => b.status === key);
}

function BookingTable({ bookings }: { bookings: Booking[] }) {
  if (bookings.length === 0) {
    return (
      <div className="bg-card rounded-2xl border border-border shadow-[0_1px_4px_rgba(0,0,0,0.06)] p-12 text-center">
        <p className="text-sm text-muted-foreground">אין הזמנות להציג</p>
      </div>
    );
  }
  return (
    <div dir="rtl" className="bg-card rounded-2xl border border-border shadow-[0_1px_4px_rgba(0,0,0,0.06),0_4px_20px_rgba(0,0,0,0.05)] overflow-hidden">
      <table dir="rtl" className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/40">
            <th className="text-right px-5 py-3 text-[10px] font-bold text-muted-foreground uppercase tracking-wide">מס׳</th>
            <th className="text-right px-4 py-3 text-[10px] font-bold text-muted-foreground uppercase tracking-wide">שם לקוח</th>
            <th className="text-right px-4 py-3 text-[10px] font-bold text-muted-foreground uppercase tracking-wide hidden md:table-cell">טלפון</th>
            <th className="text-right px-4 py-3 text-[10px] font-bold text-muted-foreground uppercase tracking-wide hidden lg:table-cell">שירות</th>
            <th className="text-right px-4 py-3 text-[10px] font-bold text-muted-foreground uppercase tracking-wide">סה״כ</th>
            <th className="text-right px-4 py-3 text-[10px] font-bold text-muted-foreground uppercase tracking-wide">סטטוס</th>
            <th className="text-right px-4 py-3 text-[10px] font-bold text-muted-foreground uppercase tracking-wide hidden md:table-cell">תאריך</th>
            <th className="px-5 py-3 w-12" />
          </tr>
        </thead>
        <tbody className="divide-y divide-border/60">
          {bookings.map((booking) => (
            <tr key={booking.id} className="hover:bg-muted/30 transition-colors">
              <td className="text-right px-5 py-3.5">
                <span className="font-mono text-[11px] font-semibold text-muted-foreground">
                  #{booking.id.slice(-8).toUpperCase()}
                </span>
              </td>
              <td className="text-right px-4 py-3.5 font-semibold text-[13px] text-card-foreground">
                {booking.customer_name}
              </td>
              <td className="text-right px-4 py-3.5 text-[12px] text-muted-foreground hidden md:table-cell" dir="ltr">
                {booking.customer_phone}
              </td>
              <td className="text-right px-4 py-3.5 text-[12px] text-muted-foreground hidden lg:table-cell">
                {SERVICE_LABEL[booking.service_type] ?? booking.service_type}
              </td>
              <td className="text-right px-4 py-3.5 font-semibold text-[13px] text-card-foreground">
                ₪{booking.total_price?.toLocaleString("he-IL") ?? "—"}
              </td>
              <td className="text-right px-4 py-3.5">
                <StatusSelect id={booking.id} value={booking.status} />
              </td>
              <td className="text-right px-4 py-3.5 text-[12px] text-muted-foreground hidden md:table-cell">
                {formatDate(booking.created_at)}
              </td>
              <td className="text-right px-5 py-3.5">
                <Link
                  href={`/dashboard/bookings/${booking.id}`}
                  className="inline-flex items-center gap-0.5 text-[#0071e3] text-xs font-semibold hover:underline"
                >
                  צפה
                  <ChevronLeft size={12} />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function BookingsTabs({
  bookings,
  initialTab = "all",
}: {
  bookings: Booking[];
  initialTab?: string;
}) {
  const [activeTab, setActiveTab] = useState(initialTab);

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="flex-wrap h-auto">
        {STATUS_TABS.map((tab) => {
          const count = getFiltered(bookings, tab.key).length;
          return (
            <TabsTrigger key={tab.key} value={tab.key} className="gap-1.5">
              {tab.label}
              <span className={cn(
                "text-[10px] px-1.5 py-0.5 rounded-full font-bold min-w-[18px] text-center leading-none",
                activeTab === tab.key
                  ? "bg-primary/10 text-primary"
                  : "bg-border/80 text-muted-foreground"
              )}>
                {count}
              </span>
            </TabsTrigger>
          );
        })}
      </TabsList>

      {STATUS_TABS.map((tab) => (
        <TabsContent key={tab.key} value={tab.key}>
          <BookingTable bookings={getFiltered(bookings, tab.key)} />
        </TabsContent>
      ))}
    </Tabs>
  );
}
