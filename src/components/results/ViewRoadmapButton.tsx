"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export function ViewRoadmapButton({ sessionId, occupationId }: { sessionId: string; occupationId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  async function handleClick() {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch("/api/roadmap/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, occupationId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(true);
        setLoading(false);
        return;
      }
      router.push(`/roadmap/${data.roadmapId}`);
    } catch {
      setError(true);
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={handleClick}
        disabled={loading}
        className="rounded-full bg-zinc-900 px-8 py-3 text-sm font-medium text-white disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900"
      >
        {loading ? "Building your roadmap…" : "View your personalized roadmap"}
      </motion.button>
      {error && <p className="text-sm text-red-500">Something went wrong. Try again.</p>}
    </div>
  );
}
