import Link from "next/link";
import { Logo } from "@/components/Logo";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-10 px-6 py-24 text-center">
      <div className="flex flex-col items-center gap-5">
        <Logo size={64} />
        <span className="text-xs font-medium tracking-[0.3em] text-accent uppercase">
          Not another personality quiz
        </span>
        <h1 className="font-[family-name:var(--font-display)] text-6xl font-medium tracking-tight sm:text-7xl">
          Vocateur
        </h1>
        <p className="max-w-md text-lg text-foreground/60">
          Real job moments. One clear signal. Find the career that actually fits how you think.
        </p>
      </div>

      <Link
        href="/assessment"
        className="rounded-full bg-accent px-10 py-4 text-base font-medium text-white shadow-[0_0_28px_-6px_var(--accent)] transition-shadow hover:shadow-[0_0_36px_-4px_var(--accent)]"
      >
        Start your assessment
      </Link>
      <p className="text-sm text-foreground/40">
        Takes about 10 minutes. Free to see your top match &mdash; $9/mo or $79/yr to unlock everything, including
        a personal AI career advisor.
      </p>

      <div className="fixed bottom-6 flex gap-4 text-xs text-foreground/30">
        <Link href="/privacy" className="underline underline-offset-2 hover:text-foreground/50">
          Privacy Policy
        </Link>
        <Link href="/terms" className="underline underline-offset-2 hover:text-foreground/50">
          Terms of Service
        </Link>
      </div>
    </main>
  );
}
