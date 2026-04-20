import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export type CreateBookingPayload = {
  customer_name: string;
  customer_phone: string;
  service_type: "lab" | "technician";
  notes?: string;
  preferred_at?: string | null;
  items: {
    modelRepairId: string;
    modelName: string;
    brandName: string;
    repairName: string;
    price: number;
  }[];
};

export async function POST(req: NextRequest) {
  try {
    const body: CreateBookingPayload = await req.json();

    const { customer_name, customer_phone, service_type, notes, preferred_at, items } = body;

    if (!customer_name?.trim() || !customer_phone?.trim()) {
      return NextResponse.json(
        { error: "שם ומספר טלפון הם שדות חובה" },
        { status: 400 }
      );
    }

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: "הסל ריק — לא ניתן להגיש הזמנה" },
        { status: 400 }
      );
    }

    const total_price = items.reduce((sum, i) => sum + i.price, 0);
    const technician_fee = service_type === "technician" ? 150 : 0;

    const supabase = await createClient();

    // Insert booking
    const { data: booking, error: bookingError } = await supabase
      .from("bookings")
      .insert({
        customer_name: customer_name.trim(),
        customer_phone: customer_phone.trim(),
        service_type,
        technician_fee,
        notes: notes?.trim() || null,
        total_price: total_price + technician_fee,
        status: "received",
        scheduled_at: preferred_at ?? null,
      })
      .select("id")
      .single();

    if (bookingError || !booking) {
      console.error("booking insert error:", bookingError);
      return NextResponse.json({ error: "שגיאה ביצירת ההזמנה" }, { status: 500 });
    }

    // Insert booking items
    const bookingItems = items.map((item) => ({
      booking_id: booking.id,
      model_repair_id: item.modelRepairId,
      price_at_booking: item.price,
      model_name: `${item.brandName} ${item.modelName}`,
      repair_name: item.repairName,
    }));

    const { error: itemsError } = await supabase
      .from("booking_items")
      .insert(bookingItems);

    if (itemsError) {
      console.error("booking_items insert error:", itemsError);
      // Booking was created — still return success so user isn't left hanging
    }

    return NextResponse.json({ id: booking.id }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "שגיאת שרת פנימית" }, { status: 500 });
  }
}
