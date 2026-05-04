import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { isIPhoneModel } from "@/lib/utils";
import LineRepairPage from "@/components/repairs/LineRepairPage";
import type { LineFaq } from "@/types";

const SITE_URL = "https://ad-phones.co.il";
const CANONICAL = "/repairs/iphone";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "תיקון iPhone | A&D Phones",
  description:
    "תיקון אייפון מקצועי בראשון לציון - החלפת מסך, סוללה, מצלמה ותיקוני לוח לכל דגמי ה-iPhone. מחירים שקופים, אחריות 3 חודשים, שירות מהיר.",
  openGraph: {
    title: "תיקון iPhone | A&D Phones",
    description:
      "תיקון אייפון מקצועי בראשון לציון - החלפת מסך, סוללה, מצלמה ותיקוני לוח לכל דגמי ה-iPhone.",
    url: `${SITE_URL}${CANONICAL}`,
    siteName: "A&D Phones",
    locale: "he_IL",
    type: "website",
  },
  alternates: { canonical: `${SITE_URL}${CANONICAL}` },
};

export default async function IPhoneRepairPage() {
  const supabase = await createClient();

  const { data: brand } = await supabase
    .from("brands")
    .select("id, name, slug")
    .eq("slug", "apple")
    .single();

  const { data: allAppleModels } = brand
    ? await supabase
        .from("models")
        .select("id, name, slug, image_url, alt_text")
        .eq("brand_id", brand.id)
        .eq("is_active", true)
        .order("sort_order")
    : { data: null };

  const models = (allAppleModels ?? []).filter((m) => isIPhoneModel(m.name));

  const { data: faqs } = await supabase
    .from("line_faqs")
    .select("id, device_line, question, answer, sort_order, is_published, created_at, updated_at")
    .eq("device_line", "iphone")
    .eq("is_published", true)
    .order("sort_order");

  return (
    <LineRepairPage
      lineLabel="iPhone"
      title="תיקון iPhone"
      subtitle="החלפת מסך, סוללה, מצלמה ותיקוני לוח לכל דגמי ה-iPhone - מחירים שקופים, אחריות מלאה, שירות מהיר."
      canonicalPath={CANONICAL}
      brandSlug={brand?.slug ?? "apple"}
      brandName={brand?.name ?? "Apple"}
      models={models}
      faqs={(faqs ?? []) as LineFaq[]}
    />
  );
}
