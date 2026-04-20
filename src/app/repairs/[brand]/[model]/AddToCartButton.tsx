"use client";

import { useState } from "react";
import { useCart, type CartItem } from "@/hooks/useCart";
import { ShoppingCart, Check, X } from "lucide-react";

interface Props {
  item: CartItem;
}

export default function AddToCartButton({ item }: Props) {
  const { addItem, removeItem, items } = useCart();
  const [justAdded, setJustAdded] = useState(false);
  const [hovering, setHovering] = useState(false);
  const alreadyInCart = items.some((i) => i.modelRepairId === item.modelRepairId);

  function handleClick() {
    if (alreadyInCart) {
      removeItem(item.modelRepairId);
      setJustAdded(false);
      return;
    }
    addItem(item);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  }

  if (alreadyInCart) {
    const showRemove = hovering;
    return (
      <button
        onClick={handleClick}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        aria-pressed="true"
        aria-label={`${item.repairName} בסל — לחץ להסרה`}
        className={`inline-flex items-center justify-center gap-1.5 h-11 px-4 rounded-[10px] text-sm font-medium transition-all focus-visible:outline-2 focus-visible:outline-[#0071e3] ${
          showRemove
            ? "bg-red-50 text-red-700 border border-red-200"
            : "bg-emerald-50 text-emerald-700 border border-emerald-200"
        }`}
        style={{ letterSpacing: "-0.224px", minWidth: 120 }}
      >
        {showRemove ? (
          <>
            <X size={15} />
            הסר מהסל
          </>
        ) : (
          <>
            <Check size={15} />
            בסל
          </>
        )}
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      aria-pressed="false"
      aria-label={`הוסף ${item.repairName} לסל`}
      className="inline-flex items-center justify-center gap-1.5 h-11 px-4 rounded-[10px] text-sm font-medium text-white transition-all focus-visible:outline-2 focus-visible:outline-[#0071e3] shadow-[0_1px_2px_rgba(0,113,227,0.3)] hover:shadow-[0_4px_12px_rgba(0,113,227,0.35)]"
      style={{ background: "#0071e3", letterSpacing: "-0.224px", minWidth: 120 }}
      onMouseEnter={(e) =>
        ((e.currentTarget as HTMLButtonElement).style.background = "#0077ed")
      }
      onMouseLeave={(e) =>
        ((e.currentTarget as HTMLButtonElement).style.background = "#0071e3")
      }
    >
      {justAdded ? <Check size={15} /> : <ShoppingCart size={15} />}
      {justAdded ? "נוסף" : "הוסף לסל"}
    </button>
  );
}
