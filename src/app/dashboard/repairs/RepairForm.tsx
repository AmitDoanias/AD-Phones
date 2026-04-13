"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

interface Props {
  type: "brand" | "model" | "repair" | "model_repair";
  brands: { id: string; name: string }[];
  models: { id: string; name: string; brand_id: string }[];
  repairTypes: { id: string; name: string }[];
  defaultModelId?: string;
  initial?: Record<string, string | number | boolean>;
  editId?: string;
}

export default function RepairForm({
  type,
  brands,
  models,
  repairTypes,
  defaultModelId,
  initial,
  editId,
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
        const payload = { name, slug: toSlug(name), sort_order: Number(sortOrder) };
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
        };
        if (editId) {
          await supabase.from("models").update(payload).eq("id", editId);
        } else {
          await supabase.from("models").insert(payload);
        }
      } else if (type === "repair") {
        const payload = { name, slug: toSlug(name) };
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
      className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col gap-4"
    >
      {(type === "brand" || type === "model" || type === "repair") && (
        <Input
          label="שם"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      )}

      {type === "model" && (
        <>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-slate-700">מותג</label>
            <select
              value={brandId}
              onChange={(e) => setBrandId(e.target.value)}
              required
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">בחר מותג</option>
              {brands.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>
          <Input
            label="סדר תצוגה"
            type="number"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          />
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer">
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

      {type === "brand" && (
        <Input
          label="סדר תצוגה"
          type="number"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        />
      )}

      {type === "model_repair" && (
        <>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-slate-700">מותג</label>
            <select
              value={brandId}
              onChange={(e) => {
                setBrandId(e.target.value);
                setModelId("");
              }}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
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
            <label className="text-sm font-medium text-slate-700">דגם</label>
            <select
              value={modelId}
              onChange={(e) => setModelId(e.target.value)}
              required
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
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
            <label className="text-sm font-medium text-slate-700">סוג תיקון</label>
            <select
              value={repairTypeId}
              onChange={(e) => setRepairTypeId(e.target.value)}
              required
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
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
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer">
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
