"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Search, Phone, Mail, MapPin, Clock, MessageCircle, Send, CheckCircle, Loader2 } from "lucide-react";
import { WHATSAPP_NUMBER } from "@/constants";
import { isIPhoneModel, isIPadModel } from "@/lib/utils";

type Model = {
  id: string;
  name: string;
  brand_slug: string;
  brand_name: string;
};

interface Props {
  models: Model[];
}

type Brand = "apple" | "samsung" | null;
type AppleType = "iphone" | "ipad" | null;

export default function ContactForm({ models }: Props) {
  const [brand, setBrand] = useState<Brand>(null);
  const [appleType, setAppleType] = useState<AppleType>(null);
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);
  const [modelSearch, setModelSearch] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Reset model when brand/type changes
  useEffect(() => {
    setSelectedModel(null);
    setModelSearch("");
  }, [brand, appleType]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Filter models based on selection
  const filteredModels = models.filter((m) => {
    if (!brand) return false;
    if (brand === "samsung") return m.brand_slug === "samsung";
    if (brand === "apple") {
      if (appleType === "iphone") return m.brand_slug === "apple" && isIPhoneModel(m.name);
      if (appleType === "ipad") return m.brand_slug === "apple" && isIPadModel(m.name);
      return false;
    }
    return false;
  }).filter((m) =>
    modelSearch.trim() === "" || m.name.toLowerCase().includes(modelSearch.toLowerCase())
  );

  const showModelSelector = brand === "samsung" || (brand === "apple" && appleType !== null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim() || undefined,
          phone: phone.trim(),
          email: email.trim() || undefined,
          device: brand ?? undefined,
          appleType: appleType ?? undefined,
          modelId: selectedModel?.id ?? undefined,
          modelName: selectedModel?.name ?? undefined,
          message: message.trim() || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "אירעה שגיאה, נסה שוב.");
      } else {
        setSuccess(true);
      }
    } catch {
      setError("בעיית חיבור - בדוק את האינטרנט ונסה שוב.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
        {/* Success card */}
        <div
          className="lg:col-span-3 bg-white rounded-[12px] p-10 flex flex-col items-center text-center gap-5"
          style={{ boxShadow: "rgba(0,0,0,0.07) 0px 2px 14px 0px" }}
        >
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{ background: "rgba(52,199,89,0.12)" }}
          >
            <CheckCircle size={36} style={{ color: "#34c759" }} />
          </div>
          <div>
            <h2 className="font-bold mb-2" style={{ fontSize: "1.25rem", color: "#1d1d1f", letterSpacing: "-0.12px" }}>
              הפנייה נשלחה!
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: "rgba(0,0,0,0.55)" }}>
              קיבלנו את הפנייה שלך ונחזור אליך בהקדם.
              <br />
              בינתיים, אפשר גם לשלוח לנו הודעה ב-WhatsApp.
            </p>
          </div>
          <button
            onClick={() => { setSuccess(false); setName(""); setPhone(""); setEmail(""); setMessage(""); setBrand(null); setAppleType(null); setSelectedModel(null); }}
            className="text-sm font-medium hover:underline"
            style={{ color: "#0071e3" }}
          >
            שלח פנייה נוספת
          </button>
        </div>

        {/* Business Info (same panel) */}
        <BusinessInfo />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">

      {/* ── Form ─────────────────────────────────── */}
      <form
        onSubmit={handleSubmit}
        className="lg:col-span-3 bg-white rounded-[12px] p-7 flex flex-col gap-6"
        style={{ boxShadow: "rgba(0,0,0,0.07) 0px 2px 14px 0px" }}
      >
        {/* Brand selection */}
        <div>
          <label className="block text-sm font-semibold mb-2.5" style={{ color: "#1d1d1f" }}>
            סוג מכשיר
          </label>
          <div className="flex gap-2">
            {(["apple", "samsung"] as Brand[]).map((b) => (
              <button
                key={b}
                type="button"
                onClick={() => { setBrand(b); setAppleType(null); }}
                className="flex-1 py-3 rounded-[8px] text-sm font-medium transition-all"
                style={
                  brand === b
                    ? { background: "#0071e3", color: "#fff", border: "2px solid #0071e3" }
                    : { background: "#f5f5f7", color: "#1d1d1f", border: "2px solid transparent" }
                }
              >
                {b === "apple" ? "Apple" : "Samsung"}
              </button>
            ))}
          </div>
        </div>

        {/* Apple sub-type */}
        {brand === "apple" && (
          <div>
            <label className="block text-sm font-semibold mb-2.5" style={{ color: "#1d1d1f" }}>
              סוג מכשיר Apple
            </label>
            <div className="flex gap-2">
              {(["iphone", "ipad"] as AppleType[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setAppleType(t)}
                  className="flex-1 py-3 rounded-[8px] text-sm font-medium transition-all"
                  style={
                    appleType === t
                      ? { background: "#1d1d1f", color: "#fff", border: "2px solid #1d1d1f" }
                      : { background: "#f5f5f7", color: "#1d1d1f", border: "2px solid transparent" }
                  }
                >
                  {t === "iphone" ? "iPhone" : "iPad"}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Model searchable dropdown */}
        {showModelSelector && (
          <div>
            <label className="block text-sm font-semibold mb-2.5" style={{ color: "#1d1d1f" }}>
              בחר דגם
            </label>
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setDropdownOpen((o) => !o)}
                className="w-full flex items-center justify-between px-4 py-3 rounded-[8px] text-sm transition-colors text-right"
                style={{
                  border: "1.5px solid rgba(0,0,0,0.15)",
                  background: "#fff",
                  color: selectedModel ? "#1d1d1f" : "rgba(0,0,0,0.35)",
                  minHeight: 48,
                }}
              >
                <ChevronDown
                  size={16}
                  style={{
                    color: "rgba(0,0,0,0.4)",
                    transform: dropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 200ms",
                    flexShrink: 0,
                  }}
                />
                <span>{selectedModel ? selectedModel.name : "חפש או בחר דגם..."}</span>
              </button>

              {dropdownOpen && (
                <div
                  className="absolute top-full mt-1 w-full z-50 bg-white rounded-[8px] overflow-hidden"
                  style={{
                    border: "1.5px solid rgba(0,0,0,0.1)",
                    boxShadow: "rgba(0,0,0,0.12) 0px 8px 24px 0px",
                    maxHeight: 280,
                  }}
                >
                  <div
                    className="flex items-center gap-2 px-3 py-2.5"
                    style={{ borderBottom: "1px solid rgba(0,0,0,0.07)" }}
                  >
                    <Search size={14} style={{ color: "rgba(0,0,0,0.35)", flexShrink: 0 }} />
                    <input
                      type="text"
                      value={modelSearch}
                      onChange={(e) => setModelSearch(e.target.value)}
                      placeholder="חפש דגם..."
                      className="flex-1 text-sm outline-none bg-transparent text-right"
                      style={{ color: "#1d1d1f" }}
                      autoFocus
                    />
                  </div>
                  <div className="overflow-y-auto" style={{ maxHeight: 220 }}>
                    {filteredModels.length === 0 ? (
                      <p className="px-4 py-3 text-sm text-center" style={{ color: "rgba(0,0,0,0.4)" }}>
                        לא נמצאו דגמים
                      </p>
                    ) : (
                      filteredModels.map((m) => (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => {
                            setSelectedModel(m);
                            setModelSearch("");
                            setDropdownOpen(false);
                          }}
                          className="w-full text-right px-4 py-2.5 text-sm transition-colors hover:bg-[#f5f5f7]"
                          style={{
                            color: "#1d1d1f",
                            background: selectedModel?.id === m.id ? "#f0f6ff" : "transparent",
                          }}
                        >
                          {m.name}
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Name + Phone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="contact-name" className="block text-sm font-semibold mb-2" style={{ color: "#1d1d1f" }}>
              שם מלא
            </label>
            <input
              id="contact-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="ישראל ישראלי"
              autoComplete="name"
              className="w-full px-4 py-3 rounded-[8px] text-sm text-right outline-none transition-colors"
              style={{ border: "1.5px solid rgba(0,0,0,0.15)", background: "#fff", color: "#1d1d1f", minHeight: 48 }}
              onFocus={(e) => (e.target.style.borderColor = "#0071e3")}
              onBlur={(e) => (e.target.style.borderColor = "rgba(0,0,0,0.15)")}
            />
          </div>
          <div>
            <label htmlFor="contact-phone" className="block text-sm font-semibold mb-2" style={{ color: "#1d1d1f" }}>
              מספר טלפון <span style={{ color: "#0071e3" }}>*</span>
            </label>
            <input
              id="contact-phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="05X-XXX-XXXX"
              autoComplete="tel"
              required
              dir="ltr"
              className="w-full px-4 py-3 rounded-[8px] text-sm outline-none transition-colors"
              style={{ border: "1.5px solid rgba(0,0,0,0.15)", background: "#fff", color: "#1d1d1f", minHeight: 48, textAlign: "right" }}
              onFocus={(e) => (e.target.style.borderColor = "#0071e3")}
              onBlur={(e) => (e.target.style.borderColor = "rgba(0,0,0,0.15)")}
            />
          </div>
        </div>

        {/* Email (optional) */}
        <div>
          <label htmlFor="contact-email" className="block text-sm font-semibold mb-2" style={{ color: "#1d1d1f" }}>
            אימייל <span className="font-normal text-xs" style={{ color: "rgba(0,0,0,0.4)" }}>(אופציונלי)</span>
          </label>
          <input
            id="contact-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            autoComplete="email"
            dir="ltr"
            className="w-full px-4 py-3 rounded-[8px] text-sm outline-none transition-colors"
            style={{ border: "1.5px solid rgba(0,0,0,0.15)", background: "#fff", color: "#1d1d1f", minHeight: 48, textAlign: "right" }}
            onFocus={(e) => (e.target.style.borderColor = "#0071e3")}
            onBlur={(e) => (e.target.style.borderColor = "rgba(0,0,0,0.15)")}
          />
        </div>

        {/* Message */}
        <div>
          <label htmlFor="contact-message" className="block text-sm font-semibold mb-2" style={{ color: "#1d1d1f" }}>
            הודעה <span className="font-normal text-xs" style={{ color: "rgba(0,0,0,0.4)" }}>(לא חובה)</span>
          </label>
          <textarea
            id="contact-message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="תאר את הבעיה עם המכשיר שלך..."
            rows={4}
            className="w-full px-4 py-3 rounded-[8px] text-sm text-right outline-none transition-colors resize-none"
            style={{ border: "1.5px solid rgba(0,0,0,0.15)", background: "#fff", color: "#1d1d1f" }}
            onFocus={(e) => (e.target.style.borderColor = "#0071e3")}
            onBlur={(e) => (e.target.style.borderColor = "rgba(0,0,0,0.15)")}
          />
        </div>

        {/* Error */}
        {error && (
          <p className="text-sm text-center" style={{ color: "#dc2626" }}>
            {error}
          </p>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-[8px] text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
          style={{ background: "#0071e3", minHeight: 52, letterSpacing: "-0.224px" }}
        >
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              שולח...
            </>
          ) : (
            <>
              <Send size={16} />
              שלח פנייה
            </>
          )}
        </button>
      </form>

      {/* ── Business Info ─────────────────────── */}
      <BusinessInfo />
    </div>
  );
}

function BusinessInfo() {
  return (
    <div className="lg:col-span-2 flex flex-col gap-4">
      <div
        className="bg-white rounded-[12px] p-7"
        style={{ boxShadow: "rgba(0,0,0,0.07) 0px 2px 14px 0px" }}
      >
        <h3 className="font-bold mb-5" style={{ color: "#1d1d1f", fontSize: "1rem" }}>
          פרטי יצירת קשר
        </h3>
        <ul className="flex flex-col gap-5">
          <li className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-[8px] flex items-center justify-center flex-shrink-0" style={{ background: "#f5f5f7" }}>
              <MapPin size={16} style={{ color: "#1d1d1f" }} />
            </div>
            <div>
              <p className="text-xs font-medium mb-0.5" style={{ color: "rgba(0,0,0,0.45)" }}>כתובת</p>
              <p className="text-sm font-medium" style={{ color: "#1d1d1f" }}>
                מעגל השלום 3, ראשון לציון
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-[8px] flex items-center justify-center flex-shrink-0" style={{ background: "#f5f5f7" }}>
              <Phone size={16} style={{ color: "#1d1d1f" }} />
            </div>
            <div>
              <p className="text-xs font-medium mb-0.5" style={{ color: "rgba(0,0,0,0.45)" }}>טלפון</p>
              <a href="tel:+972534832573" className="text-sm font-medium hover:text-[#0071e3] transition-colors" style={{ color: "#1d1d1f" }} dir="ltr">
                053-483-2573
              </a>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-[8px] flex items-center justify-center flex-shrink-0" style={{ background: "#f5f5f7" }}>
              <Mail size={16} style={{ color: "#1d1d1f" }} />
            </div>
            <div>
              <p className="text-xs font-medium mb-0.5" style={{ color: "rgba(0,0,0,0.45)" }}>אימייל</p>
              <a href="mailto:info@ad-phones.co.il" className="text-sm font-medium hover:text-[#0071e3] transition-colors" style={{ color: "#1d1d1f" }} dir="ltr">
                info@ad-phones.co.il
              </a>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-[8px] flex items-center justify-center flex-shrink-0" style={{ background: "#f5f5f7" }}>
              <Clock size={16} style={{ color: "#1d1d1f" }} />
            </div>
            <div>
              <p className="text-xs font-medium mb-0.5" style={{ color: "rgba(0,0,0,0.45)" }}>שעות פעילות</p>
              <p className="text-sm font-medium leading-relaxed" style={{ color: "#1d1d1f" }}>
                א&apos;–ה&apos; 09:00–19:00<br />ו&apos; 09:00–14:00
              </p>
            </div>
          </li>
        </ul>
      </div>

      {/* WhatsApp quick chat */}
      <a
        href={`https://wa.me/${WHATSAPP_NUMBER}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 bg-white rounded-[12px] px-6 py-4 transition-shadow hover:shadow-md"
        style={{ boxShadow: "rgba(0,0,0,0.07) 0px 2px 14px 0px" }}
      >
        <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "#25d366" }}>
          <MessageCircle size={18} color="white" />
        </div>
        <div>
          <p className="text-sm font-semibold" style={{ color: "#1d1d1f" }}>WhatsApp</p>
          <p className="text-xs" style={{ color: "rgba(0,0,0,0.45)" }}>זמין לשאלות מהירות</p>
        </div>
      </a>

      {/* Location map */}
      <div
        className="bg-white rounded-[12px] overflow-hidden"
        style={{ boxShadow: "rgba(0,0,0,0.07) 0px 2px 14px 0px" }}
      >
        <div className="px-6 pt-5 pb-3 flex items-center justify-between">
          <h3 className="font-bold" style={{ color: "#1d1d1f", fontSize: "1rem" }}>
            המיקום שלנו
          </h3>
          <a
            href="https://www.google.com/maps/place/AD+Phones/@31.9691218,34.7673615,17z"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-medium transition-colors hover:text-[#0071e3]"
            style={{ color: "#0066cc" }}
          >
            פתח ב-Google Maps →
          </a>
        </div>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3384.6967810221204!2d34.7673615!3d31.969121800000003!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1502b3a8388d2471%3A0x561a8f661c931d79!2sAD%20Phones!5e0!3m2!1siw!2sil!4v1776944458579!5m2!1siw!2sil"
          width="100%"
          height="260"
          style={{ border: 0 }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
          title="מפת המיקום של A&D Phones"
        />
      </div>
    </div>
  );
}
