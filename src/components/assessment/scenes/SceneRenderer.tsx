"use client";

import { ModuleLog } from "@/lib/assessment/types";
import { SceneConfig } from "@/lib/assessment/scenes";
import { ChoiceScene } from "./ChoiceScene";
import { TimedSelectScene } from "./TimedSelectScene";
import { RankingScene } from "./RankingScene";
import { AllocationScene } from "./AllocationScene";

export function SceneRenderer({ scene, onComplete }: { scene: SceneConfig; onComplete: (log: ModuleLog) => void }) {
  switch (scene.type) {
    case "choice":
      return <ChoiceScene scene={scene} onComplete={onComplete} />;
    case "timedSelect":
      return <TimedSelectScene scene={scene} onComplete={onComplete} />;
    case "ranking":
      return <RankingScene scene={scene} onComplete={onComplete} />;
    case "allocation":
      return <AllocationScene scene={scene} onComplete={onComplete} />;
  }
}
