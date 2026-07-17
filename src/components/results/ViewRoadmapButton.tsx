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
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        onClick={handleClick}
        disabled={loading}
        className="rounded-full bg-accent px-8 py-3 text-sm font-medium text-white shadow-[0_0_28px_-8px_var(--accent)] disabled:opacity-60 disabled:shadow-none"
      >
        {loading ? "Building your roadmap…" : "View your personalized roadmap"}
      </motion.button>
      {error && <p className="text-sm text-quadrant-c">Something went wrong. Try again.</p>}
    </div>
  );
}
