import { ShieldCheck, Zap, Award, type LucideIcon } from "lucide-react";

export const DEFAULT_TRUST_BADGES = [
  "אחריות 90 יום",
  "תיקון מיידי עד 30 דק",
  "חלקים מקוריים",
];

export function getBadgeIcon(label: string): LucideIcon {
  const s = label.toLowerCase();
  if (/אחריות|warranty|guarantee/.test(s)) return ShieldCheck;
  if (/מיידי|מהיר|דק|שע|שעות|שעה|quick|fast|instant/.test(s)) return Zap;
  if (/מקור|חלק|genuine|original|oem/.test(s)) return Award;
  return ShieldCheck;
}

export function normalizeTrustBadges(raw: unknown): string[] {
  if (!Array.isArray(raw)) return DEFAULT_TRUST_BADGES;
  const cleaned = raw
    .map((v) => (typeof v === "string" ? v.trim() : ""))
    .filter((v) => v.length > 0);
  return cleaned.length > 0 ? cleaned : DEFAULT_TRUST_BADGES;
}
