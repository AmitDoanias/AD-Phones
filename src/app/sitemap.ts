import type { MetadataRoute } from "next";
import { createStaticClient } from "@/lib/supabase/static";

const SITE_URL = "https://ad-phones.co.il";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createStaticClient();
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "daily", priority: 1.0 },
    { url: `${SITE_URL}/repairs`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/repairs/iphone`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/repairs/ipad`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/repairs/samsung`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/cookies`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/accessibility`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];

  const [
    { data: brands },
    { data: models },
    { data: repairTypes },
    { data: modelRepairs },
    { data: blogPosts },
  ] = await Promise.all([
    supabase.from("brands").select("slug"),
    supabase
      .from("models")
      .select("slug, brands!inner(slug)")
      .eq("is_active", true),
    supabase.from("repair_types").select("slug"),
    supabase
      .from("model_repairs")
      .select(
        "is_active, repair_types!inner(slug), models!inner(slug, is_active, brands!inner(slug))"
      )
      .eq("is_active", true),
    supabase
      .from("blog_posts")
      .select("slug, published_at, updated_at")
      .eq("is_published", true),
  ]);

  // Skip brands that have dedicated SEO pages above (samsung).
  const brandRoutes: MetadataRoute.Sitemap = (brands ?? [])
    .filter((b) => b.slug !== "samsung")
    .map((b) => ({
      url: `${SITE_URL}/repairs/${b.slug}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    }));

  const modelRoutes: MetadataRoute.Sitemap = (models ?? []).flatMap((m) => {
    const brand = Array.isArray(m.brands) ? m.brands[0] : m.brands;
    if (!brand?.slug) return [];
    return [
      {
        url: `${SITE_URL}/repairs/${brand.slug}/${m.slug}`,
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      },
    ];
  });

  const serviceRoutes: MetadataRoute.Sitemap = (repairTypes ?? []).map((r) => ({
    url: `${SITE_URL}/repairs/services/${r.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const repairDetailRoutes: MetadataRoute.Sitemap = (modelRepairs ?? []).flatMap((row) => {
    const repairType = Array.isArray(row.repair_types) ? row.repair_types[0] : row.repair_types;
    const model = Array.isArray(row.models) ? row.models[0] : row.models;
    if (!repairType?.slug || !model?.slug || !model.is_active) return [];
    const brand = Array.isArray(model.brands) ? model.brands[0] : model.brands;
    if (!brand?.slug) return [];
    return [
      {
        url: `${SITE_URL}/repairs/${brand.slug}/${model.slug}/${repairType.slug}`,
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      },
    ];
  });

  const blogRoutes: MetadataRoute.Sitemap = (blogPosts ?? []).map((p) => ({
    url: `${SITE_URL}/blog/${p.slug}`,
    lastModified: p.updated_at ? new Date(p.updated_at) : (p.published_at ? new Date(p.published_at) : now),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [
    ...staticRoutes,
    ...brandRoutes,
    ...modelRoutes,
    ...serviceRoutes,
    ...repairDetailRoutes,
    ...blogRoutes,
  ];
}
