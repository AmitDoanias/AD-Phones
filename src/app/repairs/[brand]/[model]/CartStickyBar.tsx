"use client";

import Link from "next/link";
import { useCart } from "@/hooks/useCart";
import { ShoppingCart } from "lucide-react";

export default function CartStickyBar() {
  const { items, total } = useCart();

  if (items.length === 0) return null;

  return (
    <div
      className="fixed bottom-0 right-0 left-0 z-40 flex items-center justify-between px-4 py-3 md:px-8"
      style={{
        background: "rgba(29,29,31,0.92)",
        backdropFilter: "saturate(180%) blur(20px)",
      }}
    >
      <span className="text-white text-sm" style={{ letterSpacing: "-0.224px" }}>
        <span className="font-semibold">{items.length}</span> פריטים בסל ·{" "}
        <span className="font-semibold">₪{total}</span>
      </span>
      <Link
        href="/cart"
        className="flex items-center gap-2 px-5 py-2 rounded-[8px] text-sm font-medium text-white transition-colors"
        style={{ background: "#0071e3" }}
      >
        <ShoppingCart size={15} />
        לסל הקניות
      </Link>
    </div>
  );
}
