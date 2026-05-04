import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppFab from "@/components/layout/WhatsAppFab";
import JsonLd from "@/components/seo/JsonLd";
import BrandModelGrid from "@/components/repairs/BrandModelGrid";
import FaqAccordion from "@/components/home/FaqAccordion";
import {
  faqSchema,
  breadcrumbSchema,
  localBusinessSchema,
} from "@/lib/seo";
import type { LineFaq } from "@/types";

type Model = {
  id: string;
  name: string;
  slug: string;
  image_url: string | null;
  alt_text: string | null;
};

type Props = {
  lineLabel: string;
  title: string;
  subtitle: string;
  canonicalPath: string;
  brandSlug: string;
  brandName: string;
  models: Model[];
  faqs: LineFaq[];
};

export default function LineRepairPage({
  lineLabel,
  title,
  subtitle,
  canonicalPath,
  brandSlug,
  brandName,
  models,
  faqs,
}: Props) {
  const faqItems = faqs.map((f) => ({ question: f.question, answer: f.answer }));

  return (
    <>
      <Header />
      <main className="flex-1 bg-[#f5f5f7]">
        {/* Hero + breadcrumbs */}
        <section className="bg-[#1d1d1f] text-white py-12 px-4 text-center">
          <nav className="text-xs mb-4" style={{ color: "rgba(255,255,255,0.5)" }}>
            <Link href="/repairs" className="hover:text-white transition-colors">
              תיקונים
            </Link>
            {" / "}
            <span>{lineLabel}</span>
          </nav>
          <h1
            className="text-3xl md:text-4xl font-bold"
            style={{ lineHeight: 1.07, letterSpacing: "-0.28px" }}
          >
            {title}
          </h1>
          <p
            className="mt-2 text-base font-light max-w-2xl mx-auto"
            style={{ color: "rgba(255,255,255,0.7)", letterSpacing: "-0.374px" }}
          >
            {subtitle}
          </p>
        </section>

        {/* Model grid */}
        <section className="max-w-5xl mx-auto px-4 py-12">
          {models.length === 0 ? (
            <p className="text-center text-[rgba(0,0,0,0.6)] py-10">
              אין דגמים זמינים כרגע
            </p>
          ) : (
            <BrandModelGrid
              models={models}
              brandSlug={brandSlug}
              brandName={brandName}
              showLineTabs={false}
            />
          )}
        </section>

        {/* FAQ section */}
        {faqItems.length > 0 && (
          <section className="bg-[#1d1d1f] py-16 px-4">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-10">
                <h2
                  className="font-bold mb-2"
                  style={{
                    fontSize: "clamp(1.5rem, 4vw, 2.5rem)",
                    lineHeight: 1.1,
                    letterSpacing: "-0.28px",
                    color: "#ffffff",
                  }}
                >
                  שאלות נפוצות על {lineLabel}
                </h2>
                <p className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
                  מצא תשובות לשאלות הנפוצות ביותר
                </p>
              </div>
              <FaqAccordion items={faqItems} />
            </div>
          </section>
        )}
      </main>
      <Footer />
      <WhatsAppFab />

      {/* Structured data */}
      <JsonLd data={localBusinessSchema()} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "דף הבית", url: "/" },
          { name: "תיקונים", url: "/repairs" },
          { name: lineLabel, url: canonicalPath },
        ])}
      />
      {faqItems.length > 0 && <JsonLd data={faqSchema(faqItems)} />}
    </>
  );
}
