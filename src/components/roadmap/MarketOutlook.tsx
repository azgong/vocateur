import { Occupation } from "@/lib/assessment/matching";

function formatWage(wage: number) {
  return `$${Math.round(wage).toLocaleString()}`;
}

export function MarketOutlook({ occupation }: { occupation: Occupation }) {
  const hasRealData = occupation.bls_match_confidence !== "no_match" && occupation.bls_change_pct_2024_34 !== null;

  return (
    <div className="rounded-2xl border border-border-subtle bg-surface-2 p-6">
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
          growth or wage figures we can&rsquo;t back with a real source. Ask your advisor for context on the
          broader field instead.
        </p>
      )}
    </div>
  );
}
