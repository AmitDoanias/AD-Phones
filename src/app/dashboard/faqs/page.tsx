import { createClient } from "@/lib/supabase/server";
import type { LineFaq } from "@/types";
import FaqsManagerClient from "./FaqsManagerClient";

export const dynamic = "force-dynamic";

export default async function FaqsDashboardPage() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("line_faqs")
    .select("id, device_line, question, answer, sort_order, is_published, created_at, updated_at")
    .order("device_line")
    .order("sort_order");

  const faqs = (data ?? []) as LineFaq[];

  return (
    <div className="flex flex-col gap-5">
      <div>
        <p className="text-[14px] font-semibold text-slate-800">שאלות נפוצות לפי קטגוריה</p>
        <p className="text-[12px] text-muted-foreground mt-0.5">
          ה-FAQs האלה מופיעים בעמודי התיקון (iPhone / iPad / Samsung) ומשמשים ל-SEO ול-GEO.
        </p>
      </div>
      <FaqsManagerClient initialFaqs={faqs} />
    </div>
  );
}
