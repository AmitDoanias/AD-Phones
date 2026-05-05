import Link from "next/link";
import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppFab from "@/components/layout/WhatsAppFab";
import { Home, Wrench, MessageCircle, ChevronLeft } from "lucide-react";
import { WHATSAPP_NUMBER } from "@/constants";

export const metadata: Metadata = {
  title: "הדף לא נמצא",
  description: "הדף שחיפשת לא קיים או הוסר. חזרה לדף הבית או למרכז התיקונים של איי די פון.",
  robots: { index: false, follow: false },
};

const POPULAR_LINKS = [
  { href: "/repairs/iphone", label: "תיקון iPhone" },
  { href: "/repairs/ipad", label: "תיקון iPad" },
  { href: "/repairs/samsung", label: "תיקון Samsung" },
  { href: "/blog", label: "הבלוג" },
  { href: "/contact", label: "צור קשר" },
];

export default function NotFound() {
  const waMessage = encodeURIComponent("היי, הגעתי לדף שלא קיים באתר. רציתי לשאול לגבי תיקון.");
  const waHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${waMessage}`;

  return (
    <>
      <Header />
      <main className="flex-1 bg-[#f5f5f7] flex items-center justify-center px-4 py-16 md:py-24">
        <div className="max-w-2xl w-full text-center">
          {/* Big 404 */}
          <p
            className="font-bold leading-none mb-6 select-none"
            style={{
              fontSize: "clamp(6rem, 18vw, 11rem)",
              color: "#1d1d1f",
              letterSpacing: "-0.04em",
              opacity: 0.12,
            }}
            aria-hidden="true"
          >
            404
          </p>

          <h1
            className="font-bold mb-4"
            style={{
              fontSize: "clamp(1.5rem, 4vw, 2.25rem)",
              lineHeight: 1.15,
              letterSpacing: "-0.28px",
              color: "#1d1d1f",
            }}
          >
            הדף שחיפשת לא נמצא
          </h1>

          <p
            className="text-base md:text-lg mx-auto mb-10"
            style={{
              color: "rgba(0,0,0,0.6)",
              letterSpacing: "-0.224px",
              maxWidth: "44ch",
              lineHeight: 1.5,
            }}
          >
            ייתכן שהקישור ישן, הדף עבר, או שנפלה טעות בהקלדה. תוכל לחזור לדף הבית או לבחור אחד מהקישורים למטה.
          </p>

          {/* Primary CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-12">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-[10px] text-base font-medium text-white transition-opacity hover:opacity-90"
              style={{ background: "#0071e3", minHeight: 48, letterSpacing: "-0.224px" }}
            >
              <Home size={18} />
              חזרה לדף הבית
            </Link>
            <Link
              href="/repairs"
              className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-[10px] text-base font-medium transition-colors hover:bg-black/5"
              style={{
                minHeight: 48,
                color: "#1d1d1f",
                border: "1px solid rgba(0,0,0,0.18)",
                letterSpacing: "-0.224px",
              }}
            >
              <Wrench size={18} />
              למרכז התיקונים
            </Link>
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-[10px] text-base font-medium transition-opacity hover:opacity-90 text-white"
              style={{ background: "#25D366", minHeight: 48, letterSpacing: "-0.224px" }}
            >
              <MessageCircle size={18} />
              WhatsApp
            </a>
          </div>

          {/* Popular links */}
          <div
            className="bg-white rounded-[16px] p-6 md:p-8 text-right"
            style={{ boxShadow: "rgba(0,0,0,0.04) 0px 2px 14px 0px" }}
          >
            <p
              className="text-xs font-semibold uppercase tracking-widest mb-4"
              style={{ color: "rgba(0,0,0,0.4)", letterSpacing: "0.14em" }}
            >
              לינקים פופולריים
            </p>
            <ul className="space-y-1.5">
              {POPULAR_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-1.5 text-sm font-medium transition-colors hover:underline"
                    style={{ color: "#0071e3" }}
                  >
                    {link.label}
                    <ChevronLeft
                      size={14}
                      className="transition-transform group-hover:-translate-x-0.5"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
      <Footer />
      <WhatsAppFab />
    </>
  );
}
