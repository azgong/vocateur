"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { authSafeOrigin } from "@/lib/site";

export function HomeProCheckout({
  isAuthenticated,
  userEmail,
}: {
  isAuthenticated: boolean;
  userEmail: string | null;
}) {
  const [stage, setStage] = useState<"cta" | "error">("cta");
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  async function startCheckout() {
    if (!isAuthenticated) {
      const next = `/api/checkout/redirect`;
      const note = "Sign in once and you go straight to secure card payment.";
      window.location.href = `${authSafeOrigin()}/login?next=${encodeURIComponent(next)}&note=${encodeURIComponent(note)}`;
      return;
    }
    setCheckoutLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        setStage("error");
        setCheckoutLoading(false);
        return;
      }
      window.location.href = data.url;
    } catch {
      setStage("error");
      setCheckoutLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        onClick={startCheckout}
        disabled={checkoutLoading}
        className="w-full rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white shadow-[0_0_28px_-8px_var(--accent)] disabled:opacity-60"
      >
        {checkoutLoading ? "Redirecting…" : "Get Pro: $29 once"}
      </motion.button>
      {stage === "error" && <p className="text-center text-sm text-quadrant-c">Something went wrong. Try again.</p>}
      {isAuthenticated && userEmail && (
        <p className="text-center text-xs text-foreground/40">Signed in as {userEmail}</p>
      )}
    </div>
  );
}
