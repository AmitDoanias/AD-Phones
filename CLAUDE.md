# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A&D Phones - a full-stack website for a phone repair business (iPhones, iPads, Samsung). Hebrew-only (RTL), customer-facing catalog + booking system + admin dashboard.

## Tech Stack

- **Framework:** Next.js 14+ (App Router) with TypeScript
- **Styling:** Tailwind CSS (RTL-first)
- **Database:** Supabase (PostgreSQL + Auth + RLS)
- **Images:** Cloudinary
- **Hosting:** Vercel
- **Rich Text:** Tiptap (JSON storage in JSONB columns)

## Commands

```bash
npm run dev          # Start dev server (localhost:3000)
npm run build        # Production build
npm run lint         # ESLint
npm run type-check   # TypeScript check (tsc --noEmit)
```

## Architecture

### Routing (App Router)

- `/` - Homepage (SSG, revalidate 3600)
- `/repairs/[brand]/[model]` - Catalog pages (SSG)
- `/cart`, `/booking` - Client-side (cart in localStorage)
- `/track/[bookingId]` - Public booking status (SSR, UUID-based access)
- `/blog/[slug]` - Blog posts (SSG)
- `/dashboard/*` - Admin pages (protected by middleware.ts)
- `/api/*` - API routes

### Auth

Single admin user via Supabase Auth. `middleware.ts` guards all `/dashboard/*` routes. No customer accounts exist. API routes check `supabase.auth.getUser()` for admin operations.

### Data Flow

- **Catalog:** Supabase → SSG pages with ISR. Admin mutations call `revalidatePath()`/`revalidateTag()` to bust cache.
- **Cart:** React context (`CartProvider`) persisted to localStorage. Becomes a `bookings` + `booking_items` database record on submission.
- **Bookings:** Public POST creates booking → Google Calendar event → WhatsApp notification. Status tracked by UUID.

### Key Schema Pattern

`repair_types` are shared across models. Prices are set per model-repair combination in the `model_repairs` junction table. `booking_items` denormalize model/repair names and price at booking time for historical accuracy.

### Supabase Clients

- `lib/supabase/client.ts` - Browser client (public pages, cart)
- `lib/supabase/server.ts` - Server client (SSG/SSR, API routes with user context)
- `lib/supabase/admin.ts` - Service-role client (webhooks, cron jobs)

## Language & RTL

All UI text is hardcoded in Hebrew. No i18n framework. Root layout sets `dir="rtl"` and `lang="he"`. Use the Heebo font from Google Fonts.

## Integrations

- **Google Calendar:** Service account via `googleapis`. Available slots = business hours - busy times - `calendar_blocks`.
- **Google Reviews:** Places API, cached daily to `reviews_cache` table via Vercel Cron.
- **Facebook:** Pixel in layout via `next/script`. Lead webhook at `/api/webhooks/facebook`.
- **WhatsApp:** `wa.me` links + Business API for booking notifications.
- **Cloudinary:** Upload via `/api/upload`, URL transformations for responsive images.
