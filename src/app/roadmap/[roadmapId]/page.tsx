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
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-6 py-16 print:py-0 lg:px-8">
      <div className="flex items-start justify-between gap-4 print:hidden">
        <div>
          <p className="text-sm font-medium tracking-[0.2em] text-accent uppercase">Your roadmap</p>
          <h1 className="font-[family-name:var(--font-title)] text-4xl font-normal tracking-tight">
            Toward {occupationTitle}
          </h1>
        </div>
        <PrintButton />
      </div>

      <div className="grid gap-10 print:grid-cols-1 lg:grid-cols-[1fr_380px] lg:items-start">
        <div className="flex min-w-0 flex-col gap-10">
          <p className="text-lg leading-relaxed text-foreground/70">{content.headline}</p>

          {content.majors?.length > 0 && <MajorMatcher majors={content.majors} />}

          <MilestoneChecklist roadmapId={roadmapId} milestones={content.milestones} initialCompleted={completedItems} />

          {content.networking && (
            <div className="flex flex-col gap-5 rounded-2xl border border-border-subtle bg-surface-2 p-6 print:break-inside-avoid">
              <div>
                <h3 className="font-[family-name:var(--font-brand)] text-lg font-medium tracking-tight">Networking &amp; outreach</h3>
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
          )}

          {content.resources?.length > 0 && (
            <div className="flex flex-col gap-3">
              <h3 className="font-[family-name:var(--font-brand)] text-lg font-medium tracking-tight">Resources to look into</h3>
              <div className="flex flex-col gap-2">
                {content.resources.map((r, i) => (
                  <div key={i} className="rounded-xl border border-border-subtle bg-surface p-4 print:break-inside-avoid">
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
          )}
        </div>

        <div className="flex flex-col gap-6 lg:sticky lg:top-8">
          {occupation && <MarketOutlook occupation={occupation} />}
          {occupation && <LifestyleReality occupation={occupation} />}
        </div>
      </div>
    </main>
  );
}
