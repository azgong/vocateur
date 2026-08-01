import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

const TRIAL_DAYS = 7;

/**
 * Reverts Pro access granted via the free beta link once the trial window
 * passes. Only touches profiles that were beta-granted and never actually
 * went through checkout (stripe_customer_id null); a beta tester who
 * converts to a real purchase gets a stripe_customer_id from that checkout
 * and is never touched here, regardless of when they claimed beta access.
 */
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();
  const cutoff = new Date(Date.now() - TRIAL_DAYS * 24 * 60 * 60 * 1000).toISOString();

  const { data: expired, error } = await admin
    .from("profiles")
    .update({ subscription_status: "none" })
    .eq("subscription_status", "active")
    .is("stripe_customer_id", null)
    .not("beta_granted_at", "is", null)
    .lt("beta_granted_at", cutoff)
    .select("id");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, expiredCount: expired?.length ?? 0 });
}
