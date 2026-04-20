import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import StatsCard from "@/components/dashboard/StatsCard";
import { SalesAreaChart, RepairsBarChart } from "@/components/dashboard/SalesChart";
import RecentBookingActions from "./RecentBookingActions";
import {
  CalendarCheck,
  Clock,
  CheckCircle,
  Users,
  Phone,
  ArrowLeft,
  Wallet,
} from "lucide-react";

// ── Helpers ──────────────────────────────────────────────────────────────────

type FormData = { device?: string; appleType?: string; modelName?: string };

const MONTH_NAMES = [
  "ינו׳", "פבר׳", "מרץ", "אפר׳", "מאי", "יוני",
  "יולי", "אוג׳", "ספט׳", "אוק׳", "נוב׳", "דצמ׳",
];

const STATUS_LABELS: Record<string, string> = {
  received:    "חדש",
  in_progress: "בטיפול",
  done:        "הושלם",
  cancelled:   "בוטל",
};

const STATUS_COLORS: Record<string, string> = {
  received:    "bg-amber-50 text-amber-700 border-amber-100",
  in_progress: "bg-blue-50 text-blue-700 border-blue-100",
  done:        "bg-emerald-50 text-emerald-700 border-emerald-100",
  cancelled:   "bg-slate-100 text-slate-500 border-slate-200",
};

const LEAD_STATUS_LABELS: Record<string, string> = {
  new:       "חדשה",
  contacted: "נוצר קשר",
  converted: "הומר",
  closed:    "סגור",
};

const LEAD_STATUS_COLORS: Record<string, string> = {
  new:       "bg-blue-50 text-blue-700 border-blue-100",
  contacted: "bg-amber-50 text-amber-700 border-amber-100",
  converted: "bg-emerald-50 text-emerald-700 border-emerald-100",
  closed:    "bg-slate-100 text-slate-500 border-slate-200",
};

function topN(map: Record<string, number>, n: number) {
  return Object.entries(map)
    .sort(([, a], [, b]) => b - a)
    .slice(0, n)
    .map(([label, count]) => ({ label, count }));
}

function groupByDay(rows: { created_at: string }[], days = 7): number[] {
  const counts = Array(days).fill(0);
  const now = new Date();
  for (const row of rows) {
    const d = new Date(row.created_at);
    const diffDays = Math.floor((now.getTime() - d.getTime()) / 86400000);
    if (diffDays >= 0 && diffDays < days) {
      counts[days - 1 - diffDays]++;
    }
  }
  return counts;
}

function groupByMonth(
  rows: { created_at: string; total_price?: number | null }[],
  months = 6
): { month: string; bookings: number; revenue: number }[] {
  const result: { month: string; bookings: number; revenue: number }[] = [];
  const now = new Date();

  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    result.push({
      month: MONTH_NAMES[d.getMonth()],
      bookings: 0,
      revenue: 0,
    });
  }

  for (const row of rows) {
    const d = new Date(row.created_at);
    const monthsAgo =
      (now.getFullYear() - d.getFullYear()) * 12 +
      (now.getMonth() - d.getMonth());
    const idx = months - 1 - monthsAgo;
    if (idx >= 0 && idx < months) {
      result[idx].bookings++;
      result[idx].revenue += row.total_price ?? 0;
    }
  }

  return result;
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("he-IL", {
    day: "2-digit",
    month: "2-digit",
  });
}

