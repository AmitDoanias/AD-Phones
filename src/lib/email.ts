import { Resend } from "resend";

// Lazy-init Resend so module load doesn't crash if RESEND_API_KEY is missing
// (e.g., a preview deploy on a branch that hasn't been added to env scope).
// Senders fail gracefully at runtime instead — caught by callers' try/catch.
let resendClient: Resend | null = null;
function getResend(): Resend {
  if (!resendClient) {
    const key = process.env.RESEND_API_KEY;
    if (!key) throw new Error("RESEND_API_KEY is not set");
    resendClient = new Resend(key);
  }
  return resendClient;
}

const FROM = process.env.CONTACT_EMAIL_FROM || "onboarding@resend.dev";
const TO = process.env.CONTACT_EMAIL_TO || "info@ad-phones.co.il";
const SITE_URL = "https://ad-phones.co.il";
const BUSINESS_PHONE = "053-483-2573";
const WHATSAPP_LINK = "https://wa.me/972534832573";

type SendResult = { ok: boolean; error?: string };

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function row(label: string, value: string | null | undefined): string {
  if (!value) return "";
  return `<tr><td style="padding:6px 12px 6px 0;color:#666;font-size:13px;vertical-align:top;white-space:nowrap;">${escapeHtml(label)}</td><td style="padding:6px 0;color:#1d1d1f;font-size:14px;">${escapeHtml(value)}</td></tr>`;
}

const DEVICE_LABELS: Record<string, string> = {
  apple: "Apple",
  samsung: "Samsung",
  iphone: "iPhone",
  ipad: "iPad",
};

export async function sendContactEmail(data: {
  name?: string | null;
  phone: string;
  device?: string | null;
  appleType?: string | null;
  modelName?: string | null;
  message?: string | null;
}): Promise<SendResult> {
  const subject = data.name
    ? `פנייה חדשה: ${data.name}`
    : `פנייה חדשה מ-${data.phone}`;

  const deviceLine = [
    data.device ? DEVICE_LABELS[data.device] ?? data.device : null,
    data.appleType ? DEVICE_LABELS[data.appleType] ?? data.appleType : null,
    data.modelName,
  ]
    .filter(Boolean)
    .join(" · ");

  const html = `<!DOCTYPE html>
<html dir="rtl" lang="he">
<body style="margin:0;padding:24px;background:#f5f5f7;font-family:-apple-system,BlinkMacSystemFont,'Heebo',sans-serif;">
  <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:12px;padding:28px;box-shadow:0 2px 10px rgba(0,0,0,0.06);">
    <h1 style="margin:0 0 6px;color:#1d1d1f;font-size:22px;">פנייה חדשה מהאתר</h1>
    <p style="margin:0 0 20px;color:#666;font-size:13px;">התקבלה ב-${new Date().toLocaleString("he-IL", { timeZone: "Asia/Jerusalem" })}</p>
    <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
      ${row("שם:", data.name || "—")}
      ${row("טלפון:", data.phone)}
      ${row("מכשיר:", deviceLine || "—")}
      ${data.message ? row("הודעה:", data.message) : ""}
    </table>
    <a href="${SITE_URL}/dashboard/leads" style="display:inline-block;padding:10px 18px;background:#0071e3;color:#fff;text-decoration:none;border-radius:8px;font-size:14px;">פתח ב-Dashboard</a>
  </div>
</body>
</html>`;

  try {
    const { error } = await getResend().emails.send({
      from: FROM,
      to: TO,
      replyTo: undefined,
      subject,
      html,
    });
    if (error) {
      console.error("[email] sendContactEmail failed:", error);
      return { ok: false, error: error.message };
    }
    return { ok: true };
  } catch (err) {
    console.error("[email] sendContactEmail threw:", err);
    return { ok: false, error: err instanceof Error ? err.message : "unknown" };
  }
}

