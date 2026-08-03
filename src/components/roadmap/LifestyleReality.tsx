import { Occupation } from "@/lib/assessment/matching";

const INTENSITY_META: Record<NonNullable<Occupation["lifestyle_intensity"]>, { label: string; className: string; fill: number }> = {
  low: { label: "Low intensity", className: "text-quadrant-b bg-quadrant-b/15 border-quadrant-b/30", fill: 25 },
  moderate: { label: "Moderate intensity", className: "text-amber-400 bg-amber-500/15 border-amber-500/30", fill: 50 },
  high: { label: "High intensity", className: "text-orange-400 bg-orange-500/15 border-orange-500/30", fill: 75 },
  extreme: { label: "Extreme intensity", className: "text-quadrant-c bg-quadrant-c/15 border-quadrant-c/30", fill: 100 },
};

export function LifestyleReality({ occupation }: { occupation: Occupation }) {
  const hasData = occupation.lifestyle_reality || occupation.typical_hours || occupation.remote_friendliness;
  if (!hasData) return null;

  const intensity = occupation.lifestyle_intensity ? INTENSITY_META[occupation.lifestyle_intensity] : null;

  return (
    <div className="rounded-2xl border border-border-subtle bg-surface-2 p-6 print:break-inside-avoid">
      <div className="mb-4 flex items-baseline justify-between gap-2">
        <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-foreground/50">
          <span
            className="inline-flex h-6 w-6 items-center justify-center rounded-full"
            style={{ background: "color-mix(in srgb, var(--quadrant-e) 18%, transparent)" }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" stroke="var(--quadrant-e)" strokeWidth="2" />
              <path d="M12 7v5l3 3" stroke="var(--quadrant-e)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          Day in the life
        </h3>
        {intensity && (
          <span className={`shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${intensity.className}`}>
            {intensity.label}
          </span>
        )}
      </div>

      {intensity && (
        <div className="mb-4 h-1.5 w-full overflow-hidden rounded-full bg-surface">
          <div className={`h-full rounded-full ${intensity.className.split(" ")[0].replace("text-", "bg-")}`} style={{ width: `${intensity.fill}%` }} />
        </div>
      )}

      {(occupation.typical_hours || occupation.remote_friendliness) && (
        <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {occupation.typical_hours && (
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-foreground/40">Typical hours</p>
              <p className="mt-1 text-sm text-foreground/80">{occupation.typical_hours}</p>
            </div>
          )}
          {occupation.remote_friendliness && (
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-foreground/40">Remote friendliness</p>
              <p className="mt-1 text-sm text-foreground/80">{occupation.remote_friendliness}</p>
            </div>
          )}
        </div>
      )}

      {occupation.lifestyle_reality && (
        <p className="text-sm leading-relaxed text-foreground/70">{occupation.lifestyle_reality}</p>
      )}
    </div>
  );
}
