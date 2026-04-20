import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

export type BarItem = { label: string; count: number };

interface AnalyticsCardProps {
  title: string;
  subtitle?: string;
  icon: LucideIcon;
  items: BarItem[];
  colorClass?: string;
  emptyText?: string;
}

export default function AnalyticsCard({
  title,
  subtitle,
  icon: Icon,
  items,
  colorClass = "bg-blue-500",
  emptyText = "אין נתונים עדיין",
}: AnalyticsCardProps) {
  const max = Math.max(...items.map((i) => i.count), 1);

  return (
    <div className="bg-card rounded-2xl border border-border shadow-[0_1px_3px_rgba(0,0,0,0.07),0_4px_16px_rgba(0,0,0,0.06)] p-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-semibold text-card-foreground">{title}</p>
          {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
        </div>
        <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
          <Icon size={15} className="text-muted-foreground" />
        </div>
      </div>

      {/* Bars */}
      {items.length === 0 ? (
        <p className="text-xs text-muted-foreground text-center py-6">{emptyText}</p>
      ) : (
        <div className="flex flex-col gap-3" dir="ltr">
          {items.map(({ label, count }) => {
            const pct = Math.round((count / max) * 100);
            return (
              <div key={label} className="flex items-center gap-3">
                <div className="flex-1 flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <span
                      className="text-xs font-medium text-card-foreground truncate max-w-[160px]"
                      dir="rtl"
                    >
                      {label}
                    </span>
                    <span className="text-xs font-bold text-muted-foreground">{count}</span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div
                      className={cn("h-full rounded-full transition-all duration-700", colorClass)}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
