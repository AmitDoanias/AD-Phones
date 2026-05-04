import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import BlogForm, { type BlogFormValues } from "../BlogForm";

export const dynamic = "force-dynamic";

export default async function EditBlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: post } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("id", id)
    .single();

  if (!post) notFound();

  const content = (post.content ?? {}) as {
    format?: "markdown" | "html";
    markdown?: string;
    html?: string;
  };

  const format: "markdown" | "html" = content.format === "html" ? "html" : "markdown";

  const initial: BlogFormValues = {
    id: post.id,
    title: post.title ?? "",
    slug: post.slug ?? "",
    format,
    markdown: typeof content.markdown === "string" ? content.markdown : "",
    html: typeof content.html === "string" ? content.html : "",
    excerpt: post.excerpt ?? "",
    cover_image_url: post.cover_image_url ?? null,
    seo_title: post.seo_title ?? "",
    seo_description: post.seo_description ?? "",
    seo_keywords: post.seo_keywords ?? "",
    is_published: !!post.is_published,
  };

  return <BlogForm initial={initial} />;
}
