import type { Metadata } from "next";
import { PricingSection } from "@/components/home/PricingSection";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Pricing · Vocateur",
  description: "Free to start, simple to unlock. $29 once for unlimited assessments, the full roadmap, and mock interview practice.",
};

export default async function PricingPage() {
  const authClient = await createClient();
  const {
    data: { user },
  } = await authClient.auth.getUser();

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-6 py-16 lg:px-8">
      <PricingSection isAuthenticated={!!user} userEmail={user?.email ?? null} />
    </main>
  );
}
