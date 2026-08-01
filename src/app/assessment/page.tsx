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
  searchParams: Promise<{ checkout?: string; beta?: string }>;
}) {
  const { checkout, beta } = await searchParams;

  return (
    <>
      {checkout === "success" && (
        <div className="mx-auto mt-6 w-full max-w-2xl px-6">
          <div className="rounded-2xl border border-accent/30 bg-accent/[0.06] px-5 py-3 text-center text-sm text-accent">
            You&rsquo;re on Pro. Finish the assessment below and your full results and roadmap will already be
            unlocked.
          </div>
        </div>
      )}
      {beta === "granted" && (
        <div className="mx-auto mt-6 w-full max-w-2xl px-6">
          <div className="rounded-2xl border border-accent/30 bg-accent/[0.06] px-5 py-3 text-center text-sm text-accent">
            You&rsquo;re in the beta, full Pro access is unlocked free for 7 days. Finish the assessment below to see
            everything.
          </div>
        </div>
      )}
      <AssessmentFlow />
    </>
  );
}
