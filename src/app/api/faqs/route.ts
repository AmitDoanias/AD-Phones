import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { DeviceLine } from "@/types";

const ALLOWED_LINES: DeviceLine[] = ["iphone", "ipad", "samsung"];

function pathForLine(line: DeviceLine) {
  return `/repairs/${line}`;
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body: {
      device_line?: string;
      question?: string;
      answer?: string;
      sort_order?: number;
      is_published?: boolean;
    } = await req.json();

    if (!body.device_line || !ALLOWED_LINES.includes(body.device_line as DeviceLine)) {
      return NextResponse.json({ error: "device_line לא תקין" }, { status: 400 });
    }
    if (!body.question?.trim() || !body.answer?.trim()) {
      return NextResponse.json({ error: "שאלה ותשובה חובה" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("line_faqs")
      .insert({
        device_line: body.device_line,
        question: body.question.trim(),
        answer: body.answer.trim(),
        sort_order: body.sort_order ?? 0,
        is_published: body.is_published ?? true,
      })
      .select()
      .single();

    if (error) {
      console.error("faq create error:", error);
      return NextResponse.json({ error: "שגיאה ביצירת השאלה" }, { status: 500 });
    }

    revalidatePath(pathForLine(body.device_line as DeviceLine));
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "שגיאת שרת פנימית" }, { status: 500 });
  }
}
