import { createClient } from "@/lib/supabase/server";
import type { ShopCategory } from "@/types";
import CategoriesManagerClient from "./CategoriesManagerClient";

export const dynamic = "force-dynamic";

export default async function ShopCategoriesPage() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("shop_categories")
    .select("id, slug, name, parent_id, description, image_url, sort_order, is_active, seo_title, seo_description, created_at, updated_at")
    .order("sort_order")
    .order("name");

  const categories = (data ?? []) as ShopCategory[];

  // Count products per category for the UI badges. We do this server-side so
  // the client doesn't need a second round-trip.
  const { data: productCounts } = await supabase
    .from("shop_products")
    .select("category_id")
    .eq("is_active", true);

  const counts: Record<string, number> = {};
  for (const row of productCounts ?? []) {
    if (row.category_id) {
      counts[row.category_id] = (counts[row.category_id] ?? 0) + 1;
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <p className="text-[14px] font-semibold text-slate-800">קטגוריות חנות</p>
        <p className="text-[12px] text-muted-foreground mt-0.5">
          ארגן את המוצרים לפי קטגוריות. ניתן לקנן (תת-קטגוריה תחת קטגוריה).
        </p>
      </div>
      <CategoriesManagerClient initialCategories={categories} productCounts={counts} />
    </div>
  );
}
