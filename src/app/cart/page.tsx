"use client";

import { useState, useId } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppFab from "@/components/layout/WhatsAppFab";
import { useCart } from "@/hooks/useCart";
import {
  Wrench,
  User,
  Phone,
  Mail,
  MessageSquare,
  Store,
  Truck,
  ChevronLeft,
  AlertCircle,
  Loader2,
  Trash2,
  ShoppingCart,
} from "lucide-react";
import type { CreateBookingPayload } from "@/app/api/bookings/route";

function Field({
  label,
  id,
  required,
  error,
  hint,
  children,
}: {
  label: string;
  id: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-sm font-medium"
        style={{ color: "#1d1d1f", letterSpacing: "0.196px" }}
      >
        {label}
        {required && (
          <span className="mr-1" style={{ color: "#dc2626" }} aria-hidden>
            *
          </span>
        )}
      </label>
      {children}
      {hint && !error && (
        <p className="text-xs" style={{ color: "rgba(0,0,0,0.48)" }}>
          {hint}
        </p>
      )}
      {error && (
        <p
          className="text-xs flex items-center gap-1"
          style={{ color: "#dc2626" }}
          role="alert"
          aria-live="polite"
        >
          <AlertCircle size={12} />
          {error}
        </p>
      )}
    </div>
  );
}

const inputClass =
  "w-full px-4 py-3 rounded-[8px] text-base bg-white border transition-colors outline-none " +
  "focus:ring-2 focus:ring-[#0071e3] focus:border-transparent " +
  "placeholder:text-[rgba(0,0,0,0.3)]";
const inputBase = { borderColor: "rgba(0,0,0,0.15)", color: "#1d1d1f" };
const inputError = { borderColor: "#dc2626" };

function ServiceOption({
  id,
  label,
  description,
  icon: Icon,
  selected,
  onSelect,
}: {
  id: string;
  label: string;
  description: string;
  icon: React.ElementType;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      id={id}
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      className="flex items-start gap-3 w-full rounded-[8px] p-4 text-right transition-all cursor-pointer"
      style={{
        border: selected ? "2px solid #0071e3" : "2px solid rgba(0,0,0,0.12)",
        background: selected ? "rgba(0,113,227,0.04)" : "white",
        minHeight: 44,
      }}
    >
      <div
        className="mt-0.5 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
        style={{ background: selected ? "#0071e3" : "rgba(0,0,0,0.06)" }}
      >
        <Icon size={16} style={{ color: selected ? "white" : "rgba(0,0,0,0.5)" }} />
      </div>
      <div>
        <p
          className="font-semibold text-sm"
          style={{ color: "#1d1d1f", letterSpacing: "0.196px" }}
        >
          {label}
        </p>
        <p className="text-xs mt-0.5" style={{ color: "rgba(0,0,0,0.6)" }}>
          {description}
        </p>
      </div>
    </button>
  );
}

