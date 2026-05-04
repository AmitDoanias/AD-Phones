import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sendContactEmail, sendCustomerContactConfirmation } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phone, email, device, appleType, modelId, modelName, message } = body as {
      name?: string;
      phone?: string;
      email?: string;
      device?: string;
      appleType?: string;
      modelId?: string;
      modelName?: string;
      message?: string;
    };

    if (!phone?.trim()) {
      return NextResponse.json({ error: "מספר טלפון הוא שדה חובה" }, { status: 400 });
    }

    const supabase = await createClient();

    const { error } = await supabase.from("leads").insert({
      source: "contact_form",
      customer_name: name?.trim() || null,
      customer_phone: phone.trim(),
      customer_email: email?.trim() || null,
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
      return NextResponse.json({ error: "שגיאה בשמירת הפנייה" }, { status: 500 });
    }

    // Notify admin by email (non-blocking - don't fail the user request if email fails)
    sendContactEmail({
      name: name?.trim() ?? null,
      phone: phone.trim(),
      device: device ?? null,
      appleType: appleType ?? null,
      modelName: modelName ?? null,
      message: message?.trim() ?? null,
    }).catch((err) => console.error("[contact] admin email send error:", err));

    // Send confirmation to customer if they provided an email (non-blocking)
    if (email?.trim()) {
      sendCustomerContactConfirmation({
        customerEmail: email.trim(),
        customerName: name?.trim() || null,
      }).catch((err) =>
        console.error("[contact] customer email send error:", err)
      );
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    console.error("[contact] unexpected error:", err);
    return NextResponse.json({ error: "שגיאת שרת פנימית" }, { status: 500 });
  }
}
