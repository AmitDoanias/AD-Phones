import {
  Smartphone,
  Battery,
  Camera,
  Mic,
  Volume2,
  Wrench,
  Fingerprint,
  Droplets,
  Usb,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

type RepairVisual = { Icon: LucideIcon; accent: string; bg: string };

const REPAIR_ICON_MAP: { match: RegExp; Icon: LucideIcon; accent: string; bg: string }[] = [
  { match: /מסך|תצוגה|display|screen/i, Icon: Smartphone, accent: "#0071e3", bg: "rgba(0,113,227,0.08)" },
  { match: /סוללה|battery/i, Icon: Battery, accent: "#30a46c", bg: "rgba(48,164,108,0.08)" },
  { match: /מצלמה|camera/i, Icon: Camera, accent: "#7c3aed", bg: "rgba(124,58,237,0.08)" },
  { match: /מיקרופון|microphone|mic/i, Icon: Mic, accent: "#e11d48", bg: "rgba(225,29,72,0.08)" },
  { match: /רמקול|speaker|קול/i, Icon: Volume2, accent: "#f59e0b", bg: "rgba(245,158,11,0.08)" },
  { match: /טעינה|שקע|charge|port|usb/i, Icon: Usb, accent: "#06b6d4", bg: "rgba(6,182,212,0.08)" },
  { match: /מים|נוזל|water|liquid/i, Icon: Droplets, accent: "#0ea5e9", bg: "rgba(14,165,233,0.08)" },
  { match: /טביעת|אצבע|face|id|fingerprint/i, Icon: Fingerprint, accent: "#8b5cf6", bg: "rgba(139,92,246,0.08)" },
  { match: /ניקוי|cleaning|שיקום/i, Icon: Sparkles, accent: "#f43f5e", bg: "rgba(244,63,94,0.08)" },
];

const DEFAULT_VISUAL: RepairVisual = {
  Icon: Wrench,
  accent: "#64748b",
  bg: "rgba(100,116,139,0.08)",
};

export function getRepairVisual(name: string): RepairVisual {
  const match = REPAIR_ICON_MAP.find((m) => m.match.test(name));
  if (!match) return DEFAULT_VISUAL;
  return { Icon: match.Icon, accent: match.accent, bg: match.bg };
}
