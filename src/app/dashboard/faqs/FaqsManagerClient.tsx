"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Pencil,
  Trash2,
  ChevronUp,
  ChevronDown,
  Eye,
  EyeOff,
  Save,
  X,
} from "lucide-react";
import Button from "@/components/ui/Button";
import { toast } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";
import type { DeviceLine, LineFaq } from "@/types";

const TABS: { id: DeviceLine; label: string }[] = [
  { id: "iphone", label: "iPhone" },
  { id: "ipad", label: "iPad" },
  { id: "samsung", label: "סמסונג" },
];

type Props = {
  initialFaqs: LineFaq[];
};

export default function FaqsManagerClient({ initialFaqs }: Props) {
  const router = useRouter();
  const [active, setActive] = useState<DeviceLine>("iphone");
  const [busy, setBusy] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  const visible = useMemo(
    () =>
      initialFaqs
        .filter((f) => f.device_line === active)
        .sort((a, b) => a.sort_order - b.sort_order),
    [initialFaqs, active]
  );

  async function refresh() {
    router.refresh();
  }

  async function handleCreate(question: string, answer: string) {
    setBusy(true);
    try {
      const maxOrder = Math.max(0, ...visible.map((f) => f.sort_order));
      const res = await fetch("/api/faqs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          device_line: active,
          question,
          answer,
          sort_order: maxOrder + 1,
          is_published: true,
        }),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "שגיאה");
      toast("השאלה נוספה", "success");
      setAdding(false);
      await refresh();
    } catch (e) {
      toast(e instanceof Error ? e.message : "שגיאה", "error");
    } finally {
      setBusy(false);
    }
  }

  async function handleUpdate(
    id: string,
    patch: Partial<Pick<LineFaq, "question" | "answer" | "sort_order" | "is_published">>
  ) {
    setBusy(true);
    try {
      const res = await fetch(`/api/faqs/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "שגיאה");
      toast("השאלה עודכנה", "success");
      setEditingId(null);
      await refresh();
    } catch (e) {
      toast(e instanceof Error ? e.message : "שגיאה", "error");
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("למחוק את השאלה?")) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/faqs/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error((await res.json()).error ?? "שגיאה");
      toast("השאלה נמחקה", "success");
      await refresh();
    } catch (e) {
      toast(e instanceof Error ? e.message : "שגיאה", "error");
    } finally {
      setBusy(false);
    }
  }

  async function handleReorder(faq: LineFaq, direction: "up" | "down") {
    const idx = visible.findIndex((f) => f.id === faq.id);
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= visible.length) return;
    const other = visible[swapIdx];
    setBusy(true);
    try {
      await Promise.all([
        fetch(`/api/faqs/${faq.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sort_order: other.sort_order }),
        }),
        fetch(`/api/faqs/${other.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sort_order: faq.sort_order }),
        }),
      ]);
      await refresh();
    } catch {
      toast("שגיאה בסידור מחדש", "error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Tabs */}
      <div className="flex gap-2 border-b border-border">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActive(tab.id);
              setEditingId(null);
              setAdding(false);
            }}
            className={cn(
              "px-4 py-2 text-[13px] font-medium transition-colors -mb-[1px] border-b-2",
              active === tab.id
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-card-foreground"
            )}
          >
            {tab.label}
            <span className="mr-1.5 text-[11px] text-muted-foreground">
              ({initialFaqs.filter((f) => f.device_line === tab.id).length})
            </span>
          </button>
        ))}
      </div>

      {/* Add button / form */}
      {!adding ? (
        <Button size="sm" onClick={() => setAdding(true)} disabled={busy}>
          <Plus size={14} /> הוסף שאלה חדשה
        </Button>
      ) : (
        <FaqForm
          onCancel={() => setAdding(false)}
          onSubmit={(q, a) => handleCreate(q, a)}
          busy={busy}
          submitLabel="הוסף"
        />
      )}

      {/* List */}
      {visible.length === 0 ? (
        <p className="text-[12px] text-muted-foreground py-8 text-center">
          אין עדיין שאלות בקטגוריה הזאת.
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {visible.map((faq, i) => (
            <div
              key={faq.id}
              className="bg-card rounded-xl border border-border p-3 shadow-[0_1px_4px_rgba(0,0,0,0.04)]"
            >
              {editingId === faq.id ? (
                <FaqForm
                  initialQuestion={faq.question}
                  initialAnswer={faq.answer}
                  onCancel={() => setEditingId(null)}
                  onSubmit={(q, a) => handleUpdate(faq.id, { question: q, answer: a })}
                  busy={busy}
                  submitLabel="שמור"
                />
              ) : (
                <div className="flex items-start gap-2">
                  {/* Reorder arrows */}
                  <div className="flex flex-col gap-0.5 pt-1">
                    <button
                      type="button"
                      onClick={() => handleReorder(faq, "up")}
                      disabled={busy || i === 0}
                      className="p-0.5 rounded hover:bg-muted disabled:opacity-30"
                      aria-label="הזז למעלה"
                    >
                      <ChevronUp size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleReorder(faq, "down")}
                      disabled={busy || i === visible.length - 1}
                      className="p-0.5 rounded hover:bg-muted disabled:opacity-30"
                      aria-label="הזז למטה"
                    >
                      <ChevronDown size={14} />
                    </button>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p
                      className={cn(
                        "text-[13px] font-semibold mb-1",
                        faq.is_published ? "text-slate-800" : "text-slate-400"
                      )}
                    >
                      {faq.question}
                    </p>
                    <p
                      className={cn(
                        "text-[12px] leading-relaxed whitespace-pre-wrap",
                        faq.is_published ? "text-muted-foreground" : "text-slate-400"
                      )}
                    >
                      {faq.answer}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() =>
                        handleUpdate(faq.id, { is_published: !faq.is_published })
                      }
                      disabled={busy}
                      title={faq.is_published ? "הסתר" : "פרסם"}
                      className="p-1.5 rounded hover:bg-muted text-muted-foreground"
                    >
                      {faq.is_published ? <Eye size={14} /> : <EyeOff size={14} />}
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingId(faq.id)}
                      disabled={busy}
                      title="ערוך"
                      className="p-1.5 rounded hover:bg-muted text-muted-foreground"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(faq.id)}
                      disabled={busy}
                      title="מחק"
                      className="p-1.5 rounded hover:bg-red-50 text-red-600"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function FaqForm({
  initialQuestion = "",
  initialAnswer = "",
  onCancel,
  onSubmit,
  busy,
  submitLabel,
}: {
  initialQuestion?: string;
  initialAnswer?: string;
  onCancel: () => void;
  onSubmit: (question: string, answer: string) => void;
  busy: boolean;
  submitLabel: string;
}) {
  const [question, setQuestion] = useState(initialQuestion);
  const [answer, setAnswer] = useState(initialAnswer);

  function submit() {
    if (!question.trim() || !answer.trim()) {
      toast("שאלה ותשובה חובה", "error");
      return;
    }
    onSubmit(question.trim(), answer.trim());
  }

  return (
    <div className="flex flex-col gap-2 bg-muted/40 rounded-xl p-3 border border-border">
      <input
        type="text"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="שאלה"
        className="w-full px-3 py-2 rounded-lg border border-border bg-background text-[13px] font-medium"
        dir="rtl"
      />
      <textarea
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder="תשובה"
        rows={4}
        className="w-full px-3 py-2 rounded-lg border border-border bg-background text-[12px] leading-relaxed resize-y"
        dir="rtl"
      />
      <div className="flex gap-2 justify-end">
        <Button size="sm" variant="outline" onClick={onCancel} disabled={busy}>
          <X size={14} /> ביטול
        </Button>
        <Button size="sm" onClick={submit} loading={busy}>
          <Save size={14} /> {submitLabel}
        </Button>
      </div>
    </div>
  );
}
