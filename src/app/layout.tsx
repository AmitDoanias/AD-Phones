import type { Metadata } from "next";
import { Heebo } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/cart/CartProvider";
import CookieBanner from "@/components/legal/CookieBanner";
import AccessibilityToolbar from "@/components/legal/AccessibilityToolbar";

const heebo = Heebo({
  variable: "--font-heebo",
  subsets: ["hebrew", "latin"],
  weight: ["300", "400", "500", "700"],
  display: "swap",
});

const SITE_URL = "https://ad-phones.co.il";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "A&D Phones | תיקון סלולר מקצועי בראשון לציון",
    template: "%s | A&D Phones",
  },
  description:
    "תיקון מקצועי לאייפון, אייפד וסמסונג בראשון לציון. החלפת מסך, סוללה, מצלמה ועוד - שירות מהיר, מחירים שקופים, אחריות מלאה. 053-483-2573",
  keywords: [
    "תיקון אייפון ראשון לציון",
    "תיקון סמסונג ראשון לציון",
    "תיקון אייפד ראשון לציון",
    "תיקון סלולר",
    "החלפת מסך אייפון",
    "A&D Phones",
  ],
  authors: [{ name: "A&D Phones" }],
  creator: "A&D Phones",
  openGraph: {
    locale: "he_IL",
    type: "website",
    siteName: "A&D Phones",
    url: SITE_URL,
    images: [
      {
        url: "/og-default.jpg",
        width: 1200,
        height: 630,
        alt: "A&D Phones - תיקון סלולר מקצועי בראשון לציון",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@adphones",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  alternates: { canonical: SITE_URL },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl" className={`${heebo.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-background text-foreground antialiased">
        <CartProvider>{children}</CartProvider>
        <CookieBanner />
        <AccessibilityToolbar />
      </body>
    </html>
  );
}
