import type { Metadata } from "next";
import { AssessmentFlow } from "@/components/assessment/AssessmentFlow";

export const metadata: Metadata = {
  title: "Take the Assessment · Vocateur",
  description:
    "Step into four real job simulations and find out which career actually fits how you think. Free to see your top match.",
  alternates: { canonical: "https://vocateur.app/assessment" },
};

export default async function AssessmentPage({
  searchParams,
}: {
  searchParams: Promise<{ checkout?: string }>;
}) {
  const { checkout } = await searchParams;

  return (
    <>
      {checkout === "success" && (
        <div className="mx-auto mt-6 w-full max-w-2xl px-6">
          <div className="rounded-2xl border border-accent/30 bg-accent/[0.06] px-5 py-3 text-center text-sm text-accent">
            You&rsquo;re on Pro. Finish the assessment below and your full results, roadmap, and advisor will
            already be unlocked.
          </div>
        </div>
      )}
      <AssessmentFlow />
    </>
  );
}
