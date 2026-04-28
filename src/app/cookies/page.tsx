import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppFab from "@/components/layout/WhatsAppFab";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "מדיניות עוגיות | איי די פון",
  description:
    "מדיניות העוגיות של איי די פון - באילו עוגיות אנו משתמשים, למה, ואיך תוכל לנהל אותן.",
  alternates: { canonical: "https://ad-phones.co.il/cookies" },
  robots: { index: true, follow: true },
};

const LAST_UPDATED = "אפריל 2026";

const CATEGORIES = [
  {
    name: "עוגיות הכרחיות",
    color: "#34c759",
    required: true,
    description:
      "עוגיות שבלעדיהן האתר לא יכול לפעול תקין - אימות התחברות לדשבורד, שמירת תוכן עגלת קניות, ושמירת בחירת העוגיות שלך. לא ניתן לבטל את העוגיות הללו.",
    cookies: [
      { name: "sb-access-token", purpose: "אימות התחברות (רק לדשבורד הניהול)", duration: "שעה" },
      { name: "sb-refresh-token", purpose: "חידוש token אימות", duration: "30 ימים" },
      { name: "ad_cart", purpose: "שמירת תוכן עגלת קניות (localStorage)", duration: "עד מחיקה ידנית" },
      { name: "ad_cookie_consent", purpose: "זוכר את הבחירה שלך לגבי עוגיות", duration: "12 חודשים" },
    ],
  },
  {
    name: "עוגיות אנליטיקה",
    color: "#0071e3",
    required: false,
    description:
      "עוגיות שעוזרות לנו להבין איך לקוחות משתמשים באתר - אילו דפים פופולריים, איפה לקוחות נתקלים בקשיים, איך לשפר את חוויית הגלישה. המידע נאסף בצורה מצרפית ואנונימית.",
    cookies: [
      { name: "_ga, _ga_*, _gid", purpose: "Google Analytics - מעקב מצטבר אחר השימוש באתר", duration: "עד שנתיים" },
    ],
  },
  {
    name: "עוגיות שיווק",
    color: "#ff9500",
    required: false,
    description:
      "עוגיות המאפשרות הצגת פרסום רלוונטי במדיה החברתית, ומדידת הצלחה של קמפיינים פרסומיים. ללא העוגיות האלה, עדיין תראה פרסומות אבל הן יהיו פחות רלוונטיות.",
    cookies: [
      { name: "_fbp, _fbc", purpose: "Facebook Pixel - מעקב המרות לקמפיינים", duration: "3 חודשים" },
      { name: "fr", purpose: "Facebook - שיוך פרסום", duration: "3 חודשים" },
    ],
  },
];

