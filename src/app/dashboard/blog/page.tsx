import Link from "next/link";
import { BookOpen, Plus, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function BlogDashboardPage() {
  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[14px] font-semibold text-slate-800">ניהול בלוג</p>
          <p className="text-[12px] text-muted-foreground mt-0.5">יצירת ועריכת פוסטים</p>
        </div>
        <Button size="sm" disabled>
          <Plus size={14} />
          פוסט חדש
        </Button>
      </div>

      {/* Empty state card */}
      <Card>
        <CardContent className="py-16 flex flex-col items-center text-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center">
            <BookOpen size={24} className="text-muted-foreground/50" />
          </div>
          <div>
            <p className="text-[14px] font-semibold text-card-foreground mb-1">אין פוסטים עדיין</p>
            <p className="text-[12px] text-muted-foreground max-w-xs mx-auto leading-relaxed">
              בקרוב תוכל לנהל ולפרסם פוסטים בבלוג ישירות מכאן עם עורך טקסט עשיר
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Coming soon features */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { icon: FileText, label: "עורך טקסט עשיר", desc: "Tiptap + תמונות" },
          { icon: BookOpen, label: "תזמון פרסום",    desc: "פרסום אוטומטי לפי תאריך" },
          { icon: Plus,     label: "AI תוכן",        desc: "יצירת תוכן חכמה" },
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
