"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from "recharts";

// ── Area Chart (monthly revenue/bookings) ────────────────────────────────────

interface MonthlyPoint {
  month: string;  // e.g. "ינו׳"
  bookings: number;
  revenue: number;
}

interface SalesAreaChartProps {
  data: MonthlyPoint[];
}

const CustomAreaTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number; name: string }[];
  label?: string;
}) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-lg px-3.5 py-2.5 text-right" dir="rtl">
      <p className="text-[11px] font-semibold text-slate-500 mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.name} className="text-[13px] font-bold text-slate-800">
          {p.name === "revenue" ? `₪${p.value.toLocaleString()}` : `${p.value} הזמנות`}
        </p>
      ))}
    </div>
  );
};

export function SalesAreaChart({ data }: SalesAreaChartProps) {
  return (
    <ResponsiveContainer width="100%" height={180}>
      <AreaChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#0071e3" stopOpacity={0.18} />
            <stop offset="95%" stopColor="#0071e3" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
        <XAxis
          dataKey="month"
          tick={{ fontSize: 11, fill: "#94a3b8", fontFamily: "inherit" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: "#94a3b8", fontFamily: "inherit" }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip content={<CustomAreaTooltip />} cursor={{ stroke: "#e2e8f0", strokeWidth: 1 }} />
        <Area
          type="monotone"
          dataKey="revenue"
          stroke="#0071e3"
          strokeWidth={2}
          fill="url(#colorRevenue)"
          dot={false}
          activeDot={{ r: 4, fill: "#0071e3", strokeWidth: 0 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

// ── Bar Chart (top repairs) ──────────────────────────────────────────────────

interface RepairItem {
  label: string;
  count: number;
}

interface RepairsBarChartProps {
  data: RepairItem[];
}

const BAR_COLORS = ["#0071e3", "#3b82f6", "#60a5fa", "#93c5fd", "#bfdbfe", "#dbeafe"];

const CustomBarTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { value: number; payload: RepairItem }[];
}) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-lg px-3.5 py-2.5 text-right" dir="rtl">
      <p className="text-[11px] text-slate-500">{payload[0].payload.label}</p>
      <p className="text-[13px] font-bold text-slate-800">{payload[0].value} הזמנות</p>
    </div>
  );
};

export function RepairsBarChart({ data }: RepairsBarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={180}>
      <BarChart data={data} layout="vertical" margin={{ top: 0, right: 4, left: 0, bottom: 0 }}>
        <XAxis
          type="number"
          tick={{ fontSize: 11, fill: "#94a3b8", fontFamily: "inherit" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          type="category"
          dataKey="label"
          width={90}
          tick={{ fontSize: 11, fill: "#64748b", fontFamily: "inherit" }}
          axisLine={false}
          tickLine={false}
        />
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
        <Tooltip content={<CustomBarTooltip />} cursor={{ fill: "#f8fafc" }} />
        <Bar dataKey="count" radius={[0, 6, 6, 0]} maxBarSize={20}>
          {data.map((_, index) => (
            <Cell key={index} fill={BAR_COLORS[index % BAR_COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
