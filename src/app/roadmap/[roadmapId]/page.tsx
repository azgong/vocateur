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
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-10 px-6 py-16 print:py-0">
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
          </li>
        ))}
      </ol>

      {occupation && <MarketOutlook occupation={occupation} />}

      {content.networkingScript && (
        <div className="rounded-2xl border border-border-subtle bg-surface-2 p-6">
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-foreground/50">Sample outreach message</h3>
          <p className="text-sm italic leading-relaxed text-foreground/70">{content.networkingScript}</p>
        </div>
      )}

      <ChatPanel roadmapId={roadmapId} />
    </main>
  );
}
