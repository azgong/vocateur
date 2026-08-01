import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

const DAY_MS = 24 * 60 * 60 * 1000;
const WINDOW_MS = 2 * DAY_MS; // cron runs daily; a 2-day window tolerates a missed run without double-sending

type Checkpoint = { days: number; column: "reminder_30d_sent_at" | "reminder_90d_sent_at" };
const CHECKPOINTS: Checkpoint[] = [
  { days: 30, column: "reminder_30d_sent_at" },
  { days: 90, column: "reminder_90d_sent_at" },
];

async function sendReminderEmail(to: string, occupationTitle: string, roadmapId: string) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("RESEND_API_KEY not set");

  const url = `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://vocateur.app"}/roadmap/${roadmapId}`;
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: "Vocateur <hello@vocateur.app>",
      to,
      subject: `How's it going toward ${occupationTitle}?`,
      html: `<p>A little while back you got a roadmap toward <strong>${occupationTitle}</strong>.</p>
<p>Quick check-in: still on track with it? Your roadmap has a checklist you can update as you go.</p>
<p><a href="${url}">Open your roadmap</a></p>
<p style="color:#888;font-size:12px;">Vocateur &middot; vocateur.app</p>`,
    }),
  });
  if (!res.ok) throw new Error(`Resend API error: ${res.status} ${await res.text()}`);
}

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();
  const results: { roadmapId: string; checkpoint: number; status: string }[] = [];

  for (const { days, column } of CHECKPOINTS) {
    const target = Date.now() - days * DAY_MS;
    const windowStart = new Date(target - WINDOW_MS).toISOString();
    const windowEnd = new Date(target).toISOString();

    const { data: due } = await admin
      .from("roadmaps")
      .select("id, user_id, generated_at, occupations(title)")
      .is(column, null)
      .gte("generated_at", windowStart)
      .lte("generated_at", windowEnd);

    for (const roadmap of due ?? []) {
      try {
        const { data: userData } = await admin.auth.admin.getUserById(roadmap.user_id);
        const email = userData?.user?.email;
        const occupation = roadmap.occupations as unknown as { title: string } | null;
        if (!email || !occupation) {
          results.push({ roadmapId: roadmap.id, checkpoint: days, status: "skipped: missing email or occupation" });
          continue;
        }

        await sendReminderEmail(email, occupation.title, roadmap.id);
        await admin.from("roadmaps").update({ [column]: new Date().toISOString() }).eq("id", roadmap.id);
        results.push({ roadmapId: roadmap.id, checkpoint: days, status: "sent" });
      } catch (e) {
        results.push({ roadmapId: roadmap.id, checkpoint: days, status: `failed: ${e instanceof Error ? e.message : "unknown"}` });
      }
    }
  }

  return NextResponse.json({ ok: true, results });
}
