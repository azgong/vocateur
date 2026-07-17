"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { LifeStage, SelfReport } from "@/lib/assessment/types";

const VALUE_OPTIONS = ["Stability", "Impact", "Creativity", "Autonomy", "Money", "Prestige"];

function OptionRow<T extends string>({
  options,
  selected,
  onSelect,
}: {
  options: { value: T; label: string }[];
  selected: T | null;
  onSelect: (v: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onSelect(o.value)}
          className={`rounded-full border-2 px-4 py-2 text-sm font-medium transition-colors ${
            selected === o.value
              ? "border-accent bg-accent/10 text-accent"
              : "border-border-subtle bg-surface hover:border-border-strong"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function SelfReportStep({ onComplete }: { onComplete: (report: SelfReport) => void }) {
  const [furtherSchooling, setFurtherSchooling] = useState<SelfReport["furtherSchooling"] | null>(null);
  const [geographicFlexibility, setGeographicFlexibility] = useState<SelfReport["geographicFlexibility"] | null>(null);
  const [lifeStage, setLifeStage] = useState<LifeStage | null>(null);
  const [values, setValues] = useState<string[]>([]);

  function toggleValue(v: string) {
    setValues((prev) => (prev.includes(v) ? prev.filter((x) => x !== v) : prev.length < 3 ? [...prev, v] : prev));
  }

  const canSubmit = furtherSchooling && geographicFlexibility && lifeStage && values.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.3 }}
      className="flex w-full max-w-lg flex-col gap-8"
    >
      <div>
        <p className="text-sm font-medium text-accent">Almost there</p>
        <h2 className="font-[family-name:var(--font-display)] text-3xl font-medium tracking-tight">
          A few quick questions
        </h2>
      </div>

      <div className="flex flex-col gap-2">
        <p className="font-medium">Where are you in your path right now?</p>
        <OptionRow
          options={[
            { value: "high_school", label: "Middle / high school" },
            { value: "university", label: "University" },
            { value: "early_career", label: "Early career" },
            { value: "career_changer", label: "Older / career changer" },
          ]}
          selected={lifeStage}
          onSelect={setLifeStage}
        />
      </div>

      <div className="flex flex-col gap-2">
        <p className="font-medium">Open to more schooling if the path called for it?</p>
        <OptionRow
          options={[
            { value: "yes", label: "Yes" },
            { value: "maybe", label: "Maybe" },
            { value: "no", label: "No" },
          ]}
          selected={furtherSchooling}
          onSelect={setFurtherSchooling}
        />
      </div>

      <div className="flex flex-col gap-2">
        <p className="font-medium">How flexible are you on location?</p>
        <OptionRow
          options={[
            { value: "local", label: "Staying local" },
            { value: "national", label: "Open nationally" },
            { value: "global", label: "Open anywhere" },
          ]}
          selected={geographicFlexibility}
          onSelect={setGeographicFlexibility}
        />
      </div>

      <div className="flex flex-col gap-2">
        <p className="font-medium">Pick up to 3 things that matter most in your work.</p>
        <div className="flex flex-wrap gap-2">
          {VALUE_OPTIONS.map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => toggleValue(v)}
              className={`rounded-full border-2 px-4 py-2 text-sm font-medium transition-colors ${
                values.includes(v)
                  ? "border-accent bg-accent/10 text-accent"
                  : "border-border-subtle bg-surface hover:border-border-strong"
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      <motion.button
        type="button"
        disabled={!canSubmit}
        whileHover={canSubmit ? { scale: 1.02 } : {}}
        whileTap={{ scale: 0.97 }}
        onClick={() =>
          canSubmit &&
          onComplete({ furtherSchooling, geographicFlexibility, lifeStage, values })
        }
        className="self-center rounded-full bg-accent px-8 py-3 text-sm font-medium text-white shadow-[0_0_28px_-8px_var(--accent)] disabled:opacity-40 disabled:shadow-none"
      >
        See my results
      </motion.button>
    </motion.div>
  );
}