export async function sendBookingEmail(data: {
  bookingId: string;
  customerName: string;
  customerPhone: string;
  serviceType: "lab" | "technician";
  total: number;
  preferredAt: string | null;
  items: Array<{ modelName: string; repairName: string; price: number }>;
}): Promise<SendResult> {
  const subject = `הזמנה חדשה - ₪${data.total.toLocaleString("he-IL")} - ${data.customerName}`;

  const itemsHtml = data.items
    .map(
      (it) =>
        `<tr><td style="padding:8px 0;border-bottom:1px solid #f0f0f0;color:#1d1d1f;font-size:14px;">${escapeHtml(it.modelName)} · ${escapeHtml(it.repairName)}</td><td style="padding:8px 0;border-bottom:1px solid #f0f0f0;color:#1d1d1f;font-size:14px;text-align:left;white-space:nowrap;">₪${it.price.toLocaleString("he-IL")}</td></tr>`
    )
    .join("");

  const serviceTypeLabel =
    data.serviceType === "technician" ? "טכנאי לבית/למשרד" : "מסירה למעבדה";
  const preferredAtLabel = data.preferredAt
    ? new Date(data.preferredAt).toLocaleString("he-IL", { timeZone: "Asia/Jerusalem" })
    : "לא צוין";

  const html = `<!DOCTYPE html>
<html dir="rtl" lang="he">
<body style="margin:0;padding:24px;background:#f5f5f7;font-family:-apple-system,BlinkMacSystemFont,'Heebo',sans-serif;">
  <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:12px;padding:28px;box-shadow:0 2px 10px rgba(0,0,0,0.06);">
    <h1 style="margin:0 0 6px;color:#1d1d1f;font-size:22px;">הזמנה חדשה</h1>
    <p style="margin:0 0 20px;color:#666;font-size:13px;">התקבלה ב-${new Date().toLocaleString("he-IL", { timeZone: "Asia/Jerusalem" })}</p>
    <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
      ${row("שם:", data.customerName)}
      ${row("טלפון:", data.customerPhone)}
      ${row("סוג שירות:", serviceTypeLabel)}
      ${row("מועד מבוקש:", preferredAtLabel)}
    </table>
    <h2 style="margin:24px 0 8px;color:#1d1d1f;font-size:16px;">פריטים:</h2>
    <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
      ${itemsHtml}
      <tr><td style="padding:12px 0 0;font-weight:bold;color:#1d1d1f;font-size:15px;">סה"כ:</td><td style="padding:12px 0 0;font-weight:bold;color:#1d1d1f;font-size:15px;text-align:left;white-space:nowrap;">₪${data.total.toLocaleString("he-IL")}</td></tr>
    </table>
    <a href="${SITE_URL}/dashboard/bookings/${data.bookingId}" style="display:inline-block;padding:10px 18px;background:#0071e3;color:#fff;text-decoration:none;border-radius:8px;font-size:14px;">פתח ב-Dashboard</a>
  </div>
</body>
</html>`;

  try {
    const { error } = await getResend().emails.send({
      from: FROM,
      to: TO,
      subject,
      html,
    });
    if (error) {
      console.error("[email] sendBookingEmail failed:", error);
      return { ok: false, error: error.message };
    }
    return { ok: true };
  } catch (err) {
    console.error("[email] sendBookingEmail threw:", err);
    return { ok: false, error: err instanceof Error ? err.message : "unknown" };
  }
}

// ─── Customer-facing confirmation emails ──────────────────────────────────

export async function sendCustomerContactConfirmation(data: {
  customerEmail: string;
  customerName?: string | null;
}): Promise<SendResult> {
  const greeting = data.customerName ? `שלום ${data.customerName},` : "שלום,";

  const html = `<!DOCTYPE html>
<html dir="rtl" lang="he">
<body style="margin:0;padding:24px;background:#f5f5f7;font-family:-apple-system,BlinkMacSystemFont,'Heebo',sans-serif;">
  <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:12px;padding:32px;box-shadow:0 2px 10px rgba(0,0,0,0.06);">
    <h1 style="margin:0 0 16px;color:#1d1d1f;font-size:22px;">תודה על פנייתך לאיי די פון!</h1>
    <p style="margin:0 0 12px;color:#1d1d1f;font-size:15px;line-height:1.6;">${escapeHtml(greeting)}</p>
    <p style="margin:0 0 16px;color:#1d1d1f;font-size:15px;line-height:1.6;">קיבלנו את ההודעה שלך ונחזור אליך בהקדם האפשרי.</p>
    <p style="margin:0 0 24px;color:rgba(0,0,0,0.6);font-size:14px;line-height:1.6;">אם הפנייה דחופה - אפשר ליצור קשר ישירות:</p>
    <div style="margin:0 0 24px;">
      <a href="tel:+972534832573" style="display:inline-block;padding:10px 18px;margin-left:8px;background:#0071e3;color:#fff;text-decoration:none;border-radius:8px;font-size:14px;">📞 ${BUSINESS_PHONE}</a>
      <a href="${WHATSAPP_LINK}" style="display:inline-block;padding:10px 18px;background:#25D366;color:#fff;text-decoration:none;border-radius:8px;font-size:14px;">💬 WhatsApp</a>
    </div>
    <hr style="border:none;border-top:1px solid #f0f0f0;margin:24px 0;">
    <p style="margin:0;color:rgba(0,0,0,0.5);font-size:12px;line-height:1.6;">
      A&D Phones · מעבדת תיקון סלולר<br>
      מעגל השלום 3, ראשון לציון<br>
      <a href="${SITE_URL}" style="color:#0071e3;text-decoration:none;">ad-phones.co.il</a>
    </p>
  </div>
</body>
</html>`;

  try {
    const { error } = await getResend().emails.send({
      from: FROM,
      to: data.customerEmail,
      subject: "תודה על פנייתך - איי די פון",
      html,
    });
    if (error) {
      console.error("[email] sendCustomerContactConfirmation failed:", error);
      return { ok: false, error: error.message };
    }
    return { ok: true };
  } catch (err) {
    console.error("[email] sendCustomerContactConfirmation threw:", err);
    return { ok: false, error: err instanceof Error ? err.message : "unknown" };
  }
}

