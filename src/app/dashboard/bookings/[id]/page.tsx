import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import BookingManager from "./BookingManager";
import { cn } from "@/lib/utils";

const STATUS_BADGE: Record<string, string> = {
  received:    "bg-amber-50 text-amber-700 border border-amber-200",
  in_progress: "bg-blue-50 text-blue-700 border border-blue-200",
  done:        "bg-emerald-50 text-emerald-700 border border-emerald-200",
  cancelled:   "bg-muted text-muted-foreground border border-border",
};

const STATUS_LABEL: Record<string, string> = {
  received:    "חדש",
  in_progress: "בטיפול",
  done:        "הושלם",
  cancelled:   "בוטל",
};

const SERVICE_LABEL: Record<string, string> = {
  lab:        "מעבדה",
  technician: "טכנאי בית",
};

function formatDateTime(dateStr: string) {
  return new Date(dateStr).toLocaleString("he-IL", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4">
      {children}
    </p>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[11px] text-muted-foreground mb-1">{label}</p>
      <div className="text-sm font-medium text-card-foreground">{children}</div>
    </div>
  );
}

export default async function BookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: booking } = await supabase
    .from("bookings")
    .select(
      "id, customer_name, customer_phone, service_type, technician_fee, notes, total_price, status, created_at, scheduled_at"
    )
    .eq("id", id)
    .single();

  if (!booking) notFound();

  const { data: items } = await supabase
    .from("booking_items")
    .select("id, model_name, repair_name, price_at_booking")
    .eq("booking_id", booking.id);

  const bookingRef = `#${booking.id.slice(-8).toUpperCase()}`;
  const cardCls = "bg-card rounded-2xl border border-border shadow-[0_1px_3px_rgba(0,0,0,0.07),0_4px_16px_rgba(0,0,0,0.06)] p-5";

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/bookings"
            className="text-xs text-muted-foreground hover:text-card-foreground transition-colors flex items-center gap-0.5"
          >
            <ChevronLeft size={13} className="rotate-180" />
            הזמנות
          </Link>
          <span className="text-muted-foreground/30 text-sm">/</span>
          <span className="font-mono text-sm font-semibold text-card-foreground">{bookingRef}</span>
        </div>
        <span
          className={cn(
            "inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold",
            STATUS_BADGE[booking.status] ?? "bg-muted text-muted-foreground"
          )}
        >
          {STATUS_LABEL[booking.status] ?? booking.status}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
        {/* Details column */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {/* Customer */}
          <div className={cardCls}>
            <SectionLabel>פרטי לקוח</SectionLabel>
            <div className="grid grid-cols-2 gap-5">
              <Field label="שם">{booking.customer_name}</Field>
              <Field label="טלפון">
                <a href={`tel:${booking.customer_phone}`} className="text-[#0071e3] hover:underline" dir="ltr">
                  {booking.customer_phone}
                </a>
              </Field>
            </div>
          </div>

          {/* Booking info */}
          <div className={cardCls}>
            <SectionLabel>פרטי הזמנה</SectionLabel>
            <div className="grid grid-cols-2 gap-5">
              <Field label="מספר הזמנה">
                <span className="font-mono">{bookingRef}</span>
              </Field>
              <Field label="סוג שירות">
                {SERVICE_LABEL[booking.service_type] ?? booking.service_type}
              </Field>
              <Field label="נוצר ב">{formatDateTime(booking.created_at)}</Field>
              {booking.scheduled_at && (
                <Field label="מועד תיקון">{formatDateTime(booking.scheduled_at)}</Field>
              )}
            </div>
            {booking.notes && (
              <div className="mt-5 pt-4 border-t border-border">
                <p className="text-[11px] text-muted-foreground mb-1.5">הערות</p>
                <p className="text-sm text-card-foreground leading-relaxed">{booking.notes}</p>
              </div>
            )}
          </div>

          {/* Items table */}
          <div className="bg-card rounded-2xl border border-border shadow-[0_1px_3px_rgba(0,0,0,0.07),0_4px_16px_rgba(0,0,0,0.06)] overflow-hidden">
            <div className="px-5 py-4 border-b border-border/60">
              <SectionLabel>פריטי הזמנה</SectionLabel>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/40 border-b border-border/60">
                  <th className="text-right px-5 py-2.5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">דגם</th>
                  <th className="text-right px-5 py-2.5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">תיקון</th>
                  <th className="text-right px-5 py-2.5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">מחיר</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {(items ?? []).map((item) => (
                  <tr key={item.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-5 py-3.5 font-semibold text-card-foreground">{item.model_name}</td>
                    <td className="px-5 py-3.5 text-muted-foreground">{item.repair_name}</td>
                    <td className="px-5 py-3.5 font-semibold text-card-foreground">₪{item.price_at_booking.toLocaleString("he-IL")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="px-5 py-4 border-t border-border bg-muted/30 flex flex-col gap-2">
              {booking.technician_fee > 0 && (
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>דמי טכנאי</span>
                  <span>₪{booking.technician_fee.toLocaleString("he-IL")}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-bold text-card-foreground">
                <span>סה״כ לתשלום</span>
                <span>₪{booking.total_price.toLocaleString("he-IL")}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Management panel */}
        <BookingManager
          bookingId={booking.id}
          bookingRef={bookingRef}
          customerName={booking.customer_name}
          customerPhone={booking.customer_phone}
          initialStatus={booking.status}
          initialScheduledAt={booking.scheduled_at}
          items={items ?? []}
        />
      </div>
    </div>
  );
}
