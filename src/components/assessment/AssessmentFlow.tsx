"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ProgressBar } from "./ProgressBar";
import { SceneRenderer } from "./scenes/SceneRenderer";
import { GameRenderer } from "./games/GameRenderer";
import { SelfReportStep } from "./SelfReportStep";
import { ModuleLog, SelfReport } from "@/lib/assessment/types";
import { CHAPTERS, SceneConfig } from "@/lib/assessment/scenes";
import { GAMES, GameResult, TOTAL_GAMES } from "@/lib/assessment/games";
import { QUADRANT_META, CHAPTER_QUADRANT } from "@/lib/assessment/quadrantStyle";

type Step = "intro" | "chapter_intro" | "scene" | "skill_lab_intro" | "game" | "self_report" | "submitting" | "error";
type ResumableStep = "chapter_intro" | "scene" | "skill_lab_intro" | "game" | "self_report";

const FLAT_SCENES: SceneConfig[] = CHAPTERS.flatMap((c) => c.scenes);
const STORAGE_KEY = "vocateur_assessment_progress";

type SavedProgress = {
  step: ResumableStep;
  sceneIndex: number;
  logs: ModuleLog[];
  gameIndex?: number;
  gameResults?: GameResult[];
};

function isResumableStep(step: Step): step is ResumableStep {
  return (
    step === "chapter_intro" ||
    step === "scene" ||
    step === "skill_lab_intro" ||
    step === "game" ||
    step === "self_report"
  );
}

function subscribeToStorage() {
  return () => {};
}

function getStorageSnapshot(): string | null {
  return window.localStorage.getItem(STORAGE_KEY);
}

function getStorageServerSnapshot(): string | null {
  return null;
}

