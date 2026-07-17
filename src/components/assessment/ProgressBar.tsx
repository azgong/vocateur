"use client";

import { motion } from "framer-motion";
import { QUADRANT_META, Quadrant } from "@/lib/assessment/quadrantStyle";

const QUADRANTS: Quadrant[] = ["a", "b", "c", "d"];

export function ProgressBar({ currentModuleIndex }: { currentModuleIndex: number }) {
  return (
    <div className="flex w-full max-w-md items-center gap-2">
      {QUADRANTS.map((q, i) => {
        const meta = QUADRANT_META[q];
        const done = i < currentModuleIndex;
        const active = i === currentModuleIndex;
        return (
          <div key={q} className="flex flex-1 flex-col items-center gap-1.5">
            <div className="relative h-2 w-full overflow-hidden rounded-full bg-surface-2">
              <motion.div
                className={`h-full rounded-full ${meta.bg}`}
                initial={{ width: "0%" }}
                animate={{ width: done ? "100%" : active ? "50%" : "0%" }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              />
            </div>
            <span
              className={`text-[11px] font-medium tracking-wide transition-colors ${
                active ? meta.text : done ? "text-foreground/50" : "text-foreground/25"
              }`}
            >
              {meta.name}
            </span>
          </div>
        );
      })}
    </div>
  );
}
