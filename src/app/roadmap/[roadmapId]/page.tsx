import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { RoadmapContent } from "@/lib/assessment/roadmap";
import { Occupation } from "@/lib/assessment/matching";
import { PrintButton } from "@/components/roadmap/PrintButton";
import { MarketOutlook } from "@/components/roadmap/MarketOutlook";
import { MilestoneChecklist } from "@/components/roadmap/MilestoneChecklist";
import { MajorMatcher } from "@/components/roadmap/MajorMatcher";
import { NetworkingTemplateCard } from "@/components/roadmap/NetworkingTemplateCard";
import { LifestyleReality } from "@/components/roadmap/LifestyleReality";
import { RevealSection } from "@/components/roadmap/RevealSection";

export const metadata: Metadata = {
  title: "Your Roadmap · Vocateur",
  robots: { index: false, follow: false },
};

export default async function RoadmapPage({
  params,
}: {
  params: Promise<{ roadmapId: string }>;
}) {
  const { roadmapId } = await params;
  const supabase = await createClient();

  const { data: roadmap } = await supabase
    .from("roadmaps")
    .select("id, content, life_stage, occupation_id, completed_items, occupations(*)")
    .eq("id", roadmapId)
    .single();

  if (!roadmap) notFound();

  const content = roadmap.content as RoadmapContent;
  const occupation = roadmap.occupations as unknown as Occupation | null;
  const occupationTitle = occupation?.title ?? "your match";
  const completedItems = (roadmap.completed_items ?? {}) as Record<string, boolean>;

  return (
    <main className="mx-auto flex w-full max-w-[1400px] flex-1 flex-col gap-10 px-6 py-16 print:py-0 lg:px-10 xl:px-16">
      <div className="flex items-start justify-between gap-4 print:hidden">
        <div>
          <p className="text-sm font-medium tracking-[0.2em] text-accent uppercase">Your roadmap</p>
          <h1 className="font-[family-name:var(--font-title)] text-4xl font-normal tracking-tight sm:text-5xl">
            Toward {occupationTitle}
          </h1>
        </div>
        <PrintButton />
      </div>

      <div
        className="relative overflow-hidden rounded-3xl p-8 print:hidden sm:p-10"
        style={{
          background:
            "linear-gradient(135deg, color-mix(in srgb, var(--quadrant-a) 14%, var(--surface-2)), color-mix(in srgb, var(--accent) 14%, var(--surface-2)) 55%, color-mix(in srgb, var(--quadrant-e) 14%, var(--surface-2)))",
        }}
      >
        <div
          className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full opacity-20 blur-3xl"
          style={{ background: "var(--accent)" }}
        />
        <p className="relative max-w-2xl text-lg leading-relaxed font-medium">{content.headline}</p>
      </div>

      <div className="grid gap-10 print:grid-cols-1 lg:grid-cols-[1fr_420px] lg:items-start">
        <div className="flex min-w-0 flex-col gap-10">
          {content.majors?.length > 0 && (
            <RevealSection>
              <MajorMatcher majors={content.majors} />
            </RevealSection>
          )}

          <RevealSection delay={0.05}>
            <MilestoneChecklist roadmapId={roadmapId} milestones={content.milestones} initialCompleted={completedItems} />
          </RevealSection>

          {content.networking && (
            <RevealSection delay={0.1}>
              <div className="flex flex-col gap-5 rounded-2xl border border-border-subtle bg-surface-2 p-6 print:break-inside-avoid">
                <div>
                  <h3 className="flex items-center gap-2 font-[family-name:var(--font-brand)] text-lg font-medium tracking-tight">
                    <span
                      className="inline-flex h-7 w-7 items-center justify-center rounded-full"
                      style={{ background: "color-mix(in srgb, var(--quadrant-c) 20%, transparent)" }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <path
                          d="M17 8h.01M3 12a9 9 0 1 0 9-9M3 12a9 9 0 0 0 9 9m-9-9h18M12 3a15 15 0 0 1 0 18"
                          stroke="var(--quadrant-c)"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    Networking &amp; outreach
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-foreground/70">{content.networking.whoToContact}</p>
                  <p className="mt-2 text-sm leading-relaxed text-foreground/70">{content.networking.howToOutreach}</p>
                </div>
                {content.networking.templates?.length > 0 && (
                  <div className="flex flex-col gap-3">
                    {content.networking.templates.map((t, i) => (
                      <NetworkingTemplateCard key={i} template={t} />
                    ))}
                  </div>
                )}
              </div>
            </RevealSection>
          )}

          {content.resources?.length > 0 && (
            <RevealSection delay={0.15}>
              <div className="flex flex-col gap-3">
                <h3 className="flex items-center gap-2 font-[family-name:var(--font-brand)] text-lg font-medium tracking-tight">
                  <span
                    className="inline-flex h-7 w-7 items-center justify-center rounded-full"
                    style={{ background: "color-mix(in srgb, var(--quadrant-d) 20%, transparent)" }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M4 19.5V6.5A2.5 2.5 0 0 1 6.5 4H20v15"
                        stroke="var(--quadrant-d)"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  Resources to look into
                </h3>
                <div className="grid gap-2 sm:grid-cols-2">
                  {content.resources.map((r, i) => (
                    <div
                      key={i}
                      className="rounded-xl border border-border-subtle bg-surface p-4 transition-colors hover:border-accent/40 print:break-inside-avoid"
                    >
                      {r.url ? (
                        <a href={r.url} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-accent underline underline-offset-2">
                          {r.name}
                        </a>
                      ) : (
                        <p className="text-sm font-medium">{r.name}</p>
                      )}
                      <p className="mt-1 text-sm leading-relaxed text-foreground/60">{r.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </RevealSection>
          )}
        </div>

        <div className="flex flex-col gap-6 lg:sticky lg:top-8">
          {occupation && (
            <RevealSection delay={0.05}>
              <MarketOutlook occupation={occupation} />
            </RevealSection>
          )}
          {occupation && (
            <RevealSection delay={0.1}>
              <LifestyleReality occupation={occupation} />
            </RevealSection>
          )}
        </div>
      </div>
    </main>
  );
}