function parseSavedProgress(raw: string | null): SavedProgress | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as SavedProgress;
    const gameIndex = parsed.gameIndex ?? 0;
    const gameResults = parsed.gameResults ?? [];
    if (
      !isResumableStep(parsed.step) ||
      !Array.isArray(parsed.logs) ||
      parsed.logs.length !== parsed.sceneIndex ||
      parsed.sceneIndex > FLAT_SCENES.length ||
      !Array.isArray(gameResults) ||
      gameResults.length !== gameIndex ||
      gameIndex > TOTAL_GAMES
    ) {
      return null;
    }
    return { ...parsed, gameIndex, gameResults };
  } catch {
    return null;
  }
}

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
  const [gameIndex, setGameIndex] = useState(0);
  const [gameResults, setGameResults] = useState<GameResult[]>([]);
  const [selfReport, setSelfReport] = useState<SelfReport | null>(null);
  const [resumeDismissed, setResumeDismissed] = useState(false);

  const savedProgressRaw = useSyncExternalStore(subscribeToStorage, getStorageSnapshot, getStorageServerSnapshot);
  const resumeData = resumeDismissed ? null : parseSavedProgress(savedProgressRaw);

  useEffect(() => {
    if (!isResumableStep(step)) return;
    const toSave: SavedProgress = { step, sceneIndex, logs, gameIndex, gameResults };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  }, [step, sceneIndex, logs, gameIndex, gameResults]);

  function handleResume() {
    if (!resumeData) return;
    setSceneIndex(resumeData.sceneIndex);
    setLogs(resumeData.logs);
    setGameIndex(resumeData.gameIndex ?? 0);
    setGameResults(resumeData.gameResults ?? []);
    setStep(resumeData.step);
    setResumeDismissed(true);
  }

  function handleStartOver() {
    window.localStorage.removeItem(STORAGE_KEY);
    setResumeDismissed(true);
  }

  function handleSceneComplete(log: ModuleLog) {
    const nextLogs = [...logs, log];
    setLogs(nextLogs);
    if (sceneIndex + 1 < FLAT_SCENES.length) {
      const nextIndex = sceneIndex + 1;
      setSceneIndex(nextIndex);
      const { sceneInChapter } = chapterInfoForIndex(nextIndex);
      setStep(sceneInChapter === 0 ? "chapter_intro" : "scene");
    } else {
      setSceneIndex(FLAT_SCENES.length);
      setStep("skill_lab_intro");
    }
  }

  function handleGameComplete(result: GameResult) {
    const nextResults = [...gameResults, result];
    setGameResults(nextResults);
    if (gameIndex + 1 < TOTAL_GAMES) {
      setGameIndex(gameIndex + 1);
    } else {
      setGameIndex(TOTAL_GAMES);
      setStep("self_report");
    }
  }

  async function submitAssessment(report: SelfReport) {
    setStep("submitting");
    try {
      const res = await fetch("/api/assessment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ logs, gameResults, selfReport: report }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStep("error");
        return;
      }
      window.localStorage.removeItem(STORAGE_KEY);
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
  const chapterMeta = QUADRANT_META[CHAPTER_QUADRANT[chapter.id]];

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-8 px-6 py-12">
      {step === "scene" && <ProgressBar chapterIndex={chapterIndex} sceneInChapter={sceneInChapter} />}

      <AnimatePresence mode="wait">
        {step === "intro" && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="flex max-w-xl flex-col items-center gap-6 text-center lg:max-w-2xl xl:max-w-3xl"
          >
            <h1 className="font-[family-name:var(--font-brand)] text-4xl font-medium tracking-tight lg:text-5xl">
              Know your fate in ten minutes.
            </h1>
            <p className="text-foreground/60 lg:text-lg">
              Twenty-eight real job moments across four worlds: an analyst call, an ER shift, a workplace conflict,
              and a founder&rsquo;s budget. Then five quick skill games test your reflexes, memory, and precision.
              How you move through all of it is the signal. No quiz questions.
            </p>
            {resumeData ? (
              <div className="flex flex-col items-center gap-3">
                <p className="text-sm font-medium text-accent">
                  {resumeData.step === "self_report"
                    ? "You finished the scenarios and the Skill Lab. Just a few questions left."
                    : resumeData.step === "skill_lab_intro" || resumeData.step === "game"
                      ? `Scenarios done. You're in the Skill Lab, game ${(resumeData.gameIndex ?? 0) + 1} of ${TOTAL_GAMES}.`
                      : `You're partway through, scene ${resumeData.sceneIndex + 1} of ${FLAT_SCENES.length}.`}
                </p>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleResume}
                    className="rounded-full bg-accent px-8 py-3 text-sm font-medium text-white shadow-[0_0_28px_-8px_var(--accent)]"
                  >
                    Continue where I left off
                  </motion.button>
                  <button
                    onClick={handleStartOver}
                    className="rounded-full border-2 border-border-strong px-8 py-3 text-sm font-medium text-foreground/70"
                  >
                    Start over
                  </button>
                </div>
              </div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setStep("chapter_intro")}
                className="rounded-full bg-accent px-8 py-3 text-sm font-medium text-white shadow-[0_0_28px_-8px_var(--accent)]"
              >
                Start
              </motion.button>
            )}
          </motion.div>
        )}

        {step === "chapter_intro" && (
          <motion.div
            key={`chapter-intro-${chapter.id}`}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="flex max-w-xl flex-col items-center gap-5 text-center lg:max-w-2xl xl:max-w-3xl"
          >
            <span className={`text-xs font-semibold uppercase tracking-[0.2em] ${chapterMeta.text}`}>
              Chapter {chapterIndex + 1} of {CHAPTERS.length} &middot; {chapterMeta.name}
            </span>
            <h1 className="font-[family-name:var(--font-brand)] text-3xl font-medium tracking-tight lg:text-4xl">
              {chapter.quadrantLabel}
            </h1>
            <p className="text-foreground/60 lg:text-lg">{chapter.focus}</p>
            <div className={`flex flex-col gap-1.5 rounded-2xl border p-5 text-left lg:p-6 ${chapterMeta.borderSoft} bg-surface`}>
              <span className={`text-[10px] font-semibold uppercase tracking-[0.2em] ${chapterMeta.text}`}>Case file</span>
              <p className="text-sm leading-relaxed text-foreground/70 lg:text-base">{chapter.caseStudy}</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setStep("scene")}
              className={`self-center rounded-full px-8 py-3 text-sm font-medium ${chapterMeta.buttonText} ${chapterMeta.bg} ${chapterMeta.ring}`}
            >
              Begin
            </motion.button>
          </motion.div>
        )}

        {step === "scene" && (
          <motion.div key={`scene-wrap-${sceneIndex}`} className="flex w-full flex-col items-center gap-6">
            <SceneRenderer key={`scene-${sceneIndex}`} scene={currentScene} onComplete={handleSceneComplete} />
          </motion.div>
        )}

        {step === "skill_lab_intro" && (
          <motion.div
            key="skill-lab-intro"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="flex max-w-xl flex-col items-center gap-5 text-center lg:max-w-2xl"
          >
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              Final stretch &middot; The Skill Lab
            </span>
            <h1 className="font-[family-name:var(--font-brand)] text-3xl font-medium tracking-tight lg:text-4xl">
              Five games. Two minutes. Raw signal.
            </h1>
            <p className="text-foreground/60 lg:text-lg">
              Scenarios showed how you decide. These show what your hands and memory can do: reflexes, pattern
              recall, spatial memory, typing, and precision. Different careers lean on different ones, and your
              matches will use every result.
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {GAMES.map((g) => (
                <span
                  key={g.id}
                  className="rounded-full border border-border-subtle bg-surface px-3.5 py-1.5 text-xs font-medium text-foreground/70"
                >
                  {g.name}
                </span>
              ))}
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setStep("game")}
              className="self-center rounded-full bg-accent px-8 py-3 text-sm font-medium text-white shadow-[0_0_28px_-8px_var(--accent)]"
            >
              Enter the lab
            </motion.button>
          </motion.div>
        )}

        {step === "game" && gameIndex < TOTAL_GAMES && (
          <motion.div key={`game-wrap-${gameIndex}`} className="flex w-full flex-col items-center gap-4">
            <span className="text-xs font-medium tracking-wide text-foreground/40">
              Game {gameIndex + 1} of {TOTAL_GAMES}
            </span>
            <GameRenderer key={`game-${gameIndex}`} gameId={GAMES[gameIndex].id} onComplete={handleGameComplete} />
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
