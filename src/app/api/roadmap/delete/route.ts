import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
  const { roadmapId } = (await req.json()) as { roadmapId?: string };
  if (typeof roadmapId !== "string") {
    return NextResponse.json({ error: "Missing roadmapId." }, { status: 400 });
  }

  const authClient = await createClient();
  const {
    data: { user },
  } = await authClient.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  const admin = createAdminClient();
  const { error, count } = await admin
    .from("roadmaps")
    .delete({ count: "exact" })
    .eq("id", roadmapId)
    .eq("user_id", user.id);

  if (error) {
    return NextResponse.json({ error: "Could not delete roadmap." }, { status: 500 });
  }
  if (!count) {
    return NextResponse.json({ error: "Roadmap not found." }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
