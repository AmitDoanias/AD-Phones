import type { Metadata } from "next";
import { Heebo } from "next/font/google";
import "./globals.css";

const heebo = Heebo({
  variable: "--font-heebo",
  subsets: ["hebrew", "latin"],
  weight: ["300", "400", "500", "700", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "AD Phones - תיקון סלולר מקצועי",
  description:
    "AD Phones - תיקון מקצועי לאייפון, אייפד וסמסונג. קבע תור עכשיו ותקבל שירות מהיר ואמין.",
  keywords: "תיקון אייפון, תיקון סמסונג, תיקון אייפד, תיקון סלולר",
  openGraph: {
    locale: "he_IL",
    type: "website",
    siteName: "AD Phones",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl" className={`${heebo.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}
