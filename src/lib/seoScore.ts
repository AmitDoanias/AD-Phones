// Lightweight, client-side SEO scorer for blog posts.
// Returns a 0-100 score plus a checklist describing what helped or hurt.

export type SeoCheck = {
  id: string;
  label: string;
  pass: boolean;
  weight: number; // 0-100, summed contribution to the final score
  hint?: string;
};

export type SeoScoreInput = {
  title: string;
  slug: string;
  excerpt: string;
  cover_image_url: string | null;
  seo_title: string;
  seo_description: string;
  seo_keywords: string;
  body: string; // raw markdown or html (we strip tags)
};

export type SeoScoreResult = {
  score: number; // 0-100
  checks: SeoCheck[];
  band: "weak" | "ok" | "good" | "excellent";
  bandColor: string;
};

function stripTags(s: string): string {
  return s
    .replace(/<\/?[^>]+(>|$)/g, " ")
    .replace(/!\[[^\]]*\]\([^)]+\)/g, "") // markdown images
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // markdown links → text
    .replace(/[#*_`>~]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function countWords(s: string): number {
  return s.split(/\s+/).filter(Boolean).length;
}

export function computeSeoScore(input: SeoScoreInput): SeoScoreResult {
  const titleLen = input.title.trim().length;
  const slugLen = input.slug.trim().length;
  const excerptLen = input.excerpt.trim().length;
  const seoTitleLen = (input.seo_title || input.title).trim().length;
  const seoDescLen = (input.seo_description || input.excerpt).trim().length;
  const keywordsCount = input.seo_keywords
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean).length;

  const plain = stripTags(input.body);
  const wordCount = countWords(plain);

  const checks: SeoCheck[] = [
    {
      id: "title",
      label: "כותרת באורך 30-70 תווים",
      pass: titleLen >= 30 && titleLen <= 70,
      weight: 12,
      hint: titleLen === 0 ? "אין כותרת" : titleLen < 30 ? `קצר מדי (${titleLen})` : titleLen > 70 ? `ארוך מדי (${titleLen})` : undefined,
    },
    {
      id: "slug",
      label: "slug תקין (3-60 תווים)",
      pass: slugLen >= 3 && slugLen <= 60,
      weight: 6,
      hint: slugLen === 0 ? "חסר" : slugLen > 60 ? "ארוך מדי" : slugLen < 3 ? "קצר מדי" : undefined,
    },
    {
      id: "excerpt",
      label: "תקציר באורך 80-200 תווים",
      pass: excerptLen >= 80 && excerptLen <= 200,
      weight: 10,
      hint: excerptLen === 0 ? "אין תקציר" : excerptLen < 80 ? "קצר מדי" : excerptLen > 200 ? "ארוך מדי" : undefined,
    },
    {
      id: "cover",
      label: "תמונת כיסוי",
      pass: !!input.cover_image_url,
      weight: 10,
      hint: !input.cover_image_url ? "מומלץ להוסיף תמונת כיסוי" : undefined,
    },
    {
      id: "seo-title",
      label: "SEO Title באורך 50-60 תווים",
      pass: seoTitleLen >= 30 && seoTitleLen <= 65,
      weight: 10,
      hint: seoTitleLen === 0 ? "ריק" : seoTitleLen > 65 ? `יקוצר ב-Google (${seoTitleLen})` : seoTitleLen < 30 ? "קצר מדי" : undefined,
    },
    {
      id: "seo-desc",
      label: "SEO Description באורך 120-160 תווים",
      pass: seoDescLen >= 120 && seoDescLen <= 165,
      weight: 12,
      hint: seoDescLen === 0 ? "ריק" : seoDescLen > 165 ? `יקוצר (${seoDescLen})` : seoDescLen < 120 ? "קצר מדי" : undefined,
    },
    {
      id: "keywords",
      label: "3-7 מילות מפתח",
      pass: keywordsCount >= 3 && keywordsCount <= 7,
      weight: 6,
      hint: keywordsCount === 0 ? "חסר" : keywordsCount < 3 ? "מעט מדי" : keywordsCount > 7 ? "יותר מדי" : undefined,
    },
    {
      id: "wordcount",
      label: "אורך תוכן 300+ מילים",
      pass: wordCount >= 300,
      weight: 14,
      hint: wordCount < 300 ? `כרגע ${wordCount} מילים` : undefined,
    },
    {
      id: "headings",
      label: "כותרות משנה בפוסט (H2/H3)",
      pass: /(^|\n)#{2,3}\s|\<h[23][\s>]/i.test(input.body),
      weight: 8,
      hint: /(^|\n)#{2,3}\s|\<h[23][\s>]/i.test(input.body) ? undefined : "פוסט קריא יותר עם כותרות משנה",
    },
    {
      id: "images-in-body",
      label: "תמונה אחת לפחות בגוף הפוסט",
      pass: /!\[[^\]]*\]\([^)]+\)|\<img\s/i.test(input.body),
      weight: 6,
      hint: /!\[[^\]]*\]\([^)]+\)|\<img\s/i.test(input.body) ? undefined : "תמונות מגדילות engagement",
    },
    {
      id: "internal-link",
      label: "לפחות קישור פנימי אחד",
      pass: /\]\((\/|https:\/\/ad-phones\.co\.il)/.test(input.body) || /href="(\/|https:\/\/ad-phones\.co\.il)/.test(input.body),
      weight: 6,
      hint: undefined,
    },
  ];

  const score = Math.round(checks.reduce((sum, c) => sum + (c.pass ? c.weight : 0), 0));
  const band: SeoScoreResult["band"] =
    score >= 85 ? "excellent" : score >= 70 ? "good" : score >= 50 ? "ok" : "weak";
  const bandColor =
    band === "excellent" ? "#34c759" : band === "good" ? "#5ac8fa" : band === "ok" ? "#ff9500" : "#ff3b30";

  return { score, checks, band, bandColor };
}

