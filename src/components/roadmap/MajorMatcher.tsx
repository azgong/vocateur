"use client";

import { motion } from "framer-motion";
import { MajorMatch } from "@/lib/assessment/roadmap";

const STATUS_META: Record<MajorMatch["status"], { label: string; badgeClass: string; dot: string }> = {
  recommended: {
    label: "Recommended Major",
    badgeClass: "border-emerald-500/30 bg-emerald-500/15 text-emerald-400",
    dot: "var(--quadrant-b)",
  },
  alternative: {
    label: "Alternative Major",
    badgeClass: "border-amber-500/30 bg-amber-500/15 text-amber-400",
    dot: "var(--quadrant-d)",
  },
  avoid: {
    label: "Avoid",
    badgeClass: "border-neutral-500/30 bg-neutral-500/15 text-neutral-400",
    dot: "var(--quadrant-c)",
  },
};

export function MajorMatcher({ majors }: { majors: MajorMatch[] }) {
  if (!majors.length) return null;

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border-subtle bg-surface-2 p-6 print:break-inside-avoid">
      <h3 className="flex items-center gap-2 font-[family-name:var(--font-brand)] text-lg font-medium tracking-tight">
        <span
          className="inline-flex h-7 w-7 items-center justify-center rounded-full"
          style={{ background: "color-mix(in srgb, var(--quadrant-d) 20%, transparent)" }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M22 10L12 5 2 10l10 5 10-5Z" stroke="var(--quadrant-d)" strokeWidth="2" strokeLinejoin="round" />
            <path d="M6 12v5c0 1.1 2.7 3 6 3s6-1.9 6-3v-5" stroke="var(--quadrant-d)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        Major matcher
      </h3>
      <div className="flex flex-col gap-2.5">
        {majors.map((m, i) => (
          <motion.div
            key={m.name}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.4, delay: Math.min(i, 6) * 0.05, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -2 }}
            className="relative flex flex-col gap-2 overflow-hidden rounded-xl border border-border-subtle bg-surface p-4 print:break-inside-avoid sm:flex-row sm:items-start sm:gap-4"
          >
            <span className="absolute inset-y-0 left-0 w-1" style={{ background: STATUS_META[m.status].dot }} />
            <span
              className={`inline-flex w-fit shrink-0 items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${STATUS_META[m.status].badgeClass}`}
            >
              {STATUS_META[m.status].label}
            </span>
            <div className="min-w-0">
              <p className="text-sm font-medium">{m.name}</p>
              <p className="mt-0.5 text-sm leading-relaxed text-foreground/60">{m.note}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
