export const metadata = {
  title: "Privacy Policy — Vocateur",
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-8 px-6 py-20">
      <div className="flex flex-col gap-2">
        <h1 className="font-[family-name:var(--font-display)] text-4xl font-medium tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-sm text-foreground/40">Effective July 19, 2026</p>
      </div>

      <div className="flex flex-col gap-8 text-sm leading-relaxed text-foreground/70">
        <section className="flex flex-col gap-2">
          <h2 className="text-base font-semibold text-foreground">Who we are</h2>
          <p>
            Vocateur (&ldquo;we,&rdquo; &ldquo;us&rdquo;) operates vocateur.app, a career-matching assessment and
            roadmap product. This policy explains what information we collect, how we use it, and the choices you
            have. If you have questions, contact us at{" "}
            <a href="mailto:vocateurteam@gmail.com" className="underline underline-offset-2 hover:text-foreground">
              vocateurteam@gmail.com
            </a>
            .
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-base font-semibold text-foreground">Who Vocateur is for</h2>
          <p>
            Vocateur is intended for users age 13 and older. We do not knowingly collect personal information from
            children under 13. If you believe a child under 13 has provided us with personal information, contact
            us and we&rsquo;ll delete it.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-base font-semibold text-foreground">What we collect</h2>
          <ul className="flex flex-col gap-1.5 pl-4">
            <li className="list-disc">
              <span className="font-medium text-foreground/90">Email address</span> — when you join the waitlist or
              create an account, used for sign-in (passwordless magic links) and product communication.
            </li>
            <li className="list-disc">
              <span className="font-medium text-foreground/90">Assessment responses</span> — the choices, timing,
              and self-reported context (like life stage and what you value in work) you provide while taking the
              assessment, used to compute your results and generate your roadmap.
            </li>
            <li className="list-disc">
              <span className="font-medium text-foreground/90">Subscription and payment status</span> — whether you
              have an active subscription and your plan type. We never see or store your full card number; payments
              are handled directly by Stripe.
            </li>
            <li className="list-disc">
              <span className="font-medium text-foreground/90">Support communications</span> — anything you send us
              directly, like emails to our support address.
            </li>
          </ul>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-base font-semibold text-foreground">How we use it</h2>
          <p>We use your information to:</p>
          <ul className="flex flex-col gap-1.5 pl-4">
            <li className="list-disc">Match you to careers and generate your personalized rationale and roadmap</li>
            <li className="list-disc">Power the AI conversation feature, where relevant context from your results is sent to our AI provider to answer your questions</li>
            <li className="list-disc">Create and maintain your account, and process subscription payments</li>
            <li className="list-disc">Send sign-in links and essential product communications</li>
            <li className="list-disc">Improve the product and understand how it&rsquo;s used</li>
          </ul>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-base font-semibold text-foreground">Who we share it with</h2>
          <p>
            We don&rsquo;t sell your personal information. We share it only with the service providers that help us
            run Vocateur, each bound to only use it to provide their service to us:
          </p>
          <ul className="flex flex-col gap-1.5 pl-4">
            <li className="list-disc"><span className="font-medium text-foreground/90">Supabase</span> — database, authentication, and secure storage of your account and assessment data</li>
            <li className="list-disc"><span className="font-medium text-foreground/90">Stripe</span> — payment processing and subscription management</li>
            <li className="list-disc"><span className="font-medium text-foreground/90">Anthropic</span> — generates your rationale, roadmap, and AI conversation responses from your assessment results</li>
            <li className="list-disc"><span className="font-medium text-foreground/90">Resend</span> — delivers sign-in and account emails</li>
            <li className="list-disc"><span className="font-medium text-foreground/90">Vercel</span> — hosts the application</li>
          </ul>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-base font-semibold text-foreground">Cookies and local storage</h2>
          <p>
            We use your browser&rsquo;s local storage to remember your age confirmation and to keep you signed in.
            We don&rsquo;t use third-party advertising or tracking cookies.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-base font-semibold text-foreground">Your choices</h2>
          <p>
            You can request a copy of your data, ask us to correct it, or ask us to delete your account and
            associated data at any time by emailing{" "}
            <a href="mailto:vocateurteam@gmail.com" className="underline underline-offset-2 hover:text-foreground">
              vocateurteam@gmail.com
            </a>
            . If you have an active subscription, you can also manage or cancel it directly from your account&rsquo;s
            billing portal.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-base font-semibold text-foreground">Data retention</h2>
          <p>
            We retain your information for as long as your account is active or as needed to provide the product.
            If you delete your account, we delete your personal data within a reasonable time, except where we&rsquo;re
            required to keep records for legal or accounting reasons.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-base font-semibold text-foreground">Changes to this policy</h2>
          <p>
            We may update this policy as Vocateur evolves. If we make material changes, we&rsquo;ll update the
            effective date above and, where appropriate, notify you directly.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-base font-semibold text-foreground">Contact us</h2>
          <p>
            Questions about this policy or your data?{" "}
            <a href="mailto:vocateurteam@gmail.com" className="underline underline-offset-2 hover:text-foreground">
              vocateurteam@gmail.com
            </a>
          </p>
        </section>
      </div>
    </main>
  );
}