// Hebrew + English stop words common enough to skip when extracting keywords.
const STOP_WORDS = new Set([
  "של", "את", "עם", "על", "אל", "מן", "אם", "כי", "הוא", "היא", "הם", "הן",
  "זה", "זו", "זאת", "אני", "אתה", "אנחנו", "אבל", "או", "גם", "רק", "מאוד", "כמו",
  "להיות", "יש", "אין", "לא", "כן", "כדי", "תוך", "לפי", "אצל", "אחרי", "לפני",
  "למה", "איך", "מה", "מי", "איפה", "מתי", "כמה", "כל", "כמו", "באמצעות",
  "the", "and", "for", "with", "this", "that", "from", "your", "you", "are",
  "can", "will", "all", "but", "not", "any", "one", "more", "than", "what",
  "when", "how", "who", "where", "why", "have", "has", "had", "was", "were",
]);

export function suggestKeywords(input: { title: string; body: string }): string[] {
  const text = `${input.title} ${stripTags(input.body)}`;
  const words = text
    .toLowerCase()
    .replace(/[^֐-׿a-zA-Z0-9\s\-]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length >= 3 && !STOP_WORDS.has(w));

  // Single words
  const single = new Map<string, number>();
  words.forEach((w) => single.set(w, (single.get(w) ?? 0) + 1));

  // Bigrams (often more valuable as SEO keywords)
  const bigrams = new Map<string, number>();
  for (let i = 0; i < words.length - 1; i++) {
    const a = words[i];
    const b = words[i + 1];
    if (a.length >= 3 && b.length >= 3) {
      const phrase = `${a} ${b}`;
      bigrams.set(phrase, (bigrams.get(phrase) ?? 0) + 1);
    }
  }

  // Score: bigrams weighted higher (more specific) and require frequency >= 2
  const candidates: Array<{ term: string; score: number }> = [];
  for (const [term, count] of bigrams) {
    if (count >= 2) candidates.push({ term, score: count * 2.5 });
  }
  for (const [term, count] of single) {
    if (count >= 3) candidates.push({ term, score: count });
  }

  candidates.sort((a, b) => b.score - a.score);

  // Deduplicate phrases that contain shorter ones already chosen
  const chosen: string[] = [];
  for (const c of candidates) {
    if (chosen.some((existing) => existing.includes(c.term) || c.term.includes(existing))) continue;
    chosen.push(c.term);
    if (chosen.length >= 7) break;
  }
  return chosen;
}
