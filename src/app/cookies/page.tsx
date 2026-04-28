import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppFab from "@/components/layout/WhatsAppFab";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookies | איי די פון",
  description:
    "מדיניות עוגיות (Cookies) של איי די פון - באילו עוגיות אנו משתמשים, למה, ואיך תוכל לנהל אותן.",
  alternates: { canonical: "https://ad-phones.co.il/cookies" },
  robots: { index: true, follow: true },
};

const LAST_UPDATED = "אפריל 2026";
const EFFECTIVE_DATE = "28 באפריל 2026";

const CATEGORIES = [
  {
    name: "עוגיות הכרחיות (Strictly Necessary)",
    color: "#34c759",
    required: true,
    description:
      "עוגיות החיוניות לתפקוד תקין של האתר ולא ניתנות לחסימה מתוך מערכת ההסכמה. אלה כוללות עוגיות לאימות התחברות לדשבורד הניהולי, שמירת תוכן עגלת הקניות, ושמירת בחירת ההסכמה לעוגיות עצמה. ללא עוגיות אלה האתר לא יוכל לפעול. הבסיס החוקי הוא ביצוע חוזה ואינטרס לגיטימי.",
    cookies: [
      { name: "sb-access-token", purpose: "אסימון אימות לדשבורד הניהול בלבד", duration: "שעה" },
      { name: "sb-refresh-token", purpose: "חידוש אסימון אימות", duration: "30 ימים" },
      { name: "ad_cart", purpose: "שמירת תוכן עגלת קניות (localStorage)", duration: "עד מחיקה ידנית" },
      { name: "ad_cookie_consent_v1", purpose: "שמירת בחירת ההסכמה לעוגיות", duration: "12 חודשים" },
    ],
  },
  {
    name: "עוגיות אנליטיקה (Analytics)",
    color: "#0071e3",
    required: false,
    description:
      "עוגיות המאפשרות לנו להבין כיצד מבקרים משתמשים באתר, באמצעות איסוף ודיווח מצרפי על דפוסי שימוש. הבסיס החוקי הוא הסכמתך המפורשת. אם תבחר שלא להסכים, עוגיות אלה לא ייטענו ולא ייאסף עליך מידע אנליטי.",
    cookies: [
      { name: "_ga, _ga_*, _gid", purpose: "Google Analytics 4 - מעקב אגרגטיבי אחר אינטראקציה באתר", duration: "עד שנתיים" },
    ],
  },
  {
    name: "עוגיות שיווק (Marketing)",
    color: "#ff9500",
    required: false,
    description:
      "עוגיות המאפשרות הצגת פרסום ממוקד במדיה החברתית, מדידת הצלחת קמפיינים ושיוך המרות. הבסיס החוקי הוא הסכמתך המפורשת. ללא הסכמה לקטגוריה זו, עוגיות הספקים השיווקיים לא ייטענו.",
    cookies: [
      { name: "_fbp, _fbc", purpose: "Facebook Pixel - מעקב המרות וקמפיינים פרסומיים", duration: "3 חודשים" },
      { name: "fr", purpose: "Meta - שיוך פרסום", duration: "3 חודשים" },
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
              Cookies
            </h1>
            <p
              className="text-sm md:text-base"
              style={{ color: "rgba(255,255,255,0.6)", letterSpacing: "-0.224px" }}
            >
              עודכן לאחרונה: {LAST_UPDATED} · בתוקף מיום: {EFFECTIVE_DATE}
            </p>
          </div>
        </section>

        <section className="px-4 py-12 md:py-16">
          <div
            className="max-w-3xl mx-auto bg-white rounded-[16px] p-7 md:p-12 leading-relaxed"
            style={{
              boxShadow: "rgba(0,0,0,0.06) 0px 2px 14px 0px",
              color: "rgba(0,0,0,0.78)",
              letterSpacing: "-0.12px",
              fontSize: "0.95rem",
              lineHeight: 1.8,
            }}
          >
            <p className="mb-6">
              מסמך זה (להלן: <strong>&quot;מדיניות העוגיות&quot;</strong>) מהווה חלק בלתי נפרד מ<a href="/privacy" className="text-[#0071e3] hover:underline">מדיניות הפרטיות</a> של <strong style={{ color: "#1d1d1f" }}>איי די פון</strong> (להלן: <strong>&quot;החברה&quot;</strong>) ומפרט את אופן השימוש בעוגיות (Cookies) ובטכנולוגיות מעקב דומות באתר <a href="https://ad-phones.co.il" className="text-[#0071e3] hover:underline">ad-phones.co.il</a> (להלן: <strong>&quot;האתר&quot;</strong>).
            </p>

            <h2 className="text-xl md:text-2xl font-bold mt-10 mb-4" style={{ color: "#1d1d1f" }}>
              1. מהן עוגיות (Cookies)?
            </h2>
            <p className="mb-6">
              עוגיות הן קבצי טקסט קטנים הנשמרים על מכשיר הקצה (מחשב, טלפון, טאבלט) של המבקר באתר על-ידי הדפדפן. בנוסף לעוגיות, אנו עשויים לעשות שימוש בטכנולוגיות דומות לרבות web storage, pixels, ו-tags. לצורך מסמך זה, ההפניה ל&quot;עוגיות&quot; כוללת את כל הטכנולוגיות הללו.
            </p>

            <h2 className="text-xl md:text-2xl font-bold mt-10 mb-4" style={{ color: "#1d1d1f" }}>
              2. הסכמה ובסיס חוקי
            </h2>
            <p className="mb-3">
              הצבת עוגיות הכרחיות אינה דורשת הסכמה ומבוצעת על בסיס אינטרס לגיטימי וביצוע חוזה. הצבת עוגיות אנליטיקה ושיווק - אופציונלית בלבד וכפופה ל<strong>הסכמה מפורשת ומדעת</strong> מצדך.
            </p>
            <p className="mb-6">
              ההסכמה ניתנת באמצעות <strong>באנר ההסכמה</strong> המופיע בכניסה לאתר, המאפשר לבחור להסכים לכל הקטגוריות, רק להכרחיות, או להתאים את הבחירה לקטגוריות ספציפיות. ההסכמה נשמרת לתקופה של עד 12 חודשים, וניתן לחזור בך מההסכמה בכל עת.
            </p>

            <h2 className="text-xl md:text-2xl font-bold mt-10 mb-4" style={{ color: "#1d1d1f" }}>
              3. סוגי העוגיות באתר
            </h2>

            {CATEGORIES.map((cat, i) => (
              <div key={i} className="mb-8">
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  <span
                    className="inline-block w-3 h-3 rounded-full"
                    style={{ background: cat.color }}
                    aria-hidden
                  />
                  <h3 className="font-semibold text-base md:text-lg" style={{ color: "#1d1d1f" }}>
                    {cat.name}
                  </h3>
                  {cat.required ? (
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{ background: "rgba(52,199,89,0.12)", color: "#34c759" }}
                    >
                      חובה
                    </span>
                  ) : (
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{ background: "rgba(0,0,0,0.05)", color: "rgba(0,0,0,0.6)" }}
                    >
                      אופציונלי - דורש הסכמה
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
              4. ניהול ההסכמה
            </h2>
            <p className="mb-3">
              <strong>4.1</strong> ניתן לעדכן את הסכמתך בכל עת באמצעות הקישור המופיע בתחתית האתר (&quot;ניהול עוגיות&quot;) או על-ידי מחיקת העוגייה <code dir="ltr">ad_cookie_consent_v1</code> מהדפדפן.
            </p>
            <p className="mb-3">
              <strong>4.2</strong> בנוסף, ניתן לחסום או למחוק עוגיות באמצעות הגדרות הדפדפן. שים לב שחסימת עוגיות הכרחיות עלולה לפגוע בתפקוד האתר.
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
                <a href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" className="text-[#0071e3] hover:underline">Microsoft Edge</a>
              </li>
            </ul>

            <h2 className="text-xl md:text-2xl font-bold mt-10 mb-4" style={{ color: "#1d1d1f" }}>
              5. עוגיות צד שלישי (Third-Party Cookies)
            </h2>
            <p className="mb-6">
              חלק מהעוגיות באתר מוגדרות על-ידי ספקי שירות שאנו עובדים איתם. עוגיות אלה כפופות למדיניות הפרטיות של אותם ספקים, ולעיתים נשלטות גם על-ידי מערכות ההסכמה שלהם. רשימה מלאה של ספקי שירות והקישורים למדיניותם נמצאת ב-<a href="/privacy" className="text-[#0071e3] hover:underline">מדיניות הפרטיות</a> שלנו.
            </p>

            <h2 className="text-xl md:text-2xl font-bold mt-10 mb-4" style={{ color: "#1d1d1f" }}>
              6. Do Not Track / Global Privacy Control
            </h2>
            <p className="mb-6">
              איננו מגיבים באופן ייחודי לכותרות &quot;Do Not Track&quot; הנשלחות מדפדפן הלקוח. תמיכה ב-Global Privacy Control (GPC) תיבחן בעתיד. ניהול ההסכמה מתבצע באמצעות באנר ההסכמה שלנו כמתואר לעיל.
            </p>

            <h2 className="text-xl md:text-2xl font-bold mt-10 mb-4" style={{ color: "#1d1d1f" }}>
              7. שינויים במדיניות
            </h2>
            <p className="mb-6">
              בכל שינוי מהותי במדיניות זו או בעוגיות שאנו עושים בהן שימוש, נעדכן את המסמך ונבקש הסכמה מחודשת באמצעות באנר ההסכמה לפי הצורך. תאריך העדכון האחרון מופיע בראש הדף.
            </p>

            <h2 className="text-xl md:text-2xl font-bold mt-10 mb-4" style={{ color: "#1d1d1f" }}>
              8. יצירת קשר
            </h2>
            <ul className="list-none pr-0 space-y-1 mb-4">
              <li>דוא&quot;ל: <a href="mailto:info@ad-phones.co.il" className="text-[#0071e3] hover:underline">info@ad-phones.co.il</a></li>
              <li>טלפון: <a href="tel:+972534832573" className="text-[#0071e3] hover:underline" dir="ltr">053-483-2573</a></li>
            </ul>

            <p className="mt-10 pt-6 text-xs" style={{ color: "rgba(0,0,0,0.5)", borderTop: "1px solid #f0f0f0" }}>
              <strong>גילוי נאות:</strong> מסמך זה מהווה תיאור כללי של נוהלינו ואינו מהווה ייעוץ משפטי. למידע מלא על זכויותיך ראה את <a href="/privacy" className="text-[#0071e3] hover:underline">מדיניות הפרטיות</a>. בכל ספק - מומלץ להיוועץ בעורך דין.
            </p>

            <p className="mt-6 text-sm" style={{ color: "rgba(0,0,0,0.5)" }}>
              לקריאה נוספת:{" "}
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
