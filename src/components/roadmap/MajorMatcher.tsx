import { MajorMatch } from "@/lib/assessment/roadmap";

const STATUS_META: Record<MajorMatch["status"], { label: string; badgeClass: string }> = {
  recommended: {
    label: "Recommended Major",
    badgeClass: "border-emerald-500/30 bg-emerald-500/15 text-emerald-400",
  },
  alternative: {
    label: "Alternative Major",
    badgeClass: "border-amber-500/30 bg-amber-500/15 text-amber-400",
  },
  avoid: {
    label: "Avoid",
    badgeClass: "border-neutral-500/30 bg-neutral-500/15 text-neutral-400",
  },
};

export function MajorMatcher({ majors }: { majors: MajorMatch[] }) {
  if (!majors.length) return null;

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border-subtle bg-surface-2 p-6 print:break-inside-avoid">
      <h3 className="font-[family-name:var(--font-brand)] text-lg font-medium tracking-tight">Major matcher</h3>
      <div className="flex flex-col gap-2.5">
        {majors.map((m) => (
          <div
            key={m.name}
            className="flex flex-col gap-2 rounded-xl border border-border-subtle bg-surface p-4 print:break-inside-avoid sm:flex-row sm:items-start sm:gap-4"
          >
            <span
              className={`inline-flex w-fit shrink-0 items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${STATUS_META[m.status].badgeClass}`}
            >
              {STATUS_META[m.status].label}
            </span>
            <div className="min-w-0">
              <p className="text-sm font-medium">{m.name}</p>
              <p className="mt-0.5 text-sm leading-relaxed text-foreground/60">{m.note}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
