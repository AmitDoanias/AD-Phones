import Link from "next/link";
import Image from "next/image";
import { BookOpen, Plus, FileText, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/server";
import BlogActions from "./BlogActions";

export const dynamic = "force-dynamic";

function formatDate(d?: string | null) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("he-IL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export default async function BlogDashboardPage() {
  const supabase = await createClient();
  const { data: posts } = await supabase
    .from("blog_posts")
    .select("id, title, slug, excerpt, cover_image_url, is_published, published_at, created_at, updated_at")
    .order("created_at", { ascending: false });

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[14px] font-semibold text-slate-800">ניהול בלוג</p>
          <p className="text-[12px] text-muted-foreground mt-0.5">
            {posts?.length ?? 0} פוסטים · יצירה ועריכה
          </p>
        </div>
        <Link href="/dashboard/blog/new">
          <Button size="sm">
            <Plus size={14} />
            פוסט חדש
          </Button>
        </Link>
      </div>

      {!posts || posts.length === 0 ? (
        <div className="bg-card rounded-2xl border border-border py-16 px-6 flex flex-col items-center text-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center">
            <BookOpen size={24} className="text-muted-foreground/50" />
          </div>
          <div>
            <p className="text-[14px] font-semibold text-card-foreground mb-1">אין פוסטים עדיין</p>
            <p className="text-[12px] text-muted-foreground max-w-xs mx-auto leading-relaxed">
              לחץ על &quot;פוסט חדש&quot; כדי ליצור את הפוסט הראשון שלך.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {posts.map((p) => (
            <div
              key={p.id}
              className="bg-card rounded-2xl border border-border p-4 flex gap-4 items-start"
            >
              {/* Cover */}
              <div className="flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-muted overflow-hidden relative">
                {p.cover_image_url ? (
                  <Image
                    src={p.cover_image_url}
                    alt={p.title}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FileText size={20} className="text-muted-foreground/40" />
                  </div>
                )}
              </div>

              {/* Body */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <Link
                    href={`/dashboard/blog/${p.id}`}
                    className="text-sm font-semibold text-slate-900 hover:text-primary transition-colors line-clamp-1"
                  >
                    {p.title}
                  </Link>
                  <div className="flex-shrink-0 flex items-center gap-1.5">
                    {p.is_published ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-green-50 text-green-700 border border-green-100">
                        <Eye size={11} />
                        מפורסם
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-50 text-slate-600 border border-slate-100">
                        <EyeOff size={11} />
                        טיוטה
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mb-2 font-mono" dir="ltr">
                  /blog/{p.slug}
                </p>
                {p.excerpt && (
                  <p className="text-xs text-slate-600 line-clamp-2 mb-2">{p.excerpt}</p>
                )}
                <div className="flex items-center justify-between gap-2">
                  <p className="text-[11px] text-muted-foreground">
                    {p.is_published ? `פורסם: ${formatDate(p.published_at)}` : `נוצר: ${formatDate(p.created_at)}`}
                  </p>
                  <BlogActions postId={p.id} slug={p.slug} isPublished={p.is_published} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
