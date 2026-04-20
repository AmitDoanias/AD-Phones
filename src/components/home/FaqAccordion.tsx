"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const FAQS = [
  {
    q: "האם צריך לקבוע תור מראש?",
    a: "אין צורך לקבוע תור מראש כדי ליצור איתנו קשר, לקבל הצעת מחיר או להזמין תיקון. לקוחות שמגיעים ללא תיאום מראש מתקבלים בדרך כלל בשעות הפעילות, אך הזמינות יכולה להשתנות בהתאם לעומס העבודה ולסוג התיקון הנדרש. אם חשוב לך זמן טיפול מהיר במיוחד, מומלץ להזמין תור מראש. כך נוכל לשמור עבורך זמן עבודה, לוודא זמינות של חלקים, ולתעדף את התיקון שלך. זה חשוב במיוחד עבור תיקונים באותו היום ועבור בקשות לשירות אקספרס.",
  },
  {
    q: "האם אני צריך לגבות את הנתונים שלי לפני התיקון?",
    a: "כן, מומלץ לגבות את הנתונים שלך בכל הזדמנות. רוב התיקונים אינם משפיעים על המידע שבמכשיר, אך לא ניתן להבטיח שמידע יישמר במקרים של תקלות פנימיות, נזקי נוזלים או בעיות תוכנה למכשיר.",
  },
  {
    q: "האם המחירים שלכם כוללים מע״מ ועבודה?",
    a: "כן, כל המחירים שלנו כוללים חלקים, עבודה ומע״מ.",
  },
  {
    q: "האם אני יחויב אם לא תצליחו לתקן את המכשיר?",
    a: "באי.די פון, אנו עובדים על פי מדיניות של ״לא תיקנת, לא שילמת״. אם לא נצליח בתיקון, לא תחויבו עבור חלקים או עבודה.",
  },
  {
    q: "האם יש אחריות על התיקונים?",
    a: "כן, כל התיקונים שלנו מכוסים באחריות של 3 חודשים. למעט מקרים של נזק לקוח (שבר או נזקי מים).",
  },
  {
    q: "כמה זמן לוקח לאבחן תקלה לא ידועה?",
    a: "הליך האבחון המלא שלנו אורך בין 24-48 שעות עבור תקלה לא ידועה.",
  },
];

function FaqItem({
  faq,
  index,
  open,
  onToggle,
}: {
  faq: { q: string; a: string };
  index: number;
  open: boolean;
  onToggle: (i: number) => void;
}) {
  return (
    <div
      className="bg-[#272729] rounded-[8px] overflow-hidden"
    >
      <button
        onClick={() => onToggle(index)}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-right transition-colors hover:bg-[#2a2a2d]"
        aria-expanded={open}
      >
        <span
          className="font-semibold text-sm"
          style={{ color: "#ffffff", letterSpacing: "0.196px" }}
        >
          {faq.q}
        </span>
        <ChevronDown
          size={17}
          className="flex-shrink-0 transition-transform duration-200"
          style={{
            color: "#0071e3",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
          }}
        />
      </button>

      <div
        className="overflow-hidden transition-all duration-300"
        style={{ maxHeight: open ? 500 : 0 }}
      >
        <p
          className="px-5 pb-4 text-sm leading-relaxed"
          style={{ color: "rgba(255,255,255,0.65)", letterSpacing: "-0.12px" }}
        >
          {faq.a}
        </p>
      </div>
    </div>
  );
}

export default function FaqAccordion() {
  const [open, setOpen] = useState<number | null>(null);

  const toggle = (i: number) => setOpen(open === i ? null : i);

  const half = Math.ceil(FAQS.length / 2);
  const colA = FAQS.slice(0, half);
  const colB = FAQS.slice(half);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {/* Column A */}
      <div className="flex flex-col gap-3">
        {colA.map((faq, i) => (
          <FaqItem
            key={i}
            faq={faq}
            index={i}
            open={open === i}
            onToggle={toggle}
          />
        ))}
      </div>
      {/* Column B */}
      <div className="flex flex-col gap-3">
        {colB.map((faq, i) => {
          const globalIdx = half + i;
          return (
            <FaqItem
              key={globalIdx}
              faq={faq}
              index={globalIdx}
              open={open === globalIdx}
              onToggle={toggle}
            />
          );
        })}
      </div>
    </div>
  );
}
