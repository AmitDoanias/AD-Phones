import { createClient } from "@/lib/supabase/server";
import type { LeadStatus } from "@/types";
import { MessageSquare, Phone } from "lucide-react";
import LeadActions from "./LeadActions";

function formatDate(d: string) {
  return new Date(d).toLocaleString("he-IL", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

type FormData = {
  device?: string;
  appleType?: string;
  modelName?: string;
  message?: string;
};

function deviceLabel(fd: unknown): string {
  if (!fd || typeof fd !== "object") return "";
  const d = fd as FormData;
  if (!d.device) return "";
  if (d.device === "apple") {
    const type = d.appleType === "iphone" ? "iPhone" : d.appleType === "ipad" ? "iPad" : "Apple";
    return d.modelName ? `${type} ${d.modelName}` : type;
  }
  return d.modelName ? `Samsung ${d.modelName}` : "Samsung";
}

export default async function LeadsPage() {
  const supabase = await createClient();

  const { data: leads, error } = await supabase
    .from("leads")
    .select("id, customer_name, customer_phone, form_data, status, created_at, notes")
    .order("created_at", { ascending: false });

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[14px] font-semibold text-slate-800">פניות</p>
          <p className="text-[12px] text-muted-foreground mt-0.5">
            {leads?.length ?? 0} פניות סה״כ
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-sm text-red-700">
          שגיאה בטעינת הפניות: {error.message}
        </div>
      )}

      {!leads || leads.length === 0 ? (
        <div className="bg-card rounded-2xl border border-border shadow-[0_1px_4px_rgba(0,0,0,0.06),0_4px_20px_rgba(0,0,0,0.05)] p-14 text-center">
          <MessageSquare size={28} className="text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">אין פניות עדיין</p>
        </div>
      ) : (
        <div className="bg-card rounded-2xl border border-border shadow-[0_1px_4px_rgba(0,0,0,0.06),0_4px_20px_rgba(0,0,0,0.05)] overflow-hidden">
          {/* Table header */}
          <div className="border-b border-border bg-muted/40 grid grid-cols-[1fr_auto_auto_auto] gap-4 px-5 py-3">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">לקוח</p>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide hidden sm:block">מכשיר</p>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">סטטוס</p>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide hidden md:block">תאריך</p>
          </div>

          {/* Rows */}
          <div className="divide-y divide-border/60">
            {leads.map((lead) => {
              const fd = lead.form_data as FormData | null;
              const status = (lead.status ?? "new") as LeadStatus;
              const device = deviceLabel(fd);
              const msg = fd?.message;

              return (
                <div key={lead.id} className="hover:bg-muted/20 transition-colors">
                  {/* Main row */}
                  <div className="grid grid-cols-[1fr_auto_auto_auto] gap-4 px-5 py-4 items-start">
                    {/* Customer */}
                    <div className="min-w-0">
                      <p className="text-[13px] font-semibold text-card-foreground truncate">
                        {lead.customer_name ?? "ללא שם"}
                      </p>
                      {lead.customer_phone && (
                        <a
                          href={`tel:${lead.customer_phone}`}
                          className="flex items-center gap-1 text-[11px] text-muted-foreground mt-0.5 hover:text-primary transition-colors w-fit"
                          dir="ltr"
                        >
                          <Phone size={10} />
                          {lead.customer_phone}
                        </a>
                      )}
                      {msg && (
                        <p className="text-[11px] text-muted-foreground mt-1.5 leading-relaxed line-clamp-2">
                          {msg}
                        </p>
                      )}
                    </div>

                    {/* Device */}
                    <div className="hidden sm:block">
                      {device ? (
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-100 whitespace-nowrap">
                          {device}
                        </span>
                      ) : (
                        <span className="text-[11px] text-muted-foreground">—</span>
                      )}
                    </div>

                    {/* Status + delete */}
                    <div className="self-start">
                      <LeadActions
                        id={lead.id}
                        initialStatus={status}
                        customerName={lead.customer_name ?? ""}
                      />
                    </div>

                    {/* Date */}
                    <span className="text-[11px] text-muted-foreground hidden md:block self-start whitespace-nowrap">
                      {formatDate(lead.created_at)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
