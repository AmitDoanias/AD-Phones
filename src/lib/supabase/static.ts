import { createClient } from "@supabase/supabase-js";

// Cookie-free client for generateStaticParams (runs at build time, no HTTP request context)
export function createStaticClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
