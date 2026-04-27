import Image from "next/image";
import Link from "next/link";
import { MapPin, Phone, Clock } from "lucide-react";

const linkStyle = { color: "rgba(0,0,0,0.6)" };
const headingStyle = { color: "#1d1d1f" };

const SERVICE_CITIES = [
  "ראשון לציון",
  "רחובות",
  "בת ים",
  "נס ציונה",
  "חולון",
  "פתח תקווה",
  "רמלה",
  "משמר השבעה",
  "גבעתיים",
  "רמת גן",
  "תל אביב",
  "הרצליה",
  "אור יהודה",
  "קרית אונו",
  "סביון",
];

function FacebookIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
    </svg>
  );
}

function InstagramIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="bg-[#f5f5f7] mt-auto" style={{ borderTop: "1px solid rgba(0,0,0,0.08)" }}>
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Image
              src="/logo.png"
              alt="AD Phones"
              width={120}
              height={40}
              className="h-10 w-auto mb-4"
            />
            <p className="text-sm leading-relaxed mb-4" style={{ color: "rgba(0,0,0,0.55)" }}>
              תיקון מקצועי לאייפון, אייפד וסמסונג. שירות מהיר, אמין ובמחיר הוגן.
            </p>
            <ul className="space-y-2 text-sm mb-4" style={{ color: "rgba(0,0,0,0.6)" }}>
              <li className="flex items-start gap-2">
                <MapPin size={14} className="flex-shrink-0 mt-0.5" style={{ color: "rgba(0,0,0,0.45)" }} />
                <span>מעגל השלום 3, ראשון לציון</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={14} style={{ color: "rgba(0,0,0,0.45)" }} />
                <a
                  href="tel:+972534832573"
                  className="hover:text-[#0071e3] transition-colors"
                  dir="ltr"
                >
                  053-483-2573
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Clock size={14} className="flex-shrink-0 mt-0.5" style={{ color: "rgba(0,0,0,0.45)" }} />
                <span>
                  א&apos;–ה&apos; 09:00–19:00
                  <br />
                  ו&apos; 09:00–14:00
                </span>
              </li>
            </ul>
            <div className="flex items-center gap-3">
              <a
                href="#"
                aria-label="Facebook"
                className="transition-colors hover:text-[#0071e3]"
                style={{ color: "rgba(0,0,0,0.45)" }}
              >
                <FacebookIcon size={18} />
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="transition-colors hover:text-[#0071e3]"
                style={{ color: "rgba(0,0,0,0.45)" }}
              >
                <InstagramIcon size={18} />
              </a>
            </div>
          </div>

          {/* Repairs */}
          <div>
            <h3 className="font-semibold mb-4" style={headingStyle}>תיקונים</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/repairs/iphone"
                  className="transition-colors hover:text-[#0071e3]"
                  style={linkStyle}
                >
                  תיקון iPhone
                </Link>
              </li>
              <li>
                <Link
                  href="/repairs/ipad"
                  className="transition-colors hover:text-[#0071e3]"
                  style={linkStyle}
                >
                  תיקון iPad
                </Link>
              </li>
              <li>
                <Link
                  href="/repairs/samsung"
                  className="transition-colors hover:text-[#0071e3]"
                  style={linkStyle}
                >
                  תיקון סמסונג
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold mb-4" style={headingStyle}>החברה</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/about"
                  className="transition-colors hover:text-[#0071e3]"
                  style={linkStyle}
                >
                  אודותינו
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="transition-colors hover:text-[#0071e3]"
                  style={linkStyle}
                >
                  צור קשר
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold mb-4" style={headingStyle}>תמיכה</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/#faq"
                  className="transition-colors hover:text-[#0071e3]"
                  style={linkStyle}
                >
                  שאלות נפוצות
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div
          className="mt-10 pt-6 space-y-4"
          style={{ borderTop: "1px solid rgba(0,0,0,0.08)" }}
        >
          <p
            className="text-center text-xs leading-relaxed max-w-3xl mx-auto"
            style={{ color: "rgba(0,0,0,0.45)" }}
          >
            <span className="font-medium" style={{ color: "rgba(0,0,0,0.6)" }}>
              שירות לכל המרכז:
            </span>{" "}
            {SERVICE_CITIES.join(" · ")}
          </p>
          <p
            className="text-center text-xs"
            style={{ color: "rgba(0,0,0,0.35)" }}
          >
            &copy; {new Date().getFullYear()} AD Phones. כל הזכויות שמורות.
          </p>
        </div>
      </div>
    </footer>
  );
}
