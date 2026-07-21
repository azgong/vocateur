"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { LifeStage, SelfReport, Timeline } from "@/lib/assessment/types";

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

const inputClass =
  "w-full rounded-2xl border-2 border-border-subtle bg-surface px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-accent placeholder:text-foreground/30";

export function SelfReportStep({ onComplete }: { onComplete: (report: SelfReport) => void }) {
  const [lifeStage, setLifeStage] = useState<LifeStage | null>(null);
  const [currentFocus, setCurrentFocus] = useState("");
  const [furtherSchooling, setFurtherSchooling] = useState<SelfReport["furtherSchooling"] | null>(null);
  const [geographicFlexibility, setGeographicFlexibility] = useState<SelfReport["geographicFlexibility"] | null>(null);
  const [location, setLocation] = useState("");
  const [timeline, setTimeline] = useState<Timeline | null>(null);
  const [values, setValues] = useState<string[]>([]);
  const [additionalContext, setAdditionalContext] = useState("");

  function toggleValue(v: string) {
    setValues((prev) => (prev.includes(v) ? prev.filter((x) => x !== v) : prev.length < 3 ? [...prev, v] : prev));
  }

  const isStudent = lifeStage === "high_school" || lifeStage === "university";
  const focusLabel = isStudent ? "What are you studying (or planning to)?" : "What do you currently do?";
  const focusPlaceholder = isStudent ? "e.g. Undecided, Computer Science, Biology" : "e.g. Marketing coordinator, between jobs";

  const canSubmit =
    lifeStage && furtherSchooling && geographicFlexibility && timeline && values.length > 0 && currentFocus.trim().length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="flex w-full max-w-2xl flex-col gap-8"
    >
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-accent">Almost there</p>
        <h2 className="font-[family-name:var(--font-display)] text-3xl font-medium tracking-tight">
          A few quick questions
        </h2>
        <p className="text-sm text-foreground/50">
          The more you tell us here, the more specific your roadmap and advisor conversations will be.
          This isn&rsquo;t graded, it&rsquo;s just context we hand directly to the AI building your plan.
        </p>
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

      {lifeStage && (
        <div className="flex flex-col gap-2">
          <p className="font-medium">{focusLabel}</p>
          <input
            type="text"
            value={currentFocus}
            onChange={(e) => setCurrentFocus(e.target.value)}
            placeholder={focusPlaceholder}
            className={inputClass}
          />
        </div>
      )}

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
        <p className="font-medium">Where are you located? <span className="font-normal text-foreground/40">(optional)</span></p>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="e.g. Toronto, ON or Austin, TX"
          className={inputClass}
        />
      </div>

      <div className="flex flex-col gap-2">
        <p className="font-medium">How soon do you want real progress toward this?</p>
        <OptionRow
          options={[
            { value: "already_committed", label: "Already committed" },
            { value: "within_a_year", label: "Within a year" },
            { value: "one_to_three_years", label: "1-3 years" },
            { value: "just_exploring", label: "Just exploring" },
          ]}
          selected={timeline}
          onSelect={setTimeline}
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

      <div className="flex flex-col gap-2">
        <p className="font-medium">
          Anything else your advisor should know? <span className="font-normal text-foreground/40">(optional)</span>
        </p>
        <textarea
          value={additionalContext}
          onChange={(e) => setAdditionalContext(e.target.value)}
          placeholder="e.g. visa status, family obligations, must stay remote, specific constraints on schooling or relocation"
          rows={3}
          className={`${inputClass} resize-none`}
        />
      </div>

      <motion.button
        type="button"
        disabled={!canSubmit}
        whileHover={canSubmit ? { scale: 1.02 } : {}}
        whileTap={{ scale: 0.97 }}
        onClick={() =>
          canSubmit &&
          onComplete({
            lifeStage,
            currentFocus: currentFocus.trim(),
            furtherSchooling,
            geographicFlexibility,
            location: location.trim(),
            timeline,
            values,
            additionalContext: additionalContext.trim(),
          })
        }
        className="self-center rounded-full bg-accent px-8 py-3 text-sm font-medium text-white shadow-[0_0_28px_-8px_var(--accent)] disabled:opacity-40 disabled:shadow-none"
      >
        See my results
      </motion.button>
    </motion.div>
  );
}
