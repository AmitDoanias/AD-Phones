import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppFab from "@/components/layout/WhatsAppFab";
import AnimatedCard from "@/components/repairs/AnimatedCard";
import JsonLd from "@/components/seo/JsonLd";
import { createClient } from "@/lib/supabase/server";
import { createStaticClient } from "@/lib/supabase/static";
import { generateRepairPageMetadata, singleRepairServiceSchema, breadcrumbSchema } from "@/lib/seo";
import { normalizeTrustBadges, getBadgeIcon } from "@/lib/trustBadges";
import AddToCartButton from "../AddToCartButton";
import CartStickyBar from "../CartStickyBar";
import { Clock, ChevronRight, MessageCircle } from "lucide-react";

export const revalidate = 3600;
export const dynamicParams = true;

type Props = {
  params: Promise<{ brand: string; model: string; repair: string }>;
};

type StaticParam = { brand: string; model: string; repair: string };

export async function generateStaticParams(): Promise<StaticParam[]> {
  const supabase = createStaticClient();
  const { data } = await supabase
    .from("model_repairs")
    .select(
      "is_active, repair_types!inner(slug), models!inner(slug, is_active, brands!inner(slug))"
    )
    .eq("is_active", true);

  const params: StaticParam[] = [];
  for (const row of data ?? []) {
    const repairType = Array.isArray(row.repair_types) ? row.repair_types[0] : row.repair_types;
    const model = Array.isArray(row.models) ? row.models[0] : row.models;
    if (!repairType || !model || !model.is_active) continue;
    const brand = Array.isArray(model.brands) ? model.brands[0] : model.brands;
    if (!brand) continue;
    params.push({ brand: brand.slug, model: model.slug, repair: repairType.slug });
  }
  return params;
}

async function loadRepairData(brandSlug: string, modelSlug: string, repairSlug: string) {
  const supabase = await createClient();

  const { data: repairType } = await supabase
    .from("repair_types")
    .select("id, name, slug, description, subtitle, trust_badges")
    .eq("slug", repairSlug)
    .single();
  if (!repairType) return null;

  const { data: model } = await supabase
    .from("models")
    .select("id, name, slug, image_url, alt_text, brands!inner(id, name, slug)")
    .eq("slug", modelSlug)
    .eq("is_active", true)
    .single();
  if (!model) return null;

  const brand = Array.isArray(model.brands) ? model.brands[0] : model.brands;
  if (!brand || brand.slug !== brandSlug) return null;

  const { data: modelRepair } = await supabase
    .from("model_repairs")
    .select("id, price, duration_min, is_active")
    .eq("model_id", model.id)
    .eq("repair_type_id", repairType.id)
    .eq("is_active", true)
    .single();
  if (!modelRepair) return null;

  const { data: otherModelRepairs } = await supabase
    .from("model_repairs")
    .select("id, price, duration_min, repair_types!inner(id, name, slug)")
    .eq("model_id", model.id)
    .eq("is_active", true)
    .neq("repair_type_id", repairType.id)
    .order("price")
    .limit(6);

  const related = (otherModelRepairs ?? []).map((r) => {
    const rt = Array.isArray(r.repair_types) ? r.repair_types[0] : r.repair_types;
    return {
      id: r.id,
      price: r.price,
      duration_min: r.duration_min as number | null,
      name: rt?.name ?? "",
      slug: rt?.slug ?? "",
    };
  });

  return { repairType, model, brand, modelRepair, related };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { brand: brandSlug, model: modelSlug, repair: repairSlug } = await params;
  const data = await loadRepairData(brandSlug, modelSlug, repairSlug);
  if (!data) return {};

  return generateRepairPageMetadata({
    brandName: data.brand.name,
    modelName: data.model.name,
    repairName: data.repairType.name,
    brandSlug: data.brand.slug,
    modelSlug: data.model.slug,
    repairSlug: data.repairType.slug,
    price: data.modelRepair.price,
    description: data.repairType.description,
    imageUrl: data.model.image_url,
  });
}

