import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { rateLimit } from "@/lib/rateLimit";

// Closed-beta gate: while the site isn't publicly launched, anyone who isn't
// signed in with an active grant (beta or paid) gets the coming-soon/waitlist
// page instead of the real product. These paths stay reachable regardless,
// since they're either how someone becomes a beta tester in the first place
// or standard legal pages that should never be hidden.
const ALWAYS_ALLOWED_PAGES = ["/coming-soon", "/login", "/auth/callback", "/auth/error", "/privacy", "/terms"];

export async function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // Results pages are publicly shareable and unauthenticated, and rendering one
  // triggers live LLM calls for any rationale not already cached. Without this,
  // a script hitting /results/<id> in a loop could run up real cost with no
  // need to ever touch the API key.
  if (pathname.startsWith("/results/") && !rateLimit(request, "results-page", 30, 10 * 60 * 1000)) {
    return NextResponse.json({ error: "Too many requests. Try again in a few minutes." }, { status: 429 });
  }

  if (ALWAYS_ALLOWED_PAGES.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    return NextResponse.next();
  }

  // A Stripe checkout redirect can briefly race the webhook that flips
  // subscription_status to active; don't bounce someone who just paid to
  // coming-soon while that write is still in flight.
  if (searchParams.get("checkout") === "success") {
    return NextResponse.next();
  }

  let response = NextResponse.next({ request });
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  // getUser()/getSession() aren't safe inside middleware (Supabase's own docs:
  // "Never trust supabase.auth.getSession() inside server code such as
  // Middleware. It isn't guaranteed to revalidate the Auth token."). getClaims()
  // verifies the JWT locally against the project's published signing keys and
  // also refreshes an about-to-expire session, which is what this needs.
  const { data: claimsData, error: claimsError } = await supabase.auth.getClaims();
  if (claimsError || !claimsData) {
    return NextResponse.rewrite(new URL("/coming-soon", request.url));
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("subscription_status")
    .eq("id", claimsData.claims.sub)
    .single();
  if (profile?.subscription_status !== "active") {
    return NextResponse.rewrite(new URL("/coming-soon", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|manifest.webmanifest|icon$|apple-icon$|opengraph-image|pwa-icon).*)",
  ],
};
