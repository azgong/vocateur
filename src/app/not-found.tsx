import Link from "next/link";
import { Logo } from "@/components/Logo";

export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-5 px-6 py-24 text-center">
      <Logo size={48} />
      <h1 className="font-[family-name:var(--font-brand)] text-3xl font-medium tracking-tight">
        Page not found
      </h1>
      <p className="max-w-sm text-foreground/60">
        This link may be broken, expired, or point to something that isn&rsquo;t yours to see.
      </p>
      <Link
        href="/"
        className="rounded-full bg-accent px-6 py-2.5 text-sm font-medium text-white shadow-[0_0_24px_-6px_var(--accent)]"
      >
        Back to Vocateur
      </Link>
    </main>
  );
}
