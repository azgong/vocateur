"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [company, setCompany] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message, company }),
      });
      if (!res.ok) {
        setStatus("error");
        return;
      }
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="flex flex-col items-center gap-2 rounded-3xl border border-border-subtle bg-surface p-10 text-center">
        <p className="text-lg font-medium">Message received.</p>
        <p className="text-sm text-foreground/60">
          Thanks for reaching out. If you left an email, you&rsquo;ll hear back soon.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-3xl border border-border-subtle bg-surface p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="text-foreground/60">Name (optional)</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-xl border border-border-subtle bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-accent"
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="text-foreground/60">Email (optional, for a reply)</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-xl border border-border-subtle bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-accent"
          />
        </label>
      </div>

      {/* Honeypot, hidden from real users. */}
      <input
        type="text"
        value={company}
        onChange={(e) => setCompany(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="hidden"
        name="company"
      />

      <label className="flex flex-col gap-1.5 text-sm">
        <span className="text-foreground/60">Message</span>
        <textarea
          required
          minLength={10}
          maxLength={2000}
          rows={6}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Questions, feedback, bug reports, anything."
          className="resize-y rounded-xl border border-border-subtle bg-background px-4 py-3 text-sm leading-relaxed text-foreground outline-none focus:border-accent"
        />
      </label>

      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        type="submit"
        disabled={status === "sending"}
        className="self-start rounded-full bg-accent px-8 py-3 text-sm font-semibold text-white shadow-[0_0_28px_-8px_var(--accent)] disabled:opacity-60"
      >
        {status === "sending" ? "Sending…" : "Send message"}
      </motion.button>

      {status === "error" && (
        <p className="text-sm text-quadrant-c">Something went wrong. Try again in a moment.</p>
      )}
    </form>
  );
}