export async function sendCustomerBookingConfirmation(data: {
  bookingId: string;
  customerEmail: string;
  customerName: string;
  serviceType: "lab" | "technician";
  total: number;
  preferredAt: string | null;
  items: Array<{ modelName: string; repairName: string; price: number }>;
}): Promise<SendResult> {
  const itemsHtml = data.items
    .map(
      (it) =>
        `<tr><td style="padding:8px 0;border-bottom:1px solid #f0f0f0;color:#1d1d1f;font-size:14px;">${escapeHtml(it.modelName)} · ${escapeHtml(it.repairName)}</td><td style="padding:8px 0;border-bottom:1px solid #f0f0f0;color:#1d1d1f;font-size:14px;text-align:left;white-space:nowrap;">₪${it.price.toLocaleString("he-IL")}</td></tr>`
    )
    .join("");

  const serviceTypeLabel =
    data.serviceType === "technician" ? "טכנאי לבית/למשרד" : "השארה במעבדה";
  const preferredAtLabel = data.preferredAt
    ? new Date(data.preferredAt).toLocaleString("he-IL", { timeZone: "Asia/Jerusalem" })
    : "—";

  const html = `<!DOCTYPE html>
<html dir="rtl" lang="he">
<body style="margin:0;padding:24px;background:#f5f5f7;font-family:-apple-system,BlinkMacSystemFont,'Heebo',sans-serif;">
  <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:12px;padding:32px;box-shadow:0 2px 10px rgba(0,0,0,0.06);">
    <h1 style="margin:0 0 8px;color:#1d1d1f;font-size:22px;">תודה ${escapeHtml(data.customerName)}, ההזמנה התקבלה!</h1>
    <p style="margin:0 0 24px;color:rgba(0,0,0,0.6);font-size:14px;">ניצור איתך קשר בקרוב לתיאום סופי.</p>

    <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
      ${row("סוג שירות:", serviceTypeLabel)}
      ${row("מועד מבוקש:", preferredAtLabel)}
    </table>

    <h2 style="margin:24px 0 8px;color:#1d1d1f;font-size:16px;">פרטי ההזמנה:</h2>
    <table style="width:100%;border-collapse:collapse;margin-bottom:16px;">
      ${itemsHtml}
      <tr><td style="padding:12px 0 0;font-weight:bold;color:#1d1d1f;font-size:15px;">סה"כ לתשלום (בסיום התיקון):</td><td style="padding:12px 0 0;font-weight:bold;color:#1d1d1f;font-size:15px;text-align:left;white-space:nowrap;">₪${data.total.toLocaleString("he-IL")}</td></tr>
    </table>

    <p style="margin:16px 0 24px;color:rgba(0,0,0,0.5);font-size:12px;line-height:1.6;">
      * תשלום בסיום התיקון - לא נגבה עכשיו.<br>
      * אחריות 90 יום על כל תיקון.
    </p>

    <a href="${SITE_URL}/booking/confirmation/${data.bookingId}" style="display:inline-block;padding:12px 20px;background:#0071e3;color:#fff;text-decoration:none;border-radius:8px;font-size:14px;margin-bottom:24px;">צפה בהזמנה באתר</a>

    <hr style="border:none;border-top:1px solid #f0f0f0;margin:24px 0;">

    <p style="margin:0 0 8px;color:#1d1d1f;font-size:14px;font-weight:600;">צריך לשנות משהו? צור קשר:</p>
    <div style="margin:0 0 16px;">
      <a href="tel:+972534832573" style="display:inline-block;padding:8px 14px;margin-left:8px;background:#0071e3;color:#fff;text-decoration:none;border-radius:6px;font-size:13px;">📞 ${BUSINESS_PHONE}</a>
      <a href="${WHATSAPP_LINK}" style="display:inline-block;padding:8px 14px;background:#25D366;color:#fff;text-decoration:none;border-radius:6px;font-size:13px;">💬 WhatsApp</a>
    </div>
    <p style="margin:0;color:rgba(0,0,0,0.5);font-size:12px;line-height:1.6;">
      A&D Phones · מעבדת תיקון סלולר<br>
      מעגל השלום 3, ראשון לציון<br>
      <a href="${SITE_URL}" style="color:#0071e3;text-decoration:none;">ad-phones.co.il</a>
    </p>
  </div>
</body>
</html>`;

  try {
    const { error } = await getResend().emails.send({
      from: FROM,
      to: data.customerEmail,
      subject: `אישור הזמנה - ₪${data.total.toLocaleString("he-IL")} - איי די פון`,
      html,
    });
    if (error) {
      console.error("[email] sendCustomerBookingConfirmation failed:", error);
      return { ok: false, error: error.message };
    }
    return { ok: true };
  } catch (err) {
    console.error("[email] sendCustomerBookingConfirmation threw:", err);
    return { ok: false, error: err instanceof Error ? err.message : "unknown" };
  }
}
