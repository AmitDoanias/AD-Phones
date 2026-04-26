import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { DeviceLine } from "@/types";

const ALLOWED_LINES: DeviceLine[] = ["iphone", "ipad", "samsung"];

function pathForLine(line: DeviceLine) {
  return `/repairs/${line}`;
}

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
    const body: {
      device_line?: string;
      question?: string;
      answer?: string;
      sort_order?: number;
      is_published?: boolean;
    } = await req.json();

    const update: Record<string, string | number | boolean> = {};
    if (body.device_line !== undefined) {
      if (!ALLOWED_LINES.includes(body.device_line as DeviceLine)) {
        return NextResponse.json({ error: "device_line לא תקין" }, { status: 400 });
      }
      update.device_line = body.device_line;
    }
    if (body.question !== undefined) update.question = body.question.trim();
    if (body.answer !== undefined) update.answer = body.answer.trim();
    if (body.sort_order !== undefined) update.sort_order = body.sort_order;
    if (body.is_published !== undefined) update.is_published = body.is_published;
    update.updated_at = new Date().toISOString();

    if (Object.keys(update).length === 1) {
      return NextResponse.json({ error: "אין שדות לעדכון" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("line_faqs")
      .update(update)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("faq update error:", error);
      return NextResponse.json({ error: "שגיאה בעדכון השאלה" }, { status: 500 });
    }

    // Revalidate both old and new line if device_line changed (data has the new one)
    if (data?.device_line && ALLOWED_LINES.includes(data.device_line as DeviceLine)) {
      revalidatePath(pathForLine(data.device_line as DeviceLine));
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

    // Fetch the row first to know which line to revalidate
    const { data: existing } = await supabase
      .from("line_faqs")
      .select("device_line")
      .eq("id", id)
      .single();

    const { error } = await supabase.from("line_faqs").delete().eq("id", id);
    if (error) {
      console.error("faq delete error:", error);
      return NextResponse.json({ error: "שגיאה במחיקת השאלה" }, { status: 500 });
    }

    if (existing?.device_line && ALLOWED_LINES.includes(existing.device_line as DeviceLine)) {
      revalidatePath(pathForLine(existing.device_line as DeviceLine));
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "שגיאת שרת פנימית" }, { status: 500 });
  }
}
