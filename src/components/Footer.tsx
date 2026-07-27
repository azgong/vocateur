import Link from "next/link";
import { Logo } from "@/components/Logo";

const COLUMNS: { heading: string; links: { label: string; href: string }[] }[] = [
  {
    heading: "Product",
    links: [
      { label: "Take the assessment", href: "/assessment" },
      { label: "Pricing", href: "/pricing" },
      { label: "What Pro includes", href: "/#pro" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { label: "How it works", href: "/#how-it-works" },
      { label: "The science", href: "/science" },
      { label: "FAQ", href: "/#faq" },
    ],
  },
  {
    heading: "Support",
    links: [{ label: "Contact", href: "/contact" }],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border-subtle print:hidden">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-14 lg:px-8">
        <div className="flex flex-col justify-between gap-10 lg:flex-row">
          <div className="flex max-w-xs flex-col gap-3">
            <div className="flex items-center gap-2.5">
              <Logo size={28} />
              <span className="font-[family-name:var(--font-brand)] text-lg font-medium tracking-tight">
                Vocateur
              </span>
            </div>
            <p className="text-sm leading-relaxed text-foreground/50">
              Find the career that actually fits how you think, then get walked all the way there.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-x-12 gap-y-8 sm:grid-cols-4">
            {COLUMNS.map((col) => (
              <div key={col.heading} className="flex flex-col gap-3">
                <p className="text-sm font-semibold">{col.heading}</p>
                <ul className="flex flex-col gap-2.5">
                  {col.links.map((l) => (
                    <li key={l.href}>
                      <Link
                        href={l.href}
                        className="text-sm text-foreground/50 transition-colors hover:text-foreground"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-foreground/35">
          &copy; {new Date().getFullYear()} Vocateur. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
