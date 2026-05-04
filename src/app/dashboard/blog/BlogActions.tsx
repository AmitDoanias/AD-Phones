"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useTransition } from "react";
import { Pencil, Trash2, ExternalLink, Eye, EyeOff, Loader2 } from "lucide-react";

type Props = {
  postId: string;
  slug: string;
  isPublished: boolean;
};

export default function BlogActions({ postId, slug, isPublished }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function togglePublish() {
    setError(null);
    startTransition(async () => {
      const res = await fetch(`/api/blog/${postId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_published: !isPublished }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "שגיאה");
        return;
      }
      router.refresh();
    });
  }

  function remove() {
    if (!confirm("למחוק את הפוסט? פעולה זו לא ניתנת לביטול.")) return;
    setError(null);
    startTransition(async () => {
      const res = await fetch(`/api/blog/${postId}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "שגיאה");
        return;
      }
      router.refresh();
    });
  }

  return (
    <div className="flex items-center gap-1">
      {error && <span className="text-[11px] text-red-600 ml-2">{error}</span>}
      <button
        type="button"
        onClick={togglePublish}
        disabled={pending}
        title={isPublished ? "הסר פרסום" : "פרסם"}
        className="w-7 h-7 rounded-md hover:bg-black/5 flex items-center justify-center text-slate-600 disabled:opacity-50"
      >
        {pending ? (
          <Loader2 size={13} className="animate-spin" />
        ) : isPublished ? (
          <EyeOff size={13} />
        ) : (
          <Eye size={13} />
        )}
      </button>
      {isPublished && (
        <Link
          href={`/blog/${slug}`}
          target="_blank"
          rel="noopener noreferrer"
          title="פתח באתר"
          className="w-7 h-7 rounded-md hover:bg-black/5 flex items-center justify-center text-slate-600"
        >
          <ExternalLink size={13} />
        </Link>
      )}
      <Link
        href={`/dashboard/blog/${postId}`}
        title="ערוך"
        className="w-7 h-7 rounded-md hover:bg-black/5 flex items-center justify-center text-slate-600"
      >
        <Pencil size={13} />
      </Link>
      <button
        type="button"
        onClick={remove}
        disabled={pending}
        title="מחק"
        className="w-7 h-7 rounded-md hover:bg-red-50 flex items-center justify-center text-red-600 disabled:opacity-50"
      >
        <Trash2 size={13} />
      </button>
    </div>
  );
}
