// Grants free Pro access to a beta tester by email, no Stripe charge involved.
// They must have signed in at least once already (so a profiles row exists).
//
// Usage: node scripts/grant-pro.mjs someone@example.com

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";

const email = process.argv[2]?.trim().toLowerCase();
if (!email) {
  console.error("Usage: node scripts/grant-pro.mjs <email>");
  process.exit(1);
}

const envRaw = readFileSync(new URL("../.env.local", import.meta.url), "utf8");
const env = {};
for (const line of envRaw.split("\n")) {
  const m = line.match(/^([A-Z_0-9]+)=(.*)$/);
  if (m) env[m[1]] = m[2].replace(/^"|"$/g, "");
}

const admin = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const { data, error } = await admin.auth.admin.listUsers({ perPage: 1000 });
if (error) {
  console.error("Failed to list users:", error.message);
  process.exit(1);
}

const user = data.users.find((u) => u.email?.toLowerCase() === email);
if (!user) {
  console.error(`No account found for ${email}. They need to sign in at least once first.`);
  process.exit(1);
}

const { error: updateError } = await admin
  .from("profiles")
  .update({ subscription_status: "active" })
  .eq("id", user.id);

if (updateError) {
  console.error("Failed to grant Pro:", updateError.message);
  process.exit(1);
}

console.log(`Granted Pro to ${email} (user ${user.id}).`);
