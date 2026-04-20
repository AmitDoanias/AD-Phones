import Link from "next/link";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color?: "blue" | "green" | "yellow" | "purple";
  trend?: number;       // positive = up, negative = down (percent)
  sparkline?: number[]; // 7-point data for mini chart
  href?: string;
}

const iconBgMap = {
  blue:   "bg-blue-50 text-blue-500",
  green:  "bg-emerald-50 text-emerald-500",
  yellow: "bg-amber-50 text-amber-500",
  purple: "bg-violet-50 text-violet-500",
};

const sparkColorMap = {
  blue:   { stroke: "#3b82f6", fill: "#3b82f6" },
  green:  { stroke: "#10b981", fill: "#10b981" },
  yellow: { stroke: "#f59e0b", fill: "#f59e0b" },
  purple: { stroke: "#8b5cf6", fill: "#8b5cf6" },
};

function Sparkline({ data, color }: { data: number[]; color: "blue" | "green" | "yellow" | "purple" }) {
  if (!data || data.length < 2) return null;

  const W = 72;
  const H = 28;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * W;
    const y = H - ((v - min) / range) * (H - 4) - 2;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });

  const { stroke, fill } = sparkColorMap[color];
  const polyPoints = points.join(" ");

  // Build filled area polygon
  const areaPoints = [
    `0,${H}`,
    ...points,
    `${W},${H}`,
  ].join(" ");

  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} className="shrink-0">
      <polygon points={areaPoints} fill={fill} fillOpacity={0.12} />
      <polyline
        points={polyPoints}
        fill="none"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CardContent({
  title,
  value,
  icon: Icon,
  color = "blue",
  trend,
  sparkline,
  clickable,
}: StatsCardProps & { clickable?: boolean }) {
  const isUp = trend !== undefined && trend >= 0;
  const TrendIcon = isUp ? TrendingUp : TrendingDown;

  return (
    <div
      className={cn(
        "bg-white rounded-2xl border border-slate-200/80 p-5 flex flex-col gap-3",
        "shadow-[0_1px_4px_rgba(0,0,0,0.06),0_4px_20px_rgba(0,0,0,0.05)]",
        clickable &&
          "hover:shadow-[0_4px_24px_rgba(0,0,0,0.11)] hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group"
      )}
    >
      {/* Top row: icon + sparkline */}
      <div className="flex items-start justify-between">
        <div className={cn("rounded-xl p-2.5 shrink-0", iconBgMap[color])}>
          <Icon size={18} />
        </div>
        {sparkline && sparkline.length >= 2 && (
          <Sparkline data={sparkline} color={color} />
        )}
      </div>

      {/* Value + title */}
      <div>
        <p className="text-[28px] font-bold text-slate-900 leading-none tracking-tight">{value}</p>
        <p className="text-[12px] text-slate-500 mt-1 font-medium">{title}</p>
      </div>

      {/* Trend badge */}
      {trend !== undefined && (
        <div className="flex items-center gap-1.5">
          <span
            className={cn(
              "inline-flex items-center gap-1 text-[11px] font-semibold px-1.5 py-0.5 rounded-md",
              isUp
                ? "bg-emerald-50 text-emerald-600"
                : "bg-red-50 text-red-500"
            )}
          >
            <TrendIcon size={10} />
            {Math.abs(trend)}%
          </span>
          <span className="text-[11px] text-slate-400">מול השבוע שעבר</span>
        </div>
      )}
    </div>
  );
}

export default function StatsCard(props: StatsCardProps) {
  if (props.href) {
    return (
      <Link href={props.href} className="block">
        <CardContent {...props} clickable />
      </Link>
    );
  }
  return <CardContent {...props} />;
}
