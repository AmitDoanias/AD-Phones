"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Cookie, X } from "lucide-react";
import { loadConsent, saveConsent } from "@/lib/cookieConsent";

type View = "banner" | "preferences" | null;

export default function CookieBanner() {
  const [view, setView] = useState<View>(null);
  const [analytics, setAnalytics] = useState(true);
  const [marketing, setMarketing] = useState(true);

  useEffect(() => {
    const existing = loadConsent();
    if (!existing) setView("banner");
  }, []);

  useEffect(() => {
    const handler = () => setView(null);
    window.addEventListener("cookie-consent-open-preferences", () => setView("preferences"));
    return () => window.removeEventListener("cookie-consent-open-preferences", handler);
  }, []);

  if (!view) return null;

  function acceptAll() {
    saveConsent({ analytics: true, marketing: true });
    setView(null);
  }

  function rejectAll() {
    saveConsent({ analytics: false, marketing: false });
    setView(null);
  }

  function savePreferences() {
    saveConsent({ analytics, marketing });
    setView(null);
  }

  return (
    <>
      <div
        className="fixed inset-x-0 bottom-0 z-[60] px-4 pb-4 md:pb-6"
        role="dialog"
        aria-labelledby="cookie-banner-title"
        aria-describedby="cookie-banner-desc"
      >
        <div
          className="max-w-3xl mx-auto bg-white rounded-[16px] p-5 md:p-6"
          style={{
            boxShadow: "0 10px 40px rgba(0,0,0,0.15), 0 2px 8px rgba(0,0,0,0.06)",
            border: "1px solid rgba(0,0,0,0.06)",
          }}
        >
          {view === "banner" ? (
            <div>
              <div className="flex items-start gap-3 mb-3">
                <div
                  className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ background: "rgba(0,113,227,0.1)" }}
                >
                  <Cookie size={20} style={{ color: "#0071e3" }} />
                </div>
                <div className="flex-1 min-w-0">
                  <h2
                    id="cookie-banner-title"
                    className="font-bold mb-1"
                    style={{ color: "#1d1d1f", fontSize: "1.05rem", letterSpacing: "-0.224px" }}
                  >
                    אנחנו משתמשים בעוגיות
                  </h2>
                  <p
                    id="cookie-banner-desc"
                    className="text-sm leading-relaxed"
                    style={{ color: "rgba(0,0,0,0.65)" }}
                  >
                    אנחנו משתמשים בעוגיות כדי לתפעל את האתר ולשפר את החוויה שלך. חלק מהעוגיות הכרחיות ופועלות תמיד, ואחרות מסייעות לנו בניתוח השימוש ובהצגת תוכן רלוונטי.{" "}
                    <Link href="/cookies" className="underline" style={{ color: "#0071e3" }}>
                      קרא עוד
                    </Link>
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                <button
                  onClick={acceptAll}
                  className="flex-1 min-w-[120px] px-5 py-3 rounded-[10px] text-sm font-semibold transition-opacity hover:opacity-90"
                  style={{ background: "#0071e3", color: "#fff", letterSpacing: "-0.224px" }}
                >
                  קבל הכל
                </button>
                <button
                  onClick={rejectAll}
                  className="flex-1 min-w-[120px] px-5 py-3 rounded-[10px] text-sm font-semibold transition-colors"
                  style={{
                    background: "rgba(0,0,0,0.04)",
                    color: "#1d1d1f",
                    letterSpacing: "-0.224px",
                  }}
                >
                  רק הכרחיות
                </button>
                <button
                  onClick={() => setView("preferences")}
                  className="flex-1 min-w-[120px] px-5 py-3 rounded-[10px] text-sm font-semibold transition-colors"
                  style={{
                    background: "transparent",
                    color: "#1d1d1f",
                    border: "1px solid rgba(0,0,0,0.15)",
                    letterSpacing: "-0.224px",
                  }}
                >
                  התאם
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-start justify-between mb-4">
                <h2 className="font-bold" style={{ color: "#1d1d1f", fontSize: "1.1rem" }}>
                  התאמת עוגיות
                </h2>
                <button
                  onClick={() => setView("banner")}
                  aria-label="סגור"
                  className="p-1 rounded hover:bg-black/5"
                  style={{ color: "rgba(0,0,0,0.5)" }}
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-4 mb-5">
                <ConsentRow
                  title="עוגיות הכרחיות"
                  description="פעילות תמיד. נדרשות לתפקוד האתר - אימות, עגלת קניות, שמירת בחירת עוגיות."
                  checked
                  disabled
                  onChange={() => undefined}
                />
                <ConsentRow
                  title="עוגיות אנליטיקה"
                  description="עוזרות לנו להבין איך אתה משתמש באתר כדי לשפר אותו (Google Analytics)."
                  checked={analytics}
                  onChange={setAnalytics}
                />
                <ConsentRow
                  title="עוגיות שיווק"
                  description="מאפשרות הצגת פרסומות רלוונטיות במדיה החברתית (Facebook Pixel)."
                  checked={marketing}
                  onChange={setMarketing}
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={savePreferences}
                  className="flex-1 min-w-[120px] px-5 py-3 rounded-[10px] text-sm font-semibold transition-opacity hover:opacity-90"
                  style={{ background: "#0071e3", color: "#fff", letterSpacing: "-0.224px" }}
                >
                  שמור בחירה
                </button>
                <button
                  onClick={acceptAll}
                  className="flex-1 min-w-[120px] px-5 py-3 rounded-[10px] text-sm font-semibold transition-colors"
                  style={{
                    background: "rgba(0,0,0,0.04)",
                    color: "#1d1d1f",
                    letterSpacing: "-0.224px",
                  }}
                >
                  קבל הכל
                </button>
              </div>

              <p className="text-xs mt-3 text-center" style={{ color: "rgba(0,0,0,0.4)" }}>
                לפרטים נוספים -{" "}
                <Link href="/cookies" className="underline" style={{ color: "#0071e3" }}>
                  מדיניות עוגיות
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function ConsentRow({
  title,
  description,
  checked,
  disabled,
  onChange,
}: {
  title: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (val: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-3 pb-4" style={{ borderBottom: "1px solid #f0f0f0" }}>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-sm mb-1" style={{ color: "#1d1d1f" }}>
          {title}
        </h3>
        <p className="text-xs leading-relaxed" style={{ color: "rgba(0,0,0,0.6)" }}>
          {description}
        </p>
      </div>
      <label className={`flex-shrink-0 ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}>
        <input
          type="checkbox"
          checked={checked}
          disabled={disabled}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only peer"
        />
        <span
          className="relative inline-block w-11 h-6 rounded-full transition-colors"
          style={{
            background: checked ? "#0071e3" : "rgba(0,0,0,0.15)",
          }}
        >
          <span
            className="absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform"
            style={{
              right: checked ? "2px" : "calc(100% - 22px)",
              boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
            }}
          />
        </span>
      </label>
    </div>
  );
}
