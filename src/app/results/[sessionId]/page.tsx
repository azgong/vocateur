import { createAdminClient } from "@/lib/supabase/admin";
import { notFound } from "next/navigation";

export default async function ResultsPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = await params;
  const supabase = createAdminClient();
  const { data: session } = await supabase
    .from("assessment_sessions")
    .select("id, trait_vector, life_stage, created_at")
    .eq("id", sessionId)
    .single();

  if (!session) notFound();

  return (
    <main className="flex flex-1 flex-col items-center gap-6 px-6 py-24 text-center">
      <h1 className="text-3xl font-semibold tracking-tight">Results are in</h1>
      <p className="max-w-md text-zinc-500">
        Matching engine and full results screen land next — for now, here&rsquo;s the raw trait read from your
        session.
      </p>
      <pre className="max-w-md overflow-x-auto rounded-xl bg-zinc-100 p-4 text-left text-xs dark:bg-zinc-900">
        {JSON.stringify(session.trait_vector, null, 2)}
      </pre>
    </main>
  );
}
