import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppFab from "@/components/layout/WhatsAppFab";
import JsonLd from "@/components/seo/JsonLd";
import ContactForm from "./ContactForm";
import { createClient } from "@/lib/supabase/server";
import { localBusinessSchema } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "יצירת קשר | A&D Phones",
  description:
    "צור קשר עם A&D Phones לתיקון מקצועי לאייפון, אייפד וסמסונג. בחר דגם, תאר את הבעיה ונחזור אליך מהר.",
  alternates: { canonical: "https://ad-phones.co.il/contact" },
};

export default async function ContactPage() {
  const supabase = await createClient();

  const { data: rawModels } = await supabase
    .from("models")
    .select("id, name, slug, brand_id, brands!inner(name, slug)")
    .eq("is_active", true)
    .order("sort_order");

  // Normalize the joined data
  const models = (rawModels ?? []).map((m) => {
    const brand = Array.isArray(m.brands) ? m.brands[0] : m.brands;
    return {
      id: m.id as string,
      name: m.name as string,
      brand_slug: (brand as { slug: string })?.slug ?? "",
      brand_name: (brand as { name: string })?.name ?? "",
    };
  });

  return (
    <>
      <Header />
      <main className="flex-1 bg-[#f5f5f7]">

        {/* Hero */}
        <section className="bg-[#1d1d1f] px-4 py-14 md:py-20">
          <div className="max-w-3xl mx-auto text-center">
            <h1
              className="font-bold text-white mb-3"
              style={{
                fontSize: "clamp(1.75rem, 4.5vw, 3rem)",
                lineHeight: 1.07,
                letterSpacing: "-0.28px",
              }}
            >
              יצירת קשר
            </h1>
            <p
              className="text-sm md:text-base"
              style={{ color: "rgba(255,255,255,0.55)", letterSpacing: "-0.224px" }}
            >
              בחר דגם, תאר את הבעיה - ונחזור אליך מהר ככל האפשר.
            </p>
          </div>
        </section>

        {/* Form + Info */}
        <section className="px-4 py-12 md:py-16">
          <div className="max-w-5xl mx-auto">
            <ContactForm models={models} />
          </div>
        </section>

      </main>
      <Footer />
      <WhatsAppFab />
      <JsonLd data={localBusinessSchema()} />
    </>
  );
}
