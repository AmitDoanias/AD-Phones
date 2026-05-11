import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import LineRepairPage from "@/components/repairs/LineRepairPage";
import type { LineFaq } from "@/types";

const SITE_URL = "https://www.ad-phones.co.il";
const CANONICAL = "/repairs/samsung";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "תיקון סמסונג | A&D Phones",
  description:
    "תיקון סמסונג מקצועי בראשון לציון - החלפת מסך AMOLED, סוללה, מחבר טעינה ותיקוני לוח לכל סדרות Galaxy (S, Note, A, Z Flip, Z Fold). מחירים שקופים, אחריות 3 חודשים.",
  openGraph: {
    title: "תיקון סמסונג | A&D Phones",
    description:
      "תיקון סמסונג מקצועי בראשון לציון - החלפת מסך, סוללה ותיקוני לוח לכל סדרות Galaxy.",
    url: `${SITE_URL}${CANONICAL}`,
    siteName: "A&D Phones",
    locale: "he_IL",
    type: "website",
  },
  alternates: { canonical: `${SITE_URL}${CANONICAL}` },
};

export default async function SamsungRepairPage() {
  const supabase = await createClient();

  const { data: brand } = await supabase
    .from("brands")
    .select("id, name, slug")
    .eq("slug", "samsung")
    .single();

  const { data: models } = brand
    ? await supabase
        .from("models")
        .select("id, name, slug, image_url, alt_text")
        .eq("brand_id", brand.id)
        .eq("is_active", true)
        .order("sort_order")
    : { data: null };

  const { data: faqs } = await supabase
    .from("line_faqs")
    .select("id, device_line, question, answer, sort_order, is_published, created_at, updated_at")
    .eq("device_line", "samsung")
    .eq("is_published", true)
    .order("sort_order");

  return (
    <LineRepairPage
      lineLabel="סמסונג"
      title="תיקון סמסונג"
      subtitle="החלפת מסך AMOLED, סוללה ותיקוני לוח לכל סדרות Galaxy - S, Note, A, Z Flip, Z Fold. מחירים שקופים, אחריות מלאה."
      canonicalPath={CANONICAL}
      brandSlug={brand?.slug ?? "samsung"}
      brandName={brand?.name ?? "Samsung"}
      models={models ?? []}
      faqs={(faqs ?? []) as LineFaq[]}
    />
  );
}
