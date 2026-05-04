import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sendBookingEmail, sendCustomerBookingConfirmation } from "@/lib/email";

export type CreateBookingPayload = {
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  service_type: "lab" | "technician";
  notes?: string;
  preferred_at?: string | null;
  items: { modelRepairId: string }[];
};

const ALLOWED_SERVICE_TYPES = new Set(["lab", "technician"]);
const TECHNICIAN_FEE = 150;

export async function POST(req: NextRequest) {
  try {
    const body: CreateBookingPayload = await req.json();
    const { customer_name, customer_phone, customer_email, service_type, notes, preferred_at, items } = body;

    if (!customer_name?.trim() || !customer_phone?.trim()) {
      return NextResponse.json(
        { error: "שם ומספר טלפון הם שדות חובה" },
        { status: 400 }
      );
    }

    if (!ALLOWED_SERVICE_TYPES.has(service_type)) {
      return NextResponse.json(
        { error: "סוג שירות לא תקין" },
        { status: 400 }
      );
    }

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "הסל ריק - לא ניתן להגיש הזמנה" },
        { status: 400 }
      );
    }

    const ids = items
      .map((i) => i?.modelRepairId)
      .filter((id): id is string => typeof id === "string" && id.length > 0);

    if (ids.length === 0 || ids.length !== items.length) {
      return NextResponse.json(
        { error: "פריטים לא תקינים בסל" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { data: modelRepairs, error: lookupError } = await supabase
      .from("model_repairs")
      .select(
        `id, price, is_active,
         models!inner ( name, brands!inner ( name ) ),
         repair_types!inner ( name )`
      )
      .in("id", ids);

    if (lookupError) {
      console.error("model_repairs lookup error:", lookupError);
      return NextResponse.json({ error: "שגיאת שרת פנימית" }, { status: 500 });
    }

    if (!modelRepairs || modelRepairs.length !== ids.length) {
      return NextResponse.json(
        { error: "אחד או יותר מהשירותים שהזמנת אינו זמין" },
        { status: 400 }
      );
    }

    if (modelRepairs.some((mr) => !mr.is_active)) {
      return NextResponse.json(
        { error: "אחד מהשירותים שהזמנת אינו זמין יותר" },
        { status: 400 }
      );
    }

    const items_total = modelRepairs.reduce(
      (sum, mr) => sum + Number(mr.price),
      0
    );
    const technician_fee = service_type === "technician" ? TECHNICIAN_FEE : 0;

    const { data: booking, error: bookingError } = await supabase
      .from("bookings")
      .insert({
        customer_name: customer_name.trim(),
        customer_phone: customer_phone.trim(),
        customer_email: customer_email?.trim() || null,
        service_type,
        technician_fee,
        notes: notes?.trim() || null,
        total_price: items_total + technician_fee,
        status: "received",
        scheduled_at: preferred_at ?? null,
      })
      .select("id")
      .single();

    if (bookingError || !booking) {
      console.error("booking insert error:", bookingError);
      return NextResponse.json(
        { error: "שגיאה ביצירת ההזמנה" },
        { status: 500 }
      );
    }

    const bookingItems = modelRepairs.map((mr) => {
      const model = mr.models as unknown as {
        name: string;
        brands: { name: string };
      };
      const repairType = mr.repair_types as unknown as { name: string };
      return {
        booking_id: booking.id,
        model_repair_id: mr.id,
        price_at_booking: mr.price,
        model_name: `${model.brands.name} ${model.name}`,
        repair_name: repairType.name,
      };
    });

    const { error: itemsError } = await supabase
      .from("booking_items")
      .insert(bookingItems);

    if (itemsError) {
      console.error("booking_items insert error:", itemsError);
      // Booking already created - return success so user isn't left hanging
    }

    const emailItems = bookingItems.map((bi) => ({
      modelName: bi.model_name,
      repairName: bi.repair_name,
      price: Number(bi.price_at_booking),
    }));
    const emailTotal = items_total + technician_fee;

    // Notify admin by email (non-blocking - don't fail the user request if email fails)
    sendBookingEmail({
      bookingId: booking.id,
      customerName: customer_name.trim(),
      customerPhone: customer_phone.trim(),
      serviceType: service_type,
      total: emailTotal,
      preferredAt: preferred_at ?? null,
      items: emailItems,
    }).catch((err) => console.error("[bookings] admin email send error:", err));

    // Send confirmation to customer if they provided an email (non-blocking)
    if (customer_email?.trim()) {
      sendCustomerBookingConfirmation({
        bookingId: booking.id,
        customerEmail: customer_email.trim(),
        customerName: customer_name.trim(),
        serviceType: service_type,
        total: emailTotal,
        preferredAt: preferred_at ?? null,
        items: emailItems,
      }).catch((err) =>
        console.error("[bookings] customer email send error:", err)
      );
    }

    return NextResponse.json({ id: booking.id }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "שגיאת שרת פנימית" }, { status: 500 });
  }
}
