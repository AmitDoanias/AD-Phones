# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A&D Phones - a full-stack website for a phone repair business (iPhones, iPads, Samsung) **plus an eCommerce store for accessories and devices**. Hebrew-only (RTL), live in production at `ad-phones.co.il`.

The site has two parallel customer flows:
1. **Repair bookings** (original) — customer picks a model + repair type, schedules a booking, pays in person
2. **Shop** (in development on `feature/shop` branch) — customer buys accessories/devices, pays online via PayPlus, ships to home

These flows share the same auth, dashboard, image upload, email infrastructure, and Supabase RLS patterns — but use separate schemas, separate carts, and separate API routes.

## Tech Stack

- **Framework:** Next.js 15+ (App Router) with TypeScript
- **Styling:** Tailwind CSS (RTL-first)
- **Database:** Supabase (PostgreSQL + Auth + RLS)
- **Images:** Cloudinary (for catalog, blog, shop products)
- **Hosting:** Vercel
- **Email:** Resend
- **Markdown:** react-markdown + remark-gfm (blog & shop product descriptions)
- **HTML sanitization:** sanitize-html (server-side only — DOMPurify caused jsdom issues on Vercel)
- **Analytics:** Google Analytics 4 (gated by cookie consent)
- **Reviews:** Elfsight (Google Reviews widget, lazy-loaded on viewport)

## Commands

```bash
npm run dev          # Start dev server (localhost:3000)
npm run build        # Production build
npm run lint         # ESLint
npm run type-check   # TypeScript check (tsc --noEmit)
```

## Architecture

### Routing (App Router)

**Public:**
- `/` - Homepage (SSG, revalidate 3600). Includes `DeviceFirstRepairs` (iPhone/iPad/Samsung tabs with model search) and brand strip.
- `/repairs` - Brand selector (3 hardcoded line cards: iPhone → /repairs/iphone, iPad → /repairs/ipad, Samsung → /repairs/samsung)
- `/repairs/iphone` `/repairs/ipad` `/repairs/samsung` - Static line landing pages with `LineRepairPage` + line-specific FAQs from `line_faqs` table
- `/repairs/[brand]/[model]` - Single model with all repairs (`/repairs/apple/iphone-14-pro` etc.)
- `/repairs/[brand]/[model]/[repair]` - Single repair (deep link)
- `/cart`, `/booking` - Repair cart (client-side, localStorage)
- `/track/[bookingId]` - Public booking status (SSR, UUID-based)
- `/blog`, `/blog/[slug]` - Blog (Hebrew slugs supported, sanitized HTML or markdown)
- `/privacy`, `/cookies`, `/accessibility` - Legal pages (lawyer-style with Israeli law citations)
- `/contact` - Contact form
- **Shop (in development on `feature/shop`):**
  - `/shop` - Main catalog
  - `/shop/category/[slug]` - Products by category
  - `/shop/product/[slug]` - Single product
  - `/shop/cart`, `/shop/checkout`
  - `/shop/order/[id]/confirmation`, `/track/order/[id]`

**Admin (protected by `middleware.ts`):**
- `/dashboard` - Overview (stats, recent activity)
- `/dashboard/bookings`, `/dashboard/bookings/[id]` - Repair booking management
- `/dashboard/leads` - Contact form leads
- `/dashboard/repairs/*` - Brand/model/repair_type CRUD, model_repair pricing
- `/dashboard/blog`, `/dashboard/blog/[id]`, `/dashboard/blog/new` - Blog editor with markdown/HTML, SEO scoring
- `/dashboard/faqs` - Per-line FAQ management (iPhone/iPad/Samsung)
- `/dashboard/calendar` - Block unavailable slots
- **Shop admin (in development):**
  - `/dashboard/shop/products` (list + edit + new)
  - `/dashboard/shop/categories` (tree view CRUD)
  - `/dashboard/shop/orders` (list + detail with status updates)
  - `/dashboard/shop/shipping` (Shopify-style methods)

