"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { LifeStage } from "@/lib/assessment/types";

type Message = { role: "user" | "assistant"; content: string };
type ChatMode = "advisor" | "mock_interview";

const MODE_META: Record<ChatMode, { label: string; placeholder: string; starter: string; empty: string }> = {
  advisor: {
    label: "Ask your advisor",
    placeholder: "Why didn't nursing rank higher for me?",
    starter: "",
    empty: "Ask anything about your results, this career, or how to actually reach your roadmap milestones.",
  },
  mock_interview: {
    label: "Mock interview",
    placeholder: "Type your answer…",
    starter: "I'm ready to start the mock interview.",
    empty: "Start a realistic mock interview for your matched role: one question at a time, with real feedback.",
  },
};

type SuggestedPrompt = { label: string; fill: string };

const JOB_SEARCH_PROMPTS: SuggestedPrompt[] = [
  { label: "Review my resume", fill: "Can you review my resume for this role? Here it is: " },
  { label: "Analyze a job posting", fill: "Am I a good fit for this posting, and what should I highlight? Here it is: " },
  { label: "Help me negotiate an offer", fill: "I have an offer and want help negotiating. Here are the details: " },
  { label: "Review my LinkedIn", fill: "Can you review my LinkedIn headline and About section? Here it is: " },
];

const STILL_CHOOSING_PROMPTS: SuggestedPrompt[] = [
  { label: "Which courses matter?", fill: "Which classes or subjects should I actually prioritize for this career? " },
  { label: "Extracurriculars that help", fill: "What extracurriculars, clubs, or programs would genuinely help me here? " },
  { label: "How do I get first exposure?", fill: "How can I get real exposure to this field now, shadowing, projects, competitions? " },
  { label: "Convince my parents", fill: "How do I explain this path to parents who aren't sure about it? " },
];

const SUGGESTED_PROMPTS: Record<LifeStage, SuggestedPrompt[]> = {
  high_school: STILL_CHOOSING_PROMPTS,
  university: STILL_CHOOSING_PROMPTS,
  early_career: JOB_SEARCH_PROMPTS,
  career_changer: JOB_SEARCH_PROMPTS,
};

export function ChatPanel({ roadmapId, lifeStage }: { roadmapId: string; lifeStage: LifeStage }) {
  const [mode, setMode] = useState<ChatMode>("advisor");
  const [threads, setThreads] = useState<Record<ChatMode, Message[]>>({ advisor: [], mock_interview: [] });
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");

  const messages = threads[mode];

  async function sendMessage(history: Message[], forMode: ChatMode) {
    setStatus("loading");
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roadmapId, messages: history, mode: forMode }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus("error");
        return;
      }
      setThreads((prev) => ({ ...prev, [forMode]: [...history, { role: "assistant", content: data.reply }] }));
      setStatus("idle");
    } catch {
      setStatus("error");
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || status === "loading") return;
    const next: Message[] = [...messages, { role: "user", content: input.trim() }];
    setThreads((prev) => ({ ...prev, [mode]: next }));
    setInput("");
    sendMessage(next, mode);
  }

  function startMockInterview() {
    if (status === "loading") return;
    const next: Message[] = [{ role: "user", content: MODE_META.mock_interview.starter }];
    setThreads((prev) => ({ ...prev, mock_interview: next }));
    sendMessage(next, "mock_interview");
  }

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border-subtle bg-surface p-6 print:hidden">
      <div>
        <h3 className="font-[family-name:var(--font-brand)] text-xl font-medium tracking-tight">
          Your career advisor
        </h3>
        <p className="text-sm text-foreground/50">
          Conversations aren&rsquo;t saved after you leave the page.
        </p>
      </div>

      <div className="flex gap-2">
        {(Object.keys(MODE_META) as ChatMode[]).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              mode === m
                ? "bg-accent text-white shadow-[0_0_16px_-4px_var(--accent)]"
                : "bg-surface-2 text-foreground/60 hover:text-foreground"
            }`}
          >
            {MODE_META[m].label}
          </button>
        ))}
      </div>

      <div className="flex max-h-80 flex-col gap-3 overflow-y-auto">
        {messages.length === 0 && status !== "loading" && (
          <div className="flex flex-col gap-3">
            <p className="text-sm text-foreground/40">{MODE_META[mode].empty}</p>
            {mode === "advisor" && (
              <div className="flex flex-wrap gap-2">
                {SUGGESTED_PROMPTS[lifeStage].map((p) => (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => setInput(p.fill)}
                    className="rounded-full border border-border-subtle bg-surface-2 px-3 py-1.5 text-xs font-medium text-foreground/70 transition-colors hover:border-accent hover:text-accent"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
        {messages
          .filter((m) => !(mode === "mock_interview" && m.role === "user" && m.content === MODE_META.mock_interview.starter))
          .map((m, i) => (
            <div
              key={i}
              className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm ${
                m.role === "user"
                  ? "self-end bg-accent text-white"
                  : "self-start bg-surface-2 text-foreground"
              }`}
            >
              {m.content}
            </div>
          ))}
        {status === "loading" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="self-start rounded-2xl bg-surface-2 px-4 py-2 text-sm text-foreground/40"
          >
            {mode === "mock_interview" ? "Interviewer is thinking…" : "Thinking…"}
          </motion.div>
        )}
        {status === "error" && (
          <div className="self-start text-sm text-quadrant-c">
            Message failed.{" "}
            <button className="underline" onClick={() => sendMessage(messages, mode)}>
              Try again
            </button>
          </div>
        )}
      </div>

      {mode === "mock_interview" && messages.length === 0 ? (
        <motion.button
          type="button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          disabled={status === "loading"}
          onClick={startMockInterview}
          className="self-center rounded-full bg-accent px-6 py-2.5 text-sm font-medium text-white shadow-[0_0_20px_-6px_var(--accent)] disabled:opacity-50"
        >
          Start mock interview
        </motion.button>
      ) : (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={MODE_META[mode].placeholder}
            className="flex-1 rounded-full border border-border-subtle bg-surface px-4 py-2 text-sm text-foreground outline-none transition-colors focus:border-accent"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="rounded-full bg-accent px-5 py-2 text-sm font-medium text-white shadow-[0_0_20px_-6px_var(--accent)] disabled:opacity-50 disabled:shadow-none"
          >
            Send
          </button>
        </form>
      )}
    </div>
  );
}
