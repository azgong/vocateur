import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { RoadmapContent } from "@/lib/assessment/roadmap";
import { Occupation } from "@/lib/assessment/matching";
import { PrintButton } from "@/components/roadmap/PrintButton";
import { ChatPanel } from "@/components/roadmap/ChatPanel";
import { MarketOutlook } from "@/components/roadmap/MarketOutlook";

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
    .select("id, content, life_stage, occupation_id, occupations(*)")
    .eq("id", roadmapId)
    .single();

  if (!roadmap) notFound();

  const content = roadmap.content as RoadmapContent;
  const occupation = roadmap.occupations as unknown as Occupation | null;
  const occupationTitle = occupation?.title ?? "your match";

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-10 px-6 py-16 print:py-0 lg:px-0">
      <div className="flex items-start justify-between gap-4 print:hidden">
        <div>
          <p className="text-sm font-medium tracking-[0.2em] text-accent uppercase">Your roadmap</p>
          <h1 className="font-[family-name:var(--font-brand)] text-3xl font-medium tracking-tight">
            Toward {occupationTitle}
          </h1>
        </div>
        <PrintButton />
      </div>

      <p className="text-lg leading-relaxed text-foreground/70">{content.headline}</p>

      <ol className="relative flex flex-col gap-8 border-l-2 border-border-subtle pl-6">
        {content.milestones.map((m, i) => (
          <li key={i} className="relative">
            <span className="absolute -left-[31px] top-1 h-3 w-3 rounded-full bg-accent shadow-[0_0_12px_-2px_var(--accent)]" />
            <span className="text-xs font-semibold uppercase tracking-wide text-accent/70">{m.timeframe}</span>
            <h3 className="font-[family-name:var(--font-brand)] text-xl font-medium tracking-tight">{m.title}</h3>
            <p className="text-sm leading-relaxed text-foreground/60">{m.description}</p>
            {m.actionItems?.length > 0 && (
              <ul className="mt-2 flex flex-col gap-1.5">
                {m.actionItems.map((item, j) => (
                  <li key={j} className="flex gap-2 text-sm leading-relaxed text-foreground/60">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-foreground/30" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ol>

      {occupation && <MarketOutlook occupation={occupation} />}

      {content.networking && (
        <div className="flex flex-col gap-5 rounded-2xl border border-border-subtle bg-surface-2 p-6">
          <div>
            <h3 className="font-[family-name:var(--font-brand)] text-lg font-medium tracking-tight">Networking &amp; outreach</h3>
            <p className="mt-2 text-sm leading-relaxed text-foreground/70">{content.networking.whoToContact}</p>
            <p className="mt-2 text-sm leading-relaxed text-foreground/70">{content.networking.howToOutreach}</p>
          </div>
          {content.networking.templates?.length > 0 && (
            <div className="flex flex-col gap-3">
              {content.networking.templates.map((t, i) => (
                <div key={i} className="rounded-xl border border-border-subtle bg-surface p-4">
                  <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-foreground/50">{t.label}</p>
                  <p className="text-sm italic leading-relaxed text-foreground/70">{t.message}</p>
                </div>
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
              <div key={i} className="rounded-xl border border-border-subtle bg-surface p-4">
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

      <ChatPanel roadmapId={roadmapId} />
    </main>
  );
}
