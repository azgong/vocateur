import { createBrowserClient } from "@supabase/ssr";

// detectSessionInUrl defaults to true, which makes the SDK automatically try
// to consume any auth code/token found in the current URL the moment this
// client is constructed. /auth/callback also does that explicitly and
// deliberately, so the two raced to redeem the same single-use code: whichever
// ran first won, and the other failed with "PKCE code verifier not found"
// (its cookie already deleted by the winner) and sent real, freshly signed-in
// users to /auth/error. Disabling auto-detection here leaves exactly one
// place, /auth/callback, in charge of the exchange.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { flowType: "implicit", detectSessionInUrl: false } },
  );
}
