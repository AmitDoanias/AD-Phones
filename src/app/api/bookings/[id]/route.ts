import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const body: { status?: string; scheduled_at?: string | null } =
      await req.json();

    const update: Record<string, string | null> = {};
    if (body.status !== undefined) update.status = body.status;
    if (body.scheduled_at !== undefined)
      update.scheduled_at = body.scheduled_at;

    if (Object.keys(update).length === 0) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("bookings")
      .update(update)
      .eq("id", id)
      .select("id, status, scheduled_at")
      .single();

    if (error) {
      console.error("booking update error:", error);
      return NextResponse.json({ error: "שגיאה בעדכון ההזמנה" }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "שגיאת שרת פנימית" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Cascade: remove booking_items first (no FK ON DELETE CASCADE in schema)
    await supabase.from("booking_items").delete().eq("booking_id", id);
    const { error } = await supabase.from("bookings").delete().eq("id", id);

    if (error) {
      console.error("booking delete error:", error);
      return NextResponse.json({ error: "שגיאה במחיקת ההזמנה" }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "שגיאת שרת פנימית" }, { status: 500 });
  }
}
