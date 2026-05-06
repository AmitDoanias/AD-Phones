"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Pencil,
  Trash2,
  ChevronDown,
  ChevronLeft,
  Eye,
  EyeOff,
  Save,
  X,
  FolderTree,
} from "lucide-react";
import Button from "@/components/ui/Button";
import { toast } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";
import type { ShopCategory } from "@/types";

type Props = {
  initialCategories: ShopCategory[];
  productCounts: Record<string, number>;
};

type CategoryNode = ShopCategory & { children: CategoryNode[]; productCount: number };

type FormValues = {
  id?: string;
  name: string;
  slug: string;
  parent_id: string | null;
  description: string;
  image_url: string;
  sort_order: number;
  seo_title: string;
  seo_description: string;
  is_active: boolean;
};

const EMPTY_FORM: FormValues = {
  name: "",
  slug: "",
  parent_id: null,
  description: "",
  image_url: "",
  sort_order: 0,
  seo_title: "",
  seo_description: "",
  is_active: true,
};

function buildTree(categories: ShopCategory[], counts: Record<string, number>): CategoryNode[] {
  const map = new Map<string, CategoryNode>();
  for (const c of categories) {
    map.set(c.id, { ...c, children: [], productCount: counts[c.id] ?? 0 });
  }
  const roots: CategoryNode[] = [];
  for (const node of map.values()) {
    if (node.parent_id && map.has(node.parent_id)) {
      map.get(node.parent_id)!.children.push(node);
    } else {
      roots.push(node);
    }
  }
  // Sort children & roots by sort_order then name
  const sorter = (a: CategoryNode, b: CategoryNode) =>
    a.sort_order - b.sort_order || a.name.localeCompare(b.name, "he");
  roots.sort(sorter);
  for (const node of map.values()) node.children.sort(sorter);
  return roots;
}

