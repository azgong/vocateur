import Link from "next/link";
import { WaitlistForm } from "@/components/WaitlistForm";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-10 px-6 py-24 text-center">
      <div className="flex flex-col items-center gap-5">
        <span className="text-xs font-medium tracking-[0.3em] text-accent uppercase">
          Not another personality quiz
        </span>
        <h1 className="font-[family-name:var(--font-display)] text-6xl font-medium tracking-tight sm:text-7xl">
          Vocateur
        </h1>
        <p className="max-w-md text-lg text-foreground/60">
          Twelve real job moments. One clear signal. Find the career that actually fits how you think.
        </p>
      </div>
      <WaitlistForm />
      <p className="text-sm text-foreground/40">Coming soon.</p>
      <Link
        href="/privacy"
        className="fixed bottom-6 text-xs text-foreground/30 underline underline-offset-2 hover:text-foreground/50"
      >
        Privacy Policy
      </Link>
    </main>
  );
}
