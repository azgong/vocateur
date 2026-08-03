import { Occupation } from "@/lib/assessment/matching";
import { createAdminClient } from "@/lib/supabase/admin";

function formatWage(wage: number) {
  return `$${Math.round(wage).toLocaleString()}`;
}

async function getDatasetAverages() {
  const admin = createAdminClient();
  const { data } = await admin
    .from("occupations")
    .select("bls_change_pct_2024_34, bls_median_wage_2024")
    .not("bls_change_pct_2024_34", "is", null)
    .not("bls_median_wage_2024", "is", null);

  if (!data || data.length === 0) return null;

  const avgGrowth = data.reduce((sum, o) => sum + (o.bls_change_pct_2024_34 ?? 0), 0) / data.length;
  const avgWage = data.reduce((sum, o) => sum + (o.bls_median_wage_2024 ?? 0), 0) / data.length;
  return { avgGrowth, avgWage, count: data.length };
}

function BarRow({
  label,
  value,
  compareValue,
  maxScale,
  format,
  barClassName,
}: {
  label: string;
  value: number;
  compareValue: number;
  maxScale: number;
  format: (n: number) => string;
  barClassName: string;
}) {
  const valuePct = Math.min(100, Math.max(2, (Math.abs(value) / maxScale) * 100));
  const comparePct = Math.min(100, Math.max(2, (Math.abs(compareValue) / maxScale) * 100));
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-foreground/60">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="w-16 shrink-0 text-[11px] text-foreground/40">This role</span>
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-surface">
          <div className={`h-full rounded-full ${barClassName}`} style={{ width: `${valuePct}%` }} />
        </div>
        <span className="w-20 shrink-0 text-right text-xs font-semibold tabular-nums">{format(value)}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="w-16 shrink-0 text-[11px] text-foreground/40">Dataset avg</span>
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-surface">
          <div className="h-full rounded-full bg-foreground/25" style={{ width: `${comparePct}%` }} />
        </div>
        <span className="w-20 shrink-0 text-right text-xs text-foreground/50 tabular-nums">{format(compareValue)}</span>
      </div>
    </div>
  );
}

export async function MarketOutlook({ occupation }: { occupation: Occupation }) {
  // Real BLS figures per field where we have them; otherwise fall back to
  // Vocateur's own curated median_salary / growth_pct rather than showing
  // nothing, even when the occupation otherwise has a real BLS match (growth
  // can be real while wage is separately null, and vice versa). A few roles
  // (e.g. startup founder) carry 0/0 on both fallback fields as a "not
  // applicable" sentinel, not a real estimate, since a single salary figure
  // doesn't mean anything for that kind of role, so that combination gets
  // its own honest message instead of a fabricated "$0".
  const hasMatch = occupation.bls_match_confidence !== "no_match";
  const growthReal = hasMatch && occupation.bls_change_pct_2024_34 !== null;
  const wageReal = hasMatch && occupation.bls_median_wage_2024 !== null;
  const openings = hasMatch ? occupation.bls_annual_openings_thousands : null;
  const zeroSentinel = occupation.median_salary === 0 && occupation.growth_pct === 0;

  const averages = growthReal || wageReal ? await getDatasetAverages() : null;

  if (!growthReal && !wageReal && zeroSentinel) {
    return (
      <div className="rounded-2xl border border-border-subtle bg-surface-2 p-6 print:break-inside-avoid">
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-foreground/50">Market outlook</h3>
        <p className="text-sm text-foreground/60">
          Pay and growth here are too variable to reduce to a single figure, it depends heavily on the specific
          venture, so we&rsquo;re not showing a number we&rsquo;d have to make up.
        </p>
      </div>
    );
  }

  const growth = growthReal ? occupation.bls_change_pct_2024_34! : occupation.growth_pct;
  const wage = wageReal ? occupation.bls_median_wage_2024! : occupation.median_salary || null;
  const anyEstimated = !growthReal || !wageReal;

  return (
    <div className="rounded-2xl border border-border-subtle bg-surface-2 p-6 print:break-inside-avoid">
      <div className="mb-4 flex items-baseline justify-between gap-2">
        <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-foreground/50">
          <span
            className="inline-flex h-6 w-6 items-center justify-center rounded-full"
            style={{ background: "color-mix(in srgb, var(--quadrant-a) 18%, transparent)" }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
              <path d="M3 21h18M6 21V10l6-6 6 6v11M9 21v-6h6v6" stroke="var(--quadrant-a)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          Market outlook
        </h3>
        <span className="text-xs text-foreground/35">2024&ndash;2034 projections</span>
      </div>

      <div className={`grid gap-4 ${openings !== null ? "grid-cols-3" : "grid-cols-2"}`}>
        <div>
          <p className={`text-2xl font-semibold tabular-nums ${growth >= 0 ? "text-quadrant-b" : "text-quadrant-c"}`}>
            {growth > 0 ? "+" : ""}
            {growth}%
          </p>
          <p className="text-xs text-foreground/50">
            Projected growth
            {!growthReal && <span className="ml-1 text-foreground/35">(estimate)</span>}
          </p>
        </div>
        <div>
          <p className="text-2xl font-semibold tabular-nums">{wage != null ? formatWage(wage) : "N/A"}</p>
          <p className="text-xs text-foreground/50">
            Median annual wage
            {!wageReal && wage != null && <span className="ml-1 text-foreground/35">(estimate)</span>}
          </p>
        </div>
        {openings !== null && (
          <div>
            <p className="text-2xl font-semibold tabular-nums">{openings}k</p>
            <p className="text-xs text-foreground/50">Annual openings</p>
          </div>
        )}
      </div>

      {averages && growthReal && wageReal && (
        <div className="mt-5 flex flex-col gap-4 border-t border-border-subtle pt-5">
          <BarRow
            label="Projected growth vs. Vocateur's tracked careers"
            value={occupation.bls_change_pct_2024_34!}
            compareValue={averages.avgGrowth}
            maxScale={30}
            format={(n) => `${n > 0 ? "+" : ""}${n.toFixed(1)}%`}
            barClassName={occupation.bls_change_pct_2024_34! >= 0 ? "bg-quadrant-b" : "bg-quadrant-c"}
          />
          <BarRow
            label="Median wage vs. Vocateur's tracked careers"
            value={occupation.bls_median_wage_2024!}
            compareValue={averages.avgWage}
            maxScale={250000}
            format={formatWage}
            barClassName="bg-accent"
          />
          <p className="text-[11px] text-foreground/35">
            Compared against the {averages.count} careers in Vocateur&rsquo;s own dataset with real BLS figures,
            not a claimed national statistic.
          </p>
        </div>
      )}

      {occupation.bls_match_confidence === "approximate" && (
        <p className="mt-3 text-xs text-foreground/40">
          Approximate match: {occupation.bls_match_note ?? "closest available government category, not an exact title match."}
        </p>
      )}

      <p className="mt-3 text-xs text-foreground/35">
        {growthReal || wageReal
          ? "Source: U.S. Bureau of Labor Statistics, Employment Projections program, Table 1.2 (bls.gov/emp)."
          : null}
        {anyEstimated && (
          <>
            {(growthReal || wageReal) && " "}
            {!hasMatch
              ? "No direct government occupational match for this specific role, so figures marked (estimate) are Vocateur's own, not a BLS number."
              : "Figures marked (estimate) aren't in the BLS dataset for this specific role and are Vocateur's own estimate instead."}
          </>
        )}
      </p>
    </div>
  );
}
