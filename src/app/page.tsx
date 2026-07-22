import Link from "next/link";
import { Logo } from "@/components/Logo";
import { InstallPrompt } from "@/components/InstallPrompt";
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
      <section className="flex flex-col items-center gap-7 px-6 pt-24 pb-20 text-center">
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
          className="rounded-full bg-accent px-14 py-6 text-xl font-semibold text-white shadow-[0_0_50px_-10px_var(--accent)] transition-shadow hover:shadow-[0_0_64px_-6px_var(--accent)]"
        >
          Start your assessment
        </Link>

        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-medium text-foreground/50">
          <span className="flex items-center gap-1.5">
            <BenefitDot /> 20 minutes, 24 real job scenarios
          </span>
          <span className="flex items-center gap-1.5">
            <BenefitDot /> Backed by real BLS wage data
          </span>
          <span className="flex items-center gap-1.5">
            <BenefitDot /> Free to see your top match
          </span>
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

function BenefitDot() {
  return <span className="h-1.5 w-1.5 rounded-full bg-accent" />;
}
