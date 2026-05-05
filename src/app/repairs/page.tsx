import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppFab from "@/components/layout/WhatsAppFab";
import AnimatedCard from "@/components/repairs/AnimatedCard";
import BrandLogo from "@/components/ui/BrandLogo";
import JsonLd from "@/components/seo/JsonLd";
import { localBusinessSchema } from "@/lib/seo";
import { ChevronLeft } from "lucide-react";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "תיקון סלולר | בחר מותג",
  description:
    "תיקון מקצועי לאייפון, אייפד וסמסונג בראשון לציון - בחר את המותג שלך וראה מחירים שקופים לכל תיקון.",
  alternates: { canonical: "https://ad-phones.co.il/repairs" },
};

// Routes users to the dedicated landing pages with line-specific FAQs and SEO.
// We don't iterate `brands` from the DB because Apple is a single brand there
// (slug=apple) and we want iPhone + iPad to be separate landing entries.
const DEVICE_LINES = [
  { name: "iPhone", logoSlug: "apple", href: "/repairs/iphone" },
  { name: "iPad", logoSlug: "apple", href: "/repairs/ipad" },
  { name: "Samsung", logoSlug: "samsung", href: "/repairs/samsung" },
] as const;

export default async function RepairsIndexPage() {
  return (
    <>
      <Header />
      <main className="flex-1 bg-[#f5f5f7]">
        {/* Hero */}
        <section className="bg-[#1d1d1f] text-white text-center py-16 px-4">
          <h1
            className="text-4xl md:text-5xl font-bold mb-3"
            style={{ lineHeight: 1.07, letterSpacing: "-0.28px" }}
          >
            תיקון סלולר מקצועי
          </h1>
          <p
            className="text-lg md:text-xl font-light"
            style={{ color: "rgba(255,255,255,0.7)", letterSpacing: "-0.374px" }}
          >
            בחר את המותג שלך ורשימת המחירים תחכה לך
          </p>
        </section>

        {/* Brand grid */}
        <section className="max-w-5xl mx-auto px-4 py-14">
          <div className="flex flex-wrap justify-center gap-5">
            {DEVICE_LINES.map((line, i) => (
              <AnimatedCard key={line.name} delay={i * 80} className="w-full sm:w-[300px]">
                <Link
                  href={line.href}
                  className="group block bg-white rounded-[8px] p-8 text-center transition-shadow hover:shadow-[rgba(0,0,0,0.22)_3px_5px_30px_0px] focus-visible:outline-2 focus-visible:outline-[#0071e3]"
                  style={{
                    boxShadow: "rgba(0,0,0,0.10) 0px 2px 12px 0px",
                  }}
                >
                  <div className="mb-4 flex justify-center">
                    <BrandLogo slug={line.logoSlug} name={line.name} size="lg" />
                  </div>
                  <h2
                    className="text-xl font-bold text-[#1d1d1f] mb-2"
                    style={{ letterSpacing: "0.196px", lineHeight: 1.14 }}
                  >
                    {line.name}
                  </h2>
                  <span className="inline-flex items-center gap-1 text-sm text-[#0066cc] group-hover:underline">
                    ראה דגמים ומחירים
                    <ChevronLeft size={14} />
                  </span>
                </Link>
              </AnimatedCard>
            ))}
          </div>
        </section>

        {/* Trust strip */}
        <section className="bg-white py-10 px-4 border-t border-[#f5f5f7]">
          <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            {[
              { title: "אחריות מלאה", body: "על כל תיקון שיוצא אצלנו" },
              { title: "מחירים שקופים", body: "ללא הפתעות - המחיר נקבע מראש" },
              { title: "שירות מהיר", body: "רוב התיקונים מוכנים ביום פנייה" },
            ].map((item, i) => (
              <AnimatedCard key={item.title} delay={i * 60}>
                <div>
                  <p
                    className="text-lg font-bold text-[#1d1d1f] mb-1"
                    style={{ letterSpacing: "0.196px" }}
                  >
                    {item.title}
                  </p>
                  <p
                    className="text-sm"
                    style={{ color: "rgba(0,0,0,0.6)", letterSpacing: "-0.224px" }}
                  >
                    {item.body}
                  </p>
                </div>
              </AnimatedCard>
            ))}
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppFab />
      <JsonLd data={localBusinessSchema()} />
    </>
  );
}
