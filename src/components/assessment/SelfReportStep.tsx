"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { LifeStage, ResumeStatus, SelfReport } from "@/lib/assessment/types";

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

function Section({
  index,
  label,
  children,
}: {
  index: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-5 rounded-2xl border border-border-subtle bg-surface-2 p-6">
      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
        {index} &middot; {label}
      </span>
      {children}
    </div>
  );
}

function Question({
  prompt,
  description,
  children,
}: {
  prompt: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <p className="font-medium">{prompt}</p>
      {description && <p className="text-xs text-foreground/50">{description}</p>}
      {children}
    </div>
  );
}

export function SelfReportStep({ onComplete }: { onComplete: (report: SelfReport) => void }) {
  const [lifeStage, setLifeStage] = useState<LifeStage | null>(null);
  const [currentFocus, setCurrentFocus] = useState("");
  const [furtherSchooling, setFurtherSchooling] = useState<SelfReport["furtherSchooling"] | null>(null);
  const [geographicFlexibility, setGeographicFlexibility] = useState<SelfReport["geographicFlexibility"] | null>(null);
  const [location, setLocation] = useState("");
  const [values, setValues] = useState<string[]>([]);
  const [currentGPA, setCurrentGPA] = useState("");
  const [currentActivities, setCurrentActivities] = useState("");
  const [resumeStatus, setResumeStatus] = useState<ResumeStatus | null>(null);
  const [additionalContext, setAdditionalContext] = useState("");

  function toggleValue(v: string) {
    setValues((prev) => (prev.includes(v) ? prev.filter((x) => x !== v) : prev.length < 3 ? [...prev, v] : prev));
  }

  const isStudent = lifeStage === "high_school" || lifeStage === "university";
  const focusLabel = isStudent ? "What are you studying, or planning to study?" : "What field or role are you in right now?";
  const focusPlaceholder = isStudent ? "e.g. Mechanical Engineering, Undecided, Biology" : "e.g. Marketing coordinator, between jobs";

  const canSubmit =
    lifeStage &&
    furtherSchooling &&
    geographicFlexibility &&
    values.length > 0 &&
    currentFocus.trim().length > 0 &&
    resumeStatus;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="flex w-full max-w-2xl flex-col gap-6 lg:max-w-3xl"
    >
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-accent">Almost there</p>
        <h2 className="font-[family-name:var(--font-brand)] text-3xl font-medium tracking-tight">
          Your profile
        </h2>
        <p className="text-sm text-foreground/50">
          A short, specific set of questions, not graded. Your career matches are ranked partly on what you
          say here, so a real answer (not &ldquo;undecided&rdquo; if you have a direction) gets you a
          noticeably more accurate top match.
        </p>
      </div>

      <Section index="01" label="Where you're at">
        <Question prompt="Where are you in your path right now?">
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
        </Question>

        {lifeStage && (
          <Question
            prompt={focusLabel}
            description="This directly shapes your matches, e.g. if you say Engineering, we won't lead with a career in sales or law even if the simulation alone would have. Be as specific as you can."
          >
            <input
              type="text"
              value={currentFocus}
              onChange={(e) => setCurrentFocus(e.target.value)}
              placeholder={focusPlaceholder}
              className={inputClass}
            />
          </Question>
        )}

        {isStudent && (
          <Question prompt="Current GPA?" description="Optional. Helps set exact grade targets in your roadmap.">
            <input
              type="text"
              value={currentGPA}
              onChange={(e) => setCurrentGPA(e.target.value)}
              placeholder="e.g. 3.6 unweighted, or not sure yet"
              className={inputClass}
            />
          </Question>
        )}

        {lifeStage && (
          <Question
            prompt={isStudent ? "Clubs, activities, or projects you're already doing?" : "Relevant experience, projects, or activities so far?"}
            description="Optional. We build your roadmap on top of what you already have instead of ignoring it."
          >
            <input
              type="text"
              value={currentActivities}
              onChange={(e) => setCurrentActivities(e.target.value)}
              placeholder={isStudent ? "e.g. robotics club, part-time retail job, student council" : "e.g. led a small team, freelance projects, volunteer work"}
              className={inputClass}
            />
          </Question>
        )}
      </Section>

      <Section index="02" label="Your direction">
        <Question prompt="Open to more schooling if a match called for it?" description="e.g. a graduate degree, a certification, a bootcamp.">
          <OptionRow
            options={[
              { value: "yes", label: "Yes" },
              { value: "maybe", label: "Maybe" },
              { value: "no", label: "No" },
            ]}
            selected={furtherSchooling}
            onSelect={setFurtherSchooling}
          />
        </Question>

        <Question prompt="How flexible are you on location for the right opportunity?">
          <OptionRow
            options={[
              { value: "local", label: "Staying local" },
              { value: "national", label: "Open nationally" },
              { value: "global", label: "Open anywhere" },
            ]}
            selected={geographicFlexibility}
            onSelect={setGeographicFlexibility}
          />
        </Question>

        <Question prompt="Where are you located?" description="Optional.">
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. Toronto, ON or Austin, TX"
            className={inputClass}
          />
        </Question>
      </Section>

      <Section index="03" label="What matters most">
        <Question
          prompt="Pick up to 3 things that matter most in your work."
          description="Used to break ties between similarly-fitting careers, e.g. picking Money nudges toward the higher-paying option among two close matches."
        >
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
        </Question>
      </Section>

      <Section index="04" label="Practical reality">
        <Question prompt="Where's your resume or LinkedIn at right now?">
          <OptionRow
            options={[
              { value: "solid", label: "Solid, just needs targeting" },
              { value: "needs_work", label: "Exists, needs work" },
              { value: "dont_have_one", label: "Don't have one yet" },
            ]}
            selected={resumeStatus}
            onSelect={setResumeStatus}
          />
        </Question>
      </Section>

      <Section index="05" label="Anything else">
        <Question prompt="Anything else your roadmap should account for?" description="Optional. e.g. visa status, family obligations, must stay remote, specific constraints on schooling or relocation.">
          <textarea
            value={additionalContext}
            onChange={(e) => setAdditionalContext(e.target.value)}
            placeholder="e.g. visa status, family obligations, must stay remote, specific constraints on schooling or relocation"
            rows={3}
            className={`${inputClass} resize-none`}
          />
        </Question>
      </Section>

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
            values,
            currentGPA: currentGPA.trim(),
            currentActivities: currentActivities.trim(),
            resumeStatus,
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
