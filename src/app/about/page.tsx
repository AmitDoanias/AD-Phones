import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppFab from "@/components/layout/WhatsAppFab";
import { Microscope, ShieldCheck, Wrench, ChevronLeft, MessageCircle } from "lucide-react";
import { WHATSAPP_NUMBER } from "@/constants";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "למה אנחנו | A&D Phones",
  description:
    "אבחון אמיתי ללא ניחושים. תיקון ברמת הרכיב, חלקים מקוריים, שקיפות מלאה. גלה למה A&D Phones שונים משאר המעבדות.",
};

const FEATURES = [
  {
    Icon: Microscope,
    title: "אנחנו לא מנחשים",
    desc: "אנחנו מוכיחים תקלות עם ראיות. כל אבחון מתבסס על מדידות ובדיקות מדויקות — לא על ניחושים.",
  },
  {
    Icon: ShieldCheck,
    title: "אנחנו לא מוכרים יותר",
    desc: "אנחנו מתקנים רק את מה שצריך. אם הבעיה פשוטה — נגיד לך את זה ישירות, ולא נחליף רכיבים שלא לצורך.",
  },
  {
    Icon: Wrench,
    title: "אנחנו לא מחליפים, מתקנים",
    desc: "אנחנו לא ממהרים להחליף מכשירים שלא לצורך. אנחנו מתמחים בתיקון ברמת הרכיב — גם כשאחרים כבר ויתרו.",
  },
];

