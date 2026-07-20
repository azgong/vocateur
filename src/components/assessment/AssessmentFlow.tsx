"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ProgressBar } from "./ProgressBar";
import { SceneRenderer } from "./scenes/SceneRenderer";
import { SelfReportStep } from "./SelfReportStep";
import { ModuleLog, SelfReport } from "@/lib/assessment/types";
import { CHAPTERS, SceneConfig } from "@/lib/assessment/scenes";

type Step = "intro" | "scene" | "self_report" | "submitting" | "error";

const FLAT_SCENES: SceneConfig[] = CHAPTERS.flatMap((c) => c.scenes);

function chapterInfoForIndex(index: number) {
  let cursor = 0;
  for (const chapter of CHAPTERS) {
    if (index < cursor + chapter.scenes.length) {
      return { chapter, sceneInChapter: index - cursor, chapterIndex: CHAPTERS.indexOf(chapter) };
    }
    cursor += chapter.scenes.length;
  }
  return { chapter: CHAPTERS[CHAPTERS.length - 1], sceneInChapter: 0, chapterIndex: CHAPTERS.length - 1 };
}

export function AssessmentFlow() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("intro");
  const [sceneIndex, setSceneIndex] = useState(0);
  const [logs, setLogs] = useState<ModuleLog[]>([]);
  const [selfReport, setSelfReport] = useState<SelfReport | null>(null);

  function handleSceneComplete(log: ModuleLog) {
    const nextLogs = [...logs, log];
    setLogs(nextLogs);
    if (sceneIndex + 1 < FLAT_SCENES.length) {
      setSceneIndex((i) => i + 1);
    } else {
      setStep("self_report");
    }
  }

  async function submitAssessment(report: SelfReport) {
    setStep("submitting");
    try {
      const res = await fetch("/api/assessment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ logs, selfReport: report }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStep("error");
        return;
      }
      router.push(`/results/${data.sessionId}`);
    } catch {
      setStep("error");
    }
  }

  function handleSelfReportComplete(report: SelfReport) {
    setSelfReport(report);
    submitAssessment(report);
  }

  const currentScene = FLAT_SCENES[sceneIndex];
  const { chapter, sceneInChapter, chapterIndex } = chapterInfoForIndex(sceneIndex);
  const isFirstSceneOfChapter = sceneInChapter === 0;

  return (
    <div className="flex flex-1 flex-col items-center gap-8 px-6 py-16">
      {step === "scene" && <ProgressBar chapterIndex={chapterIndex} sceneInChapter={sceneInChapter} />}

      <AnimatePresence mode="wait">
        {step === "intro" && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className="flex max-w-md flex-col items-center gap-6 text-center"
          >
            <h1 className="font-[family-name:var(--font-display)] text-4xl font-medium tracking-tight">
              Twelve scenarios. No quiz questions.
            </h1>
            <p className="text-foreground/60">
              You&rsquo;ll step into four real job worlds &mdash; an analyst call, an ER shift, a workplace conflict, and a
              founder&rsquo;s budget &mdash; three moments in each. How you move through them is the signal. Takes about 10
              minutes.
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setStep("scene")}
              className="rounded-full bg-accent px-8 py-3 text-sm font-medium text-white shadow-[0_0_28px_-8px_var(--accent)]"
            >
              Start
            </motion.button>
          </motion.div>
        )}

        {step === "scene" && (
          <motion.div key={`scene-wrap-${sceneIndex}`} className="flex w-full flex-col items-center gap-6">
            {isFirstSceneOfChapter && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="text-sm font-medium text-foreground/40"
              >
                {chapter.intro}
              </motion.p>
            )}
            <SceneRenderer key={`scene-${sceneIndex}`} scene={currentScene} onComplete={handleSceneComplete} />
          </motion.div>
        )}

        {step === "self_report" && <SelfReportStep key="self-report" onComplete={handleSelfReportComplete} />}

        {step === "submitting" && (
          <motion.div
            key="submitting"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center gap-4"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              className="h-8 w-8 rounded-full border-2 border-border-strong border-t-accent"
            />
            <p className="text-foreground/60">Unlocking your results…</p>
          </motion.div>
        )}

        {step === "error" && (
          <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-4">
            <p className="text-foreground/60">Something went wrong saving your results.</p>
            <button
              onClick={() => selfReport && submitAssessment(selfReport)}
              className="rounded-full border-2 border-border-strong px-6 py-2 text-sm font-medium"
            >
              Try again
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
