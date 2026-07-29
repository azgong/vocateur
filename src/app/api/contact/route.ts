import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { rateLimit } from "@/lib/rateLimit";

export async function POST(req: NextRequest) {
  if (!rateLimit(req, "contact", 10, 10 * 60 * 1000)) {
    return NextResponse.json({ error: "Too many attempts. Try again in a few minutes." }, { status: 429 });
  }

  const body = (await req.json().catch(() => null)) as {
    name?: string;
    email?: string;
    message?: string;
    company?: string;
  } | null;

  if (!body) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // Honeypot: real users never fill this hidden field.
  if (body.company) {
    return NextResponse.json({ ok: true });
  }

  const message = (body.message ?? "").trim();
  if (message.length < 10 || message.length > 2000) {
    return NextResponse.json(
      { error: "Message must be between 10 and 2000 characters." },
      { status: 400 },
    );
  }

  const admin = createAdminClient();
  const { error } = await admin.from("contact_messages").insert({
    name: (body.name ?? "").trim().slice(0, 200) || null,
    email: (body.email ?? "").trim().slice(0, 320) || null,
    message,
  });

  if (error) {
    return NextResponse.json({ error: "Could not save your message." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
