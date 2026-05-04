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
  // Legacy: only markdown without explicit format
  return { format: "markdown" as const, markdown: input.markdown ?? "" };
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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

    if (!body.title?.trim() || !body.slug?.trim()) {
      return NextResponse.json(
        { error: "כותרת ו-slug הם שדות חובה" },
        { status: 400 }
      );
    }

    if (!SLUG_PATTERN.test(body.slug)) {
      return NextResponse.json(
        { error: "slug יכול להכיל רק אותיות עברית/אנגלית, ספרות ומקפים" },
        { status: 400 }
      );
    }

    const isPublished = body.is_published ?? false;
    const insert = {
      title: body.title.trim(),
      slug: body.slug.trim(),
      content: normalizeContent(body.content),
      excerpt: body.excerpt?.trim() || null,
      cover_image_url: body.cover_image_url?.trim() || null,
      seo_title: body.seo_title?.trim() || null,
      seo_description: body.seo_description?.trim() || null,
      seo_keywords: body.seo_keywords?.trim() || null,
      is_published: isPublished,
      published_at: isPublished ? new Date().toISOString() : null,
    };

    const { data, error } = await supabase
      .from("blog_posts")
      .insert(insert)
      .select()
      .single();

    if (error) {
      console.error("blog create error:", error);
      const detail = error.code === "23505" ? "ה-slug כבר קיים" : "שגיאה ביצירת הפוסט";
      return NextResponse.json({ error: detail }, { status: 400 });
    }

    revalidatePath("/blog");
    revalidatePath("/");
    if (data.is_published) revalidatePath(`/blog/${data.slug}`);

    return NextResponse.json(data, { status: 201 });
  } catch {
    return NextResponse.json({ error: "שגיאת שרת פנימית" }, { status: 500 });
  }
}
