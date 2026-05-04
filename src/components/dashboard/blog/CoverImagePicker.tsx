"use client";

import Image from "next/image";
import { useRef, useState, useTransition } from "react";
import { ImagePlus, X, Loader2 } from "lucide-react";

type Props = {
  value: string | null;
  onChange: (url: string | null) => void;
};

export default function CoverImagePicker({ value, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, startUpload] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleClick() {
    setError(null);
    inputRef.current?.click();
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";
    if (!file.type.startsWith("image/")) {
      setError("הקובץ חייב להיות תמונה");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("התמונה גדולה מ-5MB");
      return;
    }
    startUpload(async () => {
      try {
        const fd = new FormData();
        fd.append("file", file);
        fd.append("folder", "ad-phones/blog/covers");
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        const data = await res.json();
        if (!res.ok || !data.url) {
          setError(data.error || "שגיאה בהעלאת התמונה");
          return;
        }
        onChange(data.url);
      } catch {
        setError("שגיאת רשת בהעלאה");
      }
    });
  }

  return (
    <div>
      {value ? (
        <div className="relative rounded-xl overflow-hidden border border-border bg-muted aspect-[16/9]">
          <Image
            src={value}
            alt="תמונת כיסוי"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 700px"
          />
          <button
            type="button"
            onClick={() => onChange(null)}
            aria-label="הסר תמונה"
            className="absolute top-2 left-2 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80"
          >
            <X size={16} />
          </button>
          <button
            type="button"
            onClick={handleClick}
            disabled={uploading}
            className="absolute bottom-2 left-2 px-3 py-1.5 text-xs rounded-md bg-black/60 text-white hover:bg-black/80 disabled:opacity-50 flex items-center gap-1.5"
          >
            {uploading ? <Loader2 size={12} className="animate-spin" /> : <ImagePlus size={12} />}
            החלף
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={handleClick}
          disabled={uploading}
          className="w-full aspect-[16/9] rounded-xl border-2 border-dashed border-border bg-muted/40 hover:bg-muted hover:border-primary/30 transition-colors flex flex-col items-center justify-center gap-2 text-slate-600 disabled:opacity-50"
        >
          {uploading ? (
            <>
              <Loader2 size={24} className="animate-spin" />
              <span className="text-sm">מעלה...</span>
            </>
          ) : (
            <>
              <ImagePlus size={24} />
              <span className="text-sm font-medium">העלה תמונת כיסוי</span>
              <span className="text-xs text-muted-foreground">JPG / PNG / WebP · עד 5MB</span>
            </>
          )}
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
      />
      {error && <p className="text-xs text-red-600 mt-2">{error}</p>}
    </div>
  );
}
