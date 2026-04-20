import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppFab from "@/components/layout/WhatsAppFab";
import AnimatedCard from "@/components/repairs/AnimatedCard";
import JsonLd from "@/components/seo/JsonLd";
import { createClient } from "@/lib/supabase/server";
import { createStaticClient } from "@/lib/supabase/static";
import { generateRepairServiceListMetadata, singleRepairListSchema } from "@/lib/seo";
import { normalizeTrustBadges, getBadgeIcon } from "@/lib/trustBadges";
import CartStickyBar from "../../[brand]/[model]/CartStickyBar";
import ServiceModelList from "./ServiceModelList";

export const revalidate = 3600;
export const dynamicParams = true;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const supabase = createStaticClient();
  const { data } = await supabase.from("repair_types").select("slug");
  return (data ?? []).map((r) => ({ slug: r.slug }));
}

async function loadServiceData(slug: string) {
  const supabase = await createClient();

  const { data: repairType } = await supabase
    .from("repair_types")
    .select("id, name, slug, subtitle, description, trust_badges")
    .eq("slug", slug)
    .single();
  if (!repairType) return null;

  const { data: rows } = await supabase
    .from("model_repairs")
    .select(
      "id, price, duration_min, models!inner(id, name, slug, is_active, sort_order, brands!inner(id, name, slug, sort_order))"
    )
    .eq("repair_type_id", repairType.id)
    .eq("is_active", true);

  type Entry = {
    modelRepairId: string;
    price: number;
    duration_min: number | null;
    brandName: string;
    brandSlug: string;
    brandSortOrder: number;
    modelName: string;
    modelSlug: string;
    modelSortOrder: number;
  };

  const entries: Entry[] = [];
  for (const r of rows ?? []) {
    const model = Array.isArray(r.models) ? r.models[0] : r.models;
    if (!model || !model.is_active) continue;
    const brand = Array.isArray(model.brands) ? model.brands[0] : model.brands;
    if (!brand) continue;
    entries.push({
      modelRepairId: r.id,
      price: r.price,
      duration_min: (r.duration_min as number | null) ?? null,
      brandName: brand.name,
      brandSlug: brand.slug,
      brandSortOrder: brand.sort_order ?? 0,
      modelName: model.name,
      modelSlug: model.slug,
      modelSortOrder: model.sort_order ?? 0,
    });
  }

  return { repairType, entries };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const data = await loadServiceData(slug);
  if (!data) return {};
  return generateRepairServiceListMetadata({
    repairName: data.repairType.name,
    repairSlug: data.repairType.slug,
    description: data.repairType.description,
  });
}

export default async function RepairServicePage({ params }: Props) {
  const { slug } = await params;
  const data = await loadServiceData(slug);
  if (!data) notFound();

  const { repairType, entries } = data;
  const badges = normalizeTrustBadges(repairType.trust_badges);

  const schemaData = singleRepairListSchema({
    repairName: repairType.name,
    repairSlug: repairType.slug,
    entries: entries.map((e) => ({
      brandName: e.brandName,
      brandSlug: e.brandSlug,
      modelName: e.modelName,
      modelSlug: e.modelSlug,
      price: e.price,
    })),
  });

  return (
    <>
      <Header />
      <main className="flex-1 bg-[#f5f5f7] pb-24">
        {/* Hero */}
        <section
          className="relative text-white py-12 px-4 overflow-hidden"
          style={{
            background: "radial-gradient(circle at 50% 0%, #2a2a2d 0%, #1d1d1f 60%)",
          }}
        >
          <div className="max-w-5xl mx-auto text-center">
            <nav className="text-xs mb-5" style={{ color: "rgba(255,255,255,0.5)" }}>
              <Link href="/" className="hover:text-white transition-colors">
                דף הבית
              </Link>
              {" / "}
              <Link href="/repairs" className="hover:text-white transition-colors">
                תיקונים
              </Link>
              {" / "}
              <span style={{ color: "rgba(255,255,255,0.85)" }}>{repairType.name}</span>
            </nav>
            <h1
              className="text-3xl md:text-5xl font-bold"
              style={{ lineHeight: 1.05, letterSpacing: "-0.4px" }}
            >
              {repairType.name}
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
              {badges.map((label) => {
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
          {/* Description */}
          {repairType.description && (
            <AnimatedCard>
              <div
                className="bg-white rounded-[18px] p-6 md:p-8"
                style={{ boxShadow: "rgba(0,0,0,0.06) 0px 2px 10px 0px" }}
              >
                <p
                  className="text-[15px] leading-relaxed whitespace-pre-line"
                  style={{ color: "rgba(0,0,0,0.72)", letterSpacing: "-0.1px" }}
                >
                  {repairType.description}
                </p>
              </div>
            </AnimatedCard>
          )}

          {entries.length === 0 ? (
            <div
              className="bg-white rounded-[16px] p-10 text-center"
              style={{ boxShadow: "rgba(0,0,0,0.06) 0px 2px 10px 0px" }}
            >
              <p style={{ color: "rgba(0,0,0,0.48)" }}>
                אין כרגע דגמים זמינים לתיקון זה
              </p>
              <Link
                href="/repairs"
                className="inline-block mt-3 text-sm text-[#0071e3] hover:underline"
              >
                חזרה לכל התיקונים
              </Link>
            </div>
          ) : (
            <ServiceModelList
              entries={entries}
              repairName={repairType.name}
              repairSlug={repairType.slug}
            />
          )}
        </div>
      </main>
      <Footer />
      <WhatsAppFab />
      <CartStickyBar />
      <JsonLd data={schemaData} />
    </>
  );
}
