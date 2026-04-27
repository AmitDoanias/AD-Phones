import Image from "next/image";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppFab from "@/components/layout/WhatsAppFab";
import AnimatedCard from "@/components/repairs/AnimatedCard";
import BrandLogo from "@/components/ui/BrandLogo";
import JsonLd from "@/components/seo/JsonLd";
import HeroCarousel from "@/components/home/HeroCarousel";
import TrustindexReviews from "@/components/home/TrustindexReviews";
import CountUpStat from "@/components/home/CountUpStat";
import FaqAccordion from "@/components/home/FaqAccordion";
import PopularRepairs3D from "@/components/home/PopularRepairs3D";
import { type Review } from "@/components/home/ReviewCard";
import { createClient } from "@/lib/supabase/server";
import { localBusinessSchema, faqSchema, reviewSchema } from "@/lib/seo";
import { FAQS } from "@/constants/faqs";
import { WHATSAPP_NUMBER } from "@/constants";
import {
  Phone,
  MapPin,
  Clock,
  MessageCircle,
  ChevronLeft,
  Star,
} from "lucide-react";

export const revalidate = 3600;

// ── Static reviews fallback ───────────────────────────────────────────────
const STATIC_REVIEWS: Review[] = [
  {
    author_name: "משה כהן",
    rating: 5,
    text: "שירות מעולה! תיקנו לי את המסך תוך שעה במחיר הוגן. הטכנאי היה מקצועי ואדיב. ממליץ בחום!",
    time: "2024-03-15",
  },
  {
    author_name: "רחל לוי",
    rating: 5,
    text: "הגיע לביתי ותיקן את הסוללה מהר מאוד. מחיר שקוף ואמין, בלי הפתעות. בהחלט אחזור.",
    time: "2024-02-20",
  },
  {
    author_name: "דוד ברגר",
    rating: 5,
    text: "הגעתי עם אייפון שלא נדלק - יצאתי עם טלפון חדש תוך חצי שעה. מקצוענות ברמה אחרת!",
    time: "2024-01-10",
  },
];


// ── Stats for "Why us" ─────────────────────────────────────────────────────
const STATS = [
  { end: 10000, suffix: "+", label: "לקוחות מרוצים" },
  { end: 5, suffix: "/5", label: "דירוג ממוצע בגוגל" },
  { end: 90, suffix: " יום", label: "אחריות על כל תיקון" },
];

// ── Symbols for "Why us" ───────────────────────────────────────────────────
const SYMBOLS = [
  { src: "/symbols/original_1.webp", label: "חלקים מקוריים" },
  { src: "/symbols/pioneer.webp", label: "פתרונות תיקון חדשניים" },
  { src: "/symbols/processor.webp", label: "תיקוני לוח" },
  { src: "/symbols/recycle.webp", label: "תיקונים מהירים" },
  { src: "/symbols/review_1.webp", label: "אחריות על כל תיקון" },
  { src: "/symbols/support.webp", label: "תיקונים למגוון מכשירים" },
];

