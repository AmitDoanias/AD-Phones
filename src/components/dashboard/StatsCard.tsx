import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color?: "blue" | "green" | "yellow" | "purple";
  sub?: string;
}

const colorMap = {
  blue: "bg-blue-50 text-blue-600",
  green: "bg-green-50 text-green-600",
  yellow: "bg-yellow-50 text-yellow-600",
  purple: "bg-purple-50 text-purple-600",
};

export default function StatsCard({
  title,
  value,
  icon: Icon,
  color = "blue",
  sub,
}: StatsCardProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 flex items-center gap-4 shadow-sm">
      <div className={`rounded-xl p-3 ${colorMap[color]}`}>
        <Icon size={22} />
      </div>
      <div>
        <p className="text-sm text-slate-500 font-medium">{title}</p>
        <p className="text-2xl font-bold text-slate-800">{value}</p>
        {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}
