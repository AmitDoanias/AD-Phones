import { createClient } from "@/lib/supabase/server";
import StatsCard from "@/components/dashboard/StatsCard";
import { CalendarCheck, Clock, CheckCircle, Users } from "lucide-react";

export default async function DashboardPage() {
  const supabase = await createClient();

  const today = new Date().toISOString().split("T")[0];

  const [
    { count: todayCount },
    { count: pendingCount },
    { count: doneCount },
    { count: leadsCount },
  ] = await Promise.all([
    supabase
      .from("bookings")
      .select("*", { count: "exact", head: true })
      .gte("created_at", `${today}T00:00:00`),
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
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">סקירה כללית</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard
          title="הזמנות היום"
          value={todayCount ?? 0}
          icon={CalendarCheck}
          color="blue"
        />
        <StatsCard
          title="ממתינות לטיפול"
          value={pendingCount ?? 0}
          icon={Clock}
          color="yellow"
        />
        <StatsCard
          title="הושלמו"
          value={doneCount ?? 0}
          icon={CheckCircle}
          color="green"
        />
        <StatsCard
          title="לידים חדשים"
          value={leadsCount ?? 0}
          icon={Users}
          color="purple"
        />
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <p className="text-slate-500 text-sm text-center py-8">
          בחר סעיף מהתפריט הצדדי לניהול
        </p>
      </div>
    </div>
  );
}
