import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Occupation } from "@/lib/assessment/matching";
import { AdvisorFullChat } from "@/components/roadmap/AdvisorFullChat";

export const metadata: Metadata = {
  title: "Your Advisor · Vocateur",
  robots: { index: false, follow: false },
};

export default async function AdvisorPage({
  params,
}: {
  params: Promise<{ roadmapId: string }>;
}) {
  const { roadmapId } = await params;
  const supabase = await createClient();

  const { data: roadmap } = await supabase
    .from("roadmaps")
    .select("id, life_stage, occupations(title)")
    .eq("id", roadmapId)
    .single();

  if (!roadmap) notFound();

  const occupation = roadmap.occupations as unknown as Pick<Occupation, "title"> | null;

  return (
    <AdvisorFullChat
      roadmapId={roadmapId}
      lifeStage={roadmap.life_stage}
      occupationTitle={occupation?.title ?? "your match"}
    />
  );
}
