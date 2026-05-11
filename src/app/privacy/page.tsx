import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppFab from "@/components/layout/WhatsAppFab";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "מדיניות פרטיות | איי די פון",
  description:
    "מדיניות הפרטיות של איי די פון - איזה מידע אנחנו אוספים, למה, ואיך אנחנו שומרים על הפרטיות שלך.",
  alternates: { canonical: "https://www.ad-phones.co.il/privacy" },
  robots: { index: true, follow: true },
};

const LAST_UPDATED = "אפריל 2026";
const EFFECTIVE_DATE = "28 באפריל 2026";

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
              מדיניות פרטיות זו (להלן: <strong>&quot;המדיניות&quot;</strong>) מתארת את האופן שבו <strong style={{ color: "#1d1d1f" }}>איי די פון</strong> (להלן: <strong>&quot;החברה&quot;, &quot;אנו&quot;</strong>) אוספת, משתמשת, מאחסנת ומגנה על מידע אישי הנאסף ממבקרים ומלקוחות באתר <a href="https://www.ad-phones.co.il" className="text-[#0071e3] hover:underline">ad-phones.co.il</a> (להלן: <strong>&quot;האתר&quot;</strong>) ובמסגרת השירותים הניתנים על ידי החברה.
            </p>
            <p className="mb-6">
              המדיניות נערכה בהתאם להוראות <strong>חוק הגנת הפרטיות, התשמ&quot;א-1981</strong> והתקנות שהותקנו מכוחו, וכן בהתאם לעקרונות מקובלים של רגולציות בינלאומיות (לרבות GDPR האירופי) ככל שיחולו. השימוש באתר ו/או בשירותי החברה מהווה הסכמה מצדך לתנאי המדיניות.
            </p>

            <h2 className="text-xl md:text-2xl font-bold mt-10 mb-4" style={{ color: "#1d1d1f" }}>
              1. הגדרות
            </h2>
            <ul className="list-disc pr-5 mb-6 space-y-2">
              <li><strong>&quot;מידע אישי&quot;</strong> - כהגדרתו בחוק הגנת הפרטיות; כל מידע שניתן לזהות באמצעותו אדם, לרבות שם, מספר טלפון, דוא&quot;ל, כתובת, פרטי מכשיר ופרטים נוספים שתספק.</li>
              <li><strong>&quot;נושא המידע&quot;</strong> - אדם שעליו נאסף ונשמר המידע האישי.</li>
              <li><strong>&quot;עיבוד&quot;</strong> - כל פעולה הנעשית במידע האישי, לרבות איסוף, שמירה, שימוש, גילוי, העברה ומחיקה.</li>
              <li><strong>&quot;עוגיות&quot;</strong> - קבצי טקסט קטנים הנשמרים על מכשיר הקצה של המשתמש; פירוט מלא ב-<a href="/cookies" className="text-[#0071e3] hover:underline">Cookies</a>.</li>
            </ul>

            <h2 className="text-xl md:text-2xl font-bold mt-10 mb-4" style={{ color: "#1d1d1f" }}>
              2. פרטי המאגר ובעל המאגר
            </h2>
            <ul className="list-disc pr-5 mb-6 space-y-1">
              <li><strong>שם המאגר:</strong> איי די פון - לקוחות ופניות</li>
              <li><strong>בעל המאגר ומחזיק המאגר:</strong> עמית דואניאס, בעל איי די פון</li>
              <li><strong>כתובת:</strong> מעגל השלום 3, ראשון לציון</li>
              <li><strong>אמצעי קשר:</strong> טלפון 053-483-2573 · דוא&quot;ל <a href="mailto:info@ad-phones.co.il" className="text-[#0071e3] hover:underline">info@ad-phones.co.il</a></li>
              <li><strong>מטרת המאגר:</strong> מתן שירות, יצירת קשר, ניהול הזמנות, שיפור האתר ועמידה בדרישות חוק.</li>
            </ul>

            <h2 className="text-xl md:text-2xl font-bold mt-10 mb-4" style={{ color: "#1d1d1f" }}>
              3. מידע הנאסף
            </h2>
            <h3 className="font-semibold mt-5 mb-2" style={{ color: "#1d1d1f" }}>
              3.1 מידע שתספק ביוזמתך:
            </h3>
            <ul className="list-disc pr-5 mb-4 space-y-1">
              <li>שם מלא, מספר טלפון - בעת מילוי טופס יצירת קשר או הזמנת תיקון.</li>
              <li>כתובת דוא&quot;ל - אם תבחר לספק, לצורך משלוח אישורים והתכתבות.</li>
              <li>פרטי המכשיר - יצרן, דגם, סוג תקלה, מצב המכשיר.</li>
              <li>תוכן הודעות שתשלח אלינו.</li>
              <li>כתובת לאיסוף או הגעת טכנאי, אם תבחר באפשרות זו.</li>
            </ul>
            <h3 className="font-semibold mt-5 mb-2" style={{ color: "#1d1d1f" }}>
              3.2 מידע הנאסף אוטומטית:
            </h3>
            <ul className="list-disc pr-5 mb-4 space-y-1">
              <li>כתובת IP, סוג דפדפן, מערכת הפעלה ואזור זמן.</li>
              <li>דפים שנצפו, זמן שהייה, אירועי ניווט.</li>
              <li>מקור הפניה (URL מפנה).</li>
              <li>מידע מעוגיות וטכנולוגיות דומות (פירוט ב-<a href="/cookies" className="text-[#0071e3] hover:underline">Cookies</a>).</li>
            </ul>
            <p className="mb-6 text-sm" style={{ color: "rgba(0,0,0,0.6)" }}>
              איננו אוספים &quot;מידע רגיש&quot; כהגדרתו בחוק הגנת הפרטיות (כגון מידע רפואי, דעות פוליטיות וכו&apos;) אלא אם תספק אותו ביוזמתך כחלק מתיאור התקלה במכשירך.
            </p>

            <h2 className="text-xl md:text-2xl font-bold mt-10 mb-4" style={{ color: "#1d1d1f" }}>
              4. מטרות העיבוד והבסיס החוקי
            </h2>
            <p className="mb-3">
              אנו מעבדים את המידע האישי לצרכים הבאים, כל אחד על בסיס חוקי המתאים לו:
            </p>
            <ul className="list-disc pr-5 mb-6 space-y-2">
              <li><strong>מתן השירות וניהול ההזמנה</strong> - בסיס: ביצוע חוזה. ללא מידע זה לא נוכל לתאם תיקון או לחזור אליך.</li>
              <li><strong>תקשורת תפעולית</strong> - אישורי הזמנה, עדכוני סטטוס, שאלות מקצועיות. בסיס: ביצוע חוזה ואינטרס לגיטימי.</li>
              <li><strong>שיפור האתר וחווית המשתמש</strong> - בסיס: אינטרס לגיטימי, בכפוף להסכמה לעוגיות אנליטיקה.</li>
              <li><strong>שיווק ופרסום ממוקד</strong> - שליחת הצעות והודעות שיווקיות, רטרגטינג. בסיס: הסכמה מפורשת בלבד.</li>
              <li><strong>עמידה בחובות חוק</strong> - שמירת רישומים לצורכי חשבונאות, אחריות מוצר ותקנות מס. בסיס: חובה חוקית.</li>
              <li><strong>הגנה על זכויות החברה</strong> - מניעת הונאות, התדיינות משפטית, אכיפת תנאים. בסיס: אינטרס לגיטימי.</li>
            </ul>

            <h2 className="text-xl md:text-2xl font-bold mt-10 mb-4" style={{ color: "#1d1d1f" }}>
              5. מסירת מידע לצדדים שלישיים
            </h2>
            <p className="mb-3">
              איננו מוכרים, מחכירים או סוחרים במידע אישי. עם זאת, לצורך תפעול האתר והשירות אנו עושים שימוש בספקי תשתית מקצועיים, לרבות:
            </p>
            <ul className="list-disc pr-5 mb-4 space-y-2">
              <li><strong>Supabase Inc.</strong> - אחסון מסד נתונים ואימות משתמשים. <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer" className="text-[#0071e3] hover:underline">מדיניות פרטיות</a></li>
              <li><strong>Vercel Inc.</strong> - אירוח האתר ותשתית CDN. <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-[#0071e3] hover:underline">מדיניות פרטיות</a></li>
              <li><strong>Cloudinary Ltd.</strong> - אחסון תמונות. <a href="https://cloudinary.com/privacy" target="_blank" rel="noopener noreferrer" className="text-[#0071e3] hover:underline">מדיניות פרטיות</a></li>
              <li><strong>Resend Inc.</strong> - שליחת דואר אלקטרוני אוטומטי. <a href="https://resend.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-[#0071e3] hover:underline">מדיניות פרטיות</a></li>
              <li><strong>Elfsight Limited</strong> - הצגת ביקורות מ-Google באתר. <a href="https://elfsight.com/privacy-policy/" target="_blank" rel="noopener noreferrer" className="text-[#0071e3] hover:underline">מדיניות פרטיות</a></li>
              <li><strong>Google LLC (Google Analytics)</strong> - אנליטיקה (לכשייושם, בכפוף להסכמה). <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-[#0071e3] hover:underline">מדיניות פרטיות</a></li>
              <li><strong>Meta Platforms Inc. (Facebook Pixel)</strong> - שיווק ופרסום (לכשייושם, בכפוף להסכמה). <a href="https://www.facebook.com/privacy/policy" target="_blank" rel="noopener noreferrer" className="text-[#0071e3] hover:underline">מדיניות פרטיות</a></li>
            </ul>
            <p className="mb-6">
              נמסור מידע אישי לרשויות מוסמכות אך ורק במידה ונחויב לכך לפי הוראות הדין, צו שיפוטי או הוראת רשות מוסמכת אחרת.
            </p>

            <h2 className="text-xl md:text-2xl font-bold mt-10 mb-4" style={{ color: "#1d1d1f" }}>
              6. העברת מידע אל מחוץ לישראל
            </h2>
            <p className="mb-6">
              חלק מספקי התשתית שלנו מאחסנים נתונים בשרתים מחוץ לישראל - בעיקר בארצות הברית ובאיחוד האירופי. ההעברה מתבצעת בכפוף להוראות תקנות הגנת הפרטיות (העברת מידע אל מאגרי מידע שמחוץ לגבולות המדינה), התשס&quot;א-2001, ולתנאי הסכמי עיבוד מידע (DPA) המבטיחים סטנדרט הגנה הולם.
            </p>

            <h2 className="text-xl md:text-2xl font-bold mt-10 mb-4" style={{ color: "#1d1d1f" }}>
              7. עוגיות וטכנולוגיות מעקב
            </h2>
            <p className="mb-6">
              באתר נעשה שימוש בעוגיות (Cookies) ובטכנולוגיות מעקב דומות. פירוט מלא לרבות סוגי העוגיות, מטרותיהן, משך שמירתן ואפשרויות ההסכמה והניהול - נמצא ב-<a href="/cookies" className="text-[#0071e3] hover:underline">Cookies</a>. ההסכמה לעוגיות לא-הכרחיות ניתנת באמצעות באנר ההסכמה המופיע בכניסה לאתר וניתן לעדכנה בכל עת.
            </p>

            <h2 className="text-xl md:text-2xl font-bold mt-10 mb-4" style={{ color: "#1d1d1f" }}>
              8. אבטחת מידע
            </h2>
            <p className="mb-6">
              אנו נוקטים באמצעי אבטחה סבירים ומקובלים בתעשייה לשמירה על המידע, לרבות: הצפנת תקשורת ב-HTTPS/TLS, הצפנת סיסמאות במסד נתונים (hashing), הגבלת גישה לעובדים מורשים בלבד על בסיס &quot;צורך לדעת&quot;, ואימות לחשבונות ניהול. עם זאת, אין מערכת מידע מאובטחת לחלוטין, ואיננו ערבים שמאמצים אלו ימנעו כל פגיעה אפשרית במידע.
            </p>

            <h2 className="text-xl md:text-2xl font-bold mt-10 mb-4" style={{ color: "#1d1d1f" }}>
              9. שמירת מידע
            </h2>
            <p className="mb-3">
              אנו שומרים את המידע האישי לתקופה הנדרשת למילוי המטרות שלשמן נאסף, או כפי שמחייב הדין. תקופות שמירה אופייניות:
            </p>
            <ul className="list-disc pr-5 mb-6 space-y-1">
              <li><strong>הזמנות תיקון</strong> - 7 שנים (לצורכי חשבונאות ואחריות לפי דין).</li>
              <li><strong>פניות יצירת קשר</strong> - עד 3 שנים, או עד לקבלת בקשת מחיקה ממך.</li>
              <li><strong>נתוני אנליטיקה אנונימיים</strong> - עד 26 חודשים (Google Analytics default).</li>
              <li><strong>נתונים שמירתם נדרשת על-פי דין</strong> - לתקופה הקבועה בחוק.</li>
            </ul>

            <h2 className="text-xl md:text-2xl font-bold mt-10 mb-4" style={{ color: "#1d1d1f" }}>
              10. זכויותיך
            </h2>
            <p className="mb-3">בכפוף ובהתאם להוראות חוק הגנת הפרטיות, עומדות לרשותך הזכויות הבאות:</p>
            <ul className="list-disc pr-5 mb-4 space-y-2">
              <li><strong>זכות עיון</strong> (סעיף 13 לחוק) - לבקש לעיין במידע אישי שאנו מחזיקים אודותיך.</li>
              <li><strong>זכות תיקון</strong> (סעיף 14 לחוק) - לבקש תיקון מידע שגוי, לא מעודכן או חלקי.</li>
              <li><strong>זכות מחיקה</strong> - לבקש מחיקת מידע, בכפוף לחובות שמירה לפי דין.</li>
              <li><strong>זכות התנגדות לדיוור ישיר</strong> (סעיף 17ו לחוק) - להפסיק לקבל דיוור פרסומי באמצעות הסרה דרך הלינק במייל או פנייה אלינו.</li>
              <li><strong>זכות לחזרה מהסכמה</strong> - לחזור בך מהסכמה שניתנה לעיבוד או למסירת מידע, מבלי שהדבר יפגע בחוקיות עיבוד שבוצע קודם לחזרה.</li>
            </ul>
            <p className="mb-6">
              לבירור או מימוש זכויות אלה, ניתן לפנות אלינו בדוא&quot;ל <a href="mailto:info@ad-phones.co.il" className="text-[#0071e3] hover:underline">info@ad-phones.co.il</a>. נשתדל להשיב לבקשתך תוך <strong>30 ימים</strong> ממועד קבלתה, בכפוף לאימות זהותך.
            </p>

            <h2 className="text-xl md:text-2xl font-bold mt-10 mb-4" style={{ color: "#1d1d1f" }}>
              11. קטינים
            </h2>
            <p className="mb-6">
              האתר אינו מכוון במישרין לקטינים מתחת לגיל 16. לא ייאסף מידע מקטינים ביודעין ללא הסכמת אפוטרופוס. אם נודע לנו שמידע נאסף מקטין שלא כדין, נמחק אותו ללא דיחוי.
            </p>

            <h2 className="text-xl md:text-2xl font-bold mt-10 mb-4" style={{ color: "#1d1d1f" }}>
              12. שינויים במדיניות
            </h2>
            <p className="mb-6">
              אנו רשאים לעדכן את מדיניות זו מעת לעת, לרבות בעקבות שינויי חקיקה, שינויים טכנולוגיים או שינויים בשירות. תאריך העדכון האחרון יופיע בראש הדף. במקרה של שינוי מהותי, נודיע על כך באתר באופן בולט, ואם תידרש הסכמה מחודשת - נבקש אותה.
            </p>

            <h2 className="text-xl md:text-2xl font-bold mt-10 mb-4" style={{ color: "#1d1d1f" }}>
              13. סמכות שיפוט וברירת דין
            </h2>
            <p className="mb-6">
              על מדיניות זו ועל כל סכסוך הנובע ממנה יחולו דיני מדינת ישראל בלבד. סמכות השיפוט הייחודית לדון בכל סכסוך כאמור נתונה לבתי המשפט המוסמכים במחוז תל אביב-יפו.
            </p>

            <h2 className="text-xl md:text-2xl font-bold mt-10 mb-4" style={{ color: "#1d1d1f" }}>
              14. הפרדות (Severability)
            </h2>
            <p className="mb-6">
              אם ייקבע על-ידי בית משפט מוסמך שסעיף כלשהו במדיניות זו אינו חוקי או אינו ניתן לאכיפה, יישאר הסעיף בתוקפו במידה המרבית המותרת לפי דין, ויתר הסעיפים יישארו בתוקפם המלא.
            </p>

            <h2 className="text-xl md:text-2xl font-bold mt-10 mb-4" style={{ color: "#1d1d1f" }}>
              15. יצירת קשר
            </h2>
            <p className="mb-2">לכל שאלה, בקשה או תלונה בנושא פרטיות:</p>
            <ul className="list-none pr-0 space-y-1 mb-4">
              <li>דוא&quot;ל: <a href="mailto:info@ad-phones.co.il" className="text-[#0071e3] hover:underline">info@ad-phones.co.il</a></li>
              <li>טלפון: <a href="tel:+972534832573" className="text-[#0071e3] hover:underline" dir="ltr">053-483-2573</a></li>
              <li>כתובת למשלוח: מעגל השלום 3, ראשון לציון</li>
            </ul>
            <p className="text-xs mt-6 mb-2" style={{ color: "rgba(0,0,0,0.6)" }}>
              נציין כי באפשרותך גם לפנות בתלונה ל<a href="https://www.gov.il/he/departments/the_privacy_protection_authority" target="_blank" rel="noopener noreferrer" className="text-[#0071e3] hover:underline">רשות להגנת הפרטיות</a> במשרד המשפטים.
            </p>

            <p className="mt-10 pt-6 text-xs" style={{ color: "rgba(0,0,0,0.6)", borderTop: "1px solid #f0f0f0" }}>
              <strong>גילוי נאות:</strong> מסמך זה הוכן בנוסח כללי על בסיס דרישות חוק הגנת הפרטיות וההיכרות שלנו עם פעילות החברה. הוא אינו מהווה ייעוץ משפטי. במקרה של ספק או תיקון נדרש, מומלץ להתייעץ עם עורך דין המתמחה בדיני פרטיות ומסחר אלקטרוני.
            </p>

            <p className="mt-6 text-sm" style={{ color: "rgba(0,0,0,0.6)" }}>
              לקריאה נוספת ראה גם:{" "}
              <a href="/cookies" className="text-[#0071e3] hover:underline">Cookies</a>
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
