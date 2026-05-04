"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { DEFAULT_TRUST_BADGES, getBadgeIcon } from "@/lib/trustBadges";

interface Props {
  value: string[];
  onChange: (next: string[]) => void;
}

export default function TrustBadgesEditor({ value, onChange }: Props) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [draft, setDraft] = useState("");

  const badges = value.length > 0 ? value : [];

  function startEdit(i: number) {
    setEditingIndex(i);
    setDraft(badges[i]);
  }

  function commitEdit() {
    if (editingIndex === null) return;
    const next = [...badges];
    const cleaned = draft.trim();
    if (cleaned.length === 0) {
      next.splice(editingIndex, 1);
    } else {
      next[editingIndex] = cleaned;
    }
    onChange(next);
    setEditingIndex(null);
    setDraft("");
  }

  function removeBadge(i: number) {
    const next = badges.filter((_, idx) => idx !== i);
    onChange(next);
  }

  function addBadge() {
    const next = [...badges, ""];
    onChange(next);
    setEditingIndex(next.length - 1);
    setDraft("");
  }

  function resetToDefaults() {
    onChange([...DEFAULT_TRUST_BADGES]);
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-slate-700">
          צ'יפים בראש הדף{" "}
          <span className="text-slate-400 font-normal">
            (תצוגה בדיוק כפי שתופיע בדף התיקון)
          </span>
        </label>
        <button
          type="button"
          onClick={resetToDefaults}
          className="text-[11px] text-slate-500 hover:text-slate-700 underline"
        >
          שחזר ברירות מחדל
        </button>
      </div>

      {/* Preview pills - dark background to mirror the site hero */}
      <div
        className="flex flex-wrap items-center justify-center gap-2 p-4 rounded-xl"
        style={{
          background: "radial-gradient(circle at 50% 0%, #2a2a2d 0%, #1d1d1f 60%)",
          minHeight: 72,
        }}
      >
        {badges.length === 0 && editingIndex === null && (
          <p className="text-[12px] text-white/40">
            אין צ'יפים. לחץ "+ הוסף צ'יפ" להוסיף אחד.
          </p>
        )}

        {badges.map((label, i) => {
          const Icon = getBadgeIcon(label || "warranty");
          const isEditing = editingIndex === i;
          return (
            <div
              key={i}
              className="inline-flex items-center gap-1.5 pr-3 pl-1.5 py-1.5 rounded-full text-[12px] font-medium text-white"
              style={{
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.12)",
                letterSpacing: "-0.1px",
              }}
            >
              <Icon size={13} style={{ color: "#0071e3" }} />
              {isEditing ? (
                <input
                  autoFocus
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onBlur={commitEdit}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      commitEdit();
                    }
                    if (e.key === "Escape") {
                      setEditingIndex(null);
                      setDraft("");
                    }
                  }}
                  className="bg-transparent border-b border-white/30 outline-none text-[12px] text-white w-[160px] px-0.5"
                />
              ) : (
                <button
                  type="button"
                  onClick={() => startEdit(i)}
                  className="cursor-text"
                  title="לחץ לעריכה"
                >
                  {label || <span className="text-white/40">ריק - לחץ לעריכה</span>}
                </button>
              )}
              <button
                type="button"
                onClick={() => removeBadge(i)}
                aria-label="הסר"
                className="w-5 h-5 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
              >
                <X size={11} />
              </button>
            </div>
          );
        })}
      </div>

      <button
        type="button"
        onClick={addBadge}
        className="self-start inline-flex items-center gap-1 text-[13px] text-[#0071e3] hover:underline"
      >
        <Plus size={14} />
        הוסף צ'יפ
      </button>

      <p className="text-xs text-slate-400">
        האייקון נבחר אוטומטית לפי הטקסט (אחריות → מגן, מהיר/דק → ברק, מקורי → מדליה).
        השאר ריק כדי להשתמש בברירות המחדל: {DEFAULT_TRUST_BADGES.join(" • ")}.
      </p>
    </div>
  );
}
