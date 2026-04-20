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
import { generateModelMetadata, repairServiceSchema } from "@/lib/seo";
import AddToCartButton from "./AddToCartButton";
import CartStickyBar from "./CartStickyBar";
import { getRepairVisual } from "@/lib/repairIcons";
import {
  Clock,
  ShieldCheck,
  Zap,
  Award,
  ChevronRight,
  MessageCircle,
} from "lucide-react";

export const revalidate = 3600;
export const dynamicParams = true;

type Props = { params: Promise<{ brand: string; model: string }> };

export async function generateStaticParams() {
  const supabase = createStaticClient();
  const { data: models } = await supabase
    .from("models")
    .select("slug, brands!inner(slug)")
    .eq("is_active", true);

  return (models ?? []).flatMap((m) => {
    const brandSlug =
      Array.isArray(m.brands) ? m.brands[0]?.slug : (m.brands as { slug: string } | null)?.slug;
    if (!brandSlug) return [];
    return [{ brand: brandSlug, model: m.slug }];
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { brand: brandSlug, model: modelSlug } = await params;
  const supabase = await createClient();

  const { data: model } = await supabase
    .from("models")
    .select("name, slug, seo_title, seo_description, image_url, alt_text, brands!inner(name, slug)")
    .eq("slug", modelSlug)
    .eq("is_active", true)
    .single();

  if (!model) return {};

  const brandName = Array.isArray(model.brands)
    ? model.brands[0]?.name
    : (model.brands as { name: string; slug: string } | null)?.name;

  return generateModelMetadata({
    brandName: brandName ?? "",
    modelName: model.name,
    modelSlug: model.slug,
    brandSlug,
    seoTitle: model.seo_title,
    seoDescription: model.seo_description,
    imageUrl: model.image_url,
    altText: model.alt_text,
  });
}

export default async function ModelPage({ params }: Props) {
  const { brand: brandSlug, model: modelSlug } = await params;
  const supabase = await createClient();

  const { data: model } = await supabase
    .from("models")
    .select("id, name, slug, image_url, alt_text, brands!inner(id, name, slug)")
    .eq("slug", modelSlug)
    .eq("is_active", true)
    .single();

  if (!model) notFound();

  const brand = Array.isArray(model.brands)
    ? model.brands[0]
    : (model.brands as { id: string; name: string; slug: string } | null);

  if (!brand || brand.slug !== brandSlug) notFound();

  const { data: modelRepairs } = await supabase
    .from("model_repairs")
    .select("id, price, duration_min, repair_types!inner(id, name, slug)")
    .eq("model_id", model.id)
    .eq("is_active", true)
    .order("price");

  const repairs = (modelRepairs ?? []).map((r) => {
    const repairType = Array.isArray(r.repair_types)
      ? r.repair_types[0]
      : (r.repair_types as { id: string; name: string; slug: string } | null);
    return {
      id: r.id,
      price: r.price,
      duration_min: r.duration_min as number | null,
      name: repairType?.name ?? "",
      slug: repairType?.slug ?? "",
    };
  });

  const minPrice = repairs.length > 0 ? Math.min(...repairs.map((r) => r.price)) : 0;
  const durations = repairs
    .map((r) => r.duration_min)
    .filter((d): d is number => typeof d === "number" && d > 0);
  const minDuration = durations.length > 0 ? Math.min(...durations) : 0;

  const jsonLdData = repairServiceSchema({
    modelName: model.name,
    brandName: brand.name,
    repairs: repairs.map((r) => ({ name: r.name, price: r.price })),
    modelSlug: model.slug,
    brandSlug: brand.slug,
  });

  return (
    <>
      <Header />
      <main className="flex-1 bg-[#f5f5f7] pb-24">
        {/* Hero */}
        <section
          className="relative text-white py-14 px-4 text-center overflow-hidden"
          style={{
            background:
              "radial-gradient(circle at 50% 0%, #2a2a2d 0%, #1d1d1f 60%)",
          }}
        >
          <div className="max-w-5xl mx-auto">
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
              <span style={{ color: "rgba(255,255,255,0.85)" }}>{model.name}</span>
            </nav>
            <h1
              className="text-3xl md:text-5xl font-bold"
              style={{ lineHeight: 1.05, letterSpacing: "-0.4px" }}
            >
              תיקון {model.name}
            </h1>

            {/* Trust chips */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
              {[
                { Icon: ShieldCheck, label: "אחריות 90 יום" },
                { Icon: Zap, label: "שירות ביום פנייה" },
                { Icon: Award, label: "חלקים מקוריים" },
              ].map(({ Icon, label }) => (
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
              ))}
            </div>
          </div>
        </section>

        <div className="max-w-5xl mx-auto px-4 py-10 flex flex-col gap-8">
          {/* Info hero card */}
          <AnimatedCard>
            <div
              className="relative bg-white rounded-[24px] overflow-hidden"
              style={{ boxShadow: "rgba(0,0,0,0.08) 0px 6px 24px 0px" }}
            >
              {/* Decorative gradient blob */}
              <div
                className="absolute -top-24 -left-24 w-80 h-80 rounded-full opacity-60 pointer-events-none"
                style={{
                  background: "radial-gradient(circle, rgba(0,113,227,0.08), transparent 70%)",
                }}
              />

              <div className="relative p-6 md:p-10 grid md:grid-cols-[1.1fr_0.9fr] gap-8 md:gap-12 items-center">
                {/* Info (right in RTL) */}
                <div className="order-2 md:order-1">
                  <div className="flex items-center gap-2 mb-3">
                    <span
                      className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest"
                      style={{
                        background: "rgba(0,113,227,0.1)",
                        color: "#0071e3",
                      }}
                    >
                      {brand.name}
                    </span>
                  </div>

                  <h2
                    className="text-[28px] md:text-[40px] font-bold text-[#1d1d1f] mb-5"
                    style={{ letterSpacing: "-0.6px", lineHeight: 1.05 }}
                  >
                    {model.name}
                  </h2>

                  {repairs.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 md:gap-3">
                      <div
                        className="rounded-[14px] p-3 md:p-4"
                        style={{
                          background: "linear-gradient(135deg, #f5f5f7 0%, #fafafa 100%)",
                        }}
                      >
                        <p
                          className="text-[22px] md:text-[26px] font-bold text-[#1d1d1f] tabular-nums leading-none"
                          style={{ letterSpacing: "-0.4px" }}
                        >
                          {repairs.length}
                        </p>
                        <p
                          className="text-[11px] mt-1.5 font-medium"
                          style={{ color: "rgba(0,0,0,0.56)" }}
                        >
                          תיקונים זמינים
                        </p>
                      </div>
                      <div
                        className="rounded-[14px] p-3 md:p-4"
                        style={{
                          background: "linear-gradient(135deg, rgba(0,113,227,0.08) 0%, rgba(0,113,227,0.03) 100%)",
                        }}
                      >
                        <p
                          className="text-[22px] md:text-[26px] font-bold text-[#0071e3] tabular-nums leading-none"
                          style={{ letterSpacing: "-0.4px" }}
                        >
                          ₪{minPrice}
                        </p>
                        <p
                          className="text-[11px] mt-1.5 font-medium"
                          style={{ color: "rgba(0,0,0,0.56)" }}
                        >
                          החל מ-
                        </p>
                      </div>
                      <div
                        className="rounded-[14px] p-3 md:p-4"
                        style={{
                          background: "linear-gradient(135deg, #f5f5f7 0%, #fafafa 100%)",
                        }}
                      >
                        <p
                          className="text-[22px] md:text-[26px] font-bold text-[#1d1d1f] tabular-nums leading-none"
                          style={{ letterSpacing: "-0.4px" }}
                        >
                          {minDuration > 0
                            ? minDuration < 60
                              ? `${minDuration} דק׳`
                              : `${(minDuration / 60).toFixed(minDuration % 60 === 0 ? 0 : 1)} שע׳`
                            : "—"}
                        </p>
                        <p
                          className="text-[11px] mt-1.5 font-medium"
                          style={{ color: "rgba(0,0,0,0.56)" }}
                        >
                          תיקון מהיר מ-
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Product image (left in RTL — larger, tilted backdrop) */}
                <div className="order-1 md:order-2 relative flex items-center justify-center">
                  <div
                    className="relative w-full max-w-[320px] aspect-square rounded-[24px] flex items-center justify-center overflow-hidden"
                    style={{
                      background:
                        "linear-gradient(135deg, #f5f5f7 0%, #ffffff 60%, #eef2ff 100%)",
                    }}
                  >
                    {/* Subtle glow behind phone */}
                    <div
                      className="absolute inset-8 rounded-full opacity-50 pointer-events-none"
                      style={{
                        background: "radial-gradient(circle, rgba(0,113,227,0.12), transparent 65%)",
                      }}
                    />
                    {model.image_url ? (
                      <Image
                        src={model.image_url}
                        alt={model.alt_text ?? model.name}
                        width={280}
                        height={280}
                        className="relative object-contain w-full h-full p-6"
                        priority
                      />
                    ) : (
                      <span className="relative text-7xl font-bold" style={{ color: "rgba(0,0,0,0.15)" }}>
                        {brand.name.charAt(0)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </AnimatedCard>

          {/* Repair list */}
          {repairs.length === 0 ? (
            <div
              className="bg-white rounded-[16px] p-10 text-center"
              style={{ boxShadow: "rgba(0,0,0,0.08) 0px 6px 24px 0px" }}
            >
              <p style={{ color: "rgba(0,0,0,0.48)" }}>
                אין תיקונים זמינים לדגם זה כרגע
              </p>
              <Link
                href={`/repairs/${brand.slug}`}
                className="inline-block mt-3 text-sm text-[#0066cc] hover:underline"
              >
                חזרה לדגמי {brand.name}
              </Link>
            </div>
          ) : (
            <div>
              <div className="flex items-baseline justify-between mb-4 px-1">
                <h3
                  className="text-[11px] font-semibold uppercase tracking-widest"
                  style={{ color: "rgba(0,0,0,0.48)" }}
                >
                  תיקונים ומחירים
                </h3>
                <span
                  className="text-[11px] font-medium"
                  style={{ color: "rgba(0,0,0,0.40)" }}
                >
                  {repairs.length} אפשרויות
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {repairs.map((repair, i) => {
                  const { Icon, accent, bg } = getRepairVisual(repair.name);
                  return (
                    <AnimatedCard key={repair.id} delay={i * 60}>
                      <div
                        className="group relative bg-white rounded-[18px] p-5 h-full flex flex-col transition-all duration-200 hover:-translate-y-0.5"
                        style={{ boxShadow: "rgba(0,0,0,0.06) 0px 2px 10px 0px" }}
                        onMouseEnter={undefined}
                      >
                        {/* Top row: icon + duration chip */}
                        <div className="flex items-start justify-between mb-4">
                          <div
                            className="w-12 h-12 rounded-[14px] flex items-center justify-center transition-transform group-hover:scale-105"
                            style={{ background: bg }}
                          >
                            <Icon size={22} style={{ color: accent }} strokeWidth={2} />
                          </div>
                          {repair.duration_min && (
                            <span
                              className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-medium"
                              style={{
                                background: "#f5f5f7",
                                color: "rgba(0,0,0,0.56)",
                              }}
                            >
                              <Clock size={10} />
                              {repair.duration_min < 60
                                ? `${repair.duration_min} דקות`
                                : `${Math.round(repair.duration_min / 60)} שעות`}
                            </span>
                          )}
                        </div>

                        {/* Name */}
                        <Link
                          href={`/repairs/${brand.slug}/${model.slug}/${repair.slug}`}
                          className="font-semibold text-[16px] text-[#1d1d1f] mb-1 hover:text-[#0071e3] transition-colors"
                          style={{ letterSpacing: "-0.2px", lineHeight: 1.3 }}
                        >
                          {repair.name}
                        </Link>
                        <p
                          className="text-[12px] mb-5"
                          style={{ color: "rgba(0,0,0,0.48)" }}
                        >
                          אחריות 90 יום · חלק מקורי
                        </p>

                        {/* Spacer */}
                        <div className="flex-1" />

                        {/* Bottom row: price + CTA */}
                        <div className="flex items-center justify-between gap-3 pt-4 border-t" style={{ borderColor: "#f5f5f7" }}>
                          <div>
                            <p
                              className="text-[10px] font-semibold uppercase tracking-wider"
                              style={{ color: "rgba(0,0,0,0.40)" }}
                            >
                              מחיר
                            </p>
                            <p
                              className="text-[24px] font-bold text-[#1d1d1f] tabular-nums leading-none mt-0.5"
                              style={{ letterSpacing: "-0.5px" }}
                              aria-label={`מחיר ${repair.price} שקלים`}
                            >
                              ₪{repair.price}
                            </p>
                          </div>
                          <AddToCartButton
                            item={{
                              modelRepairId: repair.id,
                              modelId: model.id,
                              modelName: model.name,
                              brandName: brand.name,
                              repairName: repair.name,
                              price: repair.price,
                            }}
                          />
                        </div>

                        {/* Accent border on hover */}
                        <div
                          className="absolute inset-0 rounded-[18px] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"
                          style={{
                            boxShadow: `inset 0 0 0 1.5px ${accent}20`,
                          }}
                        />
                      </div>
                    </AnimatedCard>
                  );
                })}
              </div>
            </div>
          )}

          {/* WhatsApp CTA */}
          <AnimatedCard>
            <div
              className="bg-white rounded-[16px] p-5 md:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-r-4 border-emerald-500"
              style={{ boxShadow: "rgba(0,0,0,0.08) 0px 6px 24px 0px" }}
            >
              <div className="flex items-center gap-4">
                <div
                  className="flex-shrink-0 w-11 h-11 rounded-full bg-emerald-50 flex items-center justify-center"
                >
                  <MessageCircle size={20} className="text-emerald-600" />
                </div>
                <div>
                  <p
                    className="font-semibold text-[15px] text-[#1d1d1f]"
                    style={{ letterSpacing: "-0.1px" }}
                  >
                    לא מצאת את מה שחיפשת?
                  </p>
                  <p
                    className="text-[13px] mt-0.5"
                    style={{ color: "rgba(0,0,0,0.56)" }}
                  >
                    שלח לנו הודעה ונחזור אליך עם מחיר מותאם אישית
                  </p>
                </div>
              </div>
              <a
                href={`https://wa.me/972547723281?text=${encodeURIComponent(`היי, אשמח לשאול על תיקון ${model.name}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 inline-flex items-center gap-1.5 h-11 px-5 rounded-[10px] text-sm font-medium text-white transition-all shadow-[0_1px_2px_rgba(0,113,227,0.3)] hover:shadow-[0_4px_12px_rgba(0,113,227,0.35)] focus-visible:outline-2 focus-visible:outline-[#0071e3]"
                style={{ background: "#0071e3", letterSpacing: "-0.224px" }}
              >
                שלח הודעה ב-WhatsApp
                <ChevronRight size={16} style={{ transform: "rotate(180deg)" }} />
              </a>
            </div>
          </AnimatedCard>
        </div>
      </main>
      <Footer />
      <WhatsAppFab />
      <CartStickyBar />
      <JsonLd data={jsonLdData} />
    </>
  );
}
