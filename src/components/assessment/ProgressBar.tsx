"use client";

import { motion } from "framer-motion";

const LABELS = ["Analyst", "Physician", "Executive", "Founder"];

export function ProgressBar({ currentModuleIndex }: { currentModuleIndex: number }) {
  return (
    <div className="flex w-full max-w-md items-center gap-2">
      {LABELS.map((label, i) => {
        const done = i < currentModuleIndex;
        const active = i === currentModuleIndex;
        return (
          <div key={label} className="flex flex-1 flex-col items-center gap-1.5">
            <div className="relative h-2 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
              <motion.div
                className="h-full rounded-full bg-zinc-900 dark:bg-zinc-100"
                initial={{ width: "0%" }}
                animate={{ width: done ? "100%" : active ? "50%" : "0%" }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              />
            </div>
            <span
              className={`text-[11px] font-medium tracking-wide transition-colors ${
                active
                  ? "text-zinc-900 dark:text-zinc-100"
                  : done
                    ? "text-zinc-500 dark:text-zinc-500"
                    : "text-zinc-300 dark:text-zinc-700"
              }`}
            >
              {label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
