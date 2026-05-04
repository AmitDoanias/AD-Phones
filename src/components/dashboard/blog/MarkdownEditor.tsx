"use client";

import { useRef, useState, useTransition } from "react";
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  Link as LinkIcon,
  Image as ImageIcon,
  List,
  ListOrdered,
  Quote,
  Code,
  Loader2,
} from "lucide-react";
import BlogPostBody, { type BlogContent } from "@/components/blog/BlogPostBody";

export type ContentFormat = "markdown" | "html";

type Props = {
  format: ContentFormat;
  onFormatChange: (format: ContentFormat) => void;
  markdown: string;
  html: string;
  onMarkdownChange: (md: string) => void;
  onHtmlChange: (html: string) => void;
  postTitle?: string;
};

type Action = {
  Icon: React.ComponentType<{ size?: number }>;
  label: string;
  apply: (selected: string) => string;
};

const MD_ACTIONS: Action[] = [
  { Icon: Heading2, label: "כותרת H2", apply: (s) => `\n## ${s || "כותרת"}\n` },
  { Icon: Heading3, label: "כותרת H3", apply: (s) => `\n### ${s || "כותרת משנה"}\n` },
  { Icon: Bold, label: "מודגש", apply: (s) => `**${s || "טקסט מודגש"}**` },
  { Icon: Italic, label: "נטוי", apply: (s) => `_${s || "טקסט נטוי"}_` },
  { Icon: List, label: "רשימה", apply: (s) => `\n- ${s || "פריט"}\n- פריט\n- פריט\n` },
  { Icon: ListOrdered, label: "רשימה ממוספרת", apply: (s) => `\n1. ${s || "פריט"}\n2. פריט\n3. פריט\n` },
  { Icon: Quote, label: "ציטוט", apply: (s) => `\n> ${s || "ציטוט"}\n` },
  { Icon: Code, label: "קוד", apply: (s) => `\`${s || "code"}\`` },
  { Icon: LinkIcon, label: "קישור", apply: (s) => `[${s || "טקסט הקישור"}](https://example.com)` },
];

const HTML_ACTIONS: Action[] = [
  { Icon: Heading2, label: "כותרת H2", apply: (s) => `\n<h2>${s || "כותרת"}</h2>\n` },
  { Icon: Heading3, label: "כותרת H3", apply: (s) => `\n<h3>${s || "כותרת משנה"}</h3>\n` },
  { Icon: Bold, label: "מודגש", apply: (s) => `<strong>${s || "טקסט מודגש"}</strong>` },
  { Icon: Italic, label: "נטוי", apply: (s) => `<em>${s || "טקסט נטוי"}</em>` },
  { Icon: List, label: "רשימה", apply: (s) => `\n<ul>\n  <li>${s || "פריט"}</li>\n  <li>פריט</li>\n</ul>\n` },
  { Icon: ListOrdered, label: "רשימה ממוספרת", apply: (s) => `\n<ol>\n  <li>${s || "פריט"}</li>\n  <li>פריט</li>\n</ol>\n` },
  { Icon: Quote, label: "ציטוט", apply: (s) => `\n<blockquote>${s || "ציטוט"}</blockquote>\n` },
  { Icon: Code, label: "קוד", apply: (s) => `<code>${s || "code"}</code>` },
  { Icon: LinkIcon, label: "קישור", apply: (s) => `<a href="https://example.com">${s || "טקסט הקישור"}</a>` },
];

