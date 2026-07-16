"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function SaveResultsForm({ sessionId }: { sessionId: string }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/save-results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, sessionId }),
      });
      setStatus(res.ok ? "done" : "error");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="w-full max-w-sm">
      <AnimatePresence>
        {status === "done" ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Saved — check your inbox for a copy.
          </motion.p>
        ) : (
          <motion.form onSubmit={handleSubmit} className="flex flex-col gap-2 sm:flex-row">
            <input
              type="email"
              required
              placeholder="you@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 rounded-full border border-zinc-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:border-zinc-100"
            />
            <motion.button
              type="submit"
              disabled={status === "loading"}
              whileTap={{ scale: 0.97 }}
              className="rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900"
            >
              {status === "loading" ? "Saving…" : "Save my results"}
            </motion.button>
          </motion.form>
        )}
      </AnimatePresence>
      {status === "error" && (
        <p className="mt-2 text-center text-sm text-red-500">Something went wrong. Try again.</p>
      )}
    </div>
  );
}
