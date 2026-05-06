import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { SLUG_PATTERN } from "@/lib/slugify";

type PatchBody = {
  name?: string;
  slug?: string;
  parent_id?: string | null;
  description?: string | null;
  image_url?: string | null;
  sort_order?: number;
  seo_title?: string | null;
  seo_description?: string | null;
  is_active?: boolean;
};

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body: PatchBody = await req.json();

    if (body.slug !== undefined && (!body.slug.trim() || !SLUG_PATTERN.test(body.slug.trim()))) {
      return NextResponse.json(
        { error: "slug יכול להכיל רק אותיות עברית/אנגלית, ספרות ומקפים" },
        { status: 400 }
      );
    }

    // Prevent making a category its own ancestor: walk up from the proposed
    // parent and bail if we hit `id`.
    if (body.parent_id) {
      if (body.parent_id === id) {
        return NextResponse.json({ error: "לא ניתן להציב קטגוריה כהורה של עצמה" }, { status: 400 });
      }
      let cursor: string | null = body.parent_id;
      const visited = new Set<string>();
      while (cursor) {
        if (visited.has(cursor)) break; // safety
        visited.add(cursor);
        if (cursor === id) {
          return NextResponse.json({ error: "ההורה שנבחר הוא צאצא של הקטגוריה" }, { status: 400 });
        }
        const result: { data: { parent_id: string | null } | null } = await supabase
          .from("shop_categories")
          .select("parent_id")
          .eq("id", cursor)
          .maybeSingle();
        cursor = result.data?.parent_id ?? null;
      }
    }

    const update: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };
    if (body.name !== undefined) update.name = body.name.trim();
    if (body.slug !== undefined) update.slug = body.slug.trim();
    if (body.parent_id !== undefined) update.parent_id = body.parent_id || null;
    if (body.description !== undefined) update.description = body.description?.trim() || null;
    if (body.image_url !== undefined) update.image_url = body.image_url?.trim() || null;
    if (body.sort_order !== undefined) update.sort_order = body.sort_order;
    if (body.seo_title !== undefined) update.seo_title = body.seo_title?.trim() || null;
    if (body.seo_description !== undefined) update.seo_description = body.seo_description?.trim() || null;
    if (body.is_active !== undefined) update.is_active = body.is_active;

    if (Object.keys(update).length === 1) {
      return NextResponse.json({ error: "אין שדות לעדכון" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("shop_categories")
      .update(update)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("shop_categories update error:", error);
      const detail = error.code === "23505" ? "ה-slug כבר קיים" : `שגיאה בעדכון הקטגוריה: ${error.message}`;
      return NextResponse.json({ error: detail, code: error.code }, { status: 400 });
    }

    revalidatePath("/dashboard/shop/categories");
    revalidatePath("/shop");
    if (data?.slug) revalidatePath(`/shop/category/${data.slug}`);

    return NextResponse.json(data);
  } catch (e) {
    console.error("shop_categories update exception:", e);
    return NextResponse.json(
      { error: e instanceof Error ? `שגיאת שרת: ${e.message}` : "שגיאת שרת פנימית" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Refuse to delete if there are sub-categories — UI also guards but we
    // double-check on the server.
    const { count } = await supabase
      .from("shop_categories")
      .select("id", { count: "exact", head: true })
      .eq("parent_id", id);
    if ((count ?? 0) > 0) {
      return NextResponse.json(
        { error: "לא ניתן למחוק קטגוריה שיש לה תת-קטגוריות. מחק אותן קודם." },
        { status: 400 }
      );
    }

    // Snapshot slug before delete for revalidation.
    const { data: existing } = await supabase
      .from("shop_categories")
      .select("slug")
      .eq("id", id)
      .maybeSingle();

    const { error } = await supabase.from("shop_categories").delete().eq("id", id);
    if (error) {
      console.error("shop_categories delete error:", error);
      return NextResponse.json(
        { error: `שגיאה במחיקת הקטגוריה: ${error.message}` },
        { status: 500 }
      );
    }

    revalidatePath("/dashboard/shop/categories");
    revalidatePath("/shop");
    if (existing?.slug) revalidatePath(`/shop/category/${existing.slug}`);

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("shop_categories delete exception:", e);
    return NextResponse.json(
      { error: e instanceof Error ? `שגיאת שרת: ${e.message}` : "שגיאת שרת פנימית" },
      { status: 500 }
    );
  }
}
