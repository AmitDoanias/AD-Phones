"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, Wrench, ShoppingCart, ChevronRight } from "lucide-react";
import { NAV_LINKS } from "@/constants";
import { useCart } from "@/hooks/useCart";

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { items } = useCart();

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Back + Logo (RTL start) */}
        <div className="flex items-center gap-1 shrink-0">
          {pathname !== "/" && (
            <button
              type="button"
              onClick={() =>
                window.history.length > 1
                  ? window.history.back()
                  : (window.location.href = "/")
              }
              className="md:hidden p-2 -mr-1 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
              aria-label="חזרה"
            >
              <ChevronRight size={24} strokeWidth={2.2} />
            </button>
          )}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <Image
              src="/logo.png"
              alt="AD Phones"
              width={120}
              height={40}
              className="h-10 w-auto"
              priority
            />
          </Link>
        </div>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname === link.href
                  ? "bg-[#0071e3] text-white"
                  : "text-slate-600 hover:text-[#0071e3] hover:bg-slate-100"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/cart"
            className="relative p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label="סל קניות"
          >
            <ShoppingCart size={20} />
            {items.length > 0 && (
              <span className="absolute -top-0.5 -left-0.5 min-w-[18px] h-[18px] flex items-center justify-center rounded-full text-[10px] font-bold text-white"
                    style={{ background: "#0071e3" }}>
                {items.length}
              </span>
            )}
          </Link>
          <Link
            href="/repairs"
            className="flex items-center gap-2 text-white px-4 py-2 rounded-[8px] text-sm font-medium transition-opacity hover:opacity-90"
            style={{ background: "#0071e3" }}
          >
            <Wrench size={16} />
            קבע תור לתיקון
          </Link>
        </div>

        {/* Mobile: cart + burger */}
        <div className="md:hidden flex items-center gap-1">
          <Link
            href="/cart"
            className="relative p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label="סל קניות"
          >
            <ShoppingCart size={20} />
            {items.length > 0 && (
              <span className="absolute -top-0.5 -left-0.5 min-w-[18px] h-[18px] flex items-center justify-center rounded-full text-[10px] font-bold text-white"
                    style={{ background: "#0071e3" }}>
                {items.length}
              </span>
            )}
          </Link>
          <button
            onClick={() => setOpen(!open)}
            className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label="תפריט"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pb-4 pt-2 flex flex-col gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                pathname === link.href
                  ? "bg-[#0071e3] text-white"
                  : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/repairs"
            onClick={() => setOpen(false)}
            className="mt-2 flex items-center justify-center gap-2 text-white px-4 py-2.5 rounded-[8px] text-sm font-medium transition-opacity hover:opacity-90"
            style={{ background: "#0071e3" }}
          >
            <Wrench size={16} />
            קבע תור לתיקון
          </Link>
        </div>
      )}
    </header>
  );
}
