"use client";

import ReviewCard, { type Review } from "./ReviewCard";

export default function ReviewsSection({ reviews }: { reviews: Review[] }) {
  return (
    <>
      {/* Desktop grid */}
      <div className="hidden md:grid grid-cols-3 gap-4">
        {reviews.map((review, i) => (
          <ReviewCard key={i} review={review} />
        ))}
      </div>

      {/* Mobile horizontal scroll */}
      <div
        className="md:hidden flex gap-4 overflow-x-auto pb-2"
        style={{ scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch" }}
      >
        {reviews.map((review, i) => (
          <div
            key={i}
            className="flex-shrink-0 w-[80vw] max-w-xs"
            style={{ scrollSnapAlign: "start" }}
          >
            <ReviewCard review={review} />
          </div>
        ))}
      </div>
    </>
  );
}