const waMessage = encodeURIComponent("היי, אשמח לשאול לגבי תיקון הטלפון שלי");

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="flex-1">

        {/* ── HERO ─────────────────────────────────────────────────── */}
        <section className="bg-[#1d1d1f] px-4 py-20 md:py-28">
          <div className="max-w-3xl mx-auto text-center">
            <h1
              className="font-bold text-white mb-6"
              style={{
                fontSize: "clamp(2rem, 5vw, 3.5rem)",
                lineHeight: 1.07,
                letterSpacing: "-0.28px",
              }}
            >
              אבחון אמיתי —<br />ללא ניחושים.
            </h1>
            <p
              className="text-base md:text-lg leading-relaxed mx-auto"
              style={{
                color: "rgba(255,255,255,0.65)",
                maxWidth: 580,
                letterSpacing: "-0.224px",
              }}
            >
              רוב המעבדות מבצעות בדיקה מהירה ומקוות לטוב. ב-איי די פון, אבחון אמיתי פירושו בדיקות ברמת הרכיב. אנחנו מאתרים תקלות דרך הלוח ולא רק מחליפים חלקים עד שמשהו &ldquo;עבד&rdquo;.
            </p>
          </div>
        </section>

        {/* ── HOW WE DIAGNOSE ─────────────────────────────────────── */}
        <section className="bg-[#f5f5f7] px-4 py-16 md:py-20">
          <div className="max-w-5xl mx-auto">
            <div className="md:flex gap-16 items-start">

              {/* Text */}
              <div className="flex-1 mb-10 md:mb-0">
                <h2
                  className="font-bold mb-5"
                  style={{
                    fontSize: "clamp(1.5rem, 4vw, 2.25rem)",
                    lineHeight: 1.1,
                    letterSpacing: "-0.28px",
                    color: "#1d1d1f",
                  }}
                >
                  מה אנחנו בודקים ואיך אנחנו עושים את זה
                </h2>
                <p
                  className="text-base leading-relaxed mb-5"
                  style={{ color: "rgba(0,0,0,0.65)", letterSpacing: "-0.224px" }}
                >
                  אנחנו מתחילים בהערכה חיצונית של המכשיר שלך. בוחנים מתח וזרם — נתונים שאומרים לנו אם המכשיר מקבל חשמל כראוי, או אם יש תקלה במעגל הטעינה. אז אנחנו עוברים לניתוח פנימי עמוק יותר.
                </p>
                <p
                  className="text-base leading-relaxed"
                  style={{ color: "rgba(0,0,0,0.65)", letterSpacing: "-0.224px" }}
                >
                  התוצאה: אנחנו יודעים בדיוק מה שבור לפני שפותחים את המכשיר — ומציגים לך את הממצאים בשקיפות מלאה לפני כל תיקון.
                </p>
              </div>

              {/* Stats column */}
              <div className="flex-shrink-0 grid grid-cols-2 gap-4 md:w-72">
                {[
                  { value: "30 דקות", label: "זמן ממוצע לתיקון" },
                  { value: "90 יום", label: "אחריות על כל תיקון" },
                  { value: "10,000+", label: "מכשירים תוקנו" },
                  { value: "5/5", label: "דירוג ממוצע בגוגל" },
                ].map((s, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-[8px] p-5 text-center"
                    style={{ boxShadow: "rgba(0,0,0,0.07) 0px 2px 8px 0px" }}
                  >
                    <p
                      className="font-bold mb-1"
                      style={{
                        fontSize: "1.5rem",
                        color: "#1d1d1f",
                        letterSpacing: "-0.28px",
                        lineHeight: 1.1,
                      }}
                    >
                      {s.value}
                    </p>
                    <p className="text-xs" style={{ color: "rgba(0,0,0,0.5)" }}>
                      {s.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── WHY US — 3 CARDS ────────────────────────────────────── */}
        <section className="bg-white px-4 py-16 md:py-20">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2
                className="font-bold mb-3"
                style={{
                  fontSize: "clamp(1.5rem, 4vw, 2.25rem)",
                  lineHeight: 1.1,
                  letterSpacing: "-0.28px",
                  color: "#1d1d1f",
                }}
              >
                למה לבחור בנו?
              </h2>
              <p className="text-sm" style={{ color: "rgba(0,0,0,0.5)" }}>
                שלושה עקרונות שמבדילים אותנו מכל מעבדה אחרת
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {FEATURES.map(({ Icon, title, desc }, i) => (
                <div
                  key={i}
                  className="bg-[#f5f5f7] rounded-[12px] p-7 flex flex-col gap-4"
                >
                  <div
                    className="w-12 h-12 rounded-[10px] flex items-center justify-center flex-shrink-0"
                    style={{ background: "rgba(0,0,0,0.07)" }}
                  >
                    <Icon size={22} style={{ color: "#1d1d1f" }} />
                  </div>
                  <div>
                    <h3
                      className="font-bold mb-2"
                      style={{
                        fontSize: "1.05rem",
                        color: "#1d1d1f",
                        letterSpacing: "-0.12px",
                      }}
                    >
                      {title}
                    </h3>
                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: "rgba(0,0,0,0.6)" }}
                    >
                      {desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ─────────────────────────────────────────────────── */}
        <section className="bg-[#1d1d1f] px-4 py-16 md:py-20">
          <div className="max-w-2xl mx-auto text-center">
            <h2
              className="font-bold text-white mb-4"
              style={{
                fontSize: "clamp(1.5rem, 4vw, 2.25rem)",
                lineHeight: 1.14,
                letterSpacing: "-0.28px",
              }}
            >
              אם אמרו לך שהמכשיר שלך לא ניתן לתיקון — תן לנו להסתכל עליו.
            </h2>
            <p
              className="text-sm mb-8 leading-relaxed"
              style={{ color: "rgba(255,255,255,0.55)", letterSpacing: "-0.224px" }}
            >
              במקרים רבים אנחנו מצליחים לתקן מכשירים ש-Apple ואחרים ויתרו עליהם.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-[8px] text-sm font-medium text-white transition-opacity hover:opacity-90"
                style={{ background: "#0071e3", minHeight: 52, letterSpacing: "-0.224px" }}
              >
                צור קשר עכשיו
              </Link>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${waMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-[8px] text-sm font-medium text-white transition-opacity hover:opacity-90"
                style={{ background: "#25d366", minHeight: 52, letterSpacing: "-0.224px" }}
              >
                <MessageCircle size={16} />
                שלח הודעה ב-WhatsApp
              </a>
            </div>
          </div>
        </section>

      </main>
      <Footer />
      <WhatsAppFab />
    </>
  );
}
