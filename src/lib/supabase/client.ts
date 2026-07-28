import { createBrowserClient } from "@supabase/ssr";

// Magic links are inherently cross-device (requested on one browser, opened
// from a phone's mail app, a different profile, etc.), so PKCE's requirement
// that the code be redeemed in the same browser that requested it breaks
// real sign-ins. Implicit flow puts the session tokens directly in the
// redirect URL fragment instead, which /auth/callback already has a
// dedicated handler for, so it works regardless of which browser opens
// the emailed link.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { flowType: "implicit" } },
  );
}
