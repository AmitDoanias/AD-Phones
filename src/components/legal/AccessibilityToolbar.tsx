"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Accessibility,
  Plus,
  Minus,
  Contrast,
  Link as LinkIcon,
  Pause,
  RotateCcw,
  X,
} from "lucide-react";

type Settings = {
  fontScale: number;
  highContrast: boolean;
  highlightLinks: boolean;
  pauseAnimations: boolean;
};

const DEFAULTS: Settings = {
  fontScale: 1,
  highContrast: false,
  highlightLinks: false,
  pauseAnimations: false,
};

const STORAGE_KEY = "ad_accessibility_v1";
const MIN_SCALE = 0.85;
const MAX_SCALE = 1.5;
const STEP = 0.1;

function loadSettings(): Settings {
  if (typeof window === "undefined") return DEFAULTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULTS;
    return { ...DEFAULTS, ...JSON.parse(raw) };
  } catch {
    return DEFAULTS;
  }
}

function applySettings(s: Settings) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.style.fontSize = `${s.fontScale * 100}%`;
  root.classList.toggle("a11y-high-contrast", s.highContrast);
  root.classList.toggle("a11y-highlight-links", s.highlightLinks);
  root.classList.toggle("a11y-pause-animations", s.pauseAnimations);
}

export default function AccessibilityToolbar() {
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState<Settings>(DEFAULTS);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initial = loadSettings();
    setSettings(initial);
    applySettings(initial);
  }, []);

  useEffect(() => {
    if (!open) return;
    function onClickOutside(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function update(next: Partial<Settings>) {
    const merged = { ...settings, ...next };
    setSettings(merged);
    applySettings(merged);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    } catch {
      // storage unavailable - settings still apply for current session
    }
  }

  function reset() {
    setSettings(DEFAULTS);
    applySettings(DEFAULTS);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="פתח תפריט נגישות"
        aria-expanded={open}
        className="fixed z-[55] bottom-5 left-5 md:bottom-6 md:left-6 w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-110"
        style={{
          background: "#0071e3",
          color: "#fff",
          boxShadow: "0 4px 14px rgba(0,113,227,0.35), 0 2px 6px rgba(0,0,0,0.12)",
        }}
      >
        <Accessibility size={22} />
      </button>

      {open && (
        <div
          ref={panelRef}
          className="fixed z-[56] bottom-20 left-5 md:bottom-24 md:left-6 w-[300px] bg-white rounded-[16px] p-5"
          style={{
            boxShadow: "0 10px 40px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.08)",
            border: "1px solid rgba(0,0,0,0.06)",
          }}
          role="dialog"
          aria-label="תפריט נגישות"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold" style={{ color: "#1d1d1f", fontSize: "1rem" }}>
              נגישות
            </h2>
            <button
              onClick={() => setOpen(false)}
              aria-label="סגור"
              className="p-1 rounded hover:bg-black/5"
              style={{ color: "rgba(0,0,0,0.5)" }}
            >
              <X size={16} />
            </button>
          </div>

          <div className="space-y-2 mb-4">
            <div
              className="flex items-center gap-2 p-3 rounded-[10px]"
              style={{ background: "#f5f5f7" }}
            >
              <span className="text-sm flex-1" style={{ color: "#1d1d1f" }}>
                גודל טקסט
              </span>
              <button
                onClick={() => update({ fontScale: Math.max(MIN_SCALE, settings.fontScale - STEP) })}
                aria-label="הקטן טקסט"
                disabled={settings.fontScale <= MIN_SCALE}
                className="w-8 h-8 rounded-full bg-white flex items-center justify-center disabled:opacity-40"
                style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}
              >
                <Minus size={14} />
              </button>
              <span className="text-xs tabular-nums w-10 text-center" style={{ color: "rgba(0,0,0,0.6)" }}>
                {Math.round(settings.fontScale * 100)}%
              </span>
              <button
                onClick={() => update({ fontScale: Math.min(MAX_SCALE, settings.fontScale + STEP) })}
                aria-label="הגדל טקסט"
                disabled={settings.fontScale >= MAX_SCALE}
                className="w-8 h-8 rounded-full bg-white flex items-center justify-center disabled:opacity-40"
                style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}
              >
                <Plus size={14} />
              </button>
            </div>

            <ToggleRow
              icon={<Contrast size={16} />}
              label="ניגודיות גבוהה"
              checked={settings.highContrast}
              onChange={(v) => update({ highContrast: v })}
            />
            <ToggleRow
              icon={<LinkIcon size={16} />}
              label="הדגשת קישורים"
              checked={settings.highlightLinks}
              onChange={(v) => update({ highlightLinks: v })}
            />
            <ToggleRow
              icon={<Pause size={16} />}
              label="עצור אנימציות"
              checked={settings.pauseAnimations}
              onChange={(v) => update({ pauseAnimations: v })}
            />
          </div>

          <button
            onClick={reset}
            className="w-full px-4 py-2.5 rounded-[10px] text-sm font-medium flex items-center justify-center gap-2 transition-colors"
            style={{
              background: "rgba(0,0,0,0.04)",
              color: "#1d1d1f",
            }}
          >
            <RotateCcw size={14} />
            איפוס
          </button>

          <p className="text-xs text-center mt-3" style={{ color: "rgba(0,0,0,0.4)" }}>
            <Link href="/accessibility" className="underline" style={{ color: "#0071e3" }}>
              הצהרת נגישות
            </Link>
          </p>
        </div>
      )}
    </>
  );
}

function ToggleRow({
  icon,
  label,
  checked,
  onChange,
}: {
  icon: React.ReactNode;
  label: string;
  checked: boolean;
  onChange: (val: boolean) => void;
}) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className="w-full flex items-center gap-3 p-3 rounded-[10px] transition-colors hover:bg-black/[0.03]"
      style={{ background: "#f5f5f7" }}
    >
      <span style={{ color: "rgba(0,0,0,0.5)" }}>{icon}</span>
      <span className="flex-1 text-right text-sm" style={{ color: "#1d1d1f" }}>
        {label}
      </span>
      <span
        className="relative inline-block w-9 h-5 rounded-full transition-colors flex-shrink-0"
        style={{
          background: checked ? "#0071e3" : "rgba(0,0,0,0.18)",
        }}
      >
        <span
          className="absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all"
          style={{
            right: checked ? "2px" : "calc(100% - 18px)",
            boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
          }}
        />
      </span>
    </button>
  );
}