export default async function HomePage() {
  const supabase = await createClient();

  const { data: brands } = await supabase
    .from("brands")
    .select("id, name, slug, icon_url")
    .order("sort_order");

  let reviews: Review[] = STATIC_REVIEWS;
  try {
    const { data } = await supabase
      .from("reviews_cache")
      .select("author_name, rating, text, time, profile_photo")
      .order("time", { ascending: false })
      .limit(6);
    if (data && data.length > 0) reviews = data as Review[];
  } catch {
    // static fallback
  }

  // Fetch repair types with per-model pricing for Popular Repairs section
  const { data: repairTypesRaw } = await supabase
    .from("repair_types")
    .select(
      `id, name, slug, description, icon_url,
       model_repairs!inner(id, price, duration_min,
         models!inner(id, name, slug,
           brands!inner(name, slug)
         )
       )`
    )
    .order("name");

  const repairTypes = (repairTypesRaw ?? []).slice(0, 6);

  const waMessage = encodeURIComponent("היי, אשמח לשאול לגבי תיקון הטלפון שלי");

  return (
    <>
      <Header />
      <main className="flex-1">

        {/* ── 1. HERO ───────────────────────────────────────────────── */}
        <section className="bg-[#f5f5f7] px-4 py-16 md:py-24 overflow-hidden">
          <div className="max-w-5xl mx-auto">
            {/* RTL: text FIRST → appears on RIGHT. Carousel SECOND → appears on LEFT */}
            <div className="md:flex gap-12 items-center">

              {/* Text - RIGHT in RTL (first child) */}
              <div className="flex-1 mb-10 md:mb-0 text-center md:text-right">
                <h1
                  className="font-bold mb-4"
                  style={{
                    fontSize: "clamp(2rem, 5vw, 3.25rem)",
                    lineHeight: 1.07,
                    letterSpacing: "-0.28px",
                    color: "#1d1d1f",
                  }}
                >
                  מעבדת תיקון סלולר
                  <br />
                  A&D Phones
                </h1>
                <p
                  className="text-base md:text-lg font-light mb-8"
                  style={{ color: "rgba(0,0,0,0.6)", letterSpacing: "-0.374px" }}
                >
                  תיקון אייפון · תיקון סמסונג · תיקון מסך אייפד · אחריות מלאה
                </p>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row items-center md:items-start justify-center md:justify-start gap-3 mb-8">
                  <Link
                    href="/booking"
                    className="inline-flex items-center justify-center px-8 py-3 rounded-[8px] text-base font-medium text-white transition-opacity hover:opacity-90"
                    style={{ background: "#0071e3", minHeight: 52, letterSpacing: "-0.224px" }}
                  >
                    קבע תיקון עכשיו
                  </Link>
                  <Link
                    href="/repairs"
                    className="inline-flex items-center justify-center gap-1.5 px-8 py-3 rounded-[980px] text-base font-medium transition-colors hover:bg-black/5"
                    style={{
                      minHeight: 52,
                      letterSpacing: "-0.224px",
                      color: "#1d1d1f",
                      border: "1px solid rgba(0,0,0,0.2)",
                    }}
                  >
                    תיקונים ומחירים
                    <ChevronLeft size={16} />
                  </Link>
                </div>

                {/* Google badge */}
                <div
                  className="inline-flex items-center gap-3 rounded-[12px] px-4 py-3"
                  style={{
                    background: "rgba(0,0,0,0.04)",
                    border: "1px solid rgba(0,0,0,0.08)",
                  }}
                >
                  {/* Left: Google G + stars + rating */}
                  <div className="flex items-center gap-2">
                    <svg viewBox="0 0 24 24" width="20" height="20" aria-label="Google" className="flex-shrink-0">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star key={i} size={13} fill="#fbbc05" stroke="none" />
                      ))}
                      <span
                        className="text-sm font-bold ms-1"
                        style={{ color: "#1d1d1f", letterSpacing: "-0.12px" }}
                      >
                        5.0
                      </span>
                    </div>
                  </div>

                  {/* Divider */}
                  <span className="text-slate-300 text-base font-light select-none">|</span>

                  {/* Right: checkmark + text */}
                  <div className="flex items-center gap-1.5">
                    <svg viewBox="0 0 24 24" width="16" height="16" className="flex-shrink-0">
                      <circle cx="12" cy="12" r="11" fill="none" stroke="#34A853" strokeWidth="2"/>
                      <path d="M7 12.5l3.5 3.5 6.5-7" stroke="#34A853" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                    </svg>
                    <span className="text-xs font-medium" style={{ color: "rgba(0,0,0,0.65)" }}>
                      מעל 450 דירוגים במדרג
                    </span>
                  </div>
                </div>
              </div>

              {/* Carousel - LEFT in RTL (second child), larger size */}
              <HeroCarousel />

            </div>
          </div>
        </section>

        {/* ── 2. GOOGLE REVIEWS ────────────────────────────────────── */}
        <section className="bg-white py-16 px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <h2
                className="font-bold mb-2"
                style={{
                  fontSize: "clamp(1.5rem, 4vw, 2.5rem)",
                  lineHeight: 1.1,
                  letterSpacing: "-0.28px",
                  color: "#1d1d1f",
                }}
              >
                מה הלקוחות אומרים
              </h2>
              <p className="text-sm" style={{ color: "rgba(0,0,0,0.5)" }}>
                ביקורות אמיתיות מלקוחות מרוצים
              </p>
            </div>
            <TrustindexReviews />
            <p className="text-center text-xs mt-6" style={{ color: "rgba(0,0,0,0.35)" }}>
              ביקורות מ-Google Reviews
            </p>
          </div>
        </section>

        {/* ── 3. WHY US ────────────────────────────────────────────── */}
        <section
          className="bg-[#f5f5f7] py-16 px-4"
          style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }}
        >
          <div className="max-w-5xl mx-auto">

            {/* Text + 3 SQUARE stat boxes side by side */}
            <div className="md:flex gap-12 items-center mb-12">

              {/* Text - RIGHT in RTL */}
              <div className="flex-1 mb-10 md:mb-0">
                <h2
                  className="font-bold mb-4"
                  style={{
                    fontSize: "clamp(1.5rem, 4vw, 2.5rem)",
                    lineHeight: 1.1,
                    letterSpacing: "-0.28px",
                    color: "#1d1d1f",
                  }}
                >
                  למה לבחור באיי די פון?
                </h2>
                <p
                  className="text-base leading-relaxed mb-6"
                  style={{
                    color: "rgba(0,0,0,0.65)",
                    letterSpacing: "-0.374px",
                    maxWidth: 440,
                  }}
                >
                  באיי די פון, התיקונים שלנו מתבצעים תוך שימוש בחלקים מקוריים. אנו מתמחים בתיקונים ברמת הרכיב. חווית השירות שלנו מתבססת על ארבעה עקרונות: שירות, נוחות, מקצועיות ואמינות. למעבדה ניסיון רב במתן שירות וכן החלפת רכיב על גבי הלוח בתיקון אייפון ואייפד מכל הדגמים. תיקוני קורוזיה, פתרונות תוכנה, העברת מידע ופתרונות נוספים. רוב תיקוני המכשירים מבוצעים במקום ובזמן של עד 30 דקות בלבד.
                </p>
                <Link
                  href="/repairs"
                  className="inline-flex items-center gap-1.5 text-sm font-medium hover:underline transition-colors"
                  style={{ color: "#0066cc", letterSpacing: "-0.224px" }}
                >
                  לכל התיקונים והמחירים
                  <ChevronLeft size={14} />
                </Link>
              </div>

              {/* 3 SQUARE stat boxes - LEFT in RTL, displayed side by side */}
              <div className="grid grid-cols-3 gap-3 md:w-auto md:flex-shrink-0 md:gap-4" style={{ minWidth: 0 }}>
                {STATS.map((stat, i) => (
                  <AnimatedCard key={i} delay={i * 100}>
                    <div
                      className="bg-white rounded-[8px] flex flex-col items-center justify-center text-center p-4"
                      style={{
                        aspectRatio: "1 / 1",
                        minWidth: 90,
                        boxShadow: "rgba(0,0,0,0.08) 0px 2px 10px 0px",
                      }}
                    >
                      <div
                        className="font-bold mb-1"
                        style={{
                          fontSize: "clamp(1.25rem, 3vw, 1.75rem)",
                          color: "#1d1d1f",
                          letterSpacing: "-0.28px",
                          lineHeight: 1.07,
                        }}
                      >
                        <CountUpStat end={stat.end} suffix={stat.suffix} duration={1600} />
                      </div>
                      <p
                        className="text-xs leading-snug"
                        style={{ color: "rgba(0,0,0,0.55)", letterSpacing: "0.196px" }}
                      >
                        {stat.label}
                      </p>
                    </div>
                  </AnimatedCard>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="my-10" style={{ borderTop: "1px solid rgba(0,0,0,0.1)" }} aria-hidden />

            {/* Symbols grid - 2 rows × 3 cols */}
            <div className="grid grid-cols-3 gap-4">
              {SYMBOLS.map((s, i) => (
                <AnimatedCard key={i} delay={i * 70}>
                  <div
                    className="flex flex-col items-center justify-center gap-2 py-5 px-3"
                  >
                    <Image
                      src={s.src}
                      alt={s.label}
                      width={48}
                      height={48}
                      className="object-contain"
                    />
                    <span
                      className="text-xs font-medium text-center leading-snug"
                      style={{ color: "#1d1d1f" }}
                    >
                      {s.label}
                    </span>
                  </div>
                </AnimatedCard>
              ))}
            </div>
          </div>
        </section>

        {/* ── 4. PARTNERS ──────────────────────────────────────────── */}
        <section
          className="bg-white py-16 px-4"
          style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }}
        >
          <div className="max-w-5xl mx-auto">
            <h2
              className="text-center font-bold mb-2"
              style={{
                fontSize: "clamp(1.25rem, 3vw, 1.75rem)",
                lineHeight: 1.1,
                letterSpacing: "-0.28px",
                color: "#1d1d1f",
              }}
            >
              חברות שעובדות איתנו
            </h2>
            <p
              className="text-center text-sm mb-4"
              style={{ color: "rgba(0,0,0,0.45)", letterSpacing: "-0.224px" }}
            >
              לקוחות עסקיים ותיקים שנותנים בנו אמון
            </p>
            <p
              className="text-center text-sm leading-relaxed mb-10 mx-auto"
              style={{ color: "rgba(0,0,0,0.55)", maxWidth: 540, letterSpacing: "-0.224px" }}
            >
              אנו מתמחים ביצירת פתרונות תיקון מותאמים אישית הן לעסקים קטנים והן לתאגידים גדולים. כל היבט בשירות שלנו מעוצב בקפידה כדי להתאים לדרישות הייחודיות של הארגון שלכם. צרו איתנו קשר כדי לגלות איך אנחנו יכולים לתת מענה לצרכים הספציפיים שלכם.
            </p>
            <div className="flex flex-wrap justify-center gap-5 max-w-[780px] mx-auto">
              {[1, 2, 3, 4, 5].map((n, i) => (
                <AnimatedCard key={n} delay={i * 50}>
                  <div
                    className="bg-white rounded-[8px] flex items-center justify-center p-4 w-[150px] sm:w-[220px]"
                    style={{
                      height: 100,
                      boxShadow: "rgba(0,0,0,0.07) 0px 2px 8px 0px",
                      border: "1px solid rgba(0,0,0,0.06)",
                    }}
                  >
                    <Image
                      src={`/companies/company-${n}.jpeg`}
                      alt={`לוגו חברה ${n}`}
                      width={180}
                      height={80}
                      className="max-h-full w-auto object-contain"
                    />
                  </div>
                </AnimatedCard>
              ))}
            </div>
          </div>
        </section>

        {/* ── 5. POPULAR REPAIRS (3D) ──────────────────────────────── */}
        <PopularRepairs3D repairTypes={repairTypes as any} />

        {/* ── 6. BLOG (hidden until /blog routes are implemented) ─── */}

        {/* ── 7. FAQs ──────────────────────────────────────────────── */}
        <section id="faq" className="bg-[#1d1d1f] py-16 px-4 scroll-mt-20">
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
                שאלות נפוצות
              </h2>
              <p className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
                מצא תשובות לשאלות הנפוצות ביותר
              </p>
            </div>
            <FaqAccordion />
          </div>
        </section>

        {/* ── 8. BRAND SELECTOR (brands strip before map) ──────────── */}
        {brands && brands.length > 0 && (
          <section
            className="bg-[#f5f5f7] py-12 px-4"
            style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }}
          >
            <div className="max-w-5xl mx-auto">
              <p
                className="text-center text-base md:text-lg font-semibold mb-8"
                style={{ color: "#1d1d1f", letterSpacing: "0.196px" }}
              >
                לאיזה מכשיר צריך תיקון?
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                {brands.map((brand, i) => (
                  <AnimatedCard key={brand.id} delay={i * 70}>
                    <Link
                      href={`/repairs/${brand.slug}`}
                      className="group block bg-white rounded-[8px] p-5 text-center w-36 transition-shadow hover:shadow-[rgba(0,0,0,0.22)_3px_5px_30px_0px]"
                      style={{ boxShadow: "rgba(0,0,0,0.10) 0px 2px 12px 0px" }}
                    >
                      <div className="mb-3 flex justify-center">
                        <BrandLogo slug={brand.slug} name={brand.name} size="md" />
                      </div>
                      <p className="text-sm font-semibold" style={{ color: "#1d1d1f", letterSpacing: "0.196px" }}>
                        {brand.name}
                      </p>
                    </Link>
                  </AnimatedCard>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── 9. MAP + CONTACT ─────────────────────────────────────── */}
        <section className="bg-[#1d1d1f] py-16 px-4">
          <div className="max-w-5xl mx-auto">
            <div className="md:flex gap-10 items-start">
              <div className="md:w-64 flex-shrink-0 mb-10 md:mb-0">
                <h2
                  className="font-bold text-white mb-6"
                  style={{
                    fontSize: "clamp(1.25rem, 3vw, 1.75rem)",
                    lineHeight: 1.14,
                    letterSpacing: "-0.28px",
                  }}
                >
                  מצאו אותנו
                </h2>
                <ul className="space-y-5 text-sm">
                  <li className="flex items-start gap-3">
                    <MapPin size={16} className="flex-shrink-0 mt-0.5" style={{ color: "rgba(255,255,255,0.5)" }} />
                    <span style={{ color: "rgba(255,255,255,0.8)", lineHeight: 1.6 }}>
                      מעגל השלום 3
                      <br />
                      ראשון לציון
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Clock size={16} className="flex-shrink-0 mt-0.5" style={{ color: "rgba(255,255,255,0.5)" }} />
                    <span style={{ color: "rgba(255,255,255,0.8)", lineHeight: 1.6 }}>
                      א&apos;–ה&apos; 09:00–19:00
                      <br />
                      ו&apos; 09:00–14:00
                    </span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Phone size={16} style={{ color: "rgba(255,255,255,0.5)" }} />
                    <a
                      href="tel:+972534832573"
                      className="hover:text-white transition-colors"
                      style={{ color: "rgba(255,255,255,0.8)" }}
                      dir="ltr"
                    >
                      053-483-2573
                    </a>
                  </li>
                </ul>
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=${waMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-8 px-6 py-3 rounded-[8px] text-sm font-medium text-white transition-opacity hover:opacity-90"
                  style={{ background: "#25d366", minHeight: 48, letterSpacing: "-0.224px" }}
                >
                  <MessageCircle size={16} />
                  שלח הודעה ב-WhatsApp
                </a>
              </div>

              <div
                className="flex-1 rounded-[8px] overflow-hidden"
                style={{ minHeight: 280, border: "1px solid rgba(255,255,255,0.08)" }}
              >
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3384.6967810221204!2d34.7673615!3d31.969121800000003!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1502b3a8388d2471%3A0x561a8f661c931d79!2sAD%20Phones!5e0!3m2!1siw!2sil!4v1776944458579!5m2!1siw!2sil"
                  width="100%"
                  height="100%"
                  style={{ border: 0, minHeight: 280, display: "block" }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                  title="מפת המיקום של A&D Phones"
                />
              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
      <WhatsAppFab />
      <JsonLd data={localBusinessSchema()} />
      <JsonLd data={faqSchema(FAQS)} />
      {reviews.length > 0 && <JsonLd data={reviewSchema(reviews)} />}
    </>
  );
}
