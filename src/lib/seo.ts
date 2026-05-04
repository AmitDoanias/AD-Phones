import type { Metadata } from "next";

const SITE_NAME = "A&D Phones";
const SITE_URL = "https://ad-phones.co.il";
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-default.jpg`;
const PHONE = "053-483-2573";
const CITY = "ראשון לציון";
const STREET_ADDRESS = "מעגל השלום 3";

const SERVICE_AREAS = [
  "ראשון לציון",
  "רחובות",
  "בת ים",
  "נס ציונה",
  "חולון",
  "פתח תקווה",
  "רמלה",
  "משמר השבעה",
  "גבעתיים",
  "רמת גן",
  "תל אביב",
  "הרצליה",
  "אור יהודה",
  "קרית אונו",
  "סביון",
];

// ─── Page-level metadata helpers ────────────────────────────────────────────

export function generateBrandMetadata(brandName: string): Metadata {
  const title = `תיקון ${brandName} | ${SITE_NAME}`;
  const description = `תיקון ${brandName} מקצועי ב${CITY} - מסכים, סוללות, מצלמות ועוד. מחירים שקופים, אחריות על כל תיקון. ${PHONE}`;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/repairs/${brandName.toLowerCase()}`,
      siteName: SITE_NAME,
      locale: "he_IL",
      type: "website",
      images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: title }],
    },
    twitter: { card: "summary_large_image", title, description },
    alternates: { canonical: `${SITE_URL}/repairs/${brandName.toLowerCase()}` },
  };
}

export function generateModelMetadata(params: {
  brandName: string;
  modelName: string;
  modelSlug: string;
  brandSlug: string;
  seoTitle?: string | null;
  seoDescription?: string | null;
  imageUrl?: string | null;
  altText?: string | null;
}): Metadata {
  const title =
    params.seoTitle ??
    `תיקון ${params.modelName} | ${params.brandName} | ${SITE_NAME}`;
  const description =
    params.seoDescription ??
    `תיקון ${params.modelName} ב${CITY} - החלפת מסך, סוללה, מצלמה ועוד. שירות מהיר, מחירים שקופים, אחריות מלאה. ${PHONE}`;
  const url = `${SITE_URL}/repairs/${params.brandSlug}/${params.modelSlug}`;
  const ogImage = params.imageUrl ?? DEFAULT_OG_IMAGE;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      locale: "he_IL",
      type: "website",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: params.altText ?? title,
        },
      ],
    },
    twitter: { card: "summary_large_image", title, description, images: [ogImage] },
    alternates: { canonical: url },
  };
}

export function generateRepairPageMetadata(params: {
  brandName: string;
  modelName: string;
  repairName: string;
  brandSlug: string;
  modelSlug: string;
  repairSlug: string;
  price: number;
  description?: string | null;
  imageUrl?: string | null;
}): Metadata {
  const title = `${params.repairName} ל${params.modelName} - מחיר ${params.price}₪ | ${SITE_NAME}`;
  const description =
    params.description?.trim() ||
    `${params.repairName} ל${params.modelName} ב${CITY}. מחיר ${params.price}₪, אחריות 90 יום, שירות ביום הפנייה. ${PHONE}`;
  const url = `${SITE_URL}/repairs/${params.brandSlug}/${params.modelSlug}/${params.repairSlug}`;
  const ogImage = params.imageUrl ?? DEFAULT_OG_IMAGE;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      locale: "he_IL",
      type: "website",
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: { card: "summary_large_image", title, description, images: [ogImage] },
    alternates: { canonical: url },
  };
}

export function generateRepairServiceListMetadata(params: {
  repairName: string;
  repairSlug: string;
  description?: string | null;
}): Metadata {
  const title = `${params.repairName} - מחירים לכל הדגמים | ${SITE_NAME}`;
  const rawDesc = (params.description ?? "").trim();
  const description = rawDesc
    ? rawDesc.length > 155
      ? `${rawDesc.slice(0, 152).trimEnd()}…`
      : rawDesc
    : `${params.repairName} ב${CITY} - מחירים שקופים לכל הדגמים, אחריות 90 יום, שירות ביום פנייה. ${PHONE}`;
  const url = `${SITE_URL}/repairs/services/${params.repairSlug}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      locale: "he_IL",
      type: "website",
      images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: title }],
    },
    twitter: { card: "summary_large_image", title, description },
    alternates: { canonical: url },
  };
}

// ─── JSON-LD schema builders ─────────────────────────────────────────────────

export function localBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${SITE_URL}/#business`,
    name: SITE_NAME,
    description: "תיקון מקצועי לאייפון, אייפד וסמסונג בראשון לציון ובכל מרכז הארץ",
    url: SITE_URL,
    telephone: `+972${PHONE.replace(/-/g, "").slice(1)}`,
    image: `${SITE_URL}/logo.png`,
    address: {
      "@type": "PostalAddress",
      streetAddress: STREET_ADDRESS,
      addressLocality: CITY,
      addressCountry: "IL",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 31.9691218,
      longitude: 34.7673615,
    },
    priceRange: "₪₪",
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"],
        opens: "09:00",
        closes: "19:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Friday"],
        opens: "09:00",
        closes: "14:00",
      },
    ],
    areaServed: SERVICE_AREAS.map((city) => ({ "@type": "City", name: city })),
    sameAs: [
      "https://share.google/ZBbiMpCRSFWMlY4Bl",
      // TODO: הוסף URLs של Facebook ו-Instagram כשיסופקו
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "5.0",
      reviewCount: "197",
      bestRating: "5",
    },
  };
}

