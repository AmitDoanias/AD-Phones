import { Calendar, Clock, CalendarCheck, Settings } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";

export default function CalendarPage() {
  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div>
        <p className="text-[14px] font-semibold text-slate-800">לוח זמנים</p>
        <p className="text-[12px] text-muted-foreground mt-0.5">ניהול זמינות ותורים</p>
      </div>

      {/* Empty state */}
      <Card>
        <CardContent className="py-16 flex flex-col items-center text-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center">
            <Calendar size={24} className="text-muted-foreground/50" />
          </div>
          <div>
            <p className="text-[14px] font-semibold text-card-foreground mb-1">לוח הזמנים בפיתוח</p>
            <p className="text-[12px] text-muted-foreground max-w-xs mx-auto leading-relaxed">
              בקרוב תוכל לנהל זמינות, לחסום שעות ולראות את כל התורים בתצוגה שבועית
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Coming soon */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { icon: CalendarCheck, label: "תצוגת לוח",    desc: "שבועי / חודשי" },
          { icon: Clock,         label: "שעות פעילות",  desc: "הגדרת זמינות" },
          { icon: Settings,      label: "חסימת זמנים",  desc: "חופשות וסגירות" },
        ].map(({ icon: Icon, label, desc }) => (
          <div key={label} className="bg-card rounded-2xl border border-border p-4 flex items-center gap-3 opacity-60">
            <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
              <Icon size={15} className="text-muted-foreground" />
            </div>
            <div>
              <p className="text-[12px] font-semibold text-card-foreground">{label}</p>
              <p className="text-[11px] text-muted-foreground">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
