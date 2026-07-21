"use client";

import { useState, useSyncExternalStore } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const STORAGE_KEY = "vocateur_age_confirmed";

function subscribe() {
  return () => {};
}

function getSnapshot() {
  return window.localStorage.getItem(STORAGE_KEY) === "true";
}

// Treat as confirmed during SSR/first paint so the gate never flashes for
// returning visitors; useSyncExternalStore reconciles with the real value
// immediately after hydration.
function getServerSnapshot() {
  return true;
}

export function AgeGate() {
  const storedConfirmed = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [justConfirmed, setJustConfirmed] = useState(false);
  const [blocked, setBlocked] = useState(false);

  function confirm() {
    window.localStorage.setItem(STORAGE_KEY, "true");
    setJustConfirmed(true);
  }

  if (storedConfirmed || justConfirmed) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 px-6 backdrop-blur-sm"
      >
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex w-full max-w-sm flex-col items-center gap-5 rounded-3xl border border-border-subtle bg-surface p-8 text-center shadow-xl"
        >
          {!blocked ? (
            <>
              <h2 className="font-[family-name:var(--font-brand)] text-2xl font-medium tracking-tight">
                Quick check before you start
              </h2>
              <p className="text-sm text-foreground/60">
                Vocateur is intended for users age 13 and older. By continuing, you confirm you meet this
                requirement. See our{" "}
                <Link href="/privacy" className="underline underline-offset-2 hover:text-foreground">
                  Privacy Policy
                </Link>{" "}
                for details.
              </p>
              <div className="flex w-full flex-col gap-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={confirm}
                  className="rounded-full bg-accent px-6 py-3 text-sm font-medium text-white shadow-[0_0_24px_-6px_var(--accent)]"
                >
                  I&rsquo;m 13 or older, continue
                </motion.button>
                <button
                  onClick={() => setBlocked(true)}
                  className="rounded-full px-6 py-2 text-sm text-foreground/40 hover:text-foreground/60"
                >
                  I&rsquo;m under 13
                </button>
              </div>
            </>
          ) : (
            <>
              <h2 className="font-[family-name:var(--font-brand)] text-2xl font-medium tracking-tight">
                Sorry about that
              </h2>
              <p className="text-sm text-foreground/60">
                Vocateur isn&rsquo;t available for users under 13. Please check back once you&rsquo;re old enough
                to use it.
              </p>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
