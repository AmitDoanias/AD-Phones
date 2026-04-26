import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { uploadImage } from "@/lib/cloudinary";

export async function POST(req: NextRequest) {
  // Auth guard - dashboard only
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const folder = (formData.get("folder") as string) || "ad-phones/models";

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "File must be an image" }, { status: 400 });
  }

  // 5 MB limit
  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: "File too large (max 5MB)" }, { status: 400 });
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const { url, public_id } = await uploadImage(buffer, folder);
    return NextResponse.json({ url, public_id });
  } catch {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
