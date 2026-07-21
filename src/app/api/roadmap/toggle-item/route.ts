import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
  const { roadmapId, key, completed } = (await req.json()) as {
    roadmapId: string;
    key: string;
    completed: boolean;
  };

  if (typeof roadmapId !== "string" || typeof key !== "string" || typeof completed !== "boolean") {
    return NextResponse.json({ error: "Missing roadmapId, key, or completed." }, { status: 400 });
  }

  const authClient = await createClient();
  const {
    data: { user },
  } = await authClient.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  const admin = createAdminClient();
  const { data: roadmap } = await admin
    .from("roadmaps")
    .select("user_id, completed_items")
    .eq("id", roadmapId)
    .single();

  if (!roadmap || roadmap.user_id !== user.id) {
    return NextResponse.json({ error: "Roadmap not found." }, { status: 404 });
  }

  const completedItems = { ...(roadmap.completed_items as Record<string, boolean>), [key]: completed };

  const { error } = await admin.from("roadmaps").update({ completed_items: completedItems }).eq("id", roadmapId);
  if (error) {
    return NextResponse.json({ error: "Could not update progress." }, { status: 500 });
  }

  return NextResponse.json({ completedItems });
}
