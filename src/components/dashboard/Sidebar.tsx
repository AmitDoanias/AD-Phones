"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Wrench,
  CalendarCheck,
  BookOpen,
  Users,
  Calendar,
  LogOut,
  Settings,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/dashboard",          label: "סקירה כללית",   icon: LayoutDashboard, exact: true },
  { href: "/dashboard/bookings", label: "הזמנות",         icon: CalendarCheck },
  { href: "/dashboard/leads",    label: "פניות",          icon: Users },
  { href: "/dashboard/repairs",  label: "ניהול תיקונים",  icon: Wrench },
  { href: "/dashboard/blog",     label: "בלוג",           icon: BookOpen },
  { href: "/dashboard/calendar", label: "לוח זמנים",     icon: Calendar },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <aside className="w-[220px] shrink-0 bg-[#111827] min-h-screen flex flex-col select-none">
      {/* Brand */}
      <div className="h-[60px] px-5 flex items-center border-b border-white/[0.07] shrink-0">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#0071e3] flex items-center justify-center shrink-0">
            <span className="text-white text-[10px] font-black tracking-tighter">AD</span>
          </div>
          <div className="leading-none">
            <p className="text-[13px] font-semibold text-white">A&D Phones</p>
            <p className="text-[10px] text-slate-500 mt-0.5">Admin Panel</p>
          </div>
        </Link>
      </div>

      {/* Main nav */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5 overflow-y-auto">
        <p className="px-3 mb-2 text-[9px] font-bold uppercase tracking-[0.14em] text-slate-600">
          ראשי
        </p>
        {NAV.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all duration-150",
                active
                  ? "bg-white/[0.08] text-white"
                  : "text-slate-400 hover:bg-white/[0.04] hover:text-slate-200"
              )}
            >
              <Icon
                size={16}
                className={cn(active ? "text-[#60a5fa]" : "text-slate-600")}
              />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-white/[0.07] flex flex-col gap-0.5">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2.5 px-3 py-2.5 w-full rounded-lg text-[13px] font-medium text-slate-400 hover:bg-white/[0.04] hover:text-slate-200 transition-all duration-150"
        >
          <LogOut size={16} className="text-slate-600" />
          יציאה
        </button>
      </div>
    </aside>
  );
}
