export type CookieCategory = "essential" | "analytics" | "marketing";

export type CookieConsent = {
  essential: true;
  analytics: boolean;
  marketing: boolean;
  consentedAt: string;
};

const STORAGE_KEY = "ad_cookie_consent";
const VERSION = 1;

const FULL_KEY = `${STORAGE_KEY}_v${VERSION}`;

export function loadConsent(): CookieConsent | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(FULL_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CookieConsent;
    if (parsed.essential !== true) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveConsent(consent: Omit<CookieConsent, "essential" | "consentedAt">) {
  if (typeof window === "undefined") return;
  const full: CookieConsent = {
    essential: true,
    analytics: consent.analytics,
    marketing: consent.marketing,
    consentedAt: new Date().toISOString(),
  };
  localStorage.setItem(FULL_KEY, JSON.stringify(full));
  window.dispatchEvent(new CustomEvent("cookie-consent-updated", { detail: full }));
}

export function clearConsent() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(FULL_KEY);
  window.dispatchEvent(new CustomEvent("cookie-consent-updated", { detail: null }));
}

export function hasConsent(category: CookieCategory): boolean {
  if (category === "essential") return true;
  const c = loadConsent();
  if (!c) return false;
  return c[category] === true;
}
