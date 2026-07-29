import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getStripe, getOrCreateStripeCustomer, ONE_TIME_PRICE_ID } from "@/lib/stripe";

export async function GET(req: NextRequest) {
  const origin = req.nextUrl.origin;
  const sessionId = req.nextUrl.searchParams.get("session");

  const authClient = await createClient();
  const {
    data: { user },
  } = await authClient.auth.getUser();
  if (!user || !user.email) {
    return NextResponse.redirect(`${origin}/`);
  }

  const admin = createAdminClient();

  // Claiming happens here, the moment someone treats a specific assessment
  // session as theirs by trying to unlock it. Only claims a still-anonymous
  // session (user_id null); never reassigns a session someone else already
  // claimed, so a shared results link can't be hijacked by a different
  // Pro account clicking "Get Pro" on it.
  if (sessionId) {
    await admin.from("assessment_sessions").update({ user_id: user.id }).eq("id", sessionId).is("user_id", null);
  }

  const { data: profile } = await admin
    .from("profiles")
    .select("subscription_status")
    .eq("id", user.id)
    .single();
  if (profile?.subscription_status === "active") {
    return NextResponse.redirect(sessionId ? `${origin}/results/${sessionId}` : `${origin}/assessment`);
  }

  const stripe = getStripe();
  const customerId = await getOrCreateStripeCustomer(admin, stripe, { id: user.id, email: user.email });

  const successUrl = sessionId
    ? `${origin}/results/${sessionId}?checkout=success`
    : `${origin}/assessment?checkout=success`;
  const cancelUrl = sessionId ? `${origin}/upgrade/${sessionId}?checkout=cancelled` : `${origin}/?checkout=cancelled`;

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "payment",
    customer: customerId,
    line_items: [{ price: ONE_TIME_PRICE_ID, quantity: 1 }],
    success_url: successUrl,
    cancel_url: cancelUrl,
    client_reference_id: user.id,
    metadata: { supabase_user_id: user.id },
  });

  return NextResponse.redirect(checkoutSession.url!);
}