export default function MarkdownEditor({
  format,
  onFormatChange,
  markdown,
  html,
  onMarkdownChange,
  onHtmlChange,
  postTitle,
}: Props) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [tab, setTab] = useState<"edit" | "preview">("edit");
  const [uploading, startUpload] = useTransition();
  const [uploadError, setUploadError] = useState<string | null>(null);

  const value = format === "html" ? html : markdown;
  const setValue = format === "html" ? onHtmlChange : onMarkdownChange;
  const actions = format === "html" ? HTML_ACTIONS : MD_ACTIONS;

  function insertAtCursor(text: string) {
    const ta = textareaRef.current;
    if (!ta) {
      setValue(value + text);
      return;
    }
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const before = value.slice(0, start);
    const after = value.slice(end);
    setValue(before + text + after);
    requestAnimationFrame(() => {
      ta.focus();
      const pos = start + text.length;
      ta.setSelectionRange(pos, pos);
    });
  }

  function applyAction(a: Action) {
    const ta = textareaRef.current;
    const selected = ta ? value.slice(ta.selectionStart, ta.selectionEnd) : "";
    insertAtCursor(a.apply(selected));
  }

  function handleImageButton() {
    setUploadError(null);
    fileInputRef.current?.click();
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";
    if (!file.type.startsWith("image/")) {
      setUploadError("הקובץ חייב להיות תמונה");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("התמונה גדולה מ-5MB");
      return;
    }
    startUpload(async () => {
      try {
        const fd = new FormData();
        fd.append("file", file);
        fd.append("folder", "ad-phones/blog");
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        const data = await res.json();
        if (!res.ok || !data.url) {
          setUploadError(data.error || "שגיאה בהעלאת התמונה");
          return;
        }
        const alt = file.name.replace(/\.[^.]+$/, "");
        const insert =
          format === "html"
            ? `\n<img src="${data.url}" alt="${alt}" />\n`
            : `\n\n![${alt}](${data.url})\n\n`;
        insertAtCursor(insert);
      } catch {
        setUploadError("שגיאת רשת בהעלאה");
      }
    });
  }

  const previewContent: BlogContent = format === "html" ? { format: "html", html } : { format: "markdown", markdown };

  return (
    <div className="border border-border rounded-xl bg-card overflow-hidden">
      {/* Toolbar row 1 - format toggle */}
      <div className="flex items-center justify-between gap-2 px-3 py-2 border-b border-border bg-muted/40">
        <div className="flex bg-white rounded-md p-0.5 border border-border" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={format === "markdown"}
            onClick={() => onFormatChange("markdown")}
            className={`px-3 py-1 text-xs font-medium rounded ${
              format === "markdown" ? "bg-primary text-white" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            Markdown
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={format === "html"}
            onClick={() => onFormatChange("html")}
            className={`px-3 py-1 text-xs font-medium rounded ${
              format === "html" ? "bg-primary text-white" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            HTML
          </button>
        </div>
        <div className="flex bg-white rounded-md p-0.5 border border-border" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={tab === "edit"}
            onClick={() => setTab("edit")}
            className={`px-3 py-1 text-xs font-medium rounded ${
              tab === "edit" ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            עריכה
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === "preview"}
            onClick={() => setTab("preview")}
            className={`px-3 py-1 text-xs font-medium rounded ${
              tab === "preview" ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            תצוגה
          </button>
        </div>
      </div>

      {/* Toolbar row 2 - formatting actions (only in edit mode) */}
      {tab === "edit" && (
        <div className="flex items-center gap-1 p-2 border-b border-border bg-muted/30 flex-wrap">
          {actions.map((a, i) => (
            <button
              key={i}
              type="button"
              onClick={() => applyAction(a)}
              title={a.label}
              aria-label={a.label}
              className="w-8 h-8 rounded-md flex items-center justify-center hover:bg-black/5 text-slate-700"
            >
              <a.Icon size={14} />
            </button>
          ))}
          <div className="w-px h-5 bg-border mx-1" aria-hidden />
          <button
            type="button"
            onClick={handleImageButton}
            disabled={uploading}
            title="העלה תמונה"
            className="h-8 px-2.5 rounded-md flex items-center gap-1.5 hover:bg-black/5 text-slate-700 disabled:opacity-50 text-xs"
          >
            {uploading ? <Loader2 size={14} className="animate-spin" /> : <ImageIcon size={14} />}
            <span>תמונה</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      )}

      {uploadError && (
        <div className="px-4 py-2 text-xs bg-red-50 text-red-700 border-b border-red-100">
          {uploadError}
        </div>
      )}

      {tab === "edit" ? (
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={
            format === "html"
              ? "כתוב כאן את תוכן הפוסט ב-HTML..."
              : "כתוב כאן את תוכן הפוסט ב-Markdown..."
          }
          className="w-full min-h-[400px] p-4 text-sm font-mono outline-none resize-y bg-white text-slate-900 leading-relaxed"
          dir={format === "html" ? "ltr" : "rtl"}
          spellCheck={false}
        />
      ) : (
        <div className="bg-[#f5f5f7] p-6 md:p-8 min-h-[400px]">
          <div
            className="max-w-2xl mx-auto bg-white rounded-[16px] p-6 md:p-10"
            style={{ boxShadow: "rgba(0,0,0,0.04) 0px 2px 14px 0px" }}
          >
            {postTitle && (
              <h1
                className="font-bold mb-7"
                style={{
                  color: "#1d1d1f",
                  fontSize: "clamp(1.5rem, 4vw, 2rem)",
                  lineHeight: 1.15,
                  letterSpacing: "-0.28px",
                }}
              >
                {postTitle}
              </h1>
            )}
            <BlogPostBody content={previewContent} />
          </div>
        </div>
      )}

      {tab === "edit" && (
        <div className="px-4 py-2 border-t border-border bg-muted/30 text-[11px] text-muted-foreground flex flex-wrap gap-3">
          {format === "markdown" ? (
            <>
              <span><strong>**מודגש**</strong></span>
              <span><strong>_נטוי_</strong></span>
              <span><strong>## כותרת</strong></span>
              <span><strong>[קישור](url)</strong></span>
              <span><strong>![תמונה](url)</strong></span>
              <span><strong>- רשימה</strong></span>
            </>
          ) : (
            <>
              <span dir="ltr"><strong>{`<h2>`}</strong></span>
              <span dir="ltr"><strong>{`<strong>`}</strong></span>
              <span dir="ltr"><strong>{`<a href="">`}</strong></span>
              <span dir="ltr"><strong>{`<img src="" />`}</strong></span>
              <span dir="ltr"><strong>{`<ul>`}</strong></span>
              <span className="text-amber-700">⚠️ HTML עובר sanitize אוטומטי - <code>{`<script>`}</code> ו-events לא יעבדו</span>
            </>
          )}
        </div>
      )}
    </div>
  );
}
