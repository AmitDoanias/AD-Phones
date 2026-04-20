"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, AlertCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastType = "success" | "error";
type Toast = { id: number; message: string; type: ToastType };

type Subscriber = (t: Toast) => void;

let nextId = 0;
let subscribers: Subscriber[] = [];

export function toast(message: string, type: ToastType = "success") {
  const t: Toast = { id: ++nextId, message, type };
  for (const s of subscribers) s(t);
}

export function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const sub: Subscriber = (t) => {
      setToasts((prev) => [...prev, t]);
      window.setTimeout(() => {
        setToasts((prev) => prev.filter((x) => x.id !== t.id));
      }, 3800);
    };
    subscribers.push(sub);
    return () => {
      subscribers = subscribers.filter((s) => s !== sub);
    };
  }, []);

  function dismiss(id: number) {
    setToasts((prev) => prev.filter((x) => x.id !== id));
  }

  if (toasts.length === 0) return null;

  return (
    <div
      dir="rtl"
      className="fixed top-4 left-4 z-[100] flex flex-col gap-2 pointer-events-none"
    >
      {toasts.map((t) => {
        const Icon = t.type === "success" ? CheckCircle2 : AlertCircle;
        return (
          <div
            key={t.id}
            className={cn(
              "pointer-events-auto flex items-center gap-2.5 pr-3 pl-2 py-2.5 rounded-xl shadow-lg border text-sm font-medium min-w-[240px]",
              t.type === "success"
                ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                : "bg-red-50 text-red-800 border-red-200"
            )}
            style={{
              animation: "toaster-slide-in 200ms cubic-bezier(0.32, 0.72, 0, 1)",
            }}
          >
            <Icon
              size={17}
              className={t.type === "success" ? "text-emerald-600" : "text-red-600"}
            />
            <span className="flex-1">{t.message}</span>
            <button
              type="button"
              onClick={() => dismiss(t.id)}
              aria-label="סגור"
              className={cn(
                "w-6 h-6 rounded-full flex items-center justify-center transition-colors",
                t.type === "success"
                  ? "hover:bg-emerald-100 text-emerald-700"
                  : "hover:bg-red-100 text-red-700"
              )}
            >
              <X size={13} />
            </button>
          </div>
        );
      })}

      <style>{`
        @keyframes toaster-slide-in {
          from { transform: translateY(-8px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
