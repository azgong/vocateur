"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { OutreachTemplate } from "@/lib/assessment/roadmap";

export function NetworkingTemplateCard({ template }: { template: OutreachTemplate }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(template.message);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard access can fail (permissions, insecure context); nothing to recover, fail silently.
    }
  }

  return (
    <div className="rounded-xl border border-border-subtle bg-surface p-4 print:break-inside-avoid">
      <div className="mb-1.5 flex items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-foreground/50">{template.label}</p>
        <button
          type="button"
          onClick={handleCopy}
          className="shrink-0 rounded-full border border-border-strong px-3 py-1 text-xs font-medium text-foreground/70 transition-colors hover:border-accent hover:text-accent print:hidden"
        >
          Copy
        </button>
      </div>
      <p className="text-sm italic leading-relaxed text-foreground/70">{template.message}</p>

      <AnimatePresence>
        {copied && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="fixed inset-x-0 bottom-6 z-50 flex justify-center print:hidden"
          >
            <div className="rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background shadow-lg">
              Copied to clipboard
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