export default function CartPage() {
  const router = useRouter();
  const { items, total, removeItem, clearCart } = useCart();
  const nameId = useId();
  const phoneId = useId();
  const emailId = useId();
  const notesId = useId();
  const dateId = useId();
  const timeId = useId();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [serviceType, setServiceType] = useState<"lab" | "technician">("lab");
  const [notes, setNotes] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [preferredTime, setPreferredTime] = useState("");

  const [errors, setErrors] = useState<{
    name?: string;
    phone?: string;
    preferredDate?: string;
    preferredTime?: string;
  }>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  if (items.length === 0) {
    return (
      <>
        <Header />
        <main className="flex-1 bg-[#f5f5f7] min-h-screen flex items-center justify-center px-4">
          <div
            className="bg-white rounded-[8px] p-12 text-center max-w-md w-full"
            style={{ boxShadow: "rgba(0,0,0,0.08) 0px 2px 10px 0px" }}
          >
            <ShoppingCart
              size={48}
              className="mx-auto mb-4"
              style={{ color: "rgba(0,0,0,0.2)" }}
            />
            <p
              className="text-lg font-medium mb-2"
              style={{ color: "#1d1d1f", letterSpacing: "0.196px" }}
            >
              הסל ריק
            </p>
            <p className="text-sm mb-6" style={{ color: "rgba(0,0,0,0.6)" }}>
              הוסף תיקונים מקטלוג השירותים שלנו
            </p>
            <Link
              href="/repairs"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-[8px] text-sm font-medium text-white"
              style={{ background: "#0071e3" }}
            >
              <ChevronLeft size={15} />
              לקטלוג התיקונים
            </Link>
          </div>
        </main>
        <Footer />
        <WhatsAppFab />
      </>
    );
  }

  function validate() {
    const e: typeof errors = {};
    if (!name.trim()) e.name = "נא להזין שם מלא";
    else if (name.trim().length < 2) e.name = "שם חייב להכיל לפחות 2 תווים";

    const cleanPhone = phone.replace(/\D/g, "");
    if (!phone.trim()) e.phone = "נא להזין מספר טלפון";
    else if (cleanPhone.length < 9 || cleanPhone.length > 11)
      e.phone = "מספר טלפון לא תקין (למשל: 053-483-2573)";

    if (!preferredDate) e.preferredDate = "נא לבחור תאריך";
    if (!preferredTime) e.preferredTime = "נא לבחור שעה";

    return e;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError("");

    const e2 = validate();
    setErrors(e2);
    if (Object.keys(e2).length > 0) {
      if (e2.name) document.getElementById(nameId)?.focus();
      else if (e2.phone) document.getElementById(phoneId)?.focus();
      else if (e2.preferredDate) document.getElementById(dateId)?.focus();
      else if (e2.preferredTime) document.getElementById(timeId)?.focus();
      return;
    }

    setSubmitting(true);

    const preferredAt = new Date(`${preferredDate}T${preferredTime}`).toISOString();

    const payload: CreateBookingPayload = {
      customer_name: name.trim(),
      customer_phone: phone.trim(),
      customer_email: email.trim() || undefined,
      service_type: serviceType,
      notes: notes.trim() || undefined,
      preferred_at: preferredAt,
      items: items.map((i) => ({
        modelRepairId: i.modelRepairId,
        modelName: i.modelName,
        brandName: i.brandName,
        repairName: i.repairName,
        price: i.price,
      })),
    };

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        setServerError(data.error ?? "שגיאה בשמירת ההזמנה. נסה שוב.");
        setSubmitting(false);
        return;
      }

      clearCart();
      router.push(`/booking/confirmation/${data.id}`);
    } catch {
      setServerError("שגיאת רשת - בדוק חיבור ונסה שוב.");
      setSubmitting(false);
    }
  }

  const techFee = serviceType === "technician" ? 150 : 0;
  const grandTotal = total + techFee;

  return (
    <>
      <Header />
      <main className="flex-1 bg-[#f5f5f7] pb-16">
        <section className="bg-[#1d1d1f] text-white py-10 px-4 text-center">
          <h1
            className="text-3xl font-bold"
            style={{ lineHeight: 1.07, letterSpacing: "-0.28px" }}
          >
            תיאום תיקון
          </h1>
          <p
            className="mt-2 text-sm font-light"
            style={{ color: "rgba(255,255,255,0.7)" }}
          >
            מלא פרטים ונחזור אליך לאישור מועד
          </p>
        </section>

        <div className="max-w-2xl mx-auto px-4 py-8">
          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">

            {/* Cart items */}
            <section
              className="bg-white rounded-[8px] overflow-hidden"
              style={{ boxShadow: "rgba(0,0,0,0.08) 0px 2px 10px 0px" }}
              aria-label="סיכום סל"
            >
              <div className="px-5 py-3 flex items-center gap-2 border-b border-[#f5f5f7]">
                <Wrench size={15} style={{ color: "rgba(0,0,0,0.4)" }} />
                <p
                  className="text-sm font-semibold"
                  style={{ color: "#1d1d1f", letterSpacing: "0.196px" }}
                >
                  תיקונים שנבחרו ({items.length})
                </p>
              </div>
              <ul className="divide-y divide-[#f5f5f7]">
                {items.map((item) => (
                  <li
                    key={item.modelRepairId}
                    className="px-5 py-3 flex items-center justify-between gap-4"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate" style={{ color: "#1d1d1f" }}>
                        {item.repairName}
                      </p>
                      <p className="text-xs mt-0.5 truncate" style={{ color: "rgba(0,0,0,0.5)" }}>
                        {item.brandName} {item.modelName}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span
                        className="text-sm font-bold tabular-nums"
                        style={{ color: "#1d1d1f", letterSpacing: "-0.28px" }}
                      >
                        ₪{item.price}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeItem(item.modelRepairId)}
                        className="p-2 rounded-[6px] transition-colors hover:bg-red-50"
                        style={{ color: "rgba(0,0,0,0.3)", minHeight: 36, minWidth: 36 }}
                        aria-label={`הסר ${item.repairName}`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            {/* Service type */}
            <section
              className="bg-white rounded-[8px] p-5"
              style={{ boxShadow: "rgba(0,0,0,0.08) 0px 2px 10px 0px" }}
              aria-label="סוג שירות"
            >
              <p
                className="text-sm font-semibold mb-3"
                style={{ color: "#1d1d1f", letterSpacing: "0.196px" }}
              >
                סוג שירות
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" role="radiogroup" aria-label="בחר סוג שירות">
                <ServiceOption
                  id="service-lab"
                  label="השארה בחנות"
                  description="הביא את המכשיר אלינו - נחזור אליך כשמוכן"
                  icon={Store}
                  selected={serviceType === "lab"}
                  onSelect={() => setServiceType("lab")}
                />
                <ServiceOption
                  id="service-tech"
                  label="טכנאי עד אליך"
                  description="תוספת ₪150 - נגיע אליך לכתובת שתבחר"
                  icon={Truck}
                  selected={serviceType === "technician"}
                  onSelect={() => setServiceType("technician")}
                />
              </div>
            </section>

            {/* Preferred date/time */}
            <section
              className="bg-white rounded-[8px] p-5 flex flex-col gap-4"
              style={{ boxShadow: "rgba(0,0,0,0.08) 0px 2px 10px 0px" }}
              aria-label="מועד מועדף"
            >
              <p
                className="text-sm font-semibold"
                style={{ color: "#1d1d1f", letterSpacing: "0.196px" }}
              >
                מועד מועדף לתיקון
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor={dateId} className="text-sm font-medium" style={{ color: "#1d1d1f", letterSpacing: "0.196px" }}>
                    תאריך
                  </label>
                  <input
                    id={dateId}
                    type="date"
                    value={preferredDate}
                    onChange={(e) => {
                      setPreferredDate(e.target.value);
                      if (errors.preferredDate) setErrors((p) => ({ ...p, preferredDate: undefined }));
                    }}
                    min={new Date().toISOString().split("T")[0]}
                    className={inputClass}
                    style={{ ...(errors.preferredDate ? inputError : inputBase), colorScheme: "light" }}
                    dir="ltr"
                    aria-required="true"
                    aria-invalid={!!errors.preferredDate}
                  />
                  {errors.preferredDate && (
                    <p className="text-xs" style={{ color: "#e11d48" }}>{errors.preferredDate}</p>
                  )}
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor={timeId} className="text-sm font-medium" style={{ color: "#1d1d1f", letterSpacing: "0.196px" }}>
                    שעה
                  </label>
                  <input
                    id={timeId}
                    type="time"
                    value={preferredTime}
                    onChange={(e) => {
                      setPreferredTime(e.target.value);
                      if (errors.preferredTime) setErrors((p) => ({ ...p, preferredTime: undefined }));
                    }}
                    className={inputClass}
                    style={{ ...(errors.preferredTime ? inputError : inputBase), colorScheme: "light" }}
                    dir="ltr"
                    aria-required="true"
                    aria-invalid={!!errors.preferredTime}
                  />
                  {errors.preferredTime && (
                    <p className="text-xs" style={{ color: "#e11d48" }}>{errors.preferredTime}</p>
                  )}
                </div>
              </div>
              <p className="text-xs" style={{ color: "rgba(0,0,0,0.45)" }}>
                נשתדל לתאם לפי הבקשה שלך - נאשר בוואטסאפ
              </p>
            </section>

            {/* Customer details */}
            <section
              className="bg-white rounded-[8px] p-5 flex flex-col gap-4"
              style={{ boxShadow: "rgba(0,0,0,0.08) 0px 2px 10px 0px" }}
              aria-label="פרטי לקוח"
            >
              <p
                className="text-sm font-semibold"
                style={{ color: "#1d1d1f", letterSpacing: "0.196px" }}
              >
                פרטי יצירת קשר
              </p>

              <Field label="שם מלא" id={nameId} required error={errors.name}>
                <div className="relative">
                  <User
                    size={16}
                    className="absolute top-1/2 -translate-y-1/2 right-3 pointer-events-none"
                    style={{ color: "rgba(0,0,0,0.3)" }}
                    aria-hidden
                  />
                  <input
                    id={nameId}
                    type="text"
                    name="name"
                    autoComplete="name"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
                    }}
                    onBlur={() => {
                      if (!name.trim()) setErrors((p) => ({ ...p, name: "נא להזין שם מלא" }));
                    }}
                    placeholder="ישראל ישראלי"
                    className={inputClass + " pr-10"}
                    style={{ ...(errors.name ? inputError : inputBase), touchAction: "manipulation" }}
                    aria-required="true"
                    aria-invalid={!!errors.name}
                  />
                </div>
              </Field>

              <Field
                label="מספר טלפון"
                id={phoneId}
                required
                error={errors.phone}
                hint="נשתמש בזה ליצירת קשר לתיאום"
              >
                <div className="relative">
                  <Phone
                    size={16}
                    className="absolute top-1/2 -translate-y-1/2 right-3 pointer-events-none"
                    style={{ color: "rgba(0,0,0,0.3)" }}
                    aria-hidden
                  />
                  <input
                    id={phoneId}
                    type="tel"
                    name="phone"
                    autoComplete="tel"
                    inputMode="tel"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      if (errors.phone) setErrors((prev) => ({ ...prev, phone: undefined }));
                    }}
                    onBlur={() => {
                      const clean = phone.replace(/\D/g, "");
                      if (!phone.trim()) setErrors((p) => ({ ...p, phone: "נא להזין מספר טלפון" }));
                      else if (clean.length < 9) setErrors((p) => ({ ...p, phone: "מספר טלפון לא תקין" }));
                    }}
                    placeholder="05X-XXX-XXXX"
                    className={inputClass + " pr-10"}
                    style={{ ...(errors.phone ? inputError : inputBase), touchAction: "manipulation" }}
                    aria-required="true"
                    aria-invalid={!!errors.phone}
                    dir="ltr"
                  />
                </div>
              </Field>

              <Field
                label="אימייל (לא חובה)"
                id={emailId}
                hint="לקבלת אישור הזמנה במייל"
              >
                <div className="relative">
                  <Mail
                    size={16}
                    className="absolute top-1/2 -translate-y-1/2 right-3 pointer-events-none"
                    style={{ color: "rgba(0,0,0,0.3)" }}
                    aria-hidden
                  />
                  <input
                    id={emailId}
                    type="email"
                    name="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className={inputClass + " pr-10"}
                    style={{ ...inputBase, touchAction: "manipulation" }}
                    dir="ltr"
                  />
                </div>
              </Field>

              <Field label="הערות (לא חובה)" id={notesId}>
                <div className="relative">
                  <MessageSquare
                    size={16}
                    className="absolute top-3.5 right-3 pointer-events-none"
                    style={{ color: "rgba(0,0,0,0.3)" }}
                    aria-hidden
                  />
                  <textarea
                    id={notesId}
                    name="notes"
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="תיאור הבעיה, שעה מועדפת, כתובת (לטכנאי)…"
                    className={inputClass + " pr-10 resize-none"}
                    style={inputBase}
                  />
                </div>
              </Field>
            </section>

            {/* Summary + CTA */}
            <section
              className="bg-white rounded-[8px] p-5 flex flex-col gap-4"
              style={{ boxShadow: "rgba(0,0,0,0.08) 0px 2px 10px 0px" }}
              aria-label="סיכום לתשלום"
            >
              <div className="space-y-2">
                <div className="flex justify-between text-sm" style={{ color: "rgba(0,0,0,0.6)" }}>
                  <span>סה&quot;כ תיקונים</span>
                  <span className="tabular-nums">₪{total}</span>
                </div>
                {techFee > 0 && (
                  <div className="flex justify-between text-sm" style={{ color: "rgba(0,0,0,0.6)" }}>
                    <span>תוספת הגעה</span>
                    <span className="tabular-nums">₪{techFee}</span>
                  </div>
                )}
                <div className="flex justify-between items-center pt-2 border-t border-[#f5f5f7]">
                  <span className="text-base font-semibold" style={{ color: "#1d1d1f" }}>
                    סה&quot;כ לתשלום
                  </span>
                  <span
                    className="text-[28px] font-bold tabular-nums"
                    style={{ color: "#1d1d1f", letterSpacing: "-0.5px" }}
                  >
                    ₪{grandTotal}
                  </span>
                </div>
              </div>

              {serverError && (
                <div
                  className="flex items-center gap-2 px-4 py-3 rounded-[8px] text-sm"
                  style={{ background: "#fff1f1", color: "#dc2626", border: "1px solid #fecaca" }}
                  role="alert"
                  aria-live="assertive"
                >
                  <AlertCircle size={15} />
                  {serverError}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-[8px] text-base font-medium text-white transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
                style={{
                  background: "#0071e3",
                  letterSpacing: "-0.224px",
                  minHeight: 52,
                  touchAction: "manipulation",
                }}
              >
                {submitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    שולח הזמנה…
                  </>
                ) : (
                  "שלח הזמנה"
                )}
              </button>

              <p
                className="text-xs text-center"
                style={{ color: "rgba(0,0,0,0.4)" }}
              >
                לא נגבה תשלום עכשיו - נשלם בסיום התיקון בלבד
              </p>
            </section>

          </form>
        </div>
      </main>
      <Footer />
      <WhatsAppFab />
    </>
  );
}
