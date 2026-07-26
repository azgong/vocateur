"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";

type OAuthProvider = "google" | "github";

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#4285F4"
        d="M23.52 12.27c0-.85-.08-1.66-.22-2.45H12v4.64h6.46a5.52 5.52 0 0 1-2.4 3.62v3h3.88c2.27-2.09 3.58-5.17 3.58-8.81Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.96-1.07 7.94-2.91l-3.88-3c-1.08.72-2.45 1.15-4.06 1.15-3.13 0-5.78-2.11-6.72-4.95H1.27v3.1A12 12 0 0 0 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.28 14.29a7.21 7.21 0 0 1 0-4.58v-3.1H1.27a12 12 0 0 0 0 10.78l4.01-3.1Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.77c1.76 0 3.34.6 4.59 1.79l3.44-3.44C17.95 1.19 15.24 0 12 0A12 12 0 0 0 1.27 6.61l4.01 3.1C6.22 6.88 8.87 4.77 12 4.77Z"
      />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 .3a12 12 0 0 0-3.8 23.38c.6.12.83-.26.83-.57L9 21.07c-3.34.72-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.08-.74.09-.73.09-.73 1.2.09 1.83 1.24 1.83 1.24 1.07 1.83 2.8 1.3 3.49 1 .1-.78.42-1.31.76-1.61-2.66-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.11-3.18 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.28-1.55 3.29-1.23 3.29-1.23.65 1.66.24 2.88.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.61-2.8 5.63-5.48 5.92.42.37.81 1.1.81 2.22l-.01 3.29c0 .32.21.7.82.58A12 12 0 0 0 12 .3Z" />
    </svg>
  );
}

/**
 * Sign-in options shown at the moment of purchase. `next` is where the user
 * lands after auth completes, typically a checkout redirect route so payment
 * opens with no extra clicks.
 */
export function SignInPanel({ next, note }: { next: string; note?: string }) {
  const [email, setEmail] = useState("");
  const [stage, setStage] = useState<"idle" | "sent">("idle");
  const [oauthLoading, setOauthLoading] = useState<OAuthProvider | null>(null);
  const [error, setError] = useState<string | null>(null);

  function callbackUrl() {
    // Some networks block the bare apex domain outright (router/ISP-level
    // "newly registered domain" filtering, confirmed on at least one home
    // network) but never www. Always send auth redirects through www in
    // production so a magic link or OAuth return never lands on a domain
    // the user's own network might be silently killing.
    const base = window.location.hostname === "localhost" ? window.location.origin : "https://www.vocateur.app";
    return `${base}/auth/callback?next=${encodeURIComponent(next)}`;
  }

  async function handleOAuth(provider: OAuthProvider) {
    setError(null);
    setOauthLoading(provider);
    const supabase = createClient();
    const { error: err } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: callbackUrl() },
    });
    if (err) {
      setOauthLoading(null);
      const label = provider === "google" ? "Google" : "GitHub";
      setError(
        err.message.toLowerCase().includes("not enabled")
          ? `${label} sign-in is not switched on yet. Use email below for now.`
          : `Could not start ${label} sign-in. Try email below.`,
      );
    }
  }

  async function handleEmail(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const supabase = createClient();
    const { error: err } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: callbackUrl() },
    });
    if (err) {
      setError("Could not send the link. Check the address and try again.");
      return;
    }
    setStage("sent");
  }

  if (stage === "sent") {
    return (
      <div className="flex w-full max-w-sm flex-col items-center gap-2 text-center">
        <p className="text-sm font-medium text-foreground/80">Check your email.</p>
        <p className="text-sm text-foreground/50">
          The sign-in link takes you straight to secure payment. Nothing to re-enter.
        </p>
      </div>
    );
  }

  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      {note && <p className="text-center text-xs text-foreground/50">{note}</p>}

      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => handleOAuth("google")}
        disabled={oauthLoading !== null}
        className="flex items-center justify-center gap-2.5 rounded-full border border-border-strong bg-white px-6 py-3 text-sm font-semibold text-neutral-900 disabled:opacity-60"
      >
        <GoogleIcon />
        {oauthLoading === "google" ? "Opening Google…" : "Continue with Google"}
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => handleOAuth("github")}
        disabled={oauthLoading !== null}
        className="flex items-center justify-center gap-2.5 rounded-full border border-border-strong bg-surface px-6 py-3 text-sm font-semibold text-foreground disabled:opacity-60"
      >
        <GitHubIcon />
        {oauthLoading === "github" ? "Opening GitHub…" : "Continue with GitHub"}
      </motion.button>

      <div className="flex items-center gap-3 py-1">
        <span className="h-px flex-1 bg-border-subtle" />
        <span className="text-[11px] font-medium uppercase tracking-wide text-foreground/40">or</span>
        <span className="h-px flex-1 bg-border-subtle" />
      </div>

      <form onSubmit={handleEmail} className="flex flex-col gap-2 sm:flex-row">
        <input
          type="email"
          required
          placeholder="you@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 rounded-full border border-border-subtle bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-accent"
        />
        <button type="submit" className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white">
          Email me a link
        </button>
      </form>

      {error && <p className="text-center text-sm text-quadrant-c">{error}</p>}
    </div>
  );
}
