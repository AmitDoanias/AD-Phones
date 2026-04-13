"use client";

import Image from "next/image";
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
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const NAV = [
  { href: "/dashboard", label: "סקירה כללית", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/repairs", label: "ניהול תיקונים", icon: Wrench },
  { href: "/dashboard/bookings", label: "הזמנות", icon: CalendarCheck },
  { href: "/dashboard/blog", label: "בלוג", icon: BookOpen },
  { href: "/dashboard/leads", label: "לידים", icon: Users },
  { href: "/dashboard/calendar", label: "לוח זמנים", icon: Calendar },
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
    <aside className="w-60 shrink-0 bg-[#0f172a] min-h-screen flex flex-col">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-slate-800">
        <Link href="/dashboard">
          <Image
            src="/logo.png"
            alt="AD Phones"
            width={110}
            height={38}
            className="h-9 w-auto brightness-0 invert"
          />
        </Link>
        <p className="text-xs text-slate-500 mt-1 font-medium">פאנל ניהול</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5">
        {NAV.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? "bg-primary text-white"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              <Icon size={17} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-slate-800">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors w-full"
        >
          <LogOut size={17} />
          יציאה
        </button>
      </div>
    </aside>
  );
}
