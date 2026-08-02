import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { rateLimit } from "@/lib/rateLimit";

// Results pages are publicly shareable and unauthenticated, and rendering one
// triggers live LLM calls for any rationale not already cached. Without this,
// a script hitting /results/<id> in a loop could run up real cost with no
// need to ever touch the API key.
export function proxy(request: NextRequest) {
  if (!rateLimit(request, "results-page", 30, 10 * 60 * 1000)) {
    return NextResponse.json({ error: "Too many requests. Try again in a few minutes." }, { status: 429 });
  }
  return NextResponse.next();
}

export const config = {
  matcher: "/results/:path*",
};
