import Link from "next/link";
import { InstallPrompt } from "@/components/InstallPrompt";
import { LandscapeAccent } from "@/components/LandscapeAccent";
import { HowItWorks } from "@/components/home/HowItWorks";
import { ScienceSection } from "@/components/home/ScienceSection";
import { DataSection } from "@/components/home/DataSection";
import { ProShowcase } from "@/components/home/ProShowcase";
import { PricingSection } from "@/components/home/PricingSection";
import { FaqSection, FAQS } from "@/components/home/FaqSection";
import { createClient } from "@/lib/supabase/server";

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Vocateur",
    url: "https://vocateur.app",
    logo: "https://vocateur.app/icon",
  },
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Vocateur",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    description: "A simulation-based career-matching assessment that maps your behavior to real careers backed by U.S. Bureau of Labor Statistics data, then unlocks a personalized roadmap and AI career advisor.",
    url: "https://vocateur.app",
    offers: [
      { "@type": "Offer", name: "Free", price: "0", priceCurrency: "USD" },
      { "@type": "Offer", name: "Pro Monthly", price: "9", priceCurrency: "USD" },
      { "@type": "Offer", name: "Pro Annual", price: "89", priceCurrency: "USD" },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  },
];

export default async function Home() {
  const authClient = await createClient();
  const {
    data: { user },
  } = await authClient.auth.getUser();

  return (
    <main className="flex flex-1 flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="relative flex flex-col items-center gap-7 overflow-hidden px-6 pt-24 pb-20 text-center">
        <HeroFloatCards />

        <span className="text-xs font-medium tracking-[0.3em] text-accent uppercase">
          You deserve better than a guess.
        </span>
        <h1 className="max-w-3xl font-[family-name:var(--font-title)] text-5xl font-normal tracking-tight sm:text-6xl lg:text-7xl">
          Meet the career that fits how you think.
          <span className="text-accent-soft"> In ten minutes.</span>
        </h1>
        <p className="max-w-xl text-lg text-foreground/60">
          Play through real job moments and quick skill games. Vocateur reads how you actually decide, then
          matches you to high-paying careers with real salary data and a step-by-step way in.
        </p>

        <Link
          href="/assessment"
          className="rounded-full bg-accent px-14 py-6 text-xl font-semibold text-white shadow-[0_0_50px_-10px_var(--accent)] transition-shadow hover:shadow-[0_0_64px_-6px_var(--accent)]"
        >
          Start the simulation
        </Link>

        <div className="flex flex-wrap items-center justify-center text-xs font-medium tracking-wide text-foreground/50 uppercase">
          <span className="px-4">About 10 minutes</span>
          <span className="border-l border-border-strong px-4">Backed by real BLS wage data</span>
          <span className="border-l border-border-strong px-4">Free to see your top matches</span>
        </div>

        <Link href="#pricing" className="text-sm text-foreground/50 underline underline-offset-4 hover:text-accent">
          Already know you want Pro? Unlock everything now
        </Link>

        <InstallPrompt />
      </section>

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-24 px-6 pb-24 lg:px-12">
        <HowItWorks />
        <ScienceSection />
        <DataSection />
        <ProShowcase />
        <PricingSection isAuthenticated={!!user} userEmail={user?.email ?? null} />
        <FaqSection />
      </div>

    </main>
  );
}

/* Decorative floating product cards flanking the hero, desktop only. */
function HeroFloatCards() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 hidden xl:block">
      <LandscapeAccent className="absolute -left-16 top-4 w-64 opacity-70" />

      <div
        className="hero-float absolute left-[4%] top-24 w-56 rounded-2xl border border-border-subtle bg-surface/80 p-4 text-left shadow-[0_16px_48px_-24px_rgba(0,0,0,0.8)] backdrop-blur-sm"
        style={{ "--float-tilt": "-3deg", "--float-tilt-end": "-1deg" } as React.CSSProperties}
      >
        <p className="text-[10px] font-semibold uppercase tracking-wide text-foreground/40">Top match</p>
        <p className="mt-1 text-sm font-semibold">Aerospace Engineer</p>
        <div className="mt-2 flex items-center gap-2">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-border-subtle">
            <div className="h-full w-[94%] rounded-full bg-accent" />
          </div>
          <span className="text-xs font-semibold tabular-nums text-accent">94%</span>
        </div>
        <p className="mt-2 text-[11px] text-foreground/50">$130,720 median wage, +6% growth</p>
      </div>

      <div
        className="hero-float-late absolute right-[3%] top-32 w-60 rounded-2xl border border-border-subtle bg-surface/80 p-4 text-left shadow-[0_16px_48px_-24px_rgba(0,0,0,0.8)] backdrop-blur-sm"
        style={{ "--float-tilt": "2deg", "--float-tilt-end": "4deg" } as React.CSSProperties}
      >
        <p className="text-[10px] font-semibold uppercase tracking-wide text-foreground/40">Your advisor</p>
        <div className="mt-2 self-end rounded-xl rounded-br-sm bg-surface-2 px-3 py-2 text-[11px] text-foreground/70">
          I have an interview at SpaceX on Friday.
        </div>
        <div className="mt-1.5 rounded-xl rounded-bl-sm border border-accent/20 bg-accent/[0.08] px-3 py-2 text-[11px] text-foreground/70">
          Let&rsquo;s run a mock round for it right now.
        </div>
      </div>

      <div
        className="hero-float absolute bottom-6 right-[3%] w-52 rounded-2xl border border-border-subtle bg-surface/80 p-4 text-left shadow-[0_16px_48px_-24px_rgba(0,0,0,0.8)] backdrop-blur-sm"
        style={{ "--float-tilt": "-2deg", "--float-tilt-end": "1deg" } as React.CSSProperties}
      >
        <p className="text-[10px] font-semibold uppercase tracking-wide text-foreground/40">Roadmap</p>
        <div className="mt-2 flex items-center gap-2">
          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[9px] font-bold text-white">
            ✓
          </span>
          <p className="text-[11px] text-foreground/70">Ship a project recruiters ask about</p>
        </div>
        <div className="mt-1.5 flex items-center gap-2">
          <span className="h-4 w-4 rounded-full border border-border-strong" />
          <p className="text-[11px] text-foreground/50">Reach out to 3 people in the role</p>
        </div>
      </div>
    </div>
  );
}
