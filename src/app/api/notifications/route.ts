import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const since = new Date();
    since.setHours(since.getHours() - 24);

    const [{ data: bookings }, { data: leads }] = await Promise.all([
      supabase
        .from("bookings")
        .select("id, customer_name, total_price, created_at")
        .gte("created_at", since.toISOString())
        .order("created_at", { ascending: false })
        .limit(10),
      supabase
        .from("leads")
        .select("id, customer_name, created_at")
        .gte("created_at", since.toISOString())
        .order("created_at", { ascending: false })
        .limit(10),
    ]);

    const items = [
      ...(bookings ?? []).map((b) => ({
        id: `b:${b.id}`,
        type: "booking" as const,
        title: b.customer_name ?? "לקוח",
        subtitle:
          b.total_price != null
            ? `הזמנה חדשה - ₪${b.total_price.toLocaleString("he-IL")}`
            : "הזמנה חדשה",
        href: `/dashboard/bookings/${b.id}`,
        created_at: b.created_at,
      })),
      ...(leads ?? []).map((l) => ({
        id: `l:${l.id}`,
        type: "lead" as const,
        title: l.customer_name ?? "לקוח",
        subtitle: "פנייה חדשה",
        href: `/dashboard/leads`,
        created_at: l.created_at,
      })),
    ];

    items.sort((a, b) => (a.created_at < b.created_at ? 1 : -1));

    return NextResponse.json({ items: items.slice(0, 12) });
  } catch {
    return NextResponse.json({ error: "שגיאת שרת" }, { status: 500 });
  }
}
