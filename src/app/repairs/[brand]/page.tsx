import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppFab from "@/components/layout/WhatsAppFab";
import JsonLd from "@/components/seo/JsonLd";
import BrandModelGrid from "@/components/repairs/BrandModelGrid";
import { createClient } from "@/lib/supabase/server";
import { createStaticClient } from "@/lib/supabase/static";
import { generateBrandMetadata, localBusinessSchema } from "@/lib/seo";
import { isIPhoneModel, isIPadModel } from "@/lib/utils";

export const revalidate = 3600;
export const dynamicParams = true; // render on-demand if not pre-built

type Props = { params: Promise<{ brand: string }> };

export async function generateStaticParams() {
  const supabase = createStaticClient();
  const { data } = await supabase.from("brands").select("slug");
  return (data ?? []).map((b) => ({ brand: b.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { brand: brandSlug } = await params;
  const supabase = await createClient();
  const { data: brand } = await supabase
    .from("brands")
    .select("name")
    .eq("slug", brandSlug)
    .single();
  if (!brand) return {};
  return generateBrandMetadata(brand.name);
}

export default async function BrandPage({ params }: Props) {
  const { brand: brandSlug } = await params;
  const supabase = await createClient();

  const { data: brand } = await supabase
    .from("brands")
    .select("id, name, slug")
    .eq("slug", brandSlug)
    .single();

  if (!brand) notFound();

  const { data: models } = await supabase
    .from("models")
    .select("id, name, slug, image_url, alt_text")
    .eq("brand_id", brand.id)
    .eq("is_active", true)
    .order("sort_order");

  const list = models ?? [];
  const hasIPhone = list.some((m) => isIPhoneModel(m.name));
  const hasIPad = list.some((m) => isIPadModel(m.name));
  const showLineTabs = hasIPhone || hasIPad;

  return (
    <>
      <Header />
      <main className="flex-1 bg-[#f5f5f7]">
        {/* Breadcrumb + hero */}
        <section className="bg-[#1d1d1f] text-white py-12 px-4 text-center">
          <nav className="text-xs mb-4" style={{ color: "rgba(255,255,255,0.5)" }}>
            <Link href="/repairs" className="hover:text-white transition-colors">
              תיקונים
            </Link>
            {" / "}
            <span>{brand.name}</span>
          </nav>
          <h1
            className="text-3xl md:text-4xl font-bold"
            style={{ lineHeight: 1.07, letterSpacing: "-0.28px" }}
          >
            תיקון {brand.name}
          </h1>
          <p
            className="mt-2 text-base font-light"
            style={{ color: "rgba(255,255,255,0.7)", letterSpacing: "-0.374px" }}
          >
            בחר דגם לצפייה במחירי התיקון
          </p>
        </section>

        {/* Model grid */}
        <section className="max-w-5xl mx-auto px-4 py-12">
          <BrandModelGrid
            models={list}
            brandSlug={brand.slug}
            brandName={brand.name}
            showLineTabs={showLineTabs}
          />
        </section>
      </main>
      <Footer />
      <WhatsAppFab />
      <JsonLd data={localBusinessSchema()} />
    </>
  );
}
