"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import ImageUpload from "@/components/ui/ImageUpload";
import TrustBadgesEditor from "./TrustBadgesEditor";
import { DEFAULT_TRUST_BADGES } from "@/lib/trustBadges";
import {
  DEVICE_CATEGORY_LABELS,
  DEVICE_CATEGORY_ORDER,
  isValidDeviceCategory,
  type DeviceCategory,
} from "@/lib/deviceCategory";

interface Props {
  type: "brand" | "model" | "repair" | "model_repair";
  brands: { id: string; name: string }[];
  models: { id: string; name: string; brand_id: string }[];
  repairTypes: { id: string; name: string }[];
  defaultModelId?: string;
  initial?: Record<string, string | number | boolean | string[] | null>;
  editId?: string;
  brandModelCounts?: Record<string, number>;
}

export default function RepairForm({
  type,
  brands,
  models,
  repairTypes,
  defaultModelId,
  initial,
  editId,
  brandModelCounts,
}: Props) {
  const router = useRouter();
  const supabase = createClient();

  const [name, setName] = useState((initial?.name as string) ?? "");
  const [brandId, setBrandId] = useState((initial?.brand_id as string) ?? "");
  const [modelId, setModelId] = useState(
    (initial?.model_id as string) ?? defaultModelId ?? ""
  );
  const [repairTypeId, setRepairTypeId] = useState(
    (initial?.repair_type_id as string) ?? ""
  );
  const [price, setPrice] = useState((initial?.price as string) ?? "");
  const [duration, setDuration] = useState(
    (initial?.duration_min as string) ?? "30"
  );
  const [sortOrder, setSortOrder] = useState(
    (initial?.sort_order as string) ?? "0"
  );
  const [isActive, setIsActive] = useState(
    initial?.is_active !== undefined ? (initial.is_active as boolean) : true
  );
  // Model image + SEO fields
  const [imageUrl, setImageUrl] = useState((initial?.image_url as string) ?? "");
  const [altText, setAltText] = useState((initial?.alt_text as string) ?? "");
  const [seoTitle, setSeoTitle] = useState((initial?.seo_title as string) ?? "");
  const [seoDescription, setSeoDescription] = useState((initial?.seo_description as string) ?? "");
  const [repairDescription, setRepairDescription] = useState((initial?.description as string) ?? "");
  const [repairSubtitle, setRepairSubtitle] = useState((initial?.subtitle as string) ?? "");
  const [repairTrustBadges, setRepairTrustBadges] = useState<string[]>(
    Array.isArray(initial?.trust_badges) && (initial.trust_badges as unknown[]).length > 0
      ? (initial.trust_badges as string[])
      : [...DEFAULT_TRUST_BADGES]
  );
  const [repairDeviceCategory, setRepairDeviceCategory] = useState<DeviceCategory | "">(
    isValidDeviceCategory(initial?.device_category) ? initial.device_category : ""
  );
  const [productLine, setProductLine] = useState<"" | "iPhone" | "iPad">("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Auto-set sort_order when brand changes (new model only)
  useEffect(() => {
    if (type === "model" && !editId && brandId && brandModelCounts) {
      setSortOrder(String(brandModelCounts[brandId] ?? 0));
    }
  }, [brandId, type, editId, brandModelCounts]);

  // Detect Apple brand selection
  const selectedBrandName = brands.find((b) => b.id === brandId)?.name ?? "";
  const isApple = selectedBrandName.toLowerCase() === "apple";

  function toSlug(text: string) {
    // Use timestamp-based slug to support Hebrew names
    const base = text
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]/g, "");
    const suffix = Date.now().toString(36);
    return base ? `${base}-${suffix}` : suffix;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (type === "brand") {
        const payload = { name, slug: toSlug(name), sort_order: Number(sortOrder), icon_url: imageUrl || null };
        if (editId) {
          await supabase.from("brands").update(payload).eq("id", editId);
        } else {
          await supabase.from("brands").insert(payload);
        }
      } else if (type === "model") {
        const payload = {
          name,
          slug: toSlug(name),
          brand_id: brandId,
          sort_order: Number(sortOrder),
          is_active: isActive,
          image_url: imageUrl || null,
          alt_text: altText || null,
          seo_title: seoTitle || null,
          seo_description: seoDescription || null,
        };
        if (editId) {
          await supabase.from("models").update(payload).eq("id", editId);
        } else {
          await supabase.from("models").insert(payload);
        }
      } else if (type === "repair") {
        if (repairDeviceCategory === "") {
          setError("יש לבחור קטגוריית מכשיר");
          setLoading(false);
          return;
        }
        const cleanedBadges = repairTrustBadges.map((b) => b.trim()).filter((b) => b.length > 0);
        const payload = {
          name,
          slug: toSlug(name),
          subtitle: repairSubtitle.trim() || null,
          description: repairDescription.trim() || null,
          trust_badges: cleanedBadges.length > 0 ? cleanedBadges : null,
          device_category: repairDeviceCategory,
        };
        if (editId) {
          await supabase.from("repair_types").update(payload).eq("id", editId);
        } else {
          await supabase.from("repair_types").insert(payload);
        }
      } else if (type === "model_repair") {
        const payload = {
          model_id: modelId,
          repair_type_id: repairTypeId,
          price: Number(price),
          duration_min: Number(duration),
          is_active: isActive,
        };
        if (editId) {
          await supabase.from("model_repairs").update(payload).eq("id", editId);
        } else {
          await supabase.from("model_repairs").insert(payload);
        }
      }

      router.push("/dashboard/repairs");
      router.refresh();
    } catch {
      setError("שגיאה בשמירה. נסה שוב.");
      setLoading(false);
    }
  }

  const filteredModels = brandId
    ? models.filter((m) => m.brand_id === brandId)
    : models;

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-card rounded-2xl border border-border shadow-[0_1px_4px_rgba(0,0,0,0.06),0_4px_20px_rgba(0,0,0,0.05)] p-5 flex flex-col gap-4"
    >
      {type === "model" && (
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-foreground">מותג</label>
          <select
            value={brandId}
            onChange={(e) => { setBrandId(e.target.value); setProductLine(""); }}
            required
            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">בחר מותג</option>
            {brands.map((b) => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
        </div>
      )}

      {/* Apple product line selector */}
      {type === "model" && isApple && (
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-foreground">
            סוג מכשיר <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-2">
            {(["iPhone", "iPad"] as const).map((line) => (
              <button
                key={line}
                type="button"
                onClick={() => setProductLine(line)}
                className="flex-1 py-2 rounded-lg text-sm font-medium border transition-colors"
                style={{
                  background: productLine === line ? "#0071e3" : "white",
                  color: productLine === line ? "white" : "#374151",
                  borderColor: productLine === line ? "#0071e3" : "#d1d5db",
                }}
              >
                {line}
              </button>
            ))}
          </div>
          <p className="text-xs text-slate-400">
            משמש לשיוך הדגם לקטגוריה (iPhone / iPad) - לא יתווסף לשם
          </p>
        </div>
      )}

      {(type === "brand" || type === "model" || type === "repair") && (
        <Input
          label={type === "model" && isApple && productLine ? "שם הדגם" : "שם"}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={type === "model" && isApple && productLine === "iPhone" ? "לדוגמה: אייפון 15 פרו מקס" : type === "model" && isApple && productLine === "iPad" ? "לדוגמה: אייפד פרו 12.9″" : ""}
          required
        />
      )}

      {type === "repair" && (
        <>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">
              קטגוריית מכשיר <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {DEVICE_CATEGORY_ORDER.map((cat) => {
                const active = repairDeviceCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setRepairDeviceCategory(cat)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                      active
                        ? "bg-[#0071e3] text-white border-[#0071e3]"
                        : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    {DEVICE_CATEGORY_LABELS[cat]}
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-muted-foreground">
              קובע אילו דגמים זמינים לשיוך ובאיזו סקציה התיקון יופיע בדשבורד. לא משפיע על SEO או דפים ציבוריים.
            </p>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">
              כותרת משנה <span className="text-muted-foreground font-normal">(אופציונלי - מוצגת מתחת לכותרת הראשית בדף התיקון)</span>
            </label>
            <input
              type="text"
              value={repairSubtitle}
              onChange={(e) => setRepairSubtitle(e.target.value)}
              placeholder="ברירת מחדל: מחיר קבוע • אחריות 90 יום • שירות ביום הפנייה"
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground"
            />
            <p className="text-xs text-muted-foreground">
              שורה קצרה שמופיעה מתחת לכותרת - השתמש ב-• להפרדה בין נקודות.
            </p>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">
              תיאור התיקון <span className="text-muted-foreground font-normal">(אופציונלי - מוצג מתחת למחיר בדף התיקון ובחלונית בדף הבית)</span>
            </label>
            <textarea
              value={repairDescription}
              onChange={(e) => setRepairDescription(e.target.value)}
              rows={5}
              placeholder="לדוגמה: החלפת מסך מקורי כוללת פירוק מקצועי, הרכבת חלק מקורי ובדיקה מקיפה. השירות אורך כשעה ומגיע עם אחריות 90 יום..."
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-ring resize-y placeholder:text-muted-foreground"
            />
            <p className="text-xs text-muted-foreground">
              המלצה: 2-5 שורות. כלול את המקצועיות, זמן השירות, האחריות ואזור השירות - משפר SEO וחוויית לקוח.
            </p>
          </div>

          <TrustBadgesEditor value={repairTrustBadges} onChange={setRepairTrustBadges} />
        </>
      )}

      {type === "model" && (
        <>
          <Input
            label="סדר תצוגה"
            type="number"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          />
          <label className="flex items-center gap-2 text-sm font-medium text-foreground cursor-pointer">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="rounded"
            />
            פעיל
          </label>

          {/* Image + SEO */}
          <hr className="border-slate-100" />
          <ImageUpload
            label="תמונת הדגם"
            value={imageUrl}
            onChange={setImageUrl}
            hint="תמונה תופיע בדף הקטלוג ללקוחות - מומלץ תמונת מוצר רשמית"
          />
          <Input
            label="Alt Text (תיאור תמונה)"
            value={altText}
            onChange={(e) => setAltText(e.target.value)}
            placeholder='לדוגמה: "iPhone 16 Pro Max צבע טיטניום"'
            hint="חשוב לנגישות ו-SEO - תאר את התמונה בקצרה"
          />
          <hr className="border-slate-100" />
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">SEO</p>
          <Input
            label="כותרת SEO"
            value={seoTitle}
            onChange={(e) => setSeoTitle(e.target.value)}
            placeholder='לדוגמה: "תיקון iPhone 16 Pro Max ברחובות | A&D Phones"'
            hint="מופיע בכרטיסיית הדפדפן ובגוגל - מקסימום 60 תווים"
          />
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-foreground">תיאור SEO</label>
            <textarea
              value={seoDescription}
              onChange={(e) => setSeoDescription(e.target.value)}
              rows={3}
              placeholder='לדוגמה: "תיקון iPhone 16 Pro Max ברחובות - החלפת מסך, סוללה, מצלמה. שירות מהיר עם אחריות. 054-772-3281"'
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none placeholder:text-muted-foreground"
            />
            <p className="text-xs text-muted-foreground">
              {seoDescription.length}/160 תווים - מופיע בתוצאות החיפוש
            </p>
          </div>
        </>
      )}

      {type === "brand" && (
        <>
          <Input
            label="סדר תצוגה"
            type="number"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          />
          <hr className="border-slate-100" />
          <ImageUpload
            label="לוגו / אייקון מותג"
            value={imageUrl}
            onChange={setImageUrl}
            hint="תמונה תופיע בדף בחירת המותג - מומלץ לוגו רשמי על רקע לבן"
          />
        </>
      )}

      {type === "model_repair" && (
        <>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-foreground">מותג</label>
            <select
              value={brandId}
              onChange={(e) => {
                setBrandId(e.target.value);
                setModelId("");
              }}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">כל המותגים</option>
              {brands.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-foreground">דגם</label>
            <select
              value={modelId}
              onChange={(e) => setModelId(e.target.value)}
              required
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">בחר דגם</option>
              {filteredModels.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-foreground">סוג תיקון</label>
            <select
              value={repairTypeId}
              onChange={(e) => setRepairTypeId(e.target.value)}
              required
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">בחר סוג תיקון</option>
              {repairTypes.map((rt) => (
                <option key={rt.id} value={rt.id}>
                  {rt.name}
                </option>
              ))}
            </select>
          </div>

          <Input
            label="מחיר (₪)"
            type="number"
            min="0"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
          <Input
            label="זמן תיקון משוער (דקות)"
            type="number"
            min="15"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />
          <label className="flex items-center gap-2 text-sm font-medium text-foreground cursor-pointer">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="rounded"
            />
            פעיל
          </label>
        </>
      )}

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex gap-3 mt-2">
        <Button type="submit" loading={loading}>
          {editId ? "עדכן" : "שמור"}
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.push("/dashboard/repairs")}
        >
          ביטול
        </Button>
      </div>
    </form>
  );
}
