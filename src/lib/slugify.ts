// Build URL slugs from Hebrew titles. Keeps Hebrew letters as-is and only
// strips characters that don't belong in a URL path. Spaces become hyphens.
//
// Examples:
//   "החלפת סוללה אייפון" → "החלפת-סוללה-אייפון"
//   "iPhone 15 Pro Max"   → "iphone-15-pro-max"
//   "מסך שבור?"            → "מסך-שבור"

const ALLOWED = /[^֐-׿a-z0-9\s-]/g; // Hebrew block + a-z + digits + space + hyphen

export function slugifyHebrew(text: string): string {
  if (!text) return "";
  return text
    .toLowerCase()
    .normalize("NFKC")
    .replace(ALLOWED, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

// Same character class used by API + form validation.
export const SLUG_PATTERN = /^[֐-׿a-z0-9-]+$/;
export const SLUG_PATTERN_SOURCE = SLUG_PATTERN.source;
