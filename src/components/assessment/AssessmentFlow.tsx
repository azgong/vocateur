"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ProgressBar } from "./ProgressBar";
import { AnalystModule } from "./modules/AnalystModule";
import { PhysicianModule } from "./modules/PhysicianModule";
import { ExecutiveModule } from "./modules/ExecutiveModule";
import { FounderModule } from "./modules/FounderModule";
import { SelfReportStep } from "./SelfReportStep";
import { ModuleLog, SelfReport } from "@/lib/assessment/types";

type Step = "intro" | "module" | "self_report" | "submitting" | "error";

const MODULES = [AnalystModule, PhysicianModule, ExecutiveModule, FounderModule];

export function AssessmentFlow() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("intro");
  const [moduleIndex, setModuleIndex] = useState(0);
  const [logs, setLogs] = useState<ModuleLog[]>([]);
  const [selfReport, setSelfReport] = useState<SelfReport | null>(null);

  function handleModuleComplete(log: ModuleLog) {
    const nextLogs = [...logs, log];
    setLogs(nextLogs);
    if (moduleIndex + 1 < MODULES.length) {
      setModuleIndex((i) => i + 1);
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

  const CurrentModule = MODULES[moduleIndex];

  return (
    <div className="flex flex-1 flex-col items-center gap-10 px-6 py-16">
      {step === "module" && <ProgressBar currentModuleIndex={moduleIndex} />}

      <AnimatePresence>
        {step === "intro" && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className="flex max-w-md flex-col items-center gap-6 text-center"
          >
            <h1 className="text-3xl font-semibold tracking-tight">Four scenarios. No quiz questions.</h1>
            <p className="text-zinc-500 dark:text-zinc-400">
              You&rsquo;ll step into four real job moments — an analyst call, an ER shift, a workplace conflict, and a
              founder&rsquo;s budget. How you move through each one is the signal. Takes about 5 minutes.
            </p>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => setStep("module")}
              className="rounded-full bg-zinc-900 px-8 py-3 text-sm font-medium text-white dark:bg-zinc-100 dark:text-zinc-900"
            >
              Start
            </motion.button>
          </motion.div>
        )}

        {step === "module" && <CurrentModule key={`module-${moduleIndex}`} onComplete={handleModuleComplete} />}

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
              className="h-8 w-8 rounded-full border-2 border-zinc-300 border-t-zinc-900 dark:border-zinc-700 dark:border-t-zinc-100"
            />
            <p className="text-zinc-500">Unlocking your results…</p>
          </motion.div>
        )}

        {step === "error" && (
          <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-4">
            <p className="text-zinc-600 dark:text-zinc-400">Something went wrong saving your results.</p>
            <button
              onClick={() => selfReport && submitAssessment(selfReport)}
              className="rounded-full border-2 border-zinc-300 px-6 py-2 text-sm font-medium dark:border-zinc-700"
            >
              Try again
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