### Auth

Single admin user via Supabase Auth. `middleware.ts` guards all `/dashboard/*` routes. No customer accounts exist anywhere in the system — both repair bookings AND shop orders use guest checkout with UUID-based tracking links. API routes check `supabase.auth.getUser()` for admin operations.

### Data Flow

- **Catalog:** Supabase → SSG pages with ISR. Admin mutations call `revalidatePath()` to bust cache.
- **Repair cart:** React context (`CartProvider` in `src/components/cart/CartProvider.tsx`) persisted to localStorage as `ad_cart`. Becomes a `bookings` + `booking_items` record on submission. **No quantity** — each model_repair appears at most once.
- **Shop cart (in development):** Separate context (`ShopCartContext`), localStorage key `ad_shop_cart`. Has quantity controls (unlike repair cart). Submission creates `shop_orders` + `shop_order_items` and a PayPlus payment session.
- **Bookings:** Public POST creates booking → admin email + customer confirmation email (if email provided) → WhatsApp link. Status tracked by UUID at `/track/[bookingId]`.
- **Shop orders:** Public POST creates order → PayPlus hosted payment page redirect → webhook updates `payment_status` → DB trigger decrements `stock_qty` → email to customer + admin.

### Key Schema Patterns

**Repairs (existing):**
- `repair_types` are shared across models
- Prices set per model+repair in `model_repairs` junction
- `booking_items` denormalize model/repair names and price at booking time

**Shop (new, on `feature/shop` branch):**
- `shop_categories` — hierarchical (`parent_id` self-ref)
- `shop_products` — single record per SKU. Pricing stored INCL VAT. `cost_price` is internal-only (admin profit calc). `gallery_urls` and `compatible_with` are JSONB arrays. `attributes` is JSONB key-value.
- `shop_shipping_methods` — Shopify-style with `free_above_amount`, `min/max_order_amount`. Admin can define any number.
- `shop_orders` — uses sequence-backed `order_number` (AD-1001+) via trigger. Snapshot of `shipping_method_name` and per-item product snapshots for historical accuracy.
- `shop_order_items` — denormalize product name/SKU/image at order time.

RLS pattern across all tables: `public_read` (`is_active = true`) + `admin_all` (`auth.role() = 'authenticated'`). Shop orders also have `public_create` and `public_read` (security via UUID secrecy — `/track/order/[uuid]`).

### Supabase Clients

- `lib/supabase/client.ts` - Browser client (public pages, cart)
- `lib/supabase/server.ts` - Server client (SSG/SSR, API routes with user context)
- `lib/supabase/admin.ts` - Service-role client (webhooks, cron jobs)

### Language & RTL

All UI text is hardcoded in Hebrew. No i18n framework. Root layout sets `dir="rtl"` and `lang="he"`. Heebo font from Google Fonts (weights: 300, 400, 500, 700 — kept lean for performance).

### HTML Sanitization

Blog HTML and shop product descriptions go through `sanitizeBlogHtml` from `src/lib/htmlSanitizer.ts` (sanitize-html package, NOT DOMPurify — jsdom is fragile on Vercel serverless). Sanitization runs at API save time AND at render time (defense-in-depth, since the editor preview renders unsaved input).

### Cookie Consent

`src/lib/cookieConsent.ts` manages user consent (`ad_cookie_consent_v1` localStorage key) with categories: `essential`, `analytics`, `marketing`. Dispatches `cookie-consent-updated` events on save. **Any tracking script (GA, FB Pixel, etc.) MUST be gated by `hasConsent('analytics')` or `hasConsent('marketing')`** — otherwise we lie in our cookie banner (Israeli Privacy Protection Law violation).

## Integrations