// Hebrew slug helper — keep Hebrew letters, lowercase a-z, digits, replace
// spaces with hyphens. Same character class used elsewhere in the project
// (see src/lib/slugify.ts).
function slugifyHebrew(text: string): string {
  if (!text) return "";
  return text
    .toLowerCase()
    .normalize("NFKC")
    .replace(/[^֐-׿a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export default function CategoriesManagerClient({ initialCategories, productCounts }: Props) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [editing, setEditing] = useState<FormValues | null>(null);
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());

  const tree = useMemo(
    () => buildTree(initialCategories, productCounts),
    [initialCategories, productCounts]
  );

  // Flat list (id+name+depth) for the parent selector — exclude the category
  // currently being edited and any descendants of it (can't make a category
  // its own ancestor).
  const flatOptions = useMemo(() => {
    const out: { id: string; name: string; depth: number }[] = [];
    function walk(nodes: CategoryNode[], depth: number, blockedId?: string) {
      for (const n of nodes) {
        if (blockedId && n.id === blockedId) continue;
        out.push({ id: n.id, name: n.name, depth });
        walk(n.children, depth + 1, blockedId);
      }
    }
    walk(tree, 0, editing?.id);
    return out;
  }, [tree, editing?.id]);

  function refresh() {
    router.refresh();
  }

  function startCreate(parentId: string | null = null) {
    setEditing({ ...EMPTY_FORM, parent_id: parentId });
  }

  function startEdit(category: ShopCategory) {
    setEditing({
      id: category.id,
      name: category.name,
      slug: category.slug,
      parent_id: category.parent_id,
      description: category.description ?? "",
      image_url: category.image_url ?? "",
      sort_order: category.sort_order,
      seo_title: category.seo_title ?? "",
      seo_description: category.seo_description ?? "",
      is_active: category.is_active,
    });
  }

  async function handleSave(values: FormValues) {
    if (!values.name.trim() || !values.slug.trim()) {
      toast("שם ו-slug חובה", "error");
      return;
    }
    setBusy(true);
    try {
      const isUpdate = Boolean(values.id);
      const url = isUpdate ? `/api/shop/categories/${values.id}` : "/api/shop/categories";
      const method = isUpdate ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name.trim(),
          slug: values.slug.trim(),
          parent_id: values.parent_id || null,
          description: values.description.trim() || null,
          image_url: values.image_url.trim() || null,
          sort_order: values.sort_order,
          seo_title: values.seo_title.trim() || null,
          seo_description: values.seo_description.trim() || null,
          is_active: values.is_active,
        }),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "שגיאה");
      toast(isUpdate ? "הקטגוריה עודכנה" : "הקטגוריה נוצרה", "success");
      setEditing(null);
      refresh();
    } catch (e) {
      toast(e instanceof Error ? e.message : "שגיאה", "error");
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete(category: CategoryNode) {
    if (category.children.length > 0) {
      toast("לא ניתן למחוק קטגוריה שיש לה תת-קטגוריות. מחק אותן קודם.", "error");
      return;
    }
    if (category.productCount > 0) {
      const confirmed = confirm(
        `לקטגוריה "${category.name}" יש ${category.productCount} מוצרים. למחוק בכל זאת? (המוצרים לא יימחקו, רק יעברו ללא-קטגוריה)`
      );
      if (!confirmed) return;
    } else if (!confirm(`למחוק את הקטגוריה "${category.name}"?`)) {
      return;
    }
    setBusy(true);
    try {
      const res = await fetch(`/api/shop/categories/${category.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error((await res.json()).error ?? "שגיאה");
      toast("הקטגוריה נמחקה", "success");
      refresh();
    } catch (e) {
      toast(e instanceof Error ? e.message : "שגיאה", "error");
    } finally {
      setBusy(false);
    }
  }

  async function handleToggleActive(category: ShopCategory) {
    setBusy(true);
    try {
      const res = await fetch(`/api/shop/categories/${category.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !category.is_active }),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "שגיאה");
      refresh();
    } catch (e) {
      toast(e instanceof Error ? e.message : "שגיאה", "error");
    } finally {
      setBusy(false);
    }
  }

  function toggleCollapsed(id: string) {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-[12px] text-muted-foreground">
          {tree.length === 0
            ? "אין עדיין קטגוריות"
            : `${initialCategories.length} קטגוריות בסך הכל`}
        </p>
        <Button size="sm" onClick={() => startCreate(null)} disabled={busy || !!editing}>
          <Plus size={14} /> קטגוריה חדשה
        </Button>
      </div>

      {editing && (
        <CategoryForm
          values={editing}
          onChange={setEditing}
          onSave={() => handleSave(editing)}
          onCancel={() => setEditing(null)}
          parentOptions={flatOptions}
          busy={busy}
        />
      )}

      {tree.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
          <FolderTree size={32} className="text-slate-300" />
          <p className="text-[13px] text-muted-foreground">
            עדיין לא הוגדרו קטגוריות. תתחיל בלחיצה על &quot;קטגוריה חדשה&quot;.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-1.5">
          {tree.map((node) => (
            <CategoryRow
              key={node.id}
              node={node}
              depth={0}
              collapsed={collapsed}
              onToggleCollapsed={toggleCollapsed}
              onEdit={startEdit}
              onDelete={handleDelete}
              onToggleActive={handleToggleActive}
              onAddChild={(id) => startCreate(id)}
              busy={busy}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function CategoryRow({
  node,
  depth,
  collapsed,
  onToggleCollapsed,
  onEdit,
  onDelete,
  onToggleActive,
  onAddChild,
  busy,
}: {
  node: CategoryNode;
  depth: number;
  collapsed: Set<string>;
  onToggleCollapsed: (id: string) => void;
  onEdit: (c: ShopCategory) => void;
  onDelete: (c: CategoryNode) => void;
  onToggleActive: (c: ShopCategory) => void;
  onAddChild: (parentId: string) => void;
  busy: boolean;
}) {
  const hasChildren = node.children.length > 0;
  const isCollapsed = collapsed.has(node.id);

  return (
    <>
      <div
        className={cn(
          "bg-card rounded-xl border border-border p-3 shadow-[0_1px_4px_rgba(0,0,0,0.04)] flex items-center gap-2",
          !node.is_active && "opacity-60"
        )}
        style={{ marginInlineStart: depth * 24 }}
      >
        {hasChildren ? (
          <button
            type="button"
            onClick={() => onToggleCollapsed(node.id)}
            className="p-1 rounded hover:bg-muted shrink-0"
            aria-label={isCollapsed ? "הרחב" : "כווץ"}
          >
            {isCollapsed ? (
              <ChevronLeft size={14} className="text-muted-foreground" />
            ) : (
              <ChevronDown size={14} className="text-muted-foreground" />
            )}
          </button>
        ) : (
          <span className="w-[22px] shrink-0" aria-hidden />
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-[13px] font-semibold text-slate-800">{node.name}</p>
            <span className="text-[11px] text-muted-foreground" dir="ltr">
              /{node.slug}
            </span>
            <span className="text-[11px] text-muted-foreground bg-muted/50 px-1.5 py-0.5 rounded">
              {node.productCount} מוצרים
            </span>
            {!node.is_active && (
              <span className="text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                מוסתר
              </span>
            )}
          </div>
          {node.description && (
            <p className="text-[11px] text-muted-foreground mt-1 line-clamp-1">
              {node.description}
            </p>
          )}
        </div>

        <div className="flex gap-1 shrink-0">
          <button
            type="button"
            onClick={() => onAddChild(node.id)}
            disabled={busy}
            title="הוסף תת-קטגוריה"
            className="p-1.5 rounded hover:bg-muted text-muted-foreground"
          >
            <Plus size={14} />
          </button>
          <button
            type="button"
            onClick={() => onToggleActive(node)}
            disabled={busy}
            title={node.is_active ? "הסתר" : "הצג"}
            className="p-1.5 rounded hover:bg-muted text-muted-foreground"
          >
            {node.is_active ? <Eye size={14} /> : <EyeOff size={14} />}
          </button>
          <button
            type="button"
            onClick={() => onEdit(node)}
            disabled={busy}
            title="ערוך"
            className="p-1.5 rounded hover:bg-muted text-muted-foreground"
          >
            <Pencil size={14} />
          </button>
          <button
            type="button"
            onClick={() => onDelete(node)}
            disabled={busy}
            title="מחק"
            className="p-1.5 rounded hover:bg-red-50 text-red-600"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {hasChildren && !isCollapsed &&
        node.children.map((child) => (
          <CategoryRow
            key={child.id}
            node={child}
            depth={depth + 1}
            collapsed={collapsed}
            onToggleCollapsed={onToggleCollapsed}
            onEdit={onEdit}
            onDelete={onDelete}
            onToggleActive={onToggleActive}
            onAddChild={onAddChild}
            busy={busy}
          />
        ))}
    </>
  );
}

function CategoryForm({
  values,
  onChange,
  onSave,
  onCancel,
  parentOptions,
  busy,
}: {
  values: FormValues;
  onChange: (v: FormValues) => void;
  onSave: () => void;
  onCancel: () => void;
  parentOptions: { id: string; name: string; depth: number }[];
  busy: boolean;
}) {
  const isUpdate = Boolean(values.id);

  return (
    <div className="bg-muted/30 rounded-xl p-4 border border-border flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-[13px] font-semibold text-slate-800">
          {isUpdate ? "עריכת קטגוריה" : "קטגוריה חדשה"}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="block text-[11px] font-medium text-slate-600 mb-1">שם</label>
          <input
            type="text"
            value={values.name}
            onChange={(e) => {
              const name = e.target.value;
              // Auto-fill slug only if user hasn't edited it manually yet
              const autoSlug = !isUpdate && (values.slug === "" || values.slug === slugifyHebrew(values.name));
              onChange({
                ...values,
                name,
                slug: autoSlug ? slugifyHebrew(name) : values.slug,
              });
            }}
            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-[13px]"
            placeholder='למשל "כיסויים"'
            dir="rtl"
          />
        </div>

        <div>
          <label className="block text-[11px] font-medium text-slate-600 mb-1">Slug (URL)</label>
          <input
            type="text"
            value={values.slug}
            onChange={(e) => onChange({ ...values, slug: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-[13px]"
            placeholder="כיסויים"
            dir="ltr"
          />
        </div>

        <div>
          <label className="block text-[11px] font-medium text-slate-600 mb-1">קטגוריית הורה</label>
          <select
            value={values.parent_id ?? ""}
            onChange={(e) => onChange({ ...values, parent_id: e.target.value || null })}
            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-[13px]"
          >
            <option value="">— ראשי (ללא הורה) —</option>
            {parentOptions.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {"— ".repeat(opt.depth)}
                {opt.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-medium text-slate-600 mb-1">סדר תצוגה</label>
          <input
            type="number"
            value={values.sort_order}
            onChange={(e) => onChange({ ...values, sort_order: Number(e.target.value) || 0 })}
            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-[13px]"
          />
        </div>
      </div>

      <div>
        <label className="block text-[11px] font-medium text-slate-600 mb-1">תיאור (אופציונלי)</label>
        <textarea
          value={values.description}
          onChange={(e) => onChange({ ...values, description: e.target.value })}
          rows={2}
          className="w-full px-3 py-2 rounded-lg border border-border bg-background text-[13px]"
          dir="rtl"
        />
      </div>

      <div>
        <label className="block text-[11px] font-medium text-slate-600 mb-1">URL תמונה (אופציונלי)</label>
        <input
          type="url"
          value={values.image_url}
          onChange={(e) => onChange({ ...values, image_url: e.target.value })}
          className="w-full px-3 py-2 rounded-lg border border-border bg-background text-[13px]"
          placeholder="https://res.cloudinary.com/..."
          dir="ltr"
        />
        <p className="text-[10px] text-muted-foreground mt-1">
          העלה תמונה דרך עריכת מוצר ובהמשך תוכל להעתיק את ה-URL לכאן.
        </p>
      </div>

      <details className="border border-border rounded-lg bg-background">
        <summary className="cursor-pointer px-3 py-2 text-[12px] font-medium text-slate-700">
          🔍 SEO — Meta Tags לגוגל (אופציונלי)
        </summary>
        <div className="p-3 pt-1 flex flex-col gap-3 border-t border-border">
          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              Meta Title (50-60 תווים)
            </label>
            <input
              type="text"
              value={values.seo_title}
              onChange={(e) => onChange({ ...values, seo_title: e.target.value })}
              maxLength={70}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-[13px]"
              dir="rtl"
            />
          </div>
          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              Meta Description (140-160 תווים)
            </label>
            <textarea
              value={values.seo_description}
              onChange={(e) => onChange({ ...values, seo_description: e.target.value })}
              maxLength={200}
              rows={2}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-[13px]"
              dir="rtl"
            />
          </div>
        </div>
      </details>

      <label className="flex items-center gap-2 text-[12px] text-slate-700">
        <input
          type="checkbox"
          checked={values.is_active}
          onChange={(e) => onChange({ ...values, is_active: e.target.checked })}
        />
        פעיל (מוצג ללקוחות)
      </label>

      <div className="flex gap-2 justify-end pt-1">
        <Button size="sm" variant="outline" onClick={onCancel} disabled={busy}>
          <X size={14} /> ביטול
        </Button>
        <Button size="sm" onClick={onSave} loading={busy}>
          <Save size={14} /> {isUpdate ? "שמור" : "צור"}
        </Button>
      </div>
    </div>
  );
}
