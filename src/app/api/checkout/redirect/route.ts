import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getStripe, getOrCreateStripeCustomer, PRICE_IDS } from "@/lib/stripe";

export async function GET(req: NextRequest) {
  const origin = req.nextUrl.origin;
  const plan = req.nextUrl.searchParams.get("plan");
  const sessionId = req.nextUrl.searchParams.get("session");

  if (plan !== "monthly" && plan !== "annual") {
    return NextResponse.redirect(`${origin}/`);
  }

  const authClient = await createClient();
  const {
    data: { user },
  } = await authClient.auth.getUser();
  if (!user || !user.email) {
    return NextResponse.redirect(`${origin}/`);
  }

  const admin = createAdminClient();

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
    mode: "subscription",
    customer: customerId,
    line_items: [{ price: PRICE_IDS[plan], quantity: 1 }],
    success_url: successUrl,
    cancel_url: cancelUrl,
    client_reference_id: user.id,
    metadata: { supabase_user_id: user.id },
  });

  return NextResponse.redirect(checkoutSession.url!);
}
