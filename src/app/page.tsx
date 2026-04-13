import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "A&D Phones | האתר בשיפוצים",
  description: "A&D Phones — תיקון מקצועי לאייפון, אייפד וסמסונג. חוזרים בקרוב!",
};

export default function HomePage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#0f172a",
        padding: "2rem",
        boxSizing: "border-box",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <div
        style={{
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "2rem",
          maxWidth: "480px",
          width: "100%",
        }}
      >
        {/* Logo */}
        <Image
          src="/logo.png"
          alt="A&D Phones"
          width={200}
          height={70}
          priority
          style={{ objectFit: "contain" }}
        />

        {/* Text */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <h1
            style={{
              color: "#f8fafc",
              fontSize: "clamp(1.5rem, 5vw, 2rem)",
              fontWeight: 700,
              margin: 0,
            }}
          >
            האתר בשיפוצים 🔧
          </h1>
          <p style={{ color: "#94a3b8", fontSize: "1.05rem", margin: 0 }}>
            אנחנו עובדים על משהו מגניב — נחזור בקרוב!
          </p>
          <p style={{ color: "#64748b", fontSize: "0.9rem", margin: 0 }}>
            בינתיים אפשר לפנות אלינו ישירות בוואטסאפ
          </p>
        </div>

        {/* WhatsApp CTA */}
        <a
          href="https://wa.me/972547723281?text=%D7%94%D7%99%D7%99%2C%20%D7%90%D7%A0%D7%99%20%D7%9E%D7%A2%D7%95%D7%A0%D7%99%D7%99%D7%9F%20%D7%91%D7%AA%D7%99%D7%A7%D7%95%D7%9F"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.6rem",
            background: "#25d366",
            color: "#fff",
            padding: "0.85rem 2rem",
            borderRadius: "999px",
            textDecoration: "none",
            fontWeight: 600,
            fontSize: "1rem",
            boxShadow: "0 4px 20px rgba(37,211,102,0.35)",
          }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          שלחו לנו וואטסאפ
        </a>

        {/* Phone */}
        <p style={{ color: "#475569", fontSize: "0.85rem", margin: 0 }}>
          או התקשרו:{" "}
          <a href="tel:0547723281" style={{ color: "#94a3b8", fontWeight: 600 }}>
            054-772-3281
          </a>
        </p>
      </div>
    </div>
  );
}
