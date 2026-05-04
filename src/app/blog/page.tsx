import Image from "next/image";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppFab from "@/components/layout/WhatsAppFab";
import { CalendarDays, BookOpen } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "בלוג | איי די פון",
  description:
    "מדריכים, טיפים וחדשות מעולם תיקוני הסלולר - הצוות המקצועי של איי די פון משתף ידע מהמעבדה.",
  alternates: { canonical: "https://ad-phones.co.il/blog" },
  robots: { index: true, follow: true },
};

export const revalidate = 3600;

function formatDate(d?: string | null) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("he-IL", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function BlogListPage() {
  const supabase = await createClient();
  const { data: posts } = await supabase
    .from("blog_posts")
    .select("title, slug, excerpt, cover_image_url, published_at")
    .eq("is_published", true)
    .order("published_at", { ascending: false });

  return (
    <>
      <Header />
      <main className="flex-1 bg-[#f5f5f7]">
        <section className="bg-[#1d1d1f] px-4 py-16 md:py-20">
          <div className="max-w-3xl mx-auto text-center">
            <h1
              className="font-bold text-white mb-4"
              style={{
                fontSize: "clamp(1.75rem, 5vw, 3rem)",
                lineHeight: 1.1,
                letterSpacing: "-0.28px",
              }}
            >
              הבלוג שלנו
            </h1>
            <p
              className="text-base"
              style={{ color: "rgba(255,255,255,0.65)", letterSpacing: "-0.224px" }}
            >
              מדריכים וטיפים לתחזוקת הסלולר שלך - מהמעבדה של איי די פון
            </p>
          </div>
        </section>

        <section className="px-4 py-12 md:py-16">
          <div className="max-w-5xl mx-auto">
            {!posts || posts.length === 0 ? (
              <div className="bg-white rounded-[16px] p-12 text-center">
                <div
                  className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center"
                  style={{ background: "rgba(0,0,0,0.04)" }}
                >
                  <BookOpen size={24} style={{ color: "rgba(0,0,0,0.4)" }} />
                </div>
                <p className="font-semibold mb-1" style={{ color: "#1d1d1f" }}>
                  עוד אין פוסטים
                </p>
                <p className="text-sm" style={{ color: "rgba(0,0,0,0.5)" }}>
                  בקרוב נעלה כאן מדריכים וטיפים מקצועיים.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {posts.map((p) => (
                  <Link
                    key={p.slug}
                    href={`/blog/${p.slug}`}
                    className="group block bg-white rounded-[16px] overflow-hidden transition-shadow hover:shadow-[rgba(0,0,0,0.12)_0px_4px_20px_0px]"
                    style={{ boxShadow: "rgba(0,0,0,0.08) 0px 2px 10px 0px" }}
                  >
                    <div
                      className="relative w-full bg-[#f5f5f7] flex items-center justify-center overflow-hidden"
                      style={{ height: 280 }}
                    >
                      {p.cover_image_url ? (
                        <Image
                          src={p.cover_image_url}
                          alt={p.title}
                          fill
                          className="object-contain p-4"
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      ) : (
                        <BookOpen size={32} style={{ color: "rgba(0,0,0,0.18)" }} />
                      )}
                    </div>
                    <div className="p-5">
                      <h2
                        className="font-semibold mb-2 leading-snug group-hover:text-[#0066cc] transition-colors"
                        style={{ color: "#1d1d1f", letterSpacing: "0.196px", fontSize: "1.05rem" }}
                      >
                        {p.title}
                      </h2>
                      {p.excerpt && (
                        <p
                          className="text-xs leading-relaxed mb-3 line-clamp-2"
                          style={{ color: "rgba(0,0,0,0.55)" }}
                        >
                          {p.excerpt}
                        </p>
                      )}
                      <div
                        className="flex items-center gap-1.5 text-xs"
                        style={{ color: "rgba(0,0,0,0.4)" }}
                      >
                        <CalendarDays size={11} />
                        {formatDate(p.published_at)}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppFab />
    </>
  );
}