export default function CookiesPolicyPage() {
  return (
    <>
      <Header />
      <main className="flex-1 bg-[#f5f5f7]">
        <section className="bg-[#1d1d1f] px-4 py-16 md:py-20">
          <div className="max-w-3xl mx-auto text-center">
            <h1
              className="font-bold text-white mb-4"
              style={{
                fontSize: "clamp(1.75rem, 5vw, 3rem)",
                lineHeight: 1.1,
                letterSpacing: "-0.28px",
              }}
            >
              מדיניות עוגיות
            </h1>
            <p
              className="text-sm md:text-base"
              style={{ color: "rgba(255,255,255,0.6)", letterSpacing: "-0.224px" }}
            >
              עודכן לאחרונה: {LAST_UPDATED}
            </p>
          </div>
        </section>

        <section className="px-4 py-12 md:py-16">
          <div
            className="max-w-3xl mx-auto bg-white rounded-[16px] p-7 md:p-12 leading-relaxed"
            style={{
              boxShadow: "rgba(0,0,0,0.06) 0px 2px 14px 0px",
              color: "rgba(0,0,0,0.75)",
              letterSpacing: "-0.12px",
              fontSize: "0.95rem",
              lineHeight: 1.75,
            }}
          >
            <h2 className="text-xl md:text-2xl font-bold mb-4" style={{ color: "#1d1d1f" }}>
              מה זה עוגיות?
            </h2>
            <p className="mb-6">
              עוגיות (Cookies) הן קבצי טקסט קטנים שאתר שאתה מבקר בו שומר על המכשיר שלך (במחשב, טלפון או טאבלט). הן מאפשרות לאתר לזכור מידע על הביקור שלך - כדוגמת שפת תצוגה מועדפת, פריטים בעגלת הקניות, או האם התחברת.
            </p>
            <p className="mb-6">
              עוגיות עוזרות לאתרים לעבוד בצורה תקינה, להבין איך משתמשים מתקיימים עם האתר, ולפעמים גם להציג תוכן ופרסום מותאמים אישית.
            </p>

            <h2 className="text-xl md:text-2xl font-bold mt-10 mb-4" style={{ color: "#1d1d1f" }}>
              סוגי עוגיות שאנחנו משתמשים בהן
            </h2>

            {CATEGORIES.map((cat, i) => (
              <div key={i} className="mb-8">
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className="inline-block w-3 h-3 rounded-full"
                    style={{ background: cat.color }}
                    aria-hidden
                  />
                  <h3 className="font-semibold text-base md:text-lg" style={{ color: "#1d1d1f" }}>
                    {cat.name}
                  </h3>
                  {cat.required && (
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{ background: "rgba(52,199,89,0.12)", color: "#34c759" }}
                    >
                      חובה
                    </span>
                  )}
                  {!cat.required && (
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{ background: "rgba(0,0,0,0.05)", color: "rgba(0,0,0,0.6)" }}
                    >
                      אופציונלי
                    </span>
                  )}
                </div>
                <p className="mb-3 text-sm">{cat.description}</p>
                <div
                  className="rounded-[8px] overflow-hidden"
                  style={{ border: "1px solid rgba(0,0,0,0.08)" }}
                >
                  <table className="w-full text-xs md:text-sm" style={{ borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ background: "#f5f5f7" }}>
                        <th className="text-right px-3 py-2 font-semibold" style={{ color: "#1d1d1f" }}>שם</th>
                        <th className="text-right px-3 py-2 font-semibold" style={{ color: "#1d1d1f" }}>מטרה</th>
                        <th className="text-right px-3 py-2 font-semibold" style={{ color: "#1d1d1f" }}>תקופה</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cat.cookies.map((c, j) => (
                        <tr key={j} style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }}>
                          <td className="px-3 py-2 font-mono text-xs" style={{ color: "#1d1d1f" }} dir="ltr">{c.name}</td>
                          <td className="px-3 py-2">{c.purpose}</td>
                          <td className="px-3 py-2 whitespace-nowrap">{c.duration}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}

            <h2 className="text-xl md:text-2xl font-bold mt-10 mb-4" style={{ color: "#1d1d1f" }}>
              איך לנהל את העוגיות שלך
            </h2>
            <p className="mb-3">
              <strong>1. דרך באנר העוגיות באתר:</strong> בכניסה לאתר תראה באנר עם בחירה - לקבל את כל העוגיות, רק את ההכרחיות, או להתאים את הבחירה. תוכל לעדכן את הבחירה בכל עת באמצעות הקישור &quot;ניהול עוגיות&quot; בתחתית הדף.
            </p>
            <p className="mb-3">
              <strong>2. דרך הגדרות הדפדפן:</strong> כל הדפדפנים מאפשרים לחסום או למחוק עוגיות. שים לב שחסימת עוגיות הכרחיות יכולה למנוע שימוש בחלק מתכונות האתר.
            </p>
            <ul className="list-disc pr-5 mb-6 space-y-1">
              <li>
                <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-[#0071e3] hover:underline">Chrome</a>
              </li>
              <li>
                <a href="https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer" target="_blank" rel="noopener noreferrer" className="text-[#0071e3] hover:underline">Firefox</a>
              </li>
              <li>
                <a href="https://support.apple.com/en-us/HT201265" target="_blank" rel="noopener noreferrer" className="text-[#0071e3] hover:underline">Safari (Mac/iOS)</a>
              </li>
              <li>
                <a href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" className="text-[#0071e3] hover:underline">Edge</a>
              </li>
            </ul>

            <h2 className="text-xl md:text-2xl font-bold mt-10 mb-4" style={{ color: "#1d1d1f" }}>
              ספקי צד שלישי
            </h2>
            <p className="mb-6">
              חלק מהעוגיות באתר מגיעות מספקי שירות שאנחנו עובדים איתם. הם מנהלים את העוגיות שלהם בעצמם, בכפוף למדיניות הפרטיות שלהם. ניתן לקרוא את מדיניות הפרטיות שלהם בקישורים שב-<a href="/privacy" className="text-[#0071e3] hover:underline">מדיניות הפרטיות</a> שלנו.
            </p>

            <h2 className="text-xl md:text-2xl font-bold mt-10 mb-4" style={{ color: "#1d1d1f" }}>
              שינויים במדיניות
            </h2>
            <p className="mb-6">
              אם נוסיף או נשנה את השימוש בעוגיות, נעדכן את המדיניות הזו ונבקש ממך אישור מחודש דרך באנר העוגיות.
            </p>

            <h2 className="text-xl md:text-2xl font-bold mt-10 mb-4" style={{ color: "#1d1d1f" }}>
              שאלות?
            </h2>
            <p className="mb-2">
              לכל שאלה בנושא עוגיות:
            </p>
            <ul className="list-none pr-0 space-y-1 mb-4">
              <li>
                דוא&quot;ל: <a href="mailto:info@ad-phones.co.il" className="text-[#0071e3] hover:underline">info@ad-phones.co.il</a>
              </li>
              <li>
                טלפון: <a href="tel:+972534832573" className="text-[#0071e3] hover:underline" dir="ltr">053-483-2573</a>
              </li>
            </ul>

            <p className="mt-10 pt-6 text-sm" style={{ color: "rgba(0,0,0,0.5)", borderTop: "1px solid #f0f0f0" }}>
              לקריאה נוספת ראה גם:{" "}
              <a href="/privacy" className="text-[#0071e3] hover:underline">מדיניות פרטיות</a>
              {" · "}
              <a href="/accessibility" className="text-[#0071e3] hover:underline">הצהרת נגישות</a>
            </p>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppFab />
    </>
  );
}
