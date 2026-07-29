import { ScrollReveal } from "@/components/ScrollReveal";
import { GeometricAccent } from "@/components/GeometricAccent";
import { createAdminClient } from "@/lib/supabase/admin";

export async function DataSection() {
  const admin = createAdminClient();
  const { count } = await admin.from("occupations").select("id", { count: "exact", head: true });

  return (
    <ScrollReveal>
      <section className="relative flex flex-col gap-8 overflow-hidden rounded-3xl border border-border-subtle bg-surface p-8 sm:p-10">
        <GeometricAccent className="pointer-events-none absolute -top-10 -right-14 hidden w-48 opacity-25 sm:block" />
        <div className="relative text-center">
          <p className="text-sm font-medium tracking-[0.2em] text-accent uppercase">Real data, not vibes</p>
          <h2 className="font-[family-name:var(--font-title)] text-4xl font-normal tracking-tight sm:text-5xl">
            Every career is backed by government labor data
          </h2>
        </div>
        <div className="grid gap-6 text-center sm:grid-cols-3">
          <Stat value={String(count ?? 178)} label="careers mapped to real occupation codes" />
          <Stat value="2024–2034" label="U.S. Bureau of Labor Statistics projection cycle" />
          <Stat value="3" label="real figures per career: growth, wage, openings" />
        </div>
        <p className="mx-auto max-w-xl text-center text-sm leading-relaxed text-foreground/60">
          Every match on your roadmap shows the real projected growth rate, median annual wage, and annual job
          openings for that occupation, sourced from the BLS Employment Projections program. Where a career
          doesn&rsquo;t have its own government occupation code, we say so directly and show which closest code we
          used instead of making up a number.
        </p>
        <p className="text-center text-xs text-foreground/40">Source: U.S. Bureau of Labor Statistics, Employment Projections program (bls.gov/emp)</p>
      </section>
    </ScrollReveal>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="font-[family-name:var(--font-brand)] text-3xl font-medium text-accent">{value}</span>
      <span className="text-sm text-foreground/50">{label}</span>
    </div>
  );
}
