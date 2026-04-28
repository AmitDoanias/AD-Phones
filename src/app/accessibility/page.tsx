import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppFab from "@/components/layout/WhatsAppFab";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "הצהרת נגישות | איי די פון",
  description:
    "הצהרת נגישות של אתר איי די פון - התאמת האתר לתקני נגישות ישראלים ובינלאומיים, אמצעי הנגשה והתחייבות לשיפור מתמיד.",
  alternates: { canonical: "https://ad-phones.co.il/accessibility" },
  robots: { index: true, follow: true },
};

const LAST_UPDATED = "אפריל 2026";

export default function AccessibilityPage() {
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
              הצהרת נגישות
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
              מחויבות לנגישות
            </h2>
            <p className="mb-6">
              ב-<strong style={{ color: "#1d1d1f" }}>איי די פון</strong> אנו רואים בנגישות ערך מרכזי. אנו פועלים על מנת שאתר זה יהיה נגיש למרבית האוכלוסייה בישראל, כולל אנשים עם מוגבלויות שונות, ועומדים בדרישות חוק שוויון זכויות לאנשים עם מוגבלות, התשנ&quot;ח-1998 ותקנות הנגישות לשירות (תקנות שוויון זכויות לאנשים עם מוגבלות (התאמות נגישות לשירות), התשע&quot;ג-2013).
            </p>

            <h2 className="text-xl md:text-2xl font-bold mt-10 mb-4" style={{ color: "#1d1d1f" }}>
              רמת התאמה
            </h2>
            <p className="mb-3">
              האתר עומד בחלק גדול מדרישות התקן הישראלי <strong>ת&quot;י 5568</strong> ברמה AA, המבוסס על התקן הבינלאומי <strong>WCAG 2.0 AA</strong> של ה-W3C.
            </p>
            <p className="mb-6">
              אנו פועלים בהתמדה לשפר את רמת הנגישות של האתר ולעמוד בתקן בצורה מלאה ככל הניתן.
            </p>

            <h2 className="text-xl md:text-2xl font-bold mt-10 mb-4" style={{ color: "#1d1d1f" }}>
              תכונות נגישות באתר
            </h2>
            <ul className="list-disc pr-5 mb-6 space-y-2">
              <li>
                <strong>תפריט נגישות</strong> - כפתור צף בצד הדף המאפשר התאמת תצוגה: הגדלת טקסט, ניגודיות גבוהה, הדגשת קישורים, הגדלת סמן עכבר ועצירת אנימציות.
              </li>
              <li>
                <strong>תמיכה בקוראי מסך</strong> - האתר נכתב במבנה HTML סמנטי עם תוויות ARIA מתאימות לתמיכה ב-NVDA, JAWS ו-VoiceOver.
              </li>
              <li>
                <strong>ניווט מקלדת</strong> - ניתן לנווט בכל האתר באמצעות מקלדת בלבד (Tab, Shift+Tab, Enter, Space).
              </li>
              <li>
                <strong>טקסט חלופי לתמונות</strong> - כל התמונות באתר כוללות תיאור טקסטואלי (alt text).
              </li>
              <li>
                <strong>גודל טקסט</strong> - ניתן להגדיל את הטקסט ב-200% מבלי לאבד פונקציונליות.
              </li>
              <li>
                <strong>ניגודיות צבעים</strong> - כל הטקסטים החשובים עומדים ביחס ניגודיות של 4.5:1 לפחות.
              </li>
              <li>
                <strong>פונט נוח לקריאה</strong> - שימוש בפונט Heebo התומך בעברית ובכל אמצעי המסך.
              </li>
              <li>
                <strong>תוכן בעברית מלאה</strong> - האתר מוצג בכיוון RTL מלא וכולל ניווט בעברית.
              </li>
              <li>
                <strong>טפסים נגישים</strong> - כל שדה כולל תווית (label) קשורה והודעות שגיאה ברורות.
              </li>
            </ul>

            <h2 className="text-xl md:text-2xl font-bold mt-10 mb-4" style={{ color: "#1d1d1f" }}>
              איך משתמשים בתפריט הנגישות
            </h2>
            <p className="mb-3">
              בכל עמוד באתר, בצד הדף, מופיע כפתור עיגול עם איקון נגישות (סמל אדם בתוך עיגול). לחיצה על הכפתור פותחת תפריט עם האפשרויות הבאות:
            </p>
            <ul className="list-disc pr-5 mb-6 space-y-1">
              <li><strong>הגדלת טקסט</strong> - לחיצות חוזרות מגדילות את גודל הטקסט בכל האתר</li>
              <li><strong>הקטנת טקסט</strong> - חזרה לגודל המקורי</li>
              <li><strong>ניגודיות גבוהה</strong> - מצב שחור-לבן עם ניגודיות מקסימלית</li>
              <li><strong>הדגשת קישורים</strong> - מסגרת בולטת סביב כל הקישורים</li>
              <li><strong>עצירת אנימציות</strong> - השבתת אנימציות ותנועה</li>
              <li><strong>איפוס</strong> - חזרה לתצוגה הרגילה</li>
            </ul>

            <h2 className="text-xl md:text-2xl font-bold mt-10 mb-4" style={{ color: "#1d1d1f" }}>
              חלקים שעדיין לא נגישים במלואם
            </h2>
            <p className="mb-3">
              למרות מאמצינו, ייתכנו אזורים מסוימים באתר שאינם נגישים במלואם:
            </p>
            <ul className="list-disc pr-5 mb-6 space-y-1">
              <li>תמונות ומסמכים שהועלו ידנית - ייתכן שחלקם לא יכללו תיאור טקסטואלי מלא</li>
              <li>וידג&apos;ט הביקורות (Trustindex) - מוצג מצד שלישי, רמת הנגישות שלו בשליטת הספק</li>
              <li>חלק מתכני בלוג ישנים - אנו עובדים על הנגשה רטרואקטיבית</li>
            </ul>
            <p className="mb-6">
              אם נתקלת בקושי באזור מסוים - נשמח לשמוע ולתקן בהקדם.
            </p>

            <h2 className="text-xl md:text-2xl font-bold mt-10 mb-4" style={{ color: "#1d1d1f" }}>
              נגישות בית העסק
            </h2>
            <p className="mb-3">
              <strong>כתובת:</strong> מעגל השלום 3, ראשון לציון
            </p>
            <ul className="list-disc pr-5 mb-6 space-y-1">
              <li>הגישה לעסק עם נגישות לכיסא גלגלים</li>
              <li>שירותים נגישים בקרבת מקום (במרכז המסחרי)</li>
              <li>חניית נכים זמינה במגרש החניה הסמוך</li>
              <li>בכניסה - ללא מדרגות, נגיש מהרחוב</li>
            </ul>

            <h2 className="text-xl md:text-2xl font-bold mt-10 mb-4" style={{ color: "#1d1d1f" }}>
              רכז נגישות
            </h2>
            <p className="mb-3">
              נתקלת בבעיית נגישות באתר או בבית העסק? יש לך הצעה לשיפור? נשמח לשמוע.
            </p>
            <ul className="list-none pr-0 space-y-1 mb-4">
              <li><strong>שם:</strong> עמית דואניאס</li>
              <li>
                <strong>דוא&quot;ל:</strong>{" "}
                <a href="mailto:info@ad-phones.co.il" className="text-[#0071e3] hover:underline">info@ad-phones.co.il</a>
              </li>
              <li>
                <strong>טלפון:</strong>{" "}
                <a href="tel:+972534832573" className="text-[#0071e3] hover:underline" dir="ltr">053-483-2573</a>
              </li>
              <li><strong>זמני מענה:</strong> א&apos;-ה&apos; 09:00-19:00, ו&apos; 09:00-14:00</li>
            </ul>
            <p className="mb-6">
              נשתדל לחזור אליך תוך 3 ימי עבודה ולספק מענה מקצועי לכל פנייה.
            </p>

            <h2 className="text-xl md:text-2xl font-bold mt-10 mb-4" style={{ color: "#1d1d1f" }}>
              עדכונים ושיפור
            </h2>
            <p className="mb-6">
              הצהרת נגישות זו תעודכן באופן שוטף ככל שיתבצעו עדכונים באתר ובהתאם לפניות שיתקבלו.
            </p>

            <p className="mt-10 pt-6 text-sm" style={{ color: "rgba(0,0,0,0.5)", borderTop: "1px solid #f0f0f0" }}>
              לקריאה נוספת ראה גם:{" "}
              <a href="/privacy" className="text-[#0071e3] hover:underline">מדיניות פרטיות</a>
              {" · "}
              <a href="/cookies" className="text-[#0071e3] hover:underline">מדיניות עוגיות</a>
            </p>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppFab />
    </>
  );
}
