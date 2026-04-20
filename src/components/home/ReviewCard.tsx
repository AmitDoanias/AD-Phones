import { Star } from "lucide-react";

export type Review = {
  reviewer_name: string;
  rating: number;
  text: string;
  published_at: string;
};

function formatDate(dateStr: string) {
  try {
    return new Date(dateStr).toLocaleDateString("he-IL", {
      year: "numeric",
      month: "short",
    });
  } catch {
    return "";
  }
}

export default function ReviewCard({ review }: { review: Review }) {
  const stars = Math.min(5, Math.max(1, Math.round(review.rating)));

  return (
    <div
      className="bg-white rounded-[8px] p-5 flex flex-col gap-3 h-full"
      style={{ boxShadow: "rgba(0,0,0,0.08) 0px 2px 10px 0px" }}
    >
      {/* Stars */}
      <div className="flex gap-0.5" aria-label={`דירוג ${stars} מתוך 5`}>
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={14}
            fill={i < stars ? "#0071e3" : "transparent"}
            stroke={i < stars ? "#0071e3" : "rgba(0,0,0,0.2)"}
          />
        ))}
      </div>

      {/* Review text */}
      <p
        className="text-sm leading-relaxed flex-1"
        style={{ color: "rgba(0,0,0,0.75)", letterSpacing: "-0.12px" }}
      >
        &ldquo;{review.text}&rdquo;
      </p>

      {/* Reviewer + date */}
      <div className="flex items-center justify-between gap-2 pt-1 border-t border-[#f5f5f7]">
        <span
          className="text-sm font-semibold"
          style={{ color: "#1d1d1f", letterSpacing: "0.196px" }}
        >
          {review.reviewer_name}
        </span>
        <span className="text-xs" style={{ color: "rgba(0,0,0,0.4)" }}>
          {formatDate(review.published_at)}
        </span>
      </div>
    </div>
  );
}
