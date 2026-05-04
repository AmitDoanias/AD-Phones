"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import Link from "next/link";
import { ChevronRight, Loader2, Save, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import MarkdownEditor, { type ContentFormat } from "@/components/dashboard/blog/MarkdownEditor";
import CoverImagePicker from "@/components/dashboard/blog/CoverImagePicker";
import SeoPanel from "@/components/dashboard/blog/SeoPanel";
import { slugifyHebrew, SLUG_PATTERN } from "@/lib/slugify";

export type BlogFormValues = {
  id?: string;
  title: string;
  slug: string;
  format: ContentFormat;
  markdown: string;
  html: string;
  excerpt: string;
  cover_image_url: string | null;
  seo_title: string;
  seo_description: string;
  seo_keywords: string;
  is_published: boolean;
};

type Props = {
  initial?: BlogFormValues;
};

const EMPTY: BlogFormValues = {
  title: "",
  slug: "",
  format: "markdown",
  markdown: "",
  html: "",
  excerpt: "",
  cover_image_url: null,
  seo_title: "",
  seo_description: "",
  seo_keywords: "",
  is_published: false,
};

export default function BlogForm({ initial }: Props) {
  const router = useRouter();
  const [v, setV] = useState<BlogFormValues>(initial ?? EMPTY);
  const [slugTouched, setSlugTouched] = useState(!!initial?.slug);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const isEdit = !!initial?.id;

  function update<K extends keyof BlogFormValues>(key: K, value: BlogFormValues[K]) {
    setV((prev) => ({ ...prev, [key]: value }));
  }

  function onTitleChange(title: string) {
    update("title", title);
    if (!slugTouched && !isEdit) {
      update("slug", slugifyHebrew(title));
    }
  }

  function generateSlug() {
    update("slug", slugifyHebrew(v.title));
    setSlugTouched(true);
  }

  function addKeyword(keyword: string) {
    const existing = v.seo_keywords
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    if (existing.some((e) => e.toLowerCase() === keyword.toLowerCase())) return;
    update("seo_keywords", existing.length ? `${v.seo_keywords}, ${keyword}` : keyword);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!v.title.trim() || !v.slug.trim()) {
      setError("כותרת ו-slug הם שדות חובה");
      return;
    }
    if (!SLUG_PATTERN.test(v.slug)) {
      setError("slug יכול להכיל רק אותיות עברית/אנגלית, ספרות ומקפים");
      return;
    }

    const content =
      v.format === "html"
        ? { format: "html" as const, html: v.html }
        : { format: "markdown" as const, markdown: v.markdown };

    const payload = {
      title: v.title.trim(),
      slug: v.slug.trim(),
      content,
      excerpt: v.excerpt.trim() || undefined,
      cover_image_url: v.cover_image_url || undefined,
      seo_title: v.seo_title.trim() || undefined,
      seo_description: v.seo_description.trim() || undefined,
      seo_keywords: v.seo_keywords.trim() || undefined,
      is_published: v.is_published,
    };

    startTransition(async () => {
      const url = isEdit ? `/api/blog/${initial!.id}` : "/api/blog";
      const method = isEdit ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "שגיאה בשמירה");
        return;
      }
      router.push("/dashboard/blog");
      router.refresh();
    });
  }

  const seoBody = v.format === "html" ? v.html : v.markdown;

  return (
    <form onSubmit={submit} className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <Link
            href="/dashboard/blog"
            className="text-muted-foreground hover:text-slate-700 transition-colors flex-shrink-0"
            aria-label="חזרה"
          >
            <ChevronRight size={18} />
          </Link>
          <div className="min-w-0">
            <p className="text-[14px] font-semibold text-slate-800 truncate">
              {isEdit ? "עריכת פוסט" : "פוסט חדש"}
            </p>
            <p className="text-[11px] text-muted-foreground">
              {v.is_published ? "מצב: מפורסם" : "מצב: טיוטה"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 text-xs cursor-pointer select-none">
            <input
              type="checkbox"
              checked={v.is_published}
              onChange={(e) => update("is_published", e.target.checked)}
              className="rounded border-border"
            />
            פרסם
          </label>
          <Button type="submit" size="sm" disabled={pending}>
            {pending ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            {isEdit ? "שמור" : "צור פוסט"}
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-2.5 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Main column */}
        <div className="lg:col-span-2 space-y-5">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              כותרת <span className="text-red-500">*</span>
            </label>
            <Input
              value={v.title}
              onChange={(e) => onTitleChange(e.target.value)}
              placeholder="כותרת הפוסט"
              required
            />
          </div>

          {/* Slug */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Slug (כתובת ה-URL) <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground font-mono">/blog/</span>
              <Input
                value={v.slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  update("slug", e.target.value.toLowerCase());
                }}
                placeholder="החלפת-סוללה-אייפון"
                className="flex-1 font-mono text-sm"
                required
              />
              <button
                type="button"
                onClick={generateSlug}
                disabled={!v.title.trim()}
                title="הפק slug מהכותרת"
                className="px-2.5 py-2 rounded-lg border border-border hover:bg-muted text-slate-700 disabled:opacity-50"
              >
                <Wand2 size={14} />
              </button>
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              אותיות עברית או אנגלית, ספרות ומקפים. רווחים יוחלפו במקפים אוטומטית.
            </p>
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              תקציר (לתצוגה ברשימת הבלוג)
            </label>
            <Textarea
              value={v.excerpt}
              onChange={(e) => update("excerpt", e.target.value)}
              placeholder="משפט-שניים שמסכמים את הפוסט..."
              rows={2}
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              תוכן הפוסט
            </label>
            <MarkdownEditor
              format={v.format}
              onFormatChange={(f) => update("format", f)}
              markdown={v.markdown}
              html={v.html}
              onMarkdownChange={(md) => update("markdown", md)}
              onHtmlChange={(h) => update("html", h)}
              postTitle={v.title}
            />
          </div>
        </div>

        {/* Side column */}
        <div className="space-y-5">
          {/* Cover image */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              תמונת כיסוי
            </label>
            <CoverImagePicker
              value={v.cover_image_url}
              onChange={(url) => update("cover_image_url", url)}
            />
          </div>

          {/* SEO Score Panel */}
          <SeoPanel
            input={{
              title: v.title,
              slug: v.slug,
              excerpt: v.excerpt,
              cover_image_url: v.cover_image_url,
              seo_title: v.seo_title,
              seo_description: v.seo_description,
              seo_keywords: v.seo_keywords,
              body: seoBody,
            }}
            onAddKeyword={addKeyword}
          />

          {/* SEO inputs */}
          <div className="bg-card border border-border rounded-xl p-4 space-y-3">
            <p className="text-xs font-semibold text-slate-700">SEO (אופציונלי)</p>
            <div>
              <label className="block text-[11px] text-muted-foreground mb-1">SEO Title</label>
              <Input
                value={v.seo_title}
                onChange={(e) => update("seo_title", e.target.value)}
                placeholder="ברירת מחדל: כותרת הפוסט"
                className="text-sm"
              />
            </div>
            <div>
              <label className="block text-[11px] text-muted-foreground mb-1">SEO Description</label>
              <Textarea
                value={v.seo_description}
                onChange={(e) => update("seo_description", e.target.value)}
                placeholder="ברירת מחדל: התקציר"
                rows={3}
                className="text-sm"
              />
            </div>
            <div>
              <label className="block text-[11px] text-muted-foreground mb-1">
                Keywords (מופרדים בפסיק)
              </label>
              <Input
                value={v.seo_keywords}
                onChange={(e) => update("seo_keywords", e.target.value)}
                placeholder="תיקון אייפון, מסך אייפון, ראשון לציון"
                className="text-sm"
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
