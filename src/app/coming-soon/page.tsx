import type { Metadata } from "next";
import Link from "next/link";
import { WaitlistForm } from "@/components/WaitlistForm";

export const metadata: Metadata = {
  title: "Coming soon · Vocateur",
  robots: { index: false, follow: false },
};

export default function ComingSoonPage() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center gap-8 px-6 py-24 text-center">
      <div>
        <p className="text-sm font-medium tracking-[0.2em] text-accent uppercase">Coming soon</p>
        <h1 className="font-[family-name:var(--font-title)] text-5xl font-normal tracking-tight sm:text-6xl">
          Find the career that actually fits how you think
        </h1>
        <p className="mx-auto mt-4 max-w-md text-foreground/60">
          Vocateur is in a private beta right now. Leave your email and we&rsquo;ll let you know the moment it opens
          up.
        </p>
      </div>

      <WaitlistForm />

      <p className="text-sm text-foreground/40">
        Already a beta tester?{" "}
        <Link href="/login" className="text-accent underline underline-offset-2">
          Log in
        </Link>
      </p>
    </main>
  );
}
