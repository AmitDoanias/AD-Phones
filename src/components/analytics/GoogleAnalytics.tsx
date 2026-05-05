"use client";

import { useEffect } from "react";
import { hasConsent } from "@/lib/cookieConsent";

const GA_MEASUREMENT_ID = "G-Z1SG898B35";
const GA_SCRIPT_ID = "ga-gtag-script";

declare global {
  interface Window {
    dataLayer: unknown[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    gtag: (...args: any[]) => void;
  }
}

function loadGA() {
  if (typeof window === "undefined") return;
  // Don't double-load if a previous mount already injected the tag.
  if (document.getElementById(GA_SCRIPT_ID)) return;

  const script = document.createElement("script");
  script.id = GA_SCRIPT_ID;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  script.async = true;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  // gtag pushes its arguments to dataLayer; that's the contract GA expects.
  window.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer.push(arguments);
  };
  window.gtag("js", new Date());
  window.gtag("config", GA_MEASUREMENT_ID, {
    anonymize_ip: true,
    cookie_flags: "SameSite=None;Secure",
  });
}

// Loads GA only after the user grants analytics consent. The cookie banner
// at /src/components/legal/CookieBanner.tsx dispatches a
// "cookie-consent-updated" event whenever the user changes preferences,
// so consent given mid-session takes effect immediately.
//
// We inject script tags directly via DOM rather than using next/script
// so the load happens reliably even when triggered by user interaction
// long after page hydration.
export default function GoogleAnalytics() {
  useEffect(() => {
    if (hasConsent("analytics")) loadGA();
    const handler = () => {
      if (hasConsent("analytics")) loadGA();
    };
    window.addEventListener("cookie-consent-updated", handler);
    return () => window.removeEventListener("cookie-consent-updated", handler);
  }, []);

  return null;
}
