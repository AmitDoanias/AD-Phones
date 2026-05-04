import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppFab from "@/components/layout/WhatsAppFab";
import JsonLd from "@/components/seo/JsonLd";
import BlogPostBody, { type BlogContent } from "@/components/blog/BlogPostBody";
import { CalendarDays, ChevronRight, ArrowRight, BookOpen } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { breadcrumbSchema } from "@/lib/seo";
import type { Metadata } from "next";

const SITE_URL = "https://ad-phones.co.il";
export const revalidate = 3600;

function formatDate(d?: string | null) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("he-IL", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

async function loadPost(rawSlug: string) {
  const supabase = await createClient();
  // Try a few normalization variants - covers cases where the URL slug arrives
  // in NFD form (decomposed) but the DB has NFC, or vice-versa.
  const candidates = new Set<string>();
  candidates.add(rawSlug);
  try { candidates.add(decodeURIComponent(rawSlug)); } catch {}
  try { candidates.add(rawSlug.normalize("NFC")); } catch {}
  try { candidates.add(rawSlug.normalize("NFKC")); } catch {}

  const { data } = await supabase
    .from("blog_posts")
    .select(
      "id, title, slug, content, excerpt, cover_image_url, seo_title, seo_description, seo_keywords, published_at, updated_at"
    )
    .in("slug", Array.from(candidates))
    .eq("is_published", true)
    .limit(1);
  return data?.[0] ?? null;
}

async function loadRelated(currentId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("blog_posts")
    .select("title, slug, excerpt, cover_image_url, published_at")
    .eq("is_published", true)
    .neq("id", currentId)
    .order("published_at", { ascending: false })
    .limit(3);
  return data ?? [];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await loadPost(slug);
  if (!post) return { title: "פוסט לא נמצא" };

  const title = post.seo_title?.trim() || post.title;
  const description = post.seo_description?.trim() || post.excerpt || `${post.title} - הבלוג של איי די פון`;
  const url = `${SITE_URL}/blog/${post.slug}`;

  return {
    title: `${title} | איי די פון`,
    description,
    keywords: post.seo_keywords?.split(",").map((s: string) => s.trim()).filter(Boolean),
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "article",
      publishedTime: post.published_at ?? undefined,
      modifiedTime: post.updated_at ?? undefined,
      images: post.cover_image_url ? [{ url: post.cover_image_url }] : undefined,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await loadPost(slug);
  if (!post) notFound();

  const content = (post.content ?? {}) as BlogContent;
  const url = `${SITE_URL}/blog/${post.slug}`;
  const related = await loadRelated(post.id);

  const blogPostingSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt ?? undefined,
    image: post.cover_image_url ?? undefined,
    datePublished: post.published_at ?? undefined,
    dateModified: post.updated_at ?? post.published_at ?? undefined,
    author: { "@type": "Organization", name: "איי די פון", url: SITE_URL },
    publisher: {
      "@type": "Organization",
      name: "איי די פון",
      logo: { "@type": "ImageObject", url: `${SITE_URL}/logo.png` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
  };

  const breadcrumb = breadcrumbSchema([
    { name: "ראשי", url: SITE_URL },
    { name: "בלוג", url: `${SITE_URL}/blog` },
    { name: post.title, url },
  ]);

  return (
    <>
      <JsonLd data={blogPostingSchema} />
      <JsonLd data={breadcrumb} />
      <Header />
      <main className="flex-1 bg-[#f5f5f7]">
        {/* Top action bar - Back button */}
        <div className="px-4 pt-5">
          <div className="max-w-3xl mx-auto">
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-[8px] bg-white hover:bg-[#f0f0f0] transition-colors"
              style={{
                color: "#1d1d1f",
                boxShadow: "rgba(0,0,0,0.05) 0px 1px 4px 0px",
              }}
            >
              <ArrowRight size={14} />
              חזרה לבלוג
            </Link>
          </div>
        </div>

        {/* Cover */}
        {post.cover_image_url && (
          <section className="px-4 pt-6">
            <div className="max-w-3xl mx-auto">
              <div
                className="relative w-full bg-[#1d1d1f] rounded-[16px] overflow-hidden flex items-center justify-center"
                style={{ minHeight: 280, maxHeight: 480 }}
              >
                <Image
                  src={post.cover_image_url}
                  alt={post.title}
                  width={1200}
                  height={800}
                  priority
                  className="w-full h-auto max-h-[480px] object-contain"
                  sizes="(max-width: 768px) 100vw, 800px"
                />
              </div>
            </div>
          </section>
        )}

        {/* Article */}
        <article className="px-4 py-8 md:py-10">
          <div className="max-w-3xl mx-auto">
            {/* Breadcrumb */}
            <nav
              className="flex items-center gap-1 mb-5 text-xs"
              style={{ color: "rgba(0,0,0,0.6)" }}
              aria-label="breadcrumb"
            >
              <Link href="/" className="hover:underline">ראשי</Link>
              <ChevronRight size={12} />
              <Link href="/blog" className="hover:underline">בלוג</Link>
              <ChevronRight size={12} />
              <span className="opacity-70 truncate">{post.title}</span>
            </nav>

            {/* Title card */}
            <div
              className="bg-white rounded-[20px] p-7 md:p-12"
              style={{
                boxShadow: "rgba(0,0,0,0.06) 0px 4px 24px 0px",
              }}
            >
              <h1
                className="font-bold mb-4"
                style={{
                  color: "#1d1d1f",
                  fontSize: "clamp(1.75rem, 4.5vw, 2.5rem)",
                  lineHeight: 1.15,
                  letterSpacing: "-0.28px",
                }}
              >
                {post.title}
              </h1>
              <div
                className="flex items-center gap-1.5 text-xs mb-7"
                style={{ color: "rgba(0,0,0,0.6)" }}
              >
                <CalendarDays size={12} />
                {formatDate(post.published_at)}
              </div>

              <BlogPostBody content={content} />

              {/* CTA */}
              <div
                className="mt-12 pt-8 border-t flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                style={{ borderColor: "rgba(0,0,0,0.08)" }}
              >
                <p className="text-sm" style={{ color: "rgba(0,0,0,0.6)" }}>
                  צריך עזרה עם תיקון מכשיר?
                </p>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center px-5 py-2.5 rounded-[10px] text-sm font-medium text-white transition-opacity hover:opacity-90"
                  style={{ background: "#0071e3" }}
                >
                  צור קשר
                </Link>
              </div>
            </div>
          </div>
        </article>

        {/* Related posts */}
        {related.length > 0 && (
          <section className="px-4 pb-16">
            <div className="max-w-5xl mx-auto">
              <h2
                className="font-bold mb-6 text-center"
                style={{
                  fontSize: "clamp(1.25rem, 3vw, 1.75rem)",
                  color: "#1d1d1f",
                  letterSpacing: "-0.28px",
                }}
              >
                פוסטים נוספים שיעניינו אותך
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {related.map((p) => (
                  <Link
                    key={p.slug}
                    href={`/blog/${p.slug}`}
                    className="group block bg-white rounded-[16px] overflow-hidden transition-shadow hover:shadow-[rgba(0,0,0,0.12)_0px_4px_20px_0px]"
                    style={{ boxShadow: "rgba(0,0,0,0.08) 0px 2px 10px 0px" }}
                  >
                    <div
                      className="relative w-full bg-[#f5f5f7] flex items-center justify-center overflow-hidden"
                      style={{ height: 220 }}
                    >
                      {p.cover_image_url ? (
                        <Image
                          src={p.cover_image_url}
                          alt={p.title}
                          fill
                          className="object-contain p-3"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      ) : (
                        <BookOpen size={28} style={{ color: "rgba(0,0,0,0.18)" }} />
                      )}
                    </div>
                    <div className="p-5">
                      <p
                        className="font-semibold mb-2 leading-snug group-hover:text-[#0066cc] transition-colors line-clamp-2"
                        style={{ color: "#1d1d1f", letterSpacing: "0.196px" }}
                      >
                        {p.title}
                      </p>
                      {p.excerpt && (
                        <p
                          className="text-xs leading-relaxed line-clamp-2"
                          style={{ color: "rgba(0,0,0,0.6)" }}
                        >
                          {p.excerpt}
                        </p>
                      )}
                      <div
                        className="flex items-center gap-1.5 text-xs mt-3"
                        style={{ color: "rgba(0,0,0,0.6)" }}
                      >
                        <CalendarDays size={11} />
                        {formatDate(p.published_at)}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="text-center mt-8">
                <Link
                  href="/blog"
                  className="text-sm hover:underline"
                  style={{ color: "#0071e3" }}
                >
                  כל הפוסטים בבלוג ←
                </Link>
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
      <WhatsAppFab />
    </>
  );
}
