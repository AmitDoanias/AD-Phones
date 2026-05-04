"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { X, Search, ShoppingCart, Check, Clock, ChevronLeft } from "lucide-react";
import { useCart } from "@/hooks/useCart";

interface ModelPrice {
  modelRepairId: string;
  modelId: string;
  model_name: string;
  model_slug: string;
  brand_name: string;
  brand_slug: string;
  repairName: string;
  repairSlug: string;
  price: number;
  duration_min: number;
}

interface RepairPricingModalProps {
  repairName: string;
  description?: string | null;
  models: ModelPrice[];
  onClose: () => void;
}

export default function RepairPricingModal({
  repairName,
  description,
  models,
  onClose,
}: RepairPricingModalProps) {
  const [search, setSearch] = useState("");
  const [visible, setVisible] = useState(false);
  const backdropRef = useRef<HTMLDivElement>(null);
  const { items, addItem, removeItem } = useCart();

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 250);
  };

  const filtered = models.filter((m) =>
    m.model_name.toLowerCase().includes(search.toLowerCase())
  );

  // Group by brand
  const grouped = filtered.reduce<Record<string, ModelPrice[]>>((acc, m) => {
    if (!acc[m.brand_name]) acc[m.brand_name] = [];
    acc[m.brand_name].push(m);
    return acc;
  }, {});

  const isInCart = (modelRepairId: string) =>
    items.some((item) => item.modelRepairId === modelRepairId);

  const handleToggleCart = (e: React.MouseEvent, m: ModelPrice) => {
    e.stopPropagation();
    if (isInCart(m.modelRepairId)) {
      removeItem(m.modelRepairId);
    } else {
      addItem({
        modelRepairId: m.modelRepairId,
        modelId: m.modelId,
        modelName: m.model_name,
        brandName: m.brand_name,
        repairName: m.repairName,
        price: m.price,
      });
    }
  };

  const cartCount = items.length;

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center"
      style={{
        background: visible ? "rgba(0,0,0,0.65)" : "rgba(0,0,0,0)",
        backdropFilter: visible ? "blur(8px)" : "blur(0px)",
        WebkitBackdropFilter: visible ? "blur(8px)" : "blur(0px)",
        transition: "all 250ms ease-out",
      }}
      onClick={(e) => {
        if (e.target === backdropRef.current) handleClose();
      }}
    >
      <div
        className="w-full md:max-w-md overflow-hidden"
        style={{
          maxHeight: "85vh",
          background: "rgba(28,28,30,0.95)",
          backdropFilter: "saturate(180%) blur(20px)",
          WebkitBackdropFilter: "saturate(180%) blur(20px)",
          borderRadius: "20px 20px 0 0",
          transform: visible ? "translateY(0)" : "translateY(100%)",
          opacity: visible ? 1 : 0,
          transition: "transform 300ms cubic-bezier(0.32, 0.72, 0, 1), opacity 200ms ease-out",
        }}
      >
        {/* Drag indicator (mobile) */}
        <div className="flex justify-center pt-2 pb-1 md:hidden">
          <div className="w-9 h-1 rounded-full bg-white/20" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3">
          <div>
            <h3
              className="font-bold text-white"
              style={{ fontSize: "1.25rem", letterSpacing: "-0.28px" }}
            >
              {repairName}
            </h3>
            <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>
              בחר דגם להוספה לסל
            </p>
          </div>
          <div className="flex items-center gap-2">
            {cartCount > 0 && (
              <div className="relative">
                <ShoppingCart size={18} style={{ color: "rgba(255,255,255,0.6)" }} />
                <span
                  className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center text-white"
                  style={{ background: "#0071e3" }}
                >
                  {cartCount}
                </span>
              </div>
            )}
            <button
              onClick={handleClose}
              className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
              style={{ background: "rgba(255,255,255,0.1)" }}
            >
              <X size={16} color="white" />
            </button>
          </div>
        </div>

        {/* Description (if available) */}
        {description && (
          <div className="px-5 pb-3">
            <p
              className="text-[13px] leading-relaxed whitespace-pre-line"
              style={{ color: "rgba(255,255,255,0.72)", letterSpacing: "-0.1px" }}
            >
              {description}
            </p>
          </div>
        )}

        {/* Search */}
        <div className="px-5 pb-3">
          <div
            className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl"
            style={{
              background: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <Search size={15} style={{ color: "rgba(255,255,255,0.35)" }} />
            <input
              type="text"
              placeholder="חיפוש דגם..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/25"
              style={{ letterSpacing: "-0.12px" }}
            />
          </div>
        </div>

        {/* Divider */}
        <div className="mx-5 h-px" style={{ background: "rgba(255,255,255,0.06)" }} />

        {/* Price List */}
        <div className="px-4 py-3 overflow-y-auto" style={{ maxHeight: "58vh" }}>
          {Object.keys(grouped).length === 0 ? (
            <p className="text-center text-sm py-10" style={{ color: "rgba(255,255,255,0.35)" }}>
              לא נמצאו דגמים
            </p>
          ) : (
            Object.entries(grouped).map(([brand, brandModels]) => (
              <div key={brand} className="mb-5 last:mb-0">
                <div className="flex items-center gap-2 mb-2 px-1">
                  <span
                    className="text-[11px] font-semibold tracking-wider uppercase"
                    style={{ color: "#2997ff" }}
                  >
                    {brand}
                  </span>
                  <div className="flex-1 h-px" style={{ background: "rgba(41,151,255,0.15)" }} />
                  <span className="text-[11px]" style={{ color: "rgba(255,255,255,0.25)" }}>
                    {brandModels.length} דגמים
                  </span>
                </div>
                <div className="flex flex-col gap-1.5">
                  {brandModels.map((m) => {
                    const inCart = isInCart(m.modelRepairId);
                    return (
                      <div
                        key={`${brand}-${m.modelRepairId}`}
                        className="flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 cursor-pointer"
                        style={{
                          background: inCart
                            ? "rgba(0,113,227,0.12)"
                            : "rgba(255,255,255,0.04)",
                          border: inCart
                            ? "1px solid rgba(0,113,227,0.25)"
                            : "1px solid transparent",
                        }}
                        onClick={(e) => handleToggleCart(e, m)}
                      >
                        {/* Model info */}
                        <div className="flex-1 min-w-0">
                          <p
                            className="text-sm font-medium text-white truncate"
                            style={{ letterSpacing: "-0.12px" }}
                          >
                            {m.model_name}
                          </p>
                          <div className="flex items-center gap-3 mt-0.5">
                            <div className="flex items-center gap-1.5">
                              <Clock size={10} style={{ color: "rgba(255,255,255,0.3)" }} />
                              <span className="text-[11px]" style={{ color: "rgba(255,255,255,0.3)" }}>
                                {m.duration_min} דקות
                              </span>
                            </div>
                            <Link
                              href={`/repairs/${m.brand_slug}/${m.model_slug}/${m.repairSlug}`}
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex items-center gap-0.5 text-[11px] font-medium hover:underline"
                              style={{ color: "#2997ff" }}
                            >
                              לפרטים
                              <ChevronLeft size={11} />
                            </Link>
                          </div>
                        </div>

                        {/* Price */}
                        <span
                          className="text-sm font-bold whitespace-nowrap"
                          style={{ color: "#2997ff" }}
                        >
                          ₪{m.price}
                        </span>

                        {/* Cart toggle button */}
                        <button
                          onClick={(e) => handleToggleCart(e, m)}
                          className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 flex-shrink-0"
                          style={{
                            background: inCart ? "#0071e3" : "rgba(255,255,255,0.08)",
                            border: inCart ? "none" : "1px solid rgba(255,255,255,0.12)",
                            transform: inCart ? "scale(1)" : "scale(1)",
                          }}
                          title={inCart ? "הסר מהסל" : "הוסף לסל"}
                        >
                          {inCart ? (
                            <Check size={15} color="white" strokeWidth={3} />
                          ) : (
                            <ShoppingCart size={14} style={{ color: "rgba(255,255,255,0.6)" }} />
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
