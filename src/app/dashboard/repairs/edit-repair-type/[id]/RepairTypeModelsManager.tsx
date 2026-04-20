"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Button from "@/components/ui/Button";
import { Plus, Trash2, Check, AlertTriangle } from "lucide-react";
import {
  DEVICE_CATEGORY_LABELS,
  modelMatchesCategory,
  type DeviceCategory,
} from "@/lib/deviceCategory";

type ExistingRepair = {
  id: string;
  price: number;
  duration_min: number;
  is_active: boolean;
};

type ModelData = {
  id: string;
  name: string;
  is_active: boolean;
  existingRepair: ExistingRepair | null;
};

type BrandData = {
  id: string;
  name: string;
  models: ModelData[];
};

interface Props {
  repairTypeId: string;
  brands: BrandData[];
  deviceCategory: DeviceCategory | null;
}

type Draft = { price?: string; duration?: string };

function toPositiveNumber(raw: string): number | null {
  const trimmed = raw.trim();
  if (trimmed === "") return null;
  const n = Number(trimmed);
  if (!Number.isFinite(n) || n <= 0) return null;
  return n;
}

export default function RepairTypeModelsManager({ repairTypeId, brands, deviceCategory }: Props) {
  const router = useRouter();
  const supabase = createClient();

  // Filter brands/models to only those matching the chosen device category.
  // If no category is set, we skip rendering the manager entirely below.
  const filteredBrands: BrandData[] = deviceCategory
    ? brands
        .map((brand) => ({
          ...brand,
          models: brand.models.filter((model) =>
            modelMatchesCategory(model.name, brand.name, deviceCategory)
          ),
        }))
        .filter((brand) => brand.models.length > 0)
    : [];

  const [repairMap, setRepairMap] = useState<Record<string, ExistingRepair | null>>(() => {
    const map: Record<string, ExistingRepair | null> = {};
    for (const brand of filteredBrands) {
      for (const model of brand.models) {
        map[model.id] = model.existingRepair;
      }
    }
    return map;
  });

  const [drafts, setDrafts] = useState<Record<string, Draft>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  const [bulkPrice, setBulkPrice] = useState("");
  const [bulkDuration, setBulkDuration] = useState("");
  const [bulkLoading, setBulkLoading] = useState(false);

  const { linkedCount, missingCount } = useMemo(() => {
    let linked = 0;
    let missing = 0;
    for (const brand of filteredBrands) {
      for (const model of brand.models) {
        if (repairMap[model.id]) linked++;
        else missing++;
      }
    }
    return { linkedCount: linked, missingCount: missing };
  }, [filteredBrands, repairMap]);

  function setLoad(modelId: string, val: boolean) {
    setLoading((prev) => ({ ...prev, [modelId]: val }));
  }

  function setDraft(modelId: string, patch: Partial<Draft>) {
    setDrafts((prev) => ({ ...prev, [modelId]: { ...prev[modelId], ...patch } }));
  }

  function clearDraft(modelId: string) {
    setDrafts((prev) => {
      const next = { ...prev };
      delete next[modelId];
      return next;
    });
  }

  function priceValue(modelId: string): string {
    const draft = drafts[modelId]?.price;
    if (draft !== undefined) return draft;
    const saved = repairMap[modelId];
    return saved ? String(saved.price) : "";
  }

  function durationValue(modelId: string): string {
    const draft = drafts[modelId]?.duration;
    if (draft !== undefined) return draft;
    const saved = repairMap[modelId];
    return saved ? String(saved.duration_min) : "";
  }

  function isDirty(modelId: string): boolean {
    const saved = repairMap[modelId];
    if (!saved) return false;
    const draft = drafts[modelId];
    if (!draft) return false;
    if (draft.price !== undefined && Number(draft.price) !== saved.price) return true;
    if (draft.duration !== undefined && Number(draft.duration) !== saved.duration_min) return true;
    return false;
  }

  function canAddNew(modelId: string): boolean {
    const draft = drafts[modelId];
    if (!draft) return false;
    return toPositiveNumber(draft.price ?? "") !== null && toPositiveNumber(draft.duration ?? "") !== null;
  }

  async function handleSaveRow(modelId: string) {
    const existing = repairMap[modelId];
    if (!existing) return;
    const draft = drafts[modelId] ?? {};
    const priceNum =
      draft.price !== undefined ? toPositiveNumber(draft.price) ?? existing.price : existing.price;
    const durationNum =
      draft.duration !== undefined
        ? toPositiveNumber(draft.duration) ?? existing.duration_min
        : existing.duration_min;

    setLoad(modelId, true);
    const { error } = await supabase
      .from("model_repairs")
      .update({ price: priceNum, duration_min: durationNum })
      .eq("id", existing.id);
    setLoad(modelId, false);
    if (error) return;

    setRepairMap((prev) => ({
      ...prev,
      [modelId]: { ...existing, price: priceNum, duration_min: durationNum },
    }));
    clearDraft(modelId);
    router.refresh();
  }

  async function handleAddRow(modelId: string) {
    const draft = drafts[modelId];
    const priceNum = toPositiveNumber(draft?.price ?? "");
    const durationNum = toPositiveNumber(draft?.duration ?? "");
    if (priceNum === null || durationNum === null) return;

    setLoad(modelId, true);
    const { data, error } = await supabase
      .from("model_repairs")
      .insert({
        model_id: modelId,
        repair_type_id: repairTypeId,
        price: priceNum,
        duration_min: durationNum,
        is_active: true,
      })
      .select()
      .single();
    setLoad(modelId, false);
    if (error || !data) return;

    setRepairMap((prev) => ({
      ...prev,
      [modelId]: {
        id: data.id,
        price: priceNum,
        duration_min: durationNum,
        is_active: true,
      },
    }));
    clearDraft(modelId);
    router.refresh();
  }

  async function handleDelete(modelId: string, modelName: string) {
    const existing = repairMap[modelId];
    if (!existing) return;
    if (!confirm(`למחוק תיקון זה מ-${modelName}?`)) return;
    const { error } = await supabase.from("model_repairs").delete().eq("id", existing.id);
    if (error) return;
    setRepairMap((prev) => ({ ...prev, [modelId]: null }));
    clearDraft(modelId);
    router.refresh();
  }

  async function handleBulkUpdateExisting() {
    const priceNum = toPositiveNumber(bulkPrice);
    const durationNum = toPositiveNumber(bulkDuration);
    const update: { price?: number; duration_min?: number } = {};
    if (priceNum !== null) update.price = priceNum;
    if (durationNum !== null) update.duration_min = durationNum;
    if (Object.keys(update).length === 0 || linkedCount === 0) return;

    setBulkLoading(true);
    const { error } = await supabase
      .from("model_repairs")
      .update(update)
      .eq("repair_type_id", repairTypeId);
    setBulkLoading(false);
    if (error) return;

    setRepairMap((prev) => {
      const next = { ...prev };
      for (const key of Object.keys(next)) {
        const row = next[key];
        if (!row) continue;
        next[key] = {
          ...row,
          ...(update.price !== undefined ? { price: update.price } : {}),
          ...(update.duration_min !== undefined ? { duration_min: update.duration_min } : {}),
        };
      }
      return next;
    });
    setDrafts({});
    setBulkPrice("");
    setBulkDuration("");
    router.refresh();
  }

  async function handleBulkAddMissing() {
    const priceNum = toPositiveNumber(bulkPrice);
    const durationNum = toPositiveNumber(bulkDuration);
    if (priceNum === null || durationNum === null) return;

    const missingIds: string[] = [];
    for (const brand of filteredBrands) {
      for (const model of brand.models) {
        if (!repairMap[model.id]) missingIds.push(model.id);
      }
    }
    if (missingIds.length === 0) return;

    setBulkLoading(true);
    const rows = missingIds.map((mid) => ({
      model_id: mid,
      repair_type_id: repairTypeId,
      price: priceNum,
      duration_min: durationNum,
      is_active: true,
    }));
    const { data, error } = await supabase.from("model_repairs").insert(rows).select();
    setBulkLoading(false);
    if (error || !data) return;

    setRepairMap((prev) => {
      const next = { ...prev };
      for (const row of data) {
        next[row.model_id] = {
          id: row.id,
          price: row.price,
          duration_min: row.duration_min,
          is_active: row.is_active,
        };
      }
      return next;
    });
    setBulkPrice("");
    setBulkDuration("");
    router.refresh();
  }

  if (!deviceCategory) {
    return (
      <div className="flex items-start gap-2 p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-700">
        <AlertTriangle size={16} className="shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold">בחר קטגוריית מכשיר כדי לראות דגמים רלוונטיים</p>
          <p className="text-xs mt-0.5 text-amber-600">
            קטגוריית המכשיר נבחרת בטופס למעלה (iPhone / iPad / Samsung). אחרי השמירה, תופיע כאן טבלה עם הדגמים המתאימים בלבד.
          </p>
        </div>
      </div>
    );
  }

  const hasAnyModels = filteredBrands.some((b) => b.models.length > 0);
  if (!hasAnyModels) {
    return (
      <div className="flex items-start gap-2 p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-600">
        <AlertTriangle size={16} className="shrink-0 mt-0.5 text-slate-400" />
        <p>אין דגמים זמינים עבור קטגוריית {DEVICE_CATEGORY_LABELS[deviceCategory]}. הוסף דגמים חדשים דרך דף ניהול התיקונים.</p>
      </div>
    );
  }

  const canBulkUpdate =
    (toPositiveNumber(bulkPrice) !== null || toPositiveNumber(bulkDuration) !== null) &&
    linkedCount > 0;
  const canBulkAdd =
    toPositiveNumber(bulkPrice) !== null && toPositiveNumber(bulkDuration) !== null && missingCount > 0;

  return (
    <div className="flex flex-col gap-5">
      {/* Bulk panel */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex flex-col gap-3">
        <div>
          <h2 className="text-base font-semibold text-slate-700">עריכה מהירה לכל הדגמים</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            החל מחיר/זמן אחיד על הדגמים הקיימים, או הוסף את התיקון לכל הדגמים שעדיין לא משויכים.
          </p>
        </div>
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-slate-500">מחיר חדש</label>
            <div className="flex items-center gap-1">
              <input
                type="number"
                value={bulkPrice}
                onChange={(e) => setBulkPrice(e.target.value)}
                className="w-28 px-2 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="—"
                min="0"
              />
              <span className="text-xs text-slate-400">₪</span>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-slate-500">זמן חדש</label>
            <div className="flex items-center gap-1">
              <input
                type="number"
                value={bulkDuration}
                onChange={(e) => setBulkDuration(e.target.value)}
                className="w-28 px-2 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="—"
                min="0"
              />
              <span className="text-xs text-slate-400">דק</span>
            </div>
          </div>
          <div className="flex items-end gap-2">
            <Button
              size="sm"
              loading={bulkLoading}
              disabled={!canBulkUpdate}
              onClick={handleBulkUpdateExisting}
            >
              עדכן את כל הקיימים ({linkedCount})
            </Button>
            <Button
              size="sm"
              variant="outline"
              loading={bulkLoading}
              disabled={!canBulkAdd}
              onClick={handleBulkAddMissing}
            >
              <Plus size={12} /> הוסף לכל החסרים ({missingCount})
            </Button>
          </div>
        </div>
      </div>

      {/* Per-model grid */}
      <div>
        <h2 className="text-base font-semibold text-slate-700 mb-3">מחירים וזמנים לפי דגם</h2>
        <div className="flex flex-col gap-3">
          {filteredBrands.map((brand) => {
            if (brand.models.length === 0) return null;
            return (
              <div
                key={brand.id}
                className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden"
              >
                <div className="px-4 py-2.5 bg-[#0f172a]">
                  <h3 className="font-semibold text-white text-sm">{brand.name}</h3>
                </div>
                <div className="divide-y divide-slate-100">
                  {brand.models.map((model) => {
                    const existing = repairMap[model.id];
                    const isLoading = !!loading[model.id];
                    const dirty = isDirty(model.id);
                    const price = priceValue(model.id);
                    const duration = durationValue(model.id);

                    return (
                      <div
                        key={model.id}
                        className={`px-4 py-2.5 flex items-center gap-3 flex-wrap ${
                          !model.is_active ? "opacity-50" : ""
                        }`}
                      >
                        <span className="text-sm font-medium text-slate-700 min-w-[10rem]">
                          {model.name}
                        </span>

                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            value={price}
                            onChange={(e) => setDraft(model.id, { price: e.target.value })}
                            className="w-24 px-2 py-1 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-60"
                            placeholder="מחיר"
                            min="0"
                            disabled={isLoading}
                          />
                          <span className="text-xs text-slate-400">₪</span>
                        </div>

                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            value={duration}
                            onChange={(e) => setDraft(model.id, { duration: e.target.value })}
                            className="w-24 px-2 py-1 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-60"
                            placeholder="זמן"
                            min="0"
                            disabled={isLoading}
                          />
                          <span className="text-xs text-slate-400">דק</span>
                        </div>

                        <div className="flex items-center gap-2 mr-auto">
                          {existing ? (
                            <>
                              {dirty && (
                                <Button
                                  size="sm"
                                  loading={isLoading}
                                  onClick={() => handleSaveRow(model.id)}
                                >
                                  <Check size={14} /> שמור
                                </Button>
                              )}
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-red-400 hover:text-red-600"
                                onClick={() => handleDelete(model.id, model.name)}
                              >
                                <Trash2 size={13} />
                              </Button>
                            </>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-xs h-7"
                              loading={isLoading}
                              disabled={!canAddNew(model.id)}
                              onClick={() => handleAddRow(model.id)}
                            >
                              <Plus size={12} /> הוסף
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
