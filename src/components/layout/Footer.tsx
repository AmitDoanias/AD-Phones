import Image from "next/image";
import Link from "next/link";
import { Phone, MapPin, Clock } from "lucide-react";
import { WHATSAPP_NUMBER } from "@/constants";

export default function Footer() {
  return (
    <footer className="bg-[#f5f5f7] mt-auto" style={{ borderTop: "1px solid rgba(0,0,0,0.08)" }}>
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <Image
              src="/logo.png"
              alt="AD Phones"
              width={120}
              height={40}
              className="h-10 w-auto mb-4"
            />
            <p className="text-sm leading-relaxed" style={{ color: "rgba(0,0,0,0.55)" }}>
              תיקון מקצועי לאייפון, אייפד וסמסונג. שירות מהיר, אמין ובמחיר הוגן.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold mb-4" style={{ color: "#1d1d1f" }}>ניווט</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/"
                  className="transition-colors hover:text-[#0071e3]"
                  style={{ color: "rgba(0,0,0,0.6)" }}
                >
                  דף הבית
                </Link>
              </li>
              <li>
                <Link
                  href="/repairs"
                  className="transition-colors hover:text-[#0071e3]"
                  style={{ color: "rgba(0,0,0,0.6)" }}
                >
                  תיקונים ומחירים
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="transition-colors hover:text-[#0071e3]"
                  style={{ color: "rgba(0,0,0,0.6)" }}
                >
                  בלוג
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4" style={{ color: "#1d1d1f" }}>צרו קשר</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Phone size={15} style={{ color: "rgba(0,0,0,0.35)" }} className="shrink-0" />
                <a
                  href={`tel:+${WHATSAPP_NUMBER}`}
                  className="transition-colors hover:text-[#0071e3] ltr"
                  style={{ color: "rgba(0,0,0,0.6)" }}
                  dir="ltr"
                >
                  054-772-3281
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={15} style={{ color: "rgba(0,0,0,0.35)" }} className="shrink-0 mt-0.5" />
                <span style={{ color: "rgba(0,0,0,0.6)" }}>כתובת העסק</span>
              </li>
              <li className="flex items-start gap-2">
                <Clock size={15} style={{ color: "rgba(0,0,0,0.35)" }} className="shrink-0 mt-0.5" />
                <span style={{ color: "rgba(0,0,0,0.6)" }}>
                  א&apos;-ה&apos; 09:00–19:00
                  <br />
                  ו&apos; 09:00–14:00
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div
          className="mt-10 pt-6 text-center text-xs"
          style={{ borderTop: "1px solid rgba(0,0,0,0.08)", color: "rgba(0,0,0,0.35)" }}
        >
          <p>
            &copy; {new Date().getFullYear()} AD Phones. כל הזכויות שמורות.
          </p>
        </div>
      </div>
    </footer>
  );
}
