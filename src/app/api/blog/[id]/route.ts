import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { SLUG_PATTERN } from "@/lib/slugify";
import { sanitizeBlogHtml } from "@/lib/htmlSanitizer";

type IncomingContent =
  | { format: "markdown"; markdown: string }
  | { format: "html"; html: string }
  | { markdown?: string; html?: string };

function normalizeContent(input: IncomingContent | undefined) {
  if (!input) return { markdown: "" };
  if ("format" in input && input.format === "html") {
    return { format: "html" as const, html: sanitizeBlogHtml(input.html ?? "") };
  }
  if ("format" in input && input.format === "markdown") {
    return { format: "markdown" as const, markdown: input.markdown ?? "" };
  }
  return { format: "markdown" as const, markdown: input.markdown ?? "" };
}

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
    const body: {
      title?: string;
      slug?: string;
      content?: IncomingContent;
      excerpt?: string;
      cover_image_url?: string;
      seo_title?: string;
      seo_description?: string;
      seo_keywords?: string;
      is_published?: boolean;
    } = await req.json();

    if (body.slug !== undefined && !SLUG_PATTERN.test(body.slug)) {
      return NextResponse.json(
        { error: "slug יכול להכיל רק אותיות עברית/אנגלית, ספרות ומקפים" },
        { status: 400 }
      );
    }

    const { data: existing } = await supabase
      .from("blog_posts")
      .select("slug, is_published, published_at")
      .eq("id", id)
      .single();

    const update: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };
    if (body.title !== undefined) update.title = body.title.trim();
    if (body.slug !== undefined) update.slug = body.slug.trim();
    if (body.content !== undefined) update.content = normalizeContent(body.content);
    if (body.excerpt !== undefined) update.excerpt = body.excerpt?.trim() || null;
    if (body.cover_image_url !== undefined)
      update.cover_image_url = body.cover_image_url?.trim() || null;
    if (body.seo_title !== undefined) update.seo_title = body.seo_title?.trim() || null;
    if (body.seo_description !== undefined)
      update.seo_description = body.seo_description?.trim() || null;
    if (body.seo_keywords !== undefined)
      update.seo_keywords = body.seo_keywords?.trim() || null;

    if (body.is_published !== undefined) {
      update.is_published = body.is_published;
      // Set published_at on first publish, keep existing on subsequent edits
      if (body.is_published && !existing?.published_at) {
        update.published_at = new Date().toISOString();
      }
    }

    const { data, error } = await supabase
      .from("blog_posts")
      .update(update)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("blog update error:", error);
      const detail = error.code === "23505" ? "ה-slug כבר קיים" : "שגיאה בעדכון הפוסט";
      return NextResponse.json({ error: detail }, { status: 400 });
    }

    revalidatePath("/blog");
    revalidatePath("/");
    if (existing?.slug) revalidatePath(`/blog/${existing.slug}`);
    if (data?.slug && data.slug !== existing?.slug) revalidatePath(`/blog/${data.slug}`);

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "שגיאת שרת פנימית" }, { status: 500 });
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
    const { data: existing } = await supabase
      .from("blog_posts")
      .select("slug")
      .eq("id", id)
      .single();

    const { error } = await supabase.from("blog_posts").delete().eq("id", id);
    if (error) {
      console.error("blog delete error:", error);
      return NextResponse.json({ error: "שגיאה במחיקת הפוסט" }, { status: 500 });
    }

    revalidatePath("/blog");
    revalidatePath("/");
    if (existing?.slug) revalidatePath(`/blog/${existing.slug}`);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "שגיאת שרת פנימית" }, { status: 500 });
  }
}