function deviceLabel(fd: unknown): string {
  if (!fd || typeof fd !== "object") return "";
  const d = fd as FormData;
  if (!d.device) return "";
  if (d.device === "apple") {
    const type =
      d.appleType === "iphone" ? "iPhone" :
      d.appleType === "ipad"   ? "iPad"   : "Apple";
    return d.modelName ? `${type} ${d.modelName}` : type;
  }
  return d.modelName ? `Samsung ${d.modelName}` : "Samsung";
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default async function DashboardPage() {
  const supabase = await createClient();

  const today      = new Date();
  const todayStr   = today.toISOString().split("T")[0];
  const weekAgo    = new Date(today); weekAgo.setDate(today.getDate() - 7);
  const twoWeeksAgo = new Date(today); twoWeeksAgo.setDate(today.getDate() - 14);
  const sixMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 5, 1);
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const prevMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);

  const [
    { count: todayCount },
    { count: pendingCount },
    { count: doneCount },
    { count: leadsCount },
    { count: prevPendingCount },
    { count: prevDoneCount },
    { data: weekBookings },
    { data: prevWeekBookings },
    { data: monthlyRaw },
    { data: repairItems },
    { data: recentBookings },
    { data: recentLeads },
    { data: monthRevenueRaw },
    { data: prevMonthRevenueRaw },
  ] = await Promise.all([
    supabase
      .from("bookings")
      .select("*", { count: "exact", head: true })
      .gte("created_at", `${todayStr}T00:00:00`),
    supabase
      .from("bookings")
      .select("*", { count: "exact", head: true })
      .eq("status", "received"),
    supabase
      .from("bookings")
      .select("*", { count: "exact", head: true })
      .eq("status", "done"),
    supabase
      .from("leads")
      .select("*", { count: "exact", head: true })
      .eq("status", "new"),
    // prev week pending (for trend calc)
    supabase
      .from("bookings")
      .select("*", { count: "exact", head: true })
      .eq("status", "received")
      .lt("created_at", weekAgo.toISOString()),
    // prev week done
    supabase
      .from("bookings")
      .select("*", { count: "exact", head: true })
      .eq("status", "done")
      .lt("created_at", weekAgo.toISOString()),
    // this week bookings (for sparklines)
    supabase
      .from("bookings")
      .select("created_at")
      .gte("created_at", weekAgo.toISOString()),
    // prev week bookings (for today trend)
    supabase
      .from("bookings")
      .select("created_at")
      .gte("created_at", twoWeeksAgo.toISOString())
      .lt("created_at", weekAgo.toISOString()),
    // 6-month monthly for area chart
    supabase
      .from("bookings")
      .select("created_at, total_price")
      .gte("created_at", sixMonthsAgo.toISOString()),
    // repair items for bar chart
    supabase.from("booking_items").select("repair_name"),
    // recent bookings
    supabase
      .from("bookings")
      .select("id, customer_name, customer_phone, status, created_at, total_price")
      .order("created_at", { ascending: false })
      .limit(6),
    // recent leads
    supabase
      .from("leads")
      .select("id, customer_name, customer_phone, form_data, status, created_at")
      .order("created_at", { ascending: false })
      .limit(5),
    // current-month done revenue
    supabase
      .from("bookings")
      .select("total_price")
      .eq("status", "done")
      .gte("created_at", monthStart.toISOString()),
    // previous-month done revenue (trend)
    supabase
      .from("bookings")
      .select("total_price")
      .eq("status", "done")
      .gte("created_at", prevMonthStart.toISOString())
      .lt("created_at", monthStart.toISOString()),
  ]);

  const monthRevenue = (monthRevenueRaw ?? []).reduce(
    (sum, r) => sum + (r.total_price ?? 0),
    0
  );
  const prevMonthRevenue = (prevMonthRevenueRaw ?? []).reduce(
    (sum, r) => sum + (r.total_price ?? 0),
    0
  );
  const revenueTrend = prevMonthRevenue === 0
    ? null
    : Math.round(((monthRevenue - prevMonthRevenue) / prevMonthRevenue) * 100);

  // Sparklines (7-day day-by-day counts)
  const todaySparkline    = groupByDay(weekBookings ?? [], 7);
  const prevTodaySparkline = groupByDay(prevWeekBookings ?? [], 7);

  // Simple trend: compare last 7 days total vs prior 7 days total
  const thisWeekTotal = todaySparkline.reduce((s, v) => s + v, 0);
  const prevWeekTotal = prevTodaySparkline.reduce((s, v) => s + v, 0);
  const bookingsTrend = prevWeekTotal === 0
    ? null
    : Math.round(((thisWeekTotal - prevWeekTotal) / prevWeekTotal) * 100);

  const pendingTrend = (prevPendingCount ?? 0) === 0
    ? null
    : Math.round((((pendingCount ?? 0) - (prevPendingCount ?? 0)) / (prevPendingCount ?? 1)) * 100);

  const doneTrend = (prevDoneCount ?? 0) === 0
    ? null
    : Math.round((((doneCount ?? 0) - (prevDoneCount ?? 0)) / (prevDoneCount ?? 1)) * 100);

  // Monthly chart data
  const monthlyData = groupByMonth(monthlyRaw ?? [], 6);

  // Top repairs for bar chart
  const repairCounts: Record<string, number> = {};
  for (const row of repairItems ?? []) {
    if (row.repair_name) repairCounts[row.repair_name] = (repairCounts[row.repair_name] || 0) + 1;
  }
  const topRepairs = topN(repairCounts, 6);

  return (
    <div className="flex flex-col gap-5">

      {/* ── Stats cards ───────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatsCard
          title="הכנסות החודש"
          value={`₪${monthRevenue.toLocaleString("he-IL")}`}
          icon={Wallet}
          color="green"
          trend={revenueTrend ?? undefined}
          href="/dashboard/bookings?status=done"
        />
        <StatsCard
          title="הזמנות היום"
          value={todayCount ?? 0}
          icon={CalendarCheck}
          color="blue"
          trend={bookingsTrend ?? undefined}
          sparkline={todaySparkline}
          href="/dashboard/bookings?date=today"
        />
        <StatsCard
          title="ממתינות לטיפול"
          value={pendingCount ?? 0}
          icon={Clock}
          color="yellow"
          trend={pendingTrend ?? undefined}
          sparkline={todaySparkline.map((v) => Math.max(0, v - 1))}
          href="/dashboard/bookings?status=received"
        />
        <StatsCard
          title="הושלמו"
          value={doneCount ?? 0}
          icon={CheckCircle}
          color="green"
          trend={doneTrend ?? undefined}
          sparkline={todaySparkline.map((v, i) => (i % 2 === 0 ? v : Math.max(0, v - 1)))}
          href="/dashboard/bookings?status=done"
        />
        <StatsCard
          title="לידים חדשים"
          value={leadsCount ?? 0}
          icon={Users}
          color="purple"
          href="/dashboard/leads"
        />
      </div>

      {/* ── Charts row ────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Area chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-[0_1px_4px_rgba(0,0,0,0.06),0_4px_20px_rgba(0,0,0,0.05)]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-[14px] font-semibold text-slate-800">סקירת הכנסות</p>
              <p className="text-[12px] text-slate-400 mt-0.5">6 חודשים אחרונים</p>
            </div>
          </div>
          <div dir="ltr">
            <SalesAreaChart data={monthlyData} />
          </div>
        </div>

        {/* Bar chart */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-[0_1px_4px_rgba(0,0,0,0.06),0_4px_20px_rgba(0,0,0,0.05)]">
          <div className="mb-4">
            <p className="text-[14px] font-semibold text-slate-800">תיקונים מובילים</p>
            <p className="text-[12px] text-slate-400 mt-0.5">לפי כמות הזמנות</p>
          </div>
          {topRepairs.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-10">אין נתונים עדיין</p>
          ) : (
            <div dir="ltr">
              <RepairsBarChart data={topRepairs} />
            </div>
          )}
        </div>
      </div>

      {/* ── Bottom row: recent bookings + recent leads ─────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Recent bookings */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_4px_rgba(0,0,0,0.06),0_4px_20px_rgba(0,0,0,0.05)] overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <p className="text-[14px] font-semibold text-slate-800">הזמנות אחרונות</p>
            <Link
              href="/dashboard/bookings"
              className="flex items-center gap-1 text-[12px] font-medium text-[#0071e3] hover:underline"
            >
              ראה הכל
              <ArrowLeft size={12} className="rotate-180" />
            </Link>
          </div>
          {!recentBookings || recentBookings.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-12">אין הזמנות עדיין</p>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60">
                  <th className="text-right text-[11px] font-semibold text-slate-400 uppercase tracking-wide px-5 py-2.5">לקוח</th>
                  <th className="text-right text-[11px] font-semibold text-slate-400 uppercase tracking-wide px-4 py-2.5 hidden sm:table-cell">תאריך</th>
                  <th className="text-right text-[11px] font-semibold text-slate-400 uppercase tracking-wide px-4 py-2.5">סכום</th>
                  <th className="text-right text-[11px] font-semibold text-slate-400 uppercase tracking-wide px-5 py-2.5">סטטוס</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentBookings.map((b) => {
                  const status = b.status ?? "received";
                  return (
                    <tr
                      key={b.id}
                      className="hover:bg-slate-50/60 transition-colors"
                    >
                      <td className="px-5 py-3">
                        <Link href={`/dashboard/bookings/${b.id}`} className="group">
                          <p className="text-[13px] font-semibold text-slate-800 group-hover:text-[#0071e3] transition-colors">
                            {b.customer_name ?? "ללא שם"}
                          </p>
                          <p className="text-[11px] text-slate-400 mt-0.5" dir="ltr">{b.customer_phone}</p>
                        </Link>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <span className="text-[12px] text-slate-500">{formatDate(b.created_at)}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-[13px] font-semibold text-slate-800">
                          {b.total_price != null ? `₪${b.total_price}` : "—"}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <RecentBookingActions
                          id={b.id}
                          initialStatus={status}
                          customerName={b.customer_name ?? ""}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Recent leads */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_4px_rgba(0,0,0,0.06),0_4px_20px_rgba(0,0,0,0.05)] overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <p className="text-[14px] font-semibold text-slate-800">פניות אחרונות</p>
            <Link
              href="/dashboard/leads"
              className="flex items-center gap-1 text-[12px] font-medium text-[#0071e3] hover:underline"
            >
              ראה הכל
              <ArrowLeft size={12} className="rotate-180" />
            </Link>
          </div>
          {!recentLeads || recentLeads.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-12">אין פניות עדיין</p>
          ) : (
            <div className="divide-y divide-slate-100">
              {recentLeads.map((lead) => {
                const status = (lead.status ?? "new") as string;
                const device = deviceLabel(lead.form_data);
                return (
                  <div key={lead.id} className="px-5 py-3.5 hover:bg-slate-50/60 transition-colors">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-[13px] font-semibold text-slate-800 truncate">
                          {lead.customer_name ?? "ללא שם"}
                        </p>
                        {lead.customer_phone && (
                          <a
                            href={`tel:${lead.customer_phone}`}
                            className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5 hover:text-[#0071e3] transition-colors"
                            dir="ltr"
                          >
                            <Phone size={10} />
                            {lead.customer_phone}
                          </a>
                        )}
                        {device && (
                          <span className="inline-block mt-1.5 text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-blue-50 text-blue-600 border border-blue-100">
                            {device}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-1.5 shrink-0">
                        <span
                          className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                            LEAD_STATUS_COLORS[status] ?? "bg-slate-100 text-slate-500 border-slate-200"
                          }`}
                        >
                          {LEAD_STATUS_LABELS[status] ?? status}
                        </span>
                        <span className="text-[10px] text-slate-400">{formatDate(lead.created_at)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