export function repairServiceSchema(params: {
  modelName: string;
  brandName: string;
  repairs: { name: string; price: number }[];
  modelSlug: string;
  brandSlug: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `תיקונים ל-${params.modelName}`,
    url: `${SITE_URL}/repairs/${params.brandSlug}/${params.modelSlug}`,
    numberOfItems: params.repairs.length,
    itemListElement: params.repairs.map((r, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Service",
        name: `${r.name} - ${params.modelName}`,
        provider: {
          "@type": "LocalBusiness",
          name: SITE_NAME,
          "@id": `${SITE_URL}/#business`,
        },
        offers: {
          "@type": "Offer",
          price: r.price,
          priceCurrency: "ILS",
          availability: "https://schema.org/InStock",
        },
      },
    })),
  };
}

export function singleRepairListSchema(params: {
  repairName: string;
  repairSlug: string;
  entries: {
    brandName: string;
    brandSlug: string;
    modelName: string;
    modelSlug: string;
    price: number;
  }[];
}) {
  const listUrl = `${SITE_URL}/repairs/services/${params.repairSlug}`;
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${params.repairName} - מחירים לכל הדגמים`,
    url: listUrl,
    numberOfItems: params.entries.length,
    itemListElement: params.entries.map((e, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${SITE_URL}/repairs/${e.brandSlug}/${e.modelSlug}/${params.repairSlug}`,
      item: {
        "@type": "Service",
        name: `${params.repairName} ל${e.modelName}`,
        url: `${SITE_URL}/repairs/${e.brandSlug}/${e.modelSlug}/${params.repairSlug}`,
        brand: { "@type": "Brand", name: e.brandName },
        provider: {
          "@type": "LocalBusiness",
          name: SITE_NAME,
          "@id": `${SITE_URL}/#business`,
        },
        offers: {
          "@type": "Offer",
          price: e.price,
          priceCurrency: "ILS",
          availability: "https://schema.org/InStock",
          url: `${SITE_URL}/repairs/${e.brandSlug}/${e.modelSlug}/${params.repairSlug}`,
        },
      },
    })),
  };
}

export function singleRepairServiceSchema(params: {
  brandName: string;
  modelName: string;
  repairName: string;
  brandSlug: string;
  modelSlug: string;
  repairSlug: string;
  price: number;
  description?: string | null;
  imageUrl?: string | null;
}) {
  const url = `${SITE_URL}/repairs/${params.brandSlug}/${params.modelSlug}/${params.repairSlug}`;
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `${params.repairName} ל${params.modelName}`,
    description:
      params.description?.trim() ||
      `${params.repairName} ל${params.modelName} ב${CITY}, אחריות 90 יום.`,
    serviceType: params.repairName,
    url,
    ...(params.imageUrl ? { image: params.imageUrl } : {}),
    provider: {
      "@type": "LocalBusiness",
      name: SITE_NAME,
      "@id": `${SITE_URL}/#business`,
      telephone: `+972${PHONE.replace(/-/g, "").slice(1)}`,
      address: {
        "@type": "PostalAddress",
        streetAddress: STREET_ADDRESS,
        addressLocality: CITY,
        addressCountry: "IL",
      },
    },
    areaServed: SERVICE_AREAS.map((city) => ({ "@type": "City", name: city })),
    brand: { "@type": "Brand", name: params.brandName },
    offers: {
      "@type": "Offer",
      price: params.price,
      priceCurrency: "ILS",
      availability: "https://schema.org/InStock",
      url,
      itemOffered: {
        "@type": "Service",
        name: `${params.repairName} ל${params.modelName}`,
      },
    },
  };
}

export function faqSchema(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

export function howToSchema(params: {
  name: string;
  description: string;
  totalTime?: string; // ISO 8601 duration, e.g. "PT10M" = 10 minutes
  steps: { name: string; text: string }[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: params.name,
    description: params.description,
    ...(params.totalTime ? { totalTime: params.totalTime } : {}),
    step: params.steps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.name,
      text: s.text,
    })),
  };
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${SITE_URL}${item.url}`,
    })),
  };
}

export function reviewSchema(
  reviews: {
    author_name: string;
    rating: number;
    text: string;
    time: string;
  }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${SITE_URL}/#business`,
    name: SITE_NAME,
    review: reviews.map((r) => ({
      "@type": "Review",
      author: { "@type": "Person", name: r.author_name },
      reviewRating: {
        "@type": "Rating",
        ratingValue: r.rating,
        bestRating: 5,
      },
      reviewBody: r.text,
      datePublished: r.time,
    })),
  };
}
