"use client";

import { useMemo } from "react";
import { CheckCircle2, AlertCircle, Sparkles, Plus } from "lucide-react";
import { computeSeoScore, suggestKeywords, type SeoScoreInput } from "@/lib/seoScore";

type Props = {
  input: SeoScoreInput;
  onAddKeyword: (keyword: string) => void;
};

export default function SeoPanel({ input, onAddKeyword }: Props) {
  const result = useMemo(() => computeSeoScore(input), [input]);
  const suggestions = useMemo(
    () => suggestKeywords({ title: input.title, body: input.body }),
    [input.title, input.body]
  );

  const existingKeywords = new Set(
    input.seo_keywords.split(",").map((s) => s.trim().toLowerCase()).filter(Boolean)
  );
  const newSuggestions = suggestions.filter((s) => !existingKeywords.has(s.toLowerCase()));

  const failed = result.checks.filter((c) => !c.pass);

  const bandLabel = {
    excellent: "מצוין",
    good: "טוב",
    ok: "סביר",
    weak: "חלש",
  }[result.band];

  return (
    <div className="bg-card border border-border rounded-xl p-4 space-y-4">
      {/* Score header */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <p className="text-xs font-semibold text-slate-700">ציון SEO</p>
          <p className="text-xs font-medium" style={{ color: result.bandColor }}>
            {bandLabel}
          </p>
        </div>
        <div className="flex items-end gap-2 mb-2">
          <span
            className="text-3xl font-bold tabular-nums"
            style={{ color: result.bandColor, letterSpacing: "-0.5px" }}
          >
            {result.score}
          </span>
          <span className="text-sm text-muted-foreground mb-1">/100</span>
        </div>
        <div
          className="h-2 w-full bg-muted rounded-full overflow-hidden"
          role="progressbar"
          aria-valuenow={result.score}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${result.score}%`,
              background: result.bandColor,
            }}
          />
        </div>
      </div>

      {/* Checks */}
      <div className="space-y-1.5 pt-1">
        {result.checks.map((c) => (
          <div key={c.id} className="flex items-start gap-2 text-[11px]">
            {c.pass ? (
              <CheckCircle2 size={13} className="flex-shrink-0 mt-0.5 text-green-600" />
            ) : (
              <AlertCircle size={13} className="flex-shrink-0 mt-0.5 text-amber-500" />
            )}
            <span className={c.pass ? "text-slate-700" : "text-slate-600"}>
              {c.label}
              {c.hint && !c.pass && (
                <span className="text-muted-foreground"> · {c.hint}</span>
              )}
            </span>
          </div>
        ))}
      </div>

      {failed.length > 0 && (
        <p className="text-[11px] text-muted-foreground pt-1 border-t border-border">
          השלם את הנקודות הפתוחות כדי לעלות לציון מצוין (85+).
        </p>
      )}

      {/* Keyword suggestions */}
      {newSuggestions.length > 0 && (
        <div className="pt-3 border-t border-border">
          <div className="flex items-center gap-1.5 mb-2">
            <Sparkles size={12} className="text-primary" />
            <p className="text-xs font-semibold text-slate-700">מילות מפתח מוצעות</p>
          </div>
          <p className="text-[11px] text-muted-foreground mb-2.5">
            מבוסס על ניתוח התוכן שלך. לחץ כדי להוסיף.
          </p>
          <div className="flex flex-wrap gap-1.5">
            {newSuggestions.map((kw) => (
              <button
                key={kw}
                type="button"
                onClick={() => onAddKeyword(kw)}
                className="inline-flex items-center gap-1 px-2 py-1 text-[11px] rounded-md bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-100 transition-colors"
              >
                <Plus size={10} />
                {kw}
              </button>
            ))}
          </div>
        </div>
      )}

      {newSuggestions.length === 0 && input.body.length > 100 && (
        <p className="text-[11px] text-muted-foreground pt-3 border-t border-border">
          לא הצלחנו להפיק הצעות חדשות מהתוכן.
        </p>
      )}
    </div>
  );
}
