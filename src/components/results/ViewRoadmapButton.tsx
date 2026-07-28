"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { RoadmapBuildingOverlay } from "./RoadmapBuildingOverlay";

export function ViewRoadmapButton({
  sessionId,
  occupationId,
  variant = "primary",
}: {
  sessionId: string;
  occupationId: string;
  variant?: "primary" | "compact";
}) {
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

  if (variant === "compact") {
    return (
      <div className="flex flex-col items-start gap-1">
        <button
          type="button"
          onClick={handleClick}
          disabled={loading}
          className="text-sm font-medium text-accent underline underline-offset-2 disabled:opacity-50"
        >
          {loading ? "Building your roadmap…" : "See the roadmap for this path"}
        </button>
        {error && <p className="text-xs text-quadrant-c">Something went wrong. Try again.</p>}
        <RoadmapBuildingOverlay show={loading} />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        animate={loading ? { opacity: [1, 0.6, 1] } : {}}
        transition={loading ? { repeat: Infinity, duration: 1.6 } : {}}
        onClick={handleClick}
        disabled={loading}
        className="rounded-full bg-accent px-8 py-3 text-sm font-medium text-white shadow-[0_0_28px_-8px_var(--accent)] disabled:shadow-none"
      >
        {loading ? "Building your roadmap…" : "View your personalized roadmap"}
      </motion.button>
      {error && <p className="text-sm text-quadrant-c">Something went wrong. Try again.</p>}
      <RoadmapBuildingOverlay show={loading} />
    </div>
  );
}