export default async function RepairDetailPage({ params }: Props) {
  const { brand: brandSlug, model: modelSlug, repair: repairSlug } = await params;
  const data = await loadRepairData(brandSlug, modelSlug, repairSlug);
  if (!data) notFound();

  const { repairType, model, brand, modelRepair, related } = data;

  const jsonLdData = singleRepairServiceSchema({
    brandName: brand.name,
    modelName: model.name,
    repairName: repairType.name,
    brandSlug: brand.slug,
    modelSlug: model.slug,
    repairSlug: repairType.slug,
    price: modelRepair.price,
    description: repairType.description,
    imageUrl: model.image_url,
  });

  const breadcrumbData = breadcrumbSchema([
    { name: "תיקונים", url: "/repairs" },
    { name: brand.name, url: `/repairs/${brand.slug}` },
    { name: model.name, url: `/repairs/${brand.slug}/${model.slug}` },
    {
      name: repairType.name,
      url: `/repairs/${brand.slug}/${model.slug}/${repairType.slug}`,
    },
  ]);

  const cartItem = {
    modelRepairId: modelRepair.id,
    modelId: model.id,
    modelName: model.name,
    brandName: brand.name,
    repairName: repairType.name,
    price: modelRepair.price,
  };

  const whatsappUrl = `https://wa.me/972547723281?text=${encodeURIComponent(
    `היי, אשמח לפרטים על ${repairType.name} ל${model.name}`
  )}`;

  return (
    <>
      <Header />
      <main className="flex-1 bg-[#f5f5f7] pb-24">
        {/* Hero */}
        <section
          className="relative text-white py-12 px-4 overflow-hidden"
          style={{
            background:
              "radial-gradient(circle at 50% 0%, #2a2a2d 0%, #1d1d1f 60%)",
          }}
        >
          <div className="max-w-5xl mx-auto text-center">
            <nav className="text-xs mb-5" style={{ color: "rgba(255,255,255,0.5)" }}>
              <Link href="/repairs" className="hover:text-white transition-colors">
                תיקונים
              </Link>
              {" / "}
              <Link
                href={`/repairs/${brand.slug}`}
                className="hover:text-white transition-colors"
              >
                {brand.name}
              </Link>
              {" / "}
              <Link
                href={`/repairs/${brand.slug}/${model.slug}`}
                className="hover:text-white transition-colors"
              >
                {model.name}
              </Link>
              {" / "}
              <span style={{ color: "rgba(255,255,255,0.85)" }}>{repairType.name}</span>
            </nav>
            <h1
              className="text-3xl md:text-5xl font-bold"
              style={{ lineHeight: 1.05, letterSpacing: "-0.4px" }}
            >
              {repairType.name} ל{model.name}
            </h1>
            {repairType.subtitle?.trim() && (
              <p
                className="mt-3 text-base md:text-lg"
                style={{ color: "rgba(255,255,255,0.72)", letterSpacing: "-0.2px" }}
              >
                {repairType.subtitle}
              </p>
            )}

            <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
              {normalizeTrustBadges(repairType.trust_badges).map((label) => {
                const Icon = getBadgeIcon(label);
                return (
                <span
                  key={label}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-medium"
                  style={{
                    background: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    letterSpacing: "-0.1px",
                  }}
                >
                  <Icon size={13} style={{ color: "#0071e3" }} />
                  {label}
                </span>
                );
              })}
            </div>
          </div>
        </section>

        <div className="max-w-5xl mx-auto px-4 py-10 flex flex-col gap-8">
          {/* Price + CTA card */}
          <AnimatedCard>
            <div
              className="bg-white rounded-[24px] overflow-hidden"
              style={{ boxShadow: "rgba(0,0,0,0.08) 0px 6px 24px 0px" }}
            >
              <div className="grid md:grid-cols-[1fr_0.9fr] gap-8 md:gap-10 p-6 md:p-10 items-center">
                <div>
                  <p
                    className="text-[10px] font-semibold uppercase tracking-wider mb-2"
                    style={{ color: "rgba(0,0,0,0.40)" }}
                  >
                    מחיר לתיקון
                  </p>
                  <div className="flex items-baseline gap-2 mb-4">
                    <span
                      className="text-[48px] md:text-[56px] font-bold text-[#1d1d1f] tabular-nums leading-none"
                      style={{ letterSpacing: "-1px" }}
                      aria-label={`מחיר ${modelRepair.price} שקלים חדשים`}
                    >
                      ₪{modelRepair.price}
                    </span>
                    {modelRepair.duration_min && (
                      <span
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[12px] font-medium"
                        style={{ background: "#f5f5f7", color: "rgba(0,0,0,0.56)" }}
                      >
                        <Clock size={11} />
                        {modelRepair.duration_min < 60
                          ? `${modelRepair.duration_min} דקות`
                          : `${Math.round(modelRepair.duration_min / 60)} שעות`}
                      </span>
                    )}
                  </div>
                  <p
                    className="text-[14px] mb-6 whitespace-pre-line"
                    style={{ color: "rgba(0,0,0,0.56)", lineHeight: 1.6 }}
                  >
                    {repairType.description?.trim() || "מחיר סופי, ללא הפתעות. כולל חלק, עבודה ובדיקה מקיפה."}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <AddToCartButton item={cartItem} />
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 h-11 px-5 rounded-[10px] text-sm font-medium text-white transition-all"
                      style={{
                        background: "#25d366",
                        letterSpacing: "-0.2px",
                        boxShadow: "rgba(37,211,102,0.25) 0px 4px 12px",
                      }}
                    >
                      <MessageCircle size={16} />
                      שאל ב-WhatsApp
                    </a>
                  </div>
                </div>

                <div className="relative flex items-center justify-center order-first md:order-last">
                  <div
                    className="relative w-full max-w-[280px] aspect-square rounded-[24px] flex items-center justify-center overflow-hidden"
                    style={{
                      background:
                        "linear-gradient(135deg, #f5f5f7 0%, #ffffff 60%, #eef2ff 100%)",
                    }}
                  >
                    {model.image_url ? (
                      <Image
                        src={model.image_url}
                        alt={model.alt_text ?? `${repairType.name} ל${model.name}`}
                        width={240}
                        height={240}
                        className="object-contain w-full h-full p-6"
                        priority
                      />
                    ) : (
                      <span className="text-6xl font-bold" style={{ color: "rgba(0,0,0,0.15)" }}>
                        {brand.name.charAt(0)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </AnimatedCard>

          {/* Related repairs for same model */}
          {related.length > 0 && (
            <div>
              <div className="flex items-baseline justify-between mb-4 px-1">
                <h2
                  className="text-[11px] font-semibold uppercase tracking-widest"
                  style={{ color: "rgba(0,0,0,0.6)" }}
                >
                  תיקונים נוספים ל-{model.name}
                </h2>
                <Link
                  href={`/repairs/${brand.slug}/${model.slug}`}
                  className="text-[12px] font-medium text-[#0071e3] hover:underline"
                >
                  כל התיקונים
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {related.map((r, i) => (
                  <AnimatedCard key={r.id} delay={i * 50}>
                    <Link
                      href={`/repairs/${brand.slug}/${model.slug}/${r.slug}`}
                      className="group flex items-center justify-between gap-3 bg-white rounded-[14px] p-4 transition-all hover:-translate-y-0.5"
                      style={{ boxShadow: "rgba(0,0,0,0.06) 0px 2px 10px 0px" }}
                    >
                      <div className="flex-1 min-w-0">
                        <p
                          className="font-semibold text-[14px] text-[#1d1d1f] truncate"
                          style={{ letterSpacing: "-0.2px" }}
                        >
                          {r.name}
                        </p>
                        <p
                          className="text-[12px] mt-0.5"
                          style={{ color: "rgba(0,0,0,0.6)" }}
                        >
                          אחריות 90 יום
                        </p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span
                          className="text-[18px] font-bold text-[#1d1d1f] tabular-nums"
                          style={{ letterSpacing: "-0.3px" }}
                        >
                          ₪{r.price}
                        </span>
                        <ChevronRight
                          size={14}
                          className="text-[#0071e3] transition-transform group-hover:-translate-x-0.5"
                          style={{ transform: "rotate(180deg)" }}
                        />
                      </div>
                    </Link>
                  </AnimatedCard>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
      <WhatsAppFab />
      <CartStickyBar />
      <JsonLd data={jsonLdData} />
      <JsonLd data={breadcrumbData} />
    </>
  );
}
