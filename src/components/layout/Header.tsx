"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, Wrench } from "lucide-react";
import { NAV_LINKS } from "@/constants";

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
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

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname === link.href
                  ? "bg-primary text-white"
                  : "text-slate-600 hover:text-primary hover:bg-slate-100"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/repairs"
            className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-light transition-colors"
          >
            <Wrench size={16} />
            קבע תור לתיקון
          </Link>
        </div>

        {/* Mobile burger */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
          aria-label="תפריט"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
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
                  ? "bg-primary text-white"
                  : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/repairs"
            onClick={() => setOpen(false)}
            className="mt-2 flex items-center justify-center gap-2 bg-primary text-white px-4 py-2.5 rounded-lg text-sm font-medium"
          >
            <Wrench size={16} />
            קבע תור לתיקון
          </Link>
        </div>
      )}
    </header>
  );
}
