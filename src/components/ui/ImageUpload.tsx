"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Upload, X, Link as LinkIcon, ImageIcon } from "lucide-react";
import Button from "./Button";

interface Props {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  label?: string;
  hint?: string;
}

export default function ImageUpload({
  value,
  onChange,
  folder = "ad-phones/models",
  label = "תמונה",
  hint,
}: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [urlMode, setUrlMode] = useState(false);
  const [urlInput, setUrlInput] = useState(value);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Upload failed");
      onChange(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "שגיאה בהעלאה");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  function handleUrlSave() {
    onChange(urlInput.trim());
    setUrlMode(false);
  }

  return (
    <div className="flex flex-col gap-1">
      <span className="text-sm font-medium text-slate-700">{label}</span>

      {value ? (
        <div className="relative w-full h-44 rounded-xl overflow-hidden border border-slate-200 bg-slate-50 group">
          <Image
            src={value}
            alt="תמונת דגם"
            fill
            className="object-contain p-2"
            sizes="(max-width: 640px) 100vw, 400px"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="bg-white text-slate-700 text-xs font-medium px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-slate-100"
            >
              <Upload size={13} /> החלף
            </button>
            <button
              type="button"
              onClick={() => onChange("")}
              className="bg-white text-red-500 text-xs font-medium px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-red-50"
            >
              <X size={13} /> הסר
            </button>
          </div>
        </div>
      ) : (
        <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 flex flex-col items-center gap-3 bg-slate-50">
          <ImageIcon size={32} className="text-slate-300" />
          <p className="text-sm text-slate-400">אין תמונה</p>
          <div className="flex gap-2">
            <Button
              type="button"
              size="sm"
              variant="outline"
              loading={uploading}
              onClick={() => fileRef.current?.click()}
            >
              <Upload size={14} /> העלה קובץ
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => setUrlMode((v) => !v)}
            >
              <LinkIcon size={14} /> הדבק URL
            </Button>
          </div>
        </div>
      )}

      {urlMode && (
        <div className="flex gap-2 mt-1">
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://..."
            className="flex-1 px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <Button type="button" size="sm" onClick={handleUrlSave}>
            שמור
          </Button>
          <Button type="button" size="sm" variant="ghost" onClick={() => setUrlMode(false)}>
            <X size={14} />
          </Button>
        </div>
      )}

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {error && <p className="text-xs text-red-500">{error}</p>}
      {hint && !error && <p className="text-xs text-slate-400">{hint}</p>}
    </div>
  );
}
