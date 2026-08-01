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
  const { data: profile } = await admin.from("profiles").select("beta_granted_at").eq("id", user.id).single();

  // Only stamp the grant time once: re-clicking the same link later (or
  // signing in again) shouldn't reset a fresh 7-day window each time.
  await admin
    .from("profiles")
    .update({ subscription_status: "active", beta_granted_at: profile?.beta_granted_at ?? new Date().toISOString() })
    .eq("id", user.id);

  return NextResponse.redirect(`${origin}/assessment?beta=granted`);
}