- **Google Analytics 4** (`G-Z1SG898B35`) — `src/components/analytics/GoogleAnalytics.tsx`. Loads gtag.js dynamically (DOM injection in useEffect, NOT next/script — more reliable for conditional-after-interaction load). Gated by `hasConsent('analytics')`. Configured with `anonymize_ip` and `cookie_flags: 'SameSite=None;Secure'`.
- **Google Search Console** — verified via GA. Sitemap submitted at `https://ad-phones.co.il/sitemap.xml`.
- **Resend** — admin booking notifications + customer confirmations (when email is provided). Templates in `src/lib/email.ts`. Currently sends from `onboarding@resend.dev` for customer-facing emails (deferred until DNS migration to Cloudflare).
- **WhatsApp:** `wa.me` deeplinks throughout (no Business API integration). Phone: `+972534832573`.
- **Cloudinary:** Upload via `/api/upload` (auth-gated, 5MB limit). Folder convention: `ad-phones/blog`, `ad-phones/models`, `ad-phones/shop-products`.
- **Elfsight** (Google Reviews widget) — `src/components/home/ElfsightReviews.tsx`. Lazy-loaded via IntersectionObserver to keep initial JS light.
- **PayPlus** (in development) — Israeli payment gateway with Apple Pay + Google Pay support. Hosted payment page (no card data on our servers). Webhook at `/api/shop/payment/webhook` updates payment_status. Abstraction in `src/lib/payments/payplus.ts` behind `PaymentProvider` interface so swapping providers is config, not rewrite.

## Performance Notes

- **Mobile Lighthouse:** ~95. Drove this up by removing `remotion` (1.8MB dep used for `interpolate()` only — replaced with CSS transitions in `AnimatedCard`), lazy-loading Elfsight, fixing contrast.
- **Desktop Lighthouse:** ~77. The remaining gap is mostly long main-thread tasks from third-party scripts; a `willChange` bug in `AnimatedCard` was the last desktop-specific regression (allocated 22 GPU layers upfront — fixed by removing the hint).
- **AnimatedCard pattern:** CSS opacity+transform transitions only. **Never** use RAF loops with per-frame `setState` (causes huge TBT when many cards trigger simultaneously on desktop's tall viewport).

## Performance / Architectural Caveats

- **Apple is a single brand** in the `brands` table (slug=`apple`). The iPhone/iPad split is by name pattern — `isIPhoneModel` / `isIPadModel` from `src/lib/utils.ts`. Brand cards on `/repairs` and the homepage strip use **hardcoded line entries** (iPhone/iPad/Samsung) that route to the static landing pages, NOT the dynamic `[brand]` route. Otherwise users hit `/repairs/apple` which has no FAQs.
- **Customer emails are deferred** until DNS migration to Cloudflare (Livedns doesn't support MX on subdomains). Until then, customer-facing emails fall back to `onboarding@resend.dev`. The Resend API integration code is complete; it's a DNS issue.
- **Shop is in development on `feature/shop` branch**. Do not merge to `dev` or `main` until the user explicitly approves at end of project.

## Project State (Updated 2026-05-06)

**Live in production:**
- Repairs catalog (Apple + Samsung)
- Booking flow (admin email working, customer email deferred)
- Blog (1 post live, 2 more drafted)
- Legal pages (Privacy / Cookies / Accessibility) + consent banner + accessibility toolbar
- Custom 404
- GA4 + GSC + sitemap
- DeviceFirstRepairs section + bilingual search
- 9 migrations applied (001-008 via Supabase initial setup, 006 line_faqs applied separately)

**On `feature/shop` branch (in progress):**
- Shop infrastructure (Phase 1: schema + categories admin)

**Deferred / blocked:**
- Customer emails (DNS migration to Cloudflare)
- Booking confirmation workflow with Calendar integration (depends on customer emails)
- Drive Sales objective in GA (depends on shop launch)

**Future projects (separate sessions):**
- AI Blog Skill (auto-write posts with images)
- Conversion tracking events in GA (after shop launch)
