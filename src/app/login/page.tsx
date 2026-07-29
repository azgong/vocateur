import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { safeNextPath } from "@/lib/site";
import { SignInPanel } from "@/components/auth/SignInPanel";

export const metadata: Metadata = {
  title: "Sign in · Vocateur",
  robots: { index: false, follow: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; note?: string }>;
}) {
  const { next, note } = await searchParams;
  const safeNext = safeNextPath(next);

  const authClient = await createClient();
  const {
    data: { user },
  } = await authClient.auth.getUser();

  // Already signed in, most likely from a stale or reshared link: skip
  // straight to wherever this login was headed rather than showing the form.
  if (user) {
    redirect(safeNext);
  }

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center gap-8 px-6 py-16">
      <div className="text-center">
        <p className="text-sm font-medium tracking-[0.2em] text-accent uppercase">Sign in</p>
        <h1 className="font-[family-name:var(--font-title)] text-4xl font-normal tracking-tight">
          Continue to Vocateur
        </h1>
      </div>
      <SignInPanel next={safeNext} note={note} />
    </main>
  );
}
