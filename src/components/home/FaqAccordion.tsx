"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { FAQS as FAQ_SOURCE } from "@/constants/faqs";

type FaqItemData = { q: string; a: string };

const DEFAULT_FAQS: FaqItemData[] = FAQ_SOURCE.map((f) => ({
  q: f.question,
  a: f.answer,
}));

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
        <Plus
          size={17}
          className="flex-shrink-0 transition-transform duration-200"
          style={{
            color: "#0071e3",
            transform: open ? "rotate(45deg)" : "rotate(0deg)",
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

type Props = {
  items?: { question: string; answer: string }[];
};

export default function FaqAccordion({ items }: Props = {}) {
  const [open, setOpen] = useState<number | null>(null);

  const toggle = (i: number) => setOpen(open === i ? null : i);

  const faqs: FaqItemData[] = items
    ? items.map((f) => ({ q: f.question, a: f.answer }))
    : DEFAULT_FAQS;

  const half = Math.ceil(faqs.length / 2);
  const colA = faqs.slice(0, half);
  const colB = faqs.slice(half);

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
