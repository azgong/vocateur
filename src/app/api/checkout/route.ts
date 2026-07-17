import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getStripe, PRICE_IDS } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  const { sessionId, plan } = (await req.json()) as { sessionId: string; plan: "monthly" | "annual" };

  if (typeof sessionId !== "string" || (plan !== "monthly" && plan !== "annual")) {
    return NextResponse.json({ error: "Missing sessionId or invalid plan." }, { status: 400 });
  }

  const authClient = await createClient();
  const {
    data: { user },
  } = await authClient.auth.getUser();
  if (!user || !user.email) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  const admin = createAdminClient();
  const stripe = getStripe();
  const origin = req.nextUrl.origin;

  const { data: profile } = await admin
    .from("profiles")
    .select("stripe_customer_id")
    .eq("id", user.id)
    .single();

  let customerId = profile?.stripe_customer_id;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      metadata: { supabase_user_id: user.id },
    });
    customerId = customer.id;
    await admin.from("profiles").update({ stripe_customer_id: customerId }).eq("id", user.id);
  }

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: [{ price: PRICE_IDS[plan], quantity: 1 }],
    success_url: `${origin}/results/${sessionId}?checkout=success`,
    cancel_url: `${origin}/results/${sessionId}?checkout=cancelled`,
    client_reference_id: user.id,
    metadata: { supabase_user_id: user.id },
  });

  return NextResponse.json({ url: checkoutSession.url });
}
