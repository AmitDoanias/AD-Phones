import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppFab from "@/components/layout/WhatsAppFab";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "מדיניות פרטיות | איי די פון",
  description:
    "מדיניות הפרטיות של איי די פון - איזה מידע אנחנו אוספים, למה, ואיך אנחנו שומרים על הפרטיות שלך.",
  alternates: { canonical: "https://ad-phones.co.il/privacy" },
  robots: { index: true, follow: true },
};

const LAST_UPDATED = "אפריל 2026";

export default function PrivacyPolicyPage() {
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
              מדיניות פרטיות
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
            <p className="mb-6">
              ב-<strong style={{ color: "#1d1d1f" }}>איי די פון</strong> (A&amp;D Phones) אנו מכבדים את פרטיות לקוחותינו ומחויבים להגן על המידע האישי שלך. מדיניות פרטיות זו מסבירה איזה מידע אנחנו אוספים, איך אנחנו משתמשים בו, ואת הזכויות העומדות לרשותך.
            </p>

            <h2 className="text-xl md:text-2xl font-bold mt-10 mb-4" style={{ color: "#1d1d1f" }}>
              1. מי אנחנו
            </h2>
            <ul className="list-disc pr-5 mb-6 space-y-1">
              <li>שם העסק: איי די פון - מעבדת תיקוני סלולר</li>
              <li>בעלים: עמית דואניאס</li>
              <li>ע.מ.: __________ (ימולא)</li>
              <li>כתובת: מעגל השלום 3, ראשון לציון</li>
              <li>טלפון: 053-483-2573</li>
              <li>דוא&quot;ל: info@ad-phones.co.il</li>
            </ul>

            <h2 className="text-xl md:text-2xl font-bold mt-10 mb-4" style={{ color: "#1d1d1f" }}>
              2. איזה מידע אנחנו אוספים
            </h2>
            <p className="mb-3">
              אנו אוספים מידע אישי שאתה מספק לנו ביוזמתך, וכן מידע טכני שנאסף אוטומטית בעת השימוש באתר:
            </p>
            <h3 className="font-semibold mt-5 mb-2" style={{ color: "#1d1d1f" }}>
              מידע שאתה מספק:
            </h3>
            <ul className="list-disc pr-5 mb-4 space-y-1">
              <li>שם מלא ומספר טלפון - בעת מילוי טופס יצירת קשר או הזמנת תיקון</li>
              <li>כתובת דוא&quot;ל (אופציונלי)</li>
              <li>פרטי המכשיר שלך (יצרן, דגם, סוג תקלה)</li>
              <li>תוכן הודעות שאתה כותב לנו</li>
              <li>כתובת לאיסוף/הגעת טכנאי - אם בחרת באפשרות זו</li>
            </ul>
            <h3 className="font-semibold mt-5 mb-2" style={{ color: "#1d1d1f" }}>
              מידע טכני שנאסף אוטומטית:
            </h3>
            <ul className="list-disc pr-5 mb-4 space-y-1">
              <li>כתובת IP, סוג דפדפן, מערכת הפעלה</li>
              <li>דפים שביקרת בהם, זמן השהייה, ואירועי ניווט</li>
              <li>מקור ההפניה (מאיפה הגעת לאתר)</li>
              <li>מידע מעוגיות (Cookies) - ראה <a href="/cookies" className="text-[#0071e3] hover:underline">מדיניות עוגיות</a></li>
            </ul>

            <h2 className="text-xl md:text-2xl font-bold mt-10 mb-4" style={{ color: "#1d1d1f" }}>
              3. למה אנחנו אוספים את המידע
            </h2>
            <ul className="list-disc pr-5 mb-6 space-y-2">
              <li>
                <strong>מתן השירות</strong> - יצירת קשר חוזר, תיאום תיקון, מתן הצעת מחיר ואישור הזמנה.
              </li>
              <li>
                <strong>שיפור האתר</strong> - הבנה איך לקוחות משתמשים באתר כדי לשפר את החוויה.
              </li>
              <li>
                <strong>חוקיות ותקינות</strong> - עמידה בדרישות חוק, ביטוח אחריות תיקונים, מניעת הונאות.
              </li>
              <li>
                <strong>שיווק</strong> - שליחת מבצעים והצעות (רק אם נתת אישור מפורש).
              </li>
            </ul>

            <h2 className="text-xl md:text-2xl font-bold mt-10 mb-4" style={{ color: "#1d1d1f" }}>
              4. עם מי אנחנו חולקים את המידע
            </h2>
            <p className="mb-3">
              אנחנו <strong>לא מוכרים</strong> מידע אישי לצדדים שלישיים. עם זאת, אנו משתמשים בספקי שירות מקצועיים אשר עוזרים לנו להפעיל את האתר ואת השירות:
            </p>
            <ul className="list-disc pr-5 mb-4 space-y-2">
              <li>
                <strong>Supabase</strong> (אחסון מידע ואימות) -{" "}
                <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer" className="text-[#0071e3] hover:underline">מדיניות פרטיות</a>
              </li>
              <li>
                <strong>Vercel</strong> (אירוח האתר) -{" "}
                <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-[#0071e3] hover:underline">מדיניות פרטיות</a>
              </li>
              <li>
                <strong>Cloudinary</strong> (אחסון תמונות) -{" "}
                <a href="https://cloudinary.com/privacy" target="_blank" rel="noopener noreferrer" className="text-[#0071e3] hover:underline">מדיניות פרטיות</a>
              </li>
              <li>
                <strong>Resend</strong> (שליחת מיילים) -{" "}
                <a href="https://resend.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-[#0071e3] hover:underline">מדיניות פרטיות</a>
              </li>
              <li>
                <strong>Trustindex</strong> (הצגת ביקורות גוגל) -{" "}
                <a href="https://www.trustindex.io/legal/privacy-policy/" target="_blank" rel="noopener noreferrer" className="text-[#0071e3] hover:underline">מדיניות פרטיות</a>
              </li>
              <li>
                <strong>Google Analytics</strong> (אנליטיקה - בעתיד) -{" "}
                <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-[#0071e3] hover:underline">מדיניות פרטיות</a>
              </li>
              <li>
                <strong>Facebook Pixel</strong> (Meta) - מעקב פרסום ואופטימיזציה של מודעות -{" "}
                <a href="https://www.facebook.com/privacy/policy" target="_blank" rel="noopener noreferrer" className="text-[#0071e3] hover:underline">מדיניות פרטיות</a>
              </li>
            </ul>
            <p className="mb-6">
              חלק מהספקים מאחסנים נתונים בשרתים מחוץ לישראל (לרוב בארה&quot;ב או באירופה). אנו עובדים רק עם ספקים שעומדים בסטנדרטים מחמירים של אבטחת מידע ופרטיות.
            </p>

            <h2 className="text-xl md:text-2xl font-bold mt-10 mb-4" style={{ color: "#1d1d1f" }}>
              5. עוגיות (Cookies) וטכנולוגיות מעקב
            </h2>
            <p className="mb-4">
              אנחנו משתמשים בעוגיות לצרכים שונים - חלקן הכרחיות לתפקוד האתר, אחרות עוזרות לנו להבין איך משתמשים באתר ולהציג פרסום רלוונטי. פירוט מלא ב-<a href="/cookies" className="text-[#0071e3] hover:underline">מדיניות העוגיות</a>.
            </p>
            <p className="mb-6">
              באנר העוגיות בכניסה לאתר מאפשר לך לבחור איזה סוגי עוגיות תרצה לאפשר. תוכל לעדכן את הבחירה בכל עת.
            </p>

            <h2 className="text-xl md:text-2xl font-bold mt-10 mb-4" style={{ color: "#1d1d1f" }}>
              6. אבטחת מידע
            </h2>
            <p className="mb-6">
              אנו נוקטים באמצעי אבטחה מקובלים בתעשייה: הצפנת נתונים בתנועה (HTTPS), הצפנת סיסמאות ב-DB, הגבלת גישה לעובדים מורשים בלבד, ואימות דו-שלבי לחשבונות ניהול. עם זאת, אין שיטה של העברת מידע על האינטרנט שהיא 100% מאובטחת.
            </p>

            <h2 className="text-xl md:text-2xl font-bold mt-10 mb-4" style={{ color: "#1d1d1f" }}>
              7. הזכויות שלך
            </h2>
            <p className="mb-3">לפי חוק הגנת הפרטיות, התשמ&quot;א-1981, יש לך את הזכויות הבאות:</p>
            <ul className="list-disc pr-5 mb-4 space-y-1">
              <li>
                <strong>זכות עיון</strong> - לבקש לקבל עותק של המידע שאנו מחזיקים עליך
              </li>
              <li>
                <strong>זכות תיקון</strong> - לבקש תיקון מידע לא מדויק
              </li>
              <li>
                <strong>זכות מחיקה</strong> - לבקש למחוק את המידע (בכפוף לחובות חוקיות)
              </li>
              <li>
                <strong>זכות התנגדות</strong> - להתנגד לשימוש במידע למטרות שיווק
              </li>
              <li>
                <strong>הסרה מרשימת תפוצה</strong> - להפסיק לקבל מיילים שיווקיים
              </li>
            </ul>
            <p className="mb-6">
              לממש כל אחת מהזכויות הללו, פנה אלינו בדוא&quot;ל:{" "}
              <a href="mailto:info@ad-phones.co.il" className="text-[#0071e3] hover:underline">info@ad-phones.co.il</a>
            </p>

            <h2 className="text-xl md:text-2xl font-bold mt-10 mb-4" style={{ color: "#1d1d1f" }}>
              8. שמירת מידע
            </h2>
            <p className="mb-6">
              אנו שומרים את המידע שלך כל עוד הוא נדרש למטרה שלשמה נאסף, או לפי דרישות החוק. בדרך כלל - מידע על תיקונים נשמר ל-7 שנים (לצרכי אחריות וחשבונאות), פניות יצירת קשר נשמרות ל-3 שנים אלא אם תבקש מחיקה מוקדם יותר.
            </p>

            <h2 className="text-xl md:text-2xl font-bold mt-10 mb-4" style={{ color: "#1d1d1f" }}>
              9. שינויים במדיניות
            </h2>
            <p className="mb-6">
              אנו עשויים לעדכן מדיניות זו מעת לעת. תמיד תוכל לראות את התאריך של העדכון האחרון בראש הדף. במידה ויחולו שינויים מהותיים, נודיע על כך בצורה בולטת באתר.
            </p>

            <h2 className="text-xl md:text-2xl font-bold mt-10 mb-4" style={{ color: "#1d1d1f" }}>
              10. יצירת קשר
            </h2>
            <p className="mb-2">לכל שאלה בנושא פרטיות:</p>
            <ul className="list-none pr-0 space-y-1 mb-4">
              <li>
                דוא&quot;ל: <a href="mailto:info@ad-phones.co.il" className="text-[#0071e3] hover:underline">info@ad-phones.co.il</a>
              </li>
              <li>
                טלפון: <a href="tel:+972534832573" className="text-[#0071e3] hover:underline" dir="ltr">053-483-2573</a>
              </li>
              <li>כתובת: מעגל השלום 3, ראשון לציון</li>
            </ul>

            <p className="mt-10 pt-6 text-sm" style={{ color: "rgba(0,0,0,0.5)", borderTop: "1px solid #f0f0f0" }}>
              לקריאה נוספת ראה גם:{" "}
              <a href="/cookies" className="text-[#0071e3] hover:underline">מדיניות עוגיות</a>
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
