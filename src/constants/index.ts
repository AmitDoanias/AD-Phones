import type { BookingStatus, LeadStatus } from "@/types";

export const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "972534832573";

export const BOOKING_STATUS_LABELS: Record<BookingStatus, string> = {
  received: "חדש",
  in_progress: "בטיפול",
  done: "הושלם",
  cancelled: "בוטל",
};

export const BOOKING_STATUS_COLORS: Record<BookingStatus, string> = {
  received: "bg-yellow-100 text-yellow-800",
  in_progress: "bg-blue-100 text-blue-800",
  done: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  new: "חדש",
  contacted: "פנו ללקוח",
  converted: "הפך ללקוח",
  closed: "נסגר",
};

export const LEAD_STATUS_COLORS: Record<LeadStatus, string> = {
  new: "bg-blue-100 text-blue-800",
  contacted: "bg-yellow-100 text-yellow-800",
  converted: "bg-green-100 text-green-800",
  closed: "bg-slate-100 text-slate-600",
};

export const TECHNICIAN_FEE_DEFAULT = 50; // ILS

export const BUSINESS_HOURS = {
  sun: { open: "09:00", close: "19:00" },
  mon: { open: "09:00", close: "19:00" },
  tue: { open: "09:00", close: "19:00" },
  wed: { open: "09:00", close: "19:00" },
  thu: { open: "09:00", close: "19:00" },
  fri: { open: "09:00", close: "14:00" },
  sat: null, // closed
};

export const SLOT_DURATION_MIN = 30;

export const NAV_LINKS = [
  { href: "/", label: "ראשי" },
  { href: "/repairs", label: "תיקונים" },
  { href: "/about", label: "למה אנחנו" },
  { href: "/contact", label: "יצירת קשר" },
];
