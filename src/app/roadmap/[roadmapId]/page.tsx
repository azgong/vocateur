import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { RoadmapContent } from "@/lib/assessment/roadmap";
import { PrintButton } from "@/components/roadmap/PrintButton";

export default async function RoadmapPage({
  params,
}: {
  params: Promise<{ roadmapId: string }>;
}) {
  const { roadmapId } = await params;
  const supabase = await createClient();

  const { data: roadmap } = await supabase
    .from("roadmaps")
    .select("id, content, life_stage, occupation_id, occupations(title)")
    .eq("id", roadmapId)
    .single();

  if (!roadmap) notFound();

  const content = roadmap.content as RoadmapContent;
  const occupationTitle = (roadmap.occupations as unknown as { title: string } | null)?.title ?? "your match";

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-10 px-6 py-16 print:py-0">
      <div className="flex items-start justify-between gap-4 print:hidden">
        <div>
          <p className="text-sm font-medium text-zinc-500">Your roadmap</p>
          <h1 className="text-2xl font-semibold tracking-tight">Toward {occupationTitle}</h1>
        </div>
        <PrintButton />
      </div>

      <p className="text-lg leading-relaxed text-zinc-700 dark:text-zinc-300">{content.headline}</p>

      <ol className="relative flex flex-col gap-8 border-l-2 border-zinc-200 pl-6 dark:border-zinc-800">
        {content.milestones.map((m, i) => (
          <li key={i} className="relative">
            <span className="absolute -left-[31px] top-1 h-3 w-3 rounded-full bg-zinc-900 dark:bg-zinc-100" />
            <span className="text-xs font-semibold uppercase tracking-wide text-zinc-400">{m.timeframe}</span>
            <h3 className="text-lg font-semibold tracking-tight">{m.title}</h3>
            <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{m.description}</p>
          </li>
        ))}
      </ol>

      {content.networkingScript && (
        <div className="rounded-2xl bg-zinc-50 p-6 dark:bg-zinc-900">
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-zinc-500">Sample outreach message</h3>
          <p className="text-sm italic leading-relaxed text-zinc-700 dark:text-zinc-300">{content.networkingScript}</p>
        </div>
      )}
    </main>
  );
}
