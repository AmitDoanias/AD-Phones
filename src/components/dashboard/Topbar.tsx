"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Search,
  LayoutDashboard,
  Wrench,
  CalendarCheck,
  BookOpen,
  Users,
  Calendar,
  type LucideIcon,
} from "lucide-react";
import NotificationsBell from "./NotificationsBell";

const NAV: { href: string; label: string; icon: LucideIcon; exact?: boolean }[] = [
  { href: "/dashboard",          label: "סקירה כללית",   icon: LayoutDashboard, exact: true },
  { href: "/dashboard/bookings", label: "הזמנות",         icon: CalendarCheck },
  { href: "/dashboard/leads",    label: "פניות",          icon: Users },
  { href: "/dashboard/repairs",  label: "ניהול תיקונים",  icon: Wrench },
  { href: "/dashboard/blog",     label: "בלוג",           icon: BookOpen },
  { href: "/dashboard/calendar", label: "לוח זמנים",     icon: Calendar },
];

export default function Topbar() {
  const pathname = usePathname();

  const current =
    NAV.find(({ href, exact }) =>
      exact ? pathname === href : pathname.startsWith(href)
    ) ?? NAV[0];

  const Icon = current.icon;

  return (
    <header className="h-[60px] bg-white border-b border-slate-200/60 px-6 flex items-center justify-between gap-4 shrink-0">
      {/* Page title — RTL start (right) */}
      <div className="flex items-center gap-2.5 shrink-0">
        <Icon size={17} className="text-slate-400" />
        <span className="text-[15px] font-semibold text-slate-800">{current.label}</span>
      </div>

      {/* Search — center */}
      <div className="flex-1 max-w-[280px]">
        <div className="relative">
          <Search
            size={14}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
          />
          <input
            type="text"
            placeholder="חיפוש..."
            className="w-full h-9 bg-slate-50 border border-slate-200 rounded-lg pr-9 pl-3 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0071e3]/20 focus:border-[#0071e3]/50 transition-all"
          />
        </div>
      </div>

      {/* Actions — RTL end (left) */}
      <div className="flex items-center gap-2 shrink-0">
        <NotificationsBell />
        <div
          aria-label="A&D Admin"
          className="w-8 h-8 rounded-full overflow-hidden bg-white border border-slate-200 flex items-center justify-center shrink-0"
        >
          <Image
            src="/logo.png"
            alt="A&D Phones"
            width={32}
            height={32}
            className="w-full h-full object-contain"
            priority
          />
        </div>
      </div>
    </header>
  );
}
