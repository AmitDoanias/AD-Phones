import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phone, device, appleType, modelId, modelName, message } = body as {
      name?: string;
      phone?: string;
      device?: string;
      appleType?: string;
      modelId?: string;
      modelName?: string;
      message?: string;
    };

    if (!phone?.trim()) {
      return NextResponse.json({ error: "מספר טלפון הוא שדה חובה" }, { status: 400 });
    }

    const supabase = createAdminClient();

    const { error } = await supabase.from("leads").insert({
      source: "contact_form",
      customer_name: name?.trim() || null,
      customer_phone: phone.trim(),
      form_data: {
        device: device ?? null,
        appleType: appleType ?? null,
        modelId: modelId ?? null,
        modelName: modelName ?? null,
        message: message?.trim() ?? null,
      },
      status: "new",
    });

    if (error) {
      console.error("[contact] db error:", error);
      return NextResponse.json({ error: "שגיאה בשמירת הפנייה", detail: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    console.error("[contact] unexpected error:", err);
    return NextResponse.json({ error: "שגיאת שרת פנימית" }, { status: 500 });
  }
}
