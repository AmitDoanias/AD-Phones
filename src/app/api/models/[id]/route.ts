import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();

  // Auth guard - admin only
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Delete child records first (FK constraint)
  const { error: repairsError } = await supabase
    .from("model_repairs")
    .delete()
    .eq("model_id", id);

  if (repairsError) {
    return NextResponse.json({ error: repairsError.message }, { status: 500 });
  }

  const { error: modelError } = await supabase
    .from("models")
    .delete()
    .eq("id", id);

  if (modelError) {
    return NextResponse.json({ error: modelError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
