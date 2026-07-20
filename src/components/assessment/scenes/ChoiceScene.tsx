"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ModuleLog } from "@/lib/assessment/types";
import { ChoiceSceneConfig } from "@/lib/assessment/scenes";
import { QUADRANT_META, CHAPTER_QUADRANT } from "@/lib/assessment/quadrantStyle";

export function ChoiceScene({
  scene,
  onComplete,
}: {
  scene: ChoiceSceneConfig;
  onComplete: (log: ModuleLog) => void;
}) {
  const Q = QUADRANT_META[CHAPTER_QUADRANT[scene.chapterId]];
  const [selected, setSelected] = useState<string | null>(null);
  const [revisions, setRevisions] = useState(0);
  const [confirmed, setConfirmed] = useState(false);
  const startRef = useRef(0);
  const firstSelectRef = useRef(false);

  useEffect(() => {
    startRef.current = Date.now();
  }, []);

  function handleSelect(id: string) {
    if (confirmed) return;
    if (firstSelectRef.current && selected !== id) {
      setRevisions((r) => r + 1);
    }
    firstSelectRef.current = true;
    setSelected(id);
  }

  function finish() {
    if (!selected) return;
    setConfirmed(true);
    const timeTakenMs = Date.now() - startRef.current;
    const option = scene.options.find((o) => o.id === selected)!;

    onComplete({
      chapterId: scene.chapterId,
      sceneId: scene.id,
      timeTakenMs,
      choiceSelected: selected,
      revisionsMade: revisions,
      extra: { traitContribution: option.traitContribution, description: scene.description },
    });
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.3 }}
      className="flex w-full max-w-lg flex-col gap-6"
    >
      <h2 className="font-[family-name:var(--font-display)] text-3xl font-medium tracking-tight">{scene.title}</h2>

      {scene.context && (
        <div className="flex flex-col gap-3 rounded-2xl bg-surface-2 p-4 text-sm">
          {scene.context.map((c, i) => (
            <p key={i}>
              <span className="font-semibold">{c.speaker}:</span> &ldquo;{c.text}&rdquo;
            </p>
          ))}
        </div>
      )}

      <p className="text-sm text-foreground/60">{scene.prompt}</p>

      <div className="flex flex-col gap-2">
        {scene.options.map((o) => {
          const isSelected = selected === o.id;
          return (
            <motion.button
              key={o.id}
              type="button"
              disabled={confirmed}
              onClick={() => handleSelect(o.id)}
              whileTap={{ scale: 0.98 }}
              className={`rounded-xl border-2 px-4 py-3 text-left text-sm transition-colors ${
                isSelected
                  ? `${Q.border} ${Q.bgSoft} ${Q.text} ${Q.ring}`
                  : "border-border-subtle bg-surface hover:border-border-strong"
              }`}
            >
              {o.label}
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence>
        {selected && !confirmed && (
          <motion.button
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            whileTap={{ scale: 0.97 }}
            onClick={finish}
            className={`self-center rounded-full px-8 py-3 text-sm font-medium ${Q.buttonText} ${Q.bg} ${Q.ring}`}
          >
            {scene.confirmLabel}
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
