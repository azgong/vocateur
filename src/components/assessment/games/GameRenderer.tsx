"use client";

import { GameId, GameResult } from "@/lib/assessment/games";
import { ReactionGame } from "./ReactionGame";
import { SequenceMemoryGame } from "./SequenceMemoryGame";
import { VisualMemoryGame } from "./VisualMemoryGame";
import { TypingGame } from "./TypingGame";
import { PrecisionGame } from "./PrecisionGame";

export function GameRenderer({
  gameId,
  onComplete,
}: {
  gameId: GameId;
  onComplete: (result: GameResult) => void;
}) {
  switch (gameId) {
    case "reaction":
      return <ReactionGame onComplete={onComplete} />;
    case "sequence_memory":
      return <SequenceMemoryGame onComplete={onComplete} />;
    case "visual_memory":
      return <VisualMemoryGame onComplete={onComplete} />;
    case "typing":
      return <TypingGame onComplete={onComplete} />;
    case "precision":
      return <PrecisionGame onComplete={onComplete} />;
  }
}
