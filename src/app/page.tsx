import Link from "next/link";
import { Logo } from "@/components/Logo";
import { InstallPrompt } from "@/components/InstallPrompt";
import { HowItWorks } from "@/components/home/HowItWorks";
import { ScienceSection } from "@/components/home/ScienceSection";
import { DataSection } from "@/components/home/DataSection";
import { ProShowcase } from "@/components/home/ProShowcase";
import { PricingSection } from "@/components/home/PricingSection";
import { FaqSection, FAQS } from "@/components/home/FaqSection";

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
      { "@type": "Offer", name: "Pro Annual", price: "79", priceCurrency: "USD" },
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

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="flex flex-col items-center gap-6 px-6 pt-24 pb-20 text-center">
        <Logo size={64} />
        <span className="text-xs font-medium tracking-[0.3em] text-accent uppercase">
          Not another personality quiz
        </span>
        <h1 className="font-[family-name:var(--font-brand)] text-6xl font-bold uppercase tracking-tight sm:text-7xl">
          Vocateur
        </h1>
        <p className="max-w-md text-lg text-foreground/60">
          Real job moments. One clear signal. Find the career that actually fits how you think.
        </p>

        <Link
          href="/assessment"
          className="rounded-full bg-accent px-10 py-4 text-base font-medium text-white shadow-[0_0_28px_-6px_var(--accent)] transition-shadow hover:shadow-[0_0_36px_-4px_var(--accent)]"
        >
          Start your assessment
        </Link>
        <p className="text-sm text-foreground/40">
          Takes about 10 minutes. Free to see your top match. $9/mo or $79/yr to unlock everything,
          including a personal AI career advisor.
        </p>
        <InstallPrompt />
      </section>

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-24 px-6 pb-24 lg:px-12">
        <HowItWorks />
        <ScienceSection />
        <DataSection />
        <ProShowcase />
        <PricingSection />
        <FaqSection />
      </div>

      <footer className="flex flex-col items-center gap-3 border-t border-border-subtle px-6 py-10 text-center">
        <Logo size={32} />
        <div className="flex gap-4 text-xs text-foreground/40">
          <Link href="/privacy" className="underline underline-offset-2 hover:text-foreground/60">
            Privacy Policy
          </Link>
          <Link href="/terms" className="underline underline-offset-2 hover:text-foreground/60">
            Terms of Service
          </Link>
        </div>
      </footer>
    </main>
  );
}
