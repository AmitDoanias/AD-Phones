import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { SLUG_PATTERN } from "@/lib/slugify";

type CreateBody = {
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

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body: CreateBody = await req.json();

    if (!body.name?.trim()) {
      return NextResponse.json({ error: "שם הוא שדה חובה" }, { status: 400 });
    }
    if (!body.slug?.trim() || !SLUG_PATTERN.test(body.slug.trim())) {
      return NextResponse.json(
        { error: "slug יכול להכיל רק אותיות עברית/אנגלית, ספרות ומקפים" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("shop_categories")
      .insert({
        name: body.name.trim(),
        slug: body.slug.trim(),
        parent_id: body.parent_id || null,
        description: body.description?.trim() || null,
        image_url: body.image_url?.trim() || null,
        sort_order: body.sort_order ?? 0,
        seo_title: body.seo_title?.trim() || null,
        seo_description: body.seo_description?.trim() || null,
        is_active: body.is_active ?? true,
      })
      .select()
      .single();

    if (error) {
      console.error("shop_categories create error:", error);
      const detail = error.code === "23505" ? "ה-slug כבר קיים" : `שגיאה ביצירת הקטגוריה: ${error.message}`;
      return NextResponse.json({ error: detail, code: error.code }, { status: 400 });
    }

    revalidatePath("/dashboard/shop/categories");
    revalidatePath("/shop");
    return NextResponse.json(data, { status: 201 });
  } catch (e) {
    console.error("shop_categories create exception:", e);
    return NextResponse.json(
      { error: e instanceof Error ? `שגיאת שרת: ${e.message}` : "שגיאת שרת פנימית" },
      { status: 500 }
    );
  }
}
