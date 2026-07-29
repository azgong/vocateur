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
  const hasRealData = occupation.bls_match_confidence !== "no_match" && occupation.bls_change_pct_2024_34 !== null;
  const averages = hasRealData ? await getDatasetAverages() : null;

  return (
    <div className="rounded-2xl border border-border-subtle bg-surface-2 p-6 print:break-inside-avoid">
      <div className="mb-4 flex items-baseline justify-between gap-2">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-foreground/50">Market outlook</h3>
        <span className="text-xs text-foreground/35">2024&ndash;2034 projections</span>
      </div>

      {hasRealData ? (
        <>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p
                className={`text-2xl font-semibold tabular-nums ${
                  (occupation.bls_change_pct_2024_34 ?? 0) >= 0 ? "text-quadrant-b" : "text-quadrant-c"
                }`}
              >
                {(occupation.bls_change_pct_2024_34 ?? 0) > 0 ? "+" : ""}
                {occupation.bls_change_pct_2024_34}%
              </p>
              <p className="text-xs text-foreground/50">Projected growth</p>
            </div>
            <div>
              <p className="text-2xl font-semibold tabular-nums">
                {occupation.bls_median_wage_2024 ? formatWage(occupation.bls_median_wage_2024) : "N/A"}
              </p>
              <p className="text-xs text-foreground/50">Median annual wage</p>
            </div>
            <div>
              <p className="text-2xl font-semibold tabular-nums">
                {occupation.bls_annual_openings_thousands ? `${occupation.bls_annual_openings_thousands}k` : "N/A"}
              </p>
              <p className="text-xs text-foreground/50">Annual openings</p>
            </div>
          </div>

          {averages && occupation.bls_median_wage_2024 !== null && (
            <div className="mt-5 flex flex-col gap-4 border-t border-border-subtle pt-5">
              <BarRow
                label="Projected growth vs. Vocateur's tracked careers"
                value={occupation.bls_change_pct_2024_34 ?? 0}
                compareValue={averages.avgGrowth}
                maxScale={30}
                format={(n) => `${n > 0 ? "+" : ""}${n.toFixed(1)}%`}
                barClassName={(occupation.bls_change_pct_2024_34 ?? 0) >= 0 ? "bg-quadrant-b" : "bg-quadrant-c"}
              />
              <BarRow
                label="Median wage vs. Vocateur's tracked careers"
                value={occupation.bls_median_wage_2024}
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
            Source: U.S. Bureau of Labor Statistics, Employment Projections program, Table 1.2 (bls.gov/emp)
          </p>
        </>
      ) : (
        <p className="text-sm text-foreground/50">
          There&rsquo;s no direct government occupational match for this specific role, so we&rsquo;re not showing
          growth or wage figures we can&rsquo;t back with a real source.
        </p>
      )}
    </div>
  );
}
