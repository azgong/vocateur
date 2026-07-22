"use client";

import { motion } from "framer-motion";
import { QUADRANT_META, CHAPTER_QUADRANT } from "@/lib/assessment/quadrantStyle";
import { CHAPTERS } from "@/lib/assessment/scenes";

export function ProgressBar({ chapterIndex, sceneInChapter }: { chapterIndex: number; sceneInChapter: number }) {
  return (
    <div className="flex w-full max-w-2xl items-center gap-3 lg:max-w-3xl xl:max-w-4xl">
      {CHAPTERS.map((chapter, ci) => {
        const meta = QUADRANT_META[CHAPTER_QUADRANT[chapter.id]];
        const isPastChapter = ci < chapterIndex;
        const isCurrentChapter = ci === chapterIndex;
        return (
          <div key={chapter.id} className="flex flex-1 flex-col items-center gap-1.5">
            <div className="flex w-full gap-1">
              {chapter.scenes.map((_, si) => {
                const done = isPastChapter || (isCurrentChapter && si < sceneInChapter);
                const active = isCurrentChapter && si === sceneInChapter;
                return (
                  <div key={si} className="relative h-2 flex-1 overflow-hidden rounded-full bg-surface-2">
                    <motion.div
                      className={`h-full rounded-full ${meta.bg}`}
                      initial={{ width: "0%" }}
                      animate={{ width: done ? "100%" : active ? "50%" : "0%" }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                    />
                  </div>
                );
              })}
            </div>
            <span
              className={`text-[11px] font-medium tracking-wide transition-colors ${
                isCurrentChapter ? meta.text : isPastChapter ? "text-foreground/50" : "text-foreground/25"
              }`}
            >
              {chapter.name}
            </span>
          </div>
        );
      })}
    </div>
  );
}
