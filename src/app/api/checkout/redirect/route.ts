import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getStripe, getOrCreateStripeCustomer, PRICE_IDS } from "@/lib/stripe";

export async function GET(req: NextRequest) {
  const origin = req.nextUrl.origin;
  const plan = req.nextUrl.searchParams.get("plan");

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
  const stripe = getStripe();
  const customerId = await getOrCreateStripeCustomer(admin, stripe, { id: user.id, email: user.email });

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: [{ price: PRICE_IDS[plan], quantity: 1 }],
    success_url: `${origin}/assessment?checkout=success`,
    cancel_url: `${origin}/?checkout=cancelled`,
    client_reference_id: user.id,
    metadata: { supabase_user_id: user.id },
  });

  return NextResponse.redirect(checkoutSession.url!);
}
