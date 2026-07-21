import type { Metadata } from "next";
import { AssessmentFlow } from "@/components/assessment/AssessmentFlow";

export const metadata: Metadata = {
  title: "Take the Assessment · Vocateur",
  description:
    "Step into four real job simulations and find out which career actually fits how you think. Free to see your top match.",
  alternates: { canonical: "https://vocateur.app/assessment" },
};

export default function AssessmentPage() {
  return <AssessmentFlow />;
}
