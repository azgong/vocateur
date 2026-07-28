"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

const MESSAGES = [
  "Reading how you actually decided things…",
  "Matching your skills to this specific role…",
  "Pulling in real wage and growth numbers…",
  "Writing your first steps…",
  "Putting it all together…",
];

const DOT_COLORS = [
  "var(--quadrant-a)",
  "var(--quadrant-b)",
  "var(--quadrant-c)",
  "var(--quadrant-d)",
  "var(--quadrant-e)",
];

export function RoadmapBuildingOverlay({ show }: { show: boolean }) {
  const [mounted, setMounted] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!show) {
      setMessageIndex(0);
      return;
    }
    const id = setInterval(() => {
      setMessageIndex((i) => Math.min(i + 1, MESSAGES.length - 1));
    }, 2400);
    return () => clearInterval(id);
  }, [show]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-8 bg-background/95 px-6 backdrop-blur-md"
        >
          <div className="relative flex h-24 w-24 items-center justify-center">
            {DOT_COLORS.map((color, i) => (
              <motion.span
                key={color}
                className="absolute h-3 w-3 rounded-full"
                style={{ background: color }}
                animate={{
                  x: [0, Math.cos((i / DOT_COLORS.length) * 2 * Math.PI) * 34, 0],
                  y: [0, Math.sin((i / DOT_COLORS.length) * 2 * Math.PI) * 34, 0],
                  scale: [0.6, 1, 0.6],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 2.2,
                  delay: i * 0.18,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>

          <div className="flex flex-col items-center gap-3 text-center">
            <p className="text-sm font-medium tracking-[0.2em] text-accent uppercase">Building your roadmap</p>
            <AnimatePresence mode="wait">
              <motion.p
                key={messageIndex}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.3 }}
                className="h-6 text-base text-foreground/70"
              >
                {MESSAGES[messageIndex]}
              </motion.p>
            </AnimatePresence>
          </div>

          <div className="h-1 w-48 overflow-hidden rounded-full bg-surface-2">
            <motion.div
              className="h-full w-1/3 rounded-full bg-accent"
              animate={{ x: ["-100%", "250%"] }}
              transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut" }}
            />
          </div>

          <p className="text-xs text-foreground/40">This usually takes under a minute.</p>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
