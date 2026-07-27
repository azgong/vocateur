import Link from "next/link";
import { ScrollReveal } from "@/components/ScrollReveal";

export function ScienceSection() {
  return (
    <section id="science" className="flex flex-col gap-6 scroll-mt-24 text-center">
      <ScrollReveal>
        <p className="text-sm font-medium tracking-[0.2em] text-accent uppercase">The method</p>
        <h2 className="font-[family-name:var(--font-title)] text-4xl font-normal tracking-tight sm:text-5xl">
          We don&rsquo;t ask if you&rsquo;re organized. We put you in a moment that requires it.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-foreground/60">
          Five real instincts, scored from what you actually do under pressure, not from a
          &ldquo;rate yourself 1-5&rdquo; question you can answer however you want to be seen.
        </p>
        <Link
          href="/science"
          className="mt-5 inline-block text-sm font-medium text-accent underline underline-offset-4 hover:text-accent/80"
        >
          Read the full rationale
        </Link>
      </ScrollReveal>
    </section>
  );
}
