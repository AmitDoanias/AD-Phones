import { notFound } from "next/navigation";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { createClient } from "@/lib/supabase/server";
import { CheckCircle2, Wrench, Phone, MessageCircle, Home, Store, Truck } from "lucide-react";

type Props = { params: Promise<{ id: string }> };

export default async function BookingConfirmationPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: booking } = await supabase
    .from("bookings")
    .select("id, customer_name, service_type, total_price, notes, created_at")
    .eq("id", id)
    .single();

  if (!booking) notFound();

  const { data: items } = await supabase
    .from("booking_items")
    .select("repair_name, model_name, price_at_booking")
    .eq("booking_id", id);

  const bookingRef = id.slice(-8).toUpperCase();
  const isLab = booking.service_type === "lab";

  const waMessage = encodeURIComponent(
    `היי, שלחתי בקשת תיקון דרך האתר.\nמספר הזמנה: #${bookingRef}\nשם: ${booking.customer_name}`
  );

  return (
    <>
      <Header />
      <main className="flex-1 bg-[#f5f5f7] pb-16">

        {/* ── 1. Success hero */}
        <section className="bg-[#1d1d1f] text-white py-14 px-4 text-center">
          <div className="flex justify-center mb-4">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{ background: "rgba(52,199,89,0.18)" }}
            >
              <CheckCircle2 size={36} style={{ color: "#34c759" }} />
            </div>
          </div>
          <h1
            className="text-3xl font-bold mb-2"
            style={{ lineHeight: 1.07, letterSpacing: "-0.28px" }}
          >
            הזמנה התקבלה!
          </h1>
          <p className="text-base font-light mb-4" style={{ color: "rgba(255,255,255,0.7)" }}>
            {booking.customer_name}, קיבלנו את הבקשה שלך
          </p>
          <span
            className="inline-block px-4 py-1.5 rounded-full text-sm font-medium tracking-widest"
            style={{ background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.8)" }}
          >
            מס׳ הזמנה #{bookingRef}
          </span>
        </section>

        <div className="max-w-2xl mx-auto px-4 py-8 flex flex-col gap-5">

          {/* ── 2. סיכום הזמנה */}
          <section
            className="bg-white rounded-[8px] overflow-hidden"
            style={{ boxShadow: "rgba(0,0,0,0.08) 0px 2px 10px 0px" }}
          >
            <div className="px-5 py-3 border-b border-[#f5f5f7] flex items-center gap-2">
              <Wrench size={15} style={{ color: "rgba(0,0,0,0.4)" }} />
              <p className="text-sm font-semibold" style={{ color: "#1d1d1f", letterSpacing: "0.196px" }}>
                סיכום הזמנה
              </p>
            </div>

            {/* Items */}
            {items && items.length > 0 && (
              <ul className="divide-y divide-[#f5f5f7]">
                {items.map((item, i) => (
                  <li key={i} className="px-5 py-3 flex justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium" style={{ color: "#1d1d1f" }}>
                        {item.repair_name}
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: "rgba(0,0,0,0.5)" }}>
                        {item.model_name}
                      </p>
                    </div>
                    <span className="text-sm font-bold flex-shrink-0" style={{ color: "#1d1d1f" }}>
                      ₪{item.price_at_booking}
                    </span>
                  </li>
                ))}
              </ul>
            )}

            {/* Service type + total */}
            <div className="px-5 py-3 border-t border-[#f5f5f7] space-y-2">
              <div className="flex items-center justify-between text-sm" style={{ color: "rgba(0,0,0,0.6)" }}>
                <span className="flex items-center gap-1.5">
                  {isLab ? <Store size={13} /> : <Truck size={13} />}
                  {isLab ? "השארה בחנות" : "טכנאי עד אליך"}
                </span>
                {!isLab && <span>+ ₪150</span>}
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-semibold" style={{ color: "#1d1d1f" }}>
                  סה&quot;כ לתשלום
                </span>
                <span className="text-lg font-bold" style={{ color: "#1d1d1f", letterSpacing: "-0.28px" }}>
                  ₪{booking.total_price}
                </span>
              </div>
              <p className="text-xs" style={{ color: "rgba(0,0,0,0.4)" }}>
                * תשלום בסיום התיקון - לא נגבה עכשיו
              </p>
            </div>
          </section>

          {/* ── 3. מה עכשיו? */}
          <section
            className="bg-white rounded-[8px] p-5"
            style={{ boxShadow: "rgba(0,0,0,0.08) 0px 2px 10px 0px" }}
          >
            <p className="text-sm font-semibold mb-4" style={{ color: "#1d1d1f", letterSpacing: "0.196px" }}>
              מה קורה עכשיו?
            </p>
            <ol className="flex flex-col gap-4">
              {[
                {
                  n: 1,
                  title: "ניצור איתך קשר",
                  body: "נתקשר או נשלח הודעה לאשר את הפרטים ולקבוע מועד",
                  icon: Phone,
                },
                {
                  n: 2,
                  title: isLab ? "הביא את המכשיר" : "נגיע אליך",
                  body: isLab
                    ? "הגע לחנות במועד שנקבע, אנו נטפל מיד"
                    : "הטכנאי יגיע לכתובת שמסרת במועד שנתאם",
                  icon: isLab ? Store : Truck,
                },
                {
                  n: 3,
                  title: "נתקן ונחזיר",
                  body: "רוב התיקונים מוכנים ביום - תקבל הודעה כשהמכשיר מוכן",
                  icon: Wrench,
                },
              ].map((step) => (
                <li key={step.n} className="flex items-start gap-3">
                  <div
                    className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ background: "#0071e3", color: "white" }}
                    aria-hidden
                  >
                    {step.n}
                  </div>
                  <div className="pt-0.5">
                    <p className="text-sm font-semibold" style={{ color: "#1d1d1f", letterSpacing: "0.196px" }}>
                      {step.title}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: "rgba(0,0,0,0.6)" }}>
                      {step.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          {/* ── 4. WhatsApp CTA */}
          <section
            className="bg-[#1d1d1f] rounded-[8px] px-5 py-6 text-center"
            style={{ boxShadow: "rgba(0,0,0,0.08) 0px 2px 10px 0px" }}
          >
            <MessageCircle size={28} className="mx-auto mb-3" style={{ color: "#25d366" }} />
            <p className="font-semibold text-white mb-1" style={{ letterSpacing: "0.196px" }}>
              יש שאלה? שלח לנו הודעה
            </p>
            <p className="text-sm mb-4" style={{ color: "rgba(255,255,255,0.6)" }}>
              נשמח לענות על כל שאלה לגבי ההזמנה שלך
            </p>
            <a
              href={`https://wa.me/972547723281?text=${waMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-[8px] font-medium text-white transition-opacity hover:opacity-90"
              style={{
                background: "#25d366",
                letterSpacing: "-0.224px",
                minHeight: 52,
              }}
            >
              <MessageCircle size={18} />
              פתח WhatsApp
            </a>
          </section>

          {/* ── 5. חזרה */}
          <div className="text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-sm transition-colors hover:underline"
              style={{ color: "#0066cc" }}
            >
              <Home size={14} />
              חזרה לדף הבית
            </Link>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
