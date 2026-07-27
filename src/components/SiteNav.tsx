import Link from "next/link";
import { Logo } from "@/components/Logo";

const NAV_LINKS = [
  { label: "How it works", href: "/#how-it-works" },
  { label: "The science", href: "/science" },
  { label: "Pro", href: "/#pro" },
  { label: "Pricing", href: "/pricing" },
  { label: "FAQ", href: "/#faq" },
];

export function SiteNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-border-subtle bg-background/70 backdrop-blur-md print:hidden">
      <nav className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-4 px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <Logo size={26} />
          <span className="font-[family-name:var(--font-brand)] text-base font-medium tracking-tight">
            Vocateur
          </span>
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm text-foreground/60 transition-colors hover:text-foreground"
            >
              {l.label}
            </Link>
          ))}
        </div>

        <Link
          href="/assessment"
          className="rounded-full bg-accent px-5 py-2 text-sm font-semibold text-white shadow-[0_0_20px_-6px_var(--accent)] transition-shadow hover:shadow-[0_0_28px_-4px_var(--accent)]"
        >
          Start free
        </Link>
      </nav>
    </header>
  );
}
