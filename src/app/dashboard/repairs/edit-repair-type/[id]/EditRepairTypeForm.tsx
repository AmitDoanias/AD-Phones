"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Trash2, AlertTriangle } from "lucide-react";
import TrustBadgesEditor from "../../TrustBadgesEditor";
import { DEFAULT_TRUST_BADGES } from "@/lib/trustBadges";
import {
  DEVICE_CATEGORY_LABELS,
  DEVICE_CATEGORY_ORDER,
  type DeviceCategory,
} from "@/lib/deviceCategory";

interface Props {
  id: string;
  initialName: string;
  initialDescription: string | null;
  initialSubtitle: string | null;
  initialTrustBadges: string[] | null;
  initialDeviceCategory: DeviceCategory | null;
  usageCount: number;
}

export default function EditRepairTypeForm({ id, initialName, initialDescription, initialSubtitle, initialTrustBadges, initialDeviceCategory, usageCount }: Props) {
  const router = useRouter();
  const [name, setName] = useState(initialName);
  const [subtitle, setSubtitle] = useState(initialSubtitle ?? "");
  const [description, setDescription] = useState(initialDescription ?? "");
  const [deviceCategory, setDeviceCategory] = useState<DeviceCategory | "">(
    initialDeviceCategory ?? ""
  );
  const [trustBadges, setTrustBadges] = useState<string[]>(
    initialTrustBadges && initialTrustBadges.length > 0
      ? initialTrustBadges
      : [...DEFAULT_TRUST_BADGES]
  );
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (deviceCategory === "") {
      setError("יש לבחור קטגוריית מכשיר");
      return;
    }
    setLoading(true);
    setError("");
    const supabase = createClient();
    const cleanedBadges = trustBadges.map((b) => b.trim()).filter((b) => b.length > 0);
    const { error } = await supabase
      .from("repair_types")
      .update({
        name,
        subtitle: subtitle.trim() || null,
        description: description.trim() || null,
        trust_badges: cleanedBadges.length > 0 ? cleanedBadges : null,
        device_category: deviceCategory,
      })
      .eq("id", id);
    if (error) { setError("שגיאה בשמירה"); setLoading(false); return; }
    router.push("/dashboard/repairs");
    router.refresh();
  }

  async function handleDelete() {
    const msg = usageCount > 0
      ? `סוג תיקון זה משויך ל-${usageCount} דגמים. מחיקתו תסיר אותו מכולם. להמשיך?`
      : `למחוק את "${initialName}"?`;
    if (!confirm(msg)) return;
    setDeleting(true);
    const supabase = createClient();
    await supabase.from("repair_types").delete().eq("id", id);
    router.push("/dashboard/repairs");
    router.refresh();
  }

  return (
    <form
      onSubmit={handleSave}
      className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col gap-4"
    >
      <Input
        label="שם סוג התיקון"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-slate-700">
          קטגוריית מכשיר <span className="text-red-500">*</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {DEVICE_CATEGORY_ORDER.map((cat) => {
            const active = deviceCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setDeviceCategory(cat)}
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
        <p className="text-xs text-slate-400">
          קובע אילו דגמים זמינים לשיוך ובאיזו סקציה התיקון יופיע בדשבורד. לא משפיע על SEO או דפים ציבוריים.
        </p>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-slate-700">
          כותרת משנה <span className="text-slate-400 font-normal">(אופציונלי — מוצגת מתחת לכותרת הראשית בדף התיקון)</span>
        </label>
        <input
          type="text"
          value={subtitle}
          onChange={(e) => setSubtitle(e.target.value)}
          placeholder="ברירת מחדל: מחיר קבוע • אחריות 90 יום • שירות ביום הפנייה"
          className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0071e3] focus:border-[#0071e3]"
        />
        <p className="text-xs text-slate-400">
          שורה קצרה שמופיעה מתחת לכותרת — השתמש ב-• להפרדה בין נקודות.
        </p>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-slate-700">
          תיאור התיקון <span className="text-slate-400 font-normal">(אופציונלי — מוצג בחלונית בדף הבית ובדף התיקון)</span>
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={5}
          placeholder="לדוגמה: החלפת מסך מקורי כוללת פירוק מקצועי, הרכבת חלק מקורי של Apple ובדיקה מקיפה. השירות אורך כשעה ומגיע עם אחריות של 90 יום..."
          className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#0071e3] focus:border-[#0071e3] resize-y"
        />
        <p className="text-xs text-slate-400">
          המלצה: 2-5 שורות. כלול את המקצועיות, זמן השירות, האחריות ואזור השירות — משפר SEO וחוויית לקוח.
        </p>
      </div>

      <TrustBadgesEditor value={trustBadges} onChange={setTrustBadges} />

      {usageCount > 0 && (
        <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-700">
          <AlertTriangle size={16} className="shrink-0 mt-0.5" />
          <span>
            שינוי השם יתעדכן בכל {usageCount} הדגמים שמשויכים לתיקון זה
          </span>
        </div>
      )}

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex items-center justify-between mt-1">
        <div className="flex gap-2">
          <Button type="submit" loading={loading}>שמור</Button>
          <Button type="button" variant="ghost" onClick={() => router.back()}>ביטול</Button>
        </div>
        <Button
          type="button"
          variant="danger"
          size="sm"
          loading={deleting}
          onClick={handleDelete}
        >
          <Trash2 size={14} /> מחק
        </Button>
      </div>
    </form>
  );
}
