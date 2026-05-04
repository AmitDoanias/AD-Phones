import { createClient } from "@/lib/supabase/server";
import BookingsTabs from "./BookingsTabs";

export default async function BookingsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; date?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();

  const { data: bookings } = await supabase
    .from("bookings")
    .select(
      "id, customer_name, customer_phone, service_type, total_price, status, created_at, scheduled_at"
    )
    .order("created_at", { ascending: false });

  const initialTab =
    params.date === "today"
      ? "today"
      : params.status ?? "all";

  return <BookingsTabs bookings={bookings ?? []} initialTab={initialTab} />;
}
