import Image from "next/image";
import Link from "next/link";
import { Phone, MapPin, Clock } from "lucide-react";
import { WHATSAPP_NUMBER } from "@/constants";

export default function Footer() {
  return (
    <footer className="bg-[#0f172a] text-slate-300 mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <Image
              src="/logo.png"
              alt="AD Phones"
              width={120}
              height={40}
              className="h-10 w-auto mb-4 brightness-0 invert"
            />
            <p className="text-sm text-slate-400 leading-relaxed">
              תיקון מקצועי לאייפון, אייפד וסמסונג. שירות מהיר, אמין ובמחיר הוגן.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">ניווט</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  דף הבית
                </Link>
              </li>
              <li>
                <Link
                  href="/repairs"
                  className="hover:text-white transition-colors"
                >
                  תיקונים ומחירים
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="hover:text-white transition-colors"
                >
                  בלוג
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">צרו קשר</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Phone size={15} className="text-slate-500 shrink-0" />
                <a
                  href={`tel:+${WHATSAPP_NUMBER}`}
                  className="hover:text-white transition-colors ltr"
                  dir="ltr"
                >
                  054-772-3281
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={15} className="text-slate-500 shrink-0 mt-0.5" />
                <span>כתובת העסק</span>
              </li>
              <li className="flex items-start gap-2">
                <Clock size={15} className="text-slate-500 shrink-0 mt-0.5" />
                <span>
                  א&apos;-ה&apos; 09:00–19:00
                  <br />
                  ו&apos; 09:00–14:00
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-10 pt-6 text-center text-xs text-slate-500">
          <p>
            &copy; {new Date().getFullYear()} AD Phones. כל הזכויות שמורות.
          </p>
        </div>
      </div>
    </footer>
  );
}
