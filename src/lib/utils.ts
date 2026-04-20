import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isIPhoneModel(name: string): boolean {
  const n = name.toLowerCase().trim();
  return n.startsWith("iphone") || n.startsWith("אייפון");
}

export function isIPadModel(name: string): boolean {
  const n = name.toLowerCase().trim();
  return n.startsWith("ipad") || n.startsWith("אייפד");
}
