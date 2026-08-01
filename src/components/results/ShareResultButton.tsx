"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

function ShareIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 3v13m0-13 4 4m-4-4-4 4M6 13v6a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ShareResultButton({ sessionId, title, fitScore }: { sessionId: string; title: string; fitScore: number }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  function shareUrl() {
    return `${window.location.origin}/results/${sessionId}`;
  }
  function imageUrl() {
    return `${window.location.origin}/results/${sessionId}/opengraph-image`;
  }

  async function handlePrimaryShare() {
    const url = shareUrl();
    const text = `My top career match on Vocateur: ${title} (${fitScore}% fit). What's yours?`;
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: "My Vocateur match", text, url });
        return;
      } catch {
        // Cancelled or unsupported target; fall through to the panel.
      }
    }
    setOpen((v) => !v);
  }

  async function handleCopyLink() {
    await navigator.clipboard.writeText(shareUrl());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleDownloadImage() {
    const a = document.createElement("a");
    a.href = imageUrl();
    a.download = "vocateur-match.png";
    a.click();
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={handlePrimaryShare}
        className="flex items-center gap-2 rounded-full border-2 border-border-strong px-5 py-2.5 text-sm font-semibold transition-colors hover:border-accent hover:text-accent"
      >
        <ShareIcon />
        Share your result
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full z-10 mt-2 flex w-56 flex-col gap-1 rounded-2xl border border-border-subtle bg-surface p-2 shadow-[0_16px_40px_-12px_rgba(0,0,0,0.5)]"
          >
            <button
              type="button"
              onClick={handleCopyLink}
              className="rounded-xl px-3 py-2.5 text-left text-sm text-foreground/80 transition-colors hover:bg-surface-2"
            >
              {copied ? "Copied!" : "Copy link"}
            </button>
            <button
              type="button"
              onClick={handleDownloadImage}
              className="rounded-xl px-3 py-2.5 text-left text-sm text-foreground/80 transition-colors hover:bg-surface-2"
            >
              Download image
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
