import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact · Vocateur",
  description: "Questions, feedback, or something not working? Send a message.",
};

export default function ContactPage() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-8 px-6 py-16">
      <div className="text-center">
        <p className="text-sm font-medium tracking-[0.2em] text-accent uppercase">Support</p>
        <h1 className="font-[family-name:var(--font-title)] text-5xl font-normal tracking-tight">
          Get in touch
        </h1>
        <p className="mx-auto mt-3 max-w-md text-foreground/60">
          Questions, feedback, billing issues, or something not working the way it should. Messages go
          straight to the team.
        </p>
      </div>
      <ContactForm />
    </main>
  );
}
