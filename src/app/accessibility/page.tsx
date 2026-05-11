import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppFab from "@/components/layout/WhatsAppFab";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "הצהרת נגישות | איי די פון",
  description:
    "הצהרת נגישות של אתר איי די פון - התאמה לתקן ישראלי 5568 ו-WCAG 2.0 AA, אמצעי הנגשה והתחייבות לשיפור מתמיד.",
  alternates: { canonical: "https://www.ad-phones.co.il/accessibility" },
  robots: { index: true, follow: true },
};

const LAST_UPDATED = "אפריל 2026";
const EFFECTIVE_DATE = "28 באפריל 2026";

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
            <h2 className="text-xl md:text-2xl font-bold mb-4" style={{ color: "#1d1d1f" }}>
              1. כללי
            </h2>
            <p className="mb-3">
              <strong style={{ color: "#1d1d1f" }}>איי די פון</strong> (להלן: <strong>&quot;החברה&quot;</strong>) רואה בנגישות ערך חשוב ופועלת באופן שוטף להנגשת שירותיה ואתר האינטרנט שלה (להלן: <strong>&quot;האתר&quot;</strong>) לכלל הציבור, ובכלל זה לאנשים עם מוגבלות.
            </p>
            <p className="mb-6">
              הצהרה זו נערכה בהתאם להוראות <strong>חוק שוויון זכויות לאנשים עם מוגבלות, התשנ&quot;ח-1998</strong> ו<strong>תקנות שוויון זכויות לאנשים עם מוגבלות (התאמות נגישות לשירות), התשע&quot;ג-2013</strong>.
            </p>

            <h2 className="text-xl md:text-2xl font-bold mt-10 mb-4" style={{ color: "#1d1d1f" }}>
              2. רמת ההתאמה ותקני העזר
            </h2>
            <p className="mb-3">
              האתר נבנה בהתאם להוראות תקנה 35 לתקנות שוויון זכויות לאנשים עם מוגבלות (התאמות נגישות לשירות), התשע&quot;ג-2013, ובהתאם לתקן הישראלי <strong>ת&quot;י 5568</strong> ברמה <strong>AA</strong>, המבוסס על הנחיות הנגישות לתכני אינטרנט של ארגון <strong>W3C - WCAG 2.0 AA</strong>.
            </p>
            <p className="mb-6">
              החברה משקיעה משאבים ומאמצים על מנת להגיע לרמת ההתאמה המיטבית ולעמוד בדרישות התקן בצורה מלאה.
            </p>

            <h2 className="text-xl md:text-2xl font-bold mt-10 mb-4" style={{ color: "#1d1d1f" }}>
              3. אמצעי הנגשה באתר
            </h2>
            <ul className="list-disc pr-5 mb-6 space-y-2">
              <li>
                <strong>תפריט נגישות אינטראקטיבי</strong> - כפתור צף בצד הדף הפותח תפריט הכולל: שינוי גודל טקסט, ניגודיות גבוהה, הדגשת קישורים, השבתת אנימציות ותנועה, ואפס לברירת מחדל. הבחירה נשמרת בדפדפן המשתמש לפעמים הבאות.
              </li>
              <li>
                <strong>תאימות לקוראי מסך</strong> - האתר נכתב במבנה HTML5 סמנטי תקני, עם תוויות ARIA במקומות הנדרשים, לתמיכה בקוראי מסך נפוצים: NVDA, JAWS ו-VoiceOver.
              </li>
              <li>
                <strong>ניווט מקלדת מלא</strong> - ניתן לנווט בכל האתר ולבצע את כל הפעולות באמצעות מקלדת בלבד (Tab, Shift+Tab, Enter, Space).
              </li>
              <li>
                <strong>טקסט חלופי לתמונות</strong> - כל התמונות החשובות באתר כוללות טקסט חלופי (alt text) המתאר את התוכן.
              </li>
              <li>
                <strong>גודל טקסט מתכוונן</strong> - ניתן להגדיל את הטקסט עד 200% מבלי לאבד פונקציונליות או תוכן.
              </li>
              <li>
                <strong>ניגודיות צבעים</strong> - הטקסטים באתר עומדים ביחס ניגודיות מינימלי של 4.5:1 (טקסט רגיל) ו-3:1 (טקסט גדול), כדרישות התקן.
              </li>
              <li>
                <strong>פונט קריא בעברית</strong> - שימוש בפונט Heebo, התומך בעברית מלאה ומותאם לקריאה במגוון מסכים.
              </li>
              <li>
                <strong>כיווניות RTL מלאה</strong> - האתר מוצג בכיווניות עברית מימין לשמאל בכל המרכיבים.
              </li>
              <li>
                <strong>טפסים נגישים</strong> - לכל שדה תווית מקושרת (label), אינדיקציות שגיאה ברורות, והדרכות שימוש.
              </li>
              <li>
                <strong>תאימות מובייל</strong> - האתר מותאם לכל גודלי המסך, לרבות מסכי מובייל, וניתן לתפעל באמצעות מגע.
              </li>
            </ul>

            <h2 className="text-xl md:text-2xl font-bold mt-10 mb-4" style={{ color: "#1d1d1f" }}>
              4. שימוש בתפריט הנגישות
            </h2>
            <p className="mb-3">
              בכל עמוד באתר מופיע כפתור עיגול בצד הדף עם איקון נגישות. לחיצה עליו פותחת תפריט עם האפשרויות הבאות:
            </p>
            <ul className="list-disc pr-5 mb-6 space-y-1">
              <li><strong>הגדלת/הקטנת טקסט</strong> - שינוי גודל הטקסט בכל האתר בטווח 85%-150%.</li>
              <li><strong>ניגודיות גבוהה</strong> - מצב ניגודיות מוגברת לטקסט והטיות צבע.</li>
              <li><strong>הדגשת קישורים</strong> - מסגרת בולטת סביב כל הקישורים והכפתורים.</li>
              <li><strong>עצירת אנימציות</strong> - השבתת אפקטים ותנועה (מתאים גם לאנשים הסובלים מ-vestibular disorders).</li>
              <li><strong>איפוס</strong> - חזרה לתצוגה הרגילה.</li>
            </ul>

            <h2 className="text-xl md:text-2xl font-bold mt-10 mb-4" style={{ color: "#1d1d1f" }}>
              5. נגישות בית העסק הפיזי
            </h2>
            <p className="mb-3">
              <strong>כתובת:</strong> מעגל השלום 3, ראשון לציון
            </p>
            <p className="mb-3" style={{ color: "rgba(0,0,0,0.6)" }}>
              <em>אנא אמת את הפרטים הבאים מול בית העסק שלך וערוך לפי הצורך:</em>
            </p>
            <ul className="list-disc pr-5 mb-6 space-y-1">
              <li>הכניסה לעסק נגישה לכיסא גלגלים, ללא מדרגות.</li>
              <li>חניית נכים זמינה בקרבת מקום במגרש החניה הציבורי.</li>
              <li>שירותים נגישים זמינים במרכז המסחרי.</li>
              <li>צוות העסק זמין לסיוע בכל שאלה או בקשה הקשורה לנגישות.</li>
            </ul>

            <h2 className="text-xl md:text-2xl font-bold mt-10 mb-4" style={{ color: "#1d1d1f" }}>
              6. התאמות נוספות לפי דרישה
            </h2>
            <p className="mb-6">
              אנו מציעים התאמות נוספות בהתאם לצורך - לרבות הקראת תכנים, הסבר טלפוני מורחב, תיאום מועד פנוי בשירות, ועוד. אנא צור קשר עם רכז הנגישות לתיאום.
            </p>

            <h2 className="text-xl md:text-2xl font-bold mt-10 mb-4" style={{ color: "#1d1d1f" }}>
              7. מגבלות ידועות
            </h2>
            <p className="mb-3">
              חרף מאמצינו, ייתכנו אזורים שאינם נגישים במלואם או בכלל:
            </p>
            <ul className="list-disc pr-5 mb-6 space-y-1">
              <li>תכנים שהועלו על-ידי משתמשים או צדדים שלישיים, כולל תמונות שצולמו במכשיר הלקוח, עשויים שלא לכלול תיאור טקסטואלי מלא.</li>
              <li>וידג&apos;ט הביקורות (Elfsight) משולב מצד שלישי, ורמת הנגישות שלו בשליטת הספק החיצוני.</li>
              <li>תכני בלוג ישנים ומסמכי PDF שיועלו - אנו פועלים להנגשתם בהדרגה.</li>
            </ul>
            <p className="mb-6">
              אם נתקלת בבעיית נגישות בכל אזור באתר - נשמח לשמוע ולפעול לתיקון בהקדם האפשרי.
            </p>

            <h2 className="text-xl md:text-2xl font-bold mt-10 mb-4" style={{ color: "#1d1d1f" }}>
              8. רכז הנגישות
            </h2>
            <p className="mb-3">בהתאם לתקנה 91 לתקנות שוויון זכויות לאנשים עם מוגבלות (התאמות נגישות לשירות), התשע&quot;ג-2013, מונה רכז נגישות:</p>
            <ul className="list-none pr-0 space-y-1 mb-4">
              <li><strong>שם:</strong> עמית דואניאס</li>
              <li><strong>תפקיד:</strong> בעלים, איי די פון</li>
              <li><strong>דוא&quot;ל:</strong> <a href="mailto:info@ad-phones.co.il" className="text-[#0071e3] hover:underline">info@ad-phones.co.il</a></li>
              <li><strong>טלפון:</strong> <a href="tel:+972534832573" className="text-[#0071e3] hover:underline" dir="ltr">053-483-2573</a></li>
              <li><strong>שעות מענה:</strong> ימים א&apos;-ה&apos; 09:00-19:00, יום ו&apos; 09:00-14:00</li>
              <li><strong>זמן מענה לפניות נגישות:</strong> עד 3 ימי עבודה</li>
            </ul>
            <p className="mb-6">
              ניתן להגיש פנייה, תלונה או הצעה לשיפור באמצעי הקשר לעיל. נטפל בכל פנייה במקצועיות וביעילות.
            </p>

            <h2 className="text-xl md:text-2xl font-bold mt-10 mb-4" style={{ color: "#1d1d1f" }}>
              9. תהליך שיפור מתמיד
            </h2>
            <p className="mb-6">
              החברה מקיימת בדיקות נגישות תקופתיות, מטמיעה תיקונים ופועלת לשיפור הרציף של חוויית המשתמש לכלל המשתמשים. הצהרת נגישות זו תעודכן בהתאם לעדכוני האתר ולהתפתחות תקני הנגישות.
            </p>

            <p className="mt-10 pt-6 text-xs" style={{ color: "rgba(0,0,0,0.6)", borderTop: "1px solid #f0f0f0" }}>
              <strong>גילוי נאות:</strong> הצהרה זו מהווה תיאור עכשווי של מצב הנגישות באתר ואינה מהווה ייעוץ משפטי. במידה ותרצה לקבל ייעוץ נגישות מקצועי, או נדרשת התאמת התקן לסוג עיסוק מיוחד, מומלץ להתייעץ עם מורשה נגישות שירות מטעם הרשות לזכויות אנשים עם מוגבלות.
            </p>

            <p className="mt-6 text-sm" style={{ color: "rgba(0,0,0,0.6)" }}>
              לקריאה נוספת:{" "}
              <a href="/privacy" className="text-[#0071e3] hover:underline">מדיניות פרטיות</a>
              {" · "}
              <a href="/cookies" className="text-[#0071e3] hover:underline">Cookies</a>
            </p>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppFab />
    </>
  );
}
