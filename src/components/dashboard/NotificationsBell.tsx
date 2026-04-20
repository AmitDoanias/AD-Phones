"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Bell, CalendarCheck, Users } from "lucide-react";
import { cn } from "@/lib/utils";

type NotificationItem = {
  id: string;
  type: "booking" | "lead";
  title: string;
  subtitle: string;
  href: string;
  created_at: string;
};

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "הרגע";
  if (mins < 60) return `לפני ${mins} דק׳`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `לפני ${hours} שעות`;
  const days = Math.floor(hours / 24);
  return `לפני ${days} ימים`;
}

export default function NotificationsBell() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  async function load() {
    try {
      const res = await fetch("/api/notifications", { cache: "no-store" });
      if (!res.ok) return;
      const data = (await res.json()) as { items: NotificationItem[] };
      setItems(data.items ?? []);
      setLoaded(true);
    } catch {
      setLoaded(true);
    }
  }

  // Preload unread count on mount so the red dot is meaningful
  useEffect(() => {
    load();
  }, []);

  // Click-outside
  useEffect(() => {
    if (!open) return;
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  function toggle() {
    if (!open) load();
    setOpen(!open);
  }

  const hasItems = items.length > 0;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-label="התראות"
        onClick={toggle}
        className="relative w-9 h-9 rounded-lg flex items-center justify-center hover:bg-slate-100 transition-colors"
      >
        <Bell size={17} className="text-slate-500" />
        {hasItems && (
          <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-red-500 border border-white" />
        )}
      </button>

      {open && (
        <div
          dir="rtl"
          className="absolute top-11 left-0 w-80 max-h-[420px] overflow-auto bg-white rounded-xl border border-slate-200 shadow-lg z-50"
        >
          <div className="sticky top-0 bg-white px-4 py-3 border-b border-slate-100 flex items-center justify-between">
            <p className="text-[13px] font-semibold text-slate-800">התראות</p>
            <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wide">
              24 שעות אחרונות
            </span>
          </div>

          {!loaded ? (
            <p className="text-sm text-slate-400 text-center py-10">טוען...</p>
          ) : !hasItems ? (
            <p className="text-sm text-slate-400 text-center py-10">אין התראות חדשות</p>
          ) : (
            <div className="divide-y divide-slate-100">
              {items.map((item) => {
                const Icon = item.type === "booking" ? CalendarCheck : Users;
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="flex items-start gap-3 px-4 py-3 hover:bg-slate-50 transition-colors"
                  >
                    <div
                      className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5",
                        item.type === "booking"
                          ? "bg-blue-50 text-blue-500"
                          : "bg-violet-50 text-violet-500"
                      )}
                    >
                      <Icon size={15} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-semibold text-slate-800 truncate">
                        {item.title}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate">{item.subtitle}</p>
                    </div>
                    <span className="text-[10px] text-slate-400 flex-shrink-0 mt-0.5 whitespace-nowrap">
                      {relativeTime(item.created_at)}
                    </span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
