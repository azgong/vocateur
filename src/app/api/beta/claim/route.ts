import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * One shared link for beta testers: grants Pro without going through Stripe.
 * Not a general promo-code system, just a single secret string for this
 * phase, meant to be shared directly (text/DM), not published anywhere.
 */
export async function GET(req: NextRequest) {
  const origin = req.nextUrl.origin;
  const code = req.nextUrl.searchParams.get("code");

  if (!code || code !== process.env.BETA_ACCESS_CODE) {
    return NextResponse.redirect(`${origin}/`);
  }

  const authClient = await createClient();
  const {
    data: { user },
  } = await authClient.auth.getUser();

  if (!user) {
    const next = `/api/beta/claim?code=${encodeURIComponent(code)}`;
    const note = "Sign in once to activate your free beta access.";
    return NextResponse.redirect(`${origin}/login?next=${encodeURIComponent(next)}&note=${encodeURIComponent(note)}`);
  }

  const admin = createAdminClient();
  await admin.from("profiles").update({ subscription_status: "active" }).eq("id", user.id);

  return NextResponse.redirect(`${origin}/assessment?beta=granted`);
}
