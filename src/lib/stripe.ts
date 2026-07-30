import Stripe from "stripe";
import { createAdminClient } from "@/lib/supabase/admin";

export function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!);
}

export const ONE_TIME_PRICE_ID = process.env.STRIPE_PRICE_ID_ONETIME!;

export async function getOrCreateStripeCustomer(
  admin: ReturnType<typeof createAdminClient>,
  stripe: Stripe,
  user: { id: string; email: string },
) {
  const { data: profile } = await admin
    .from("profiles")
    .select("stripe_customer_id")
    .eq("id", user.id)
    .single();

  if (profile?.stripe_customer_id) {
    // The stored id can be stale (e.g. a test-mode id left over on a shared
    // profiles row from local dev, meaningless against the live API key).
    // Verify it actually resolves before trusting it, instead of passing a
    // dead id straight into checkout session creation.
    try {
      const existing = await stripe.customers.retrieve(profile.stripe_customer_id);
      if (!existing.deleted) return existing.id;
    } catch {
      // Falls through to create a fresh customer below.
    }
  }

  const customer = await stripe.customers.create({
    email: user.email,
    metadata: { supabase_user_id: user.id },
  });
  await admin.from("profiles").update({ stripe_customer_id: customer.id }).eq("id", user.id);
  return customer.id;
}
