"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { LifeStage } from "@/lib/assessment/types";
import { Message, ChatMode, MODE_META, SUGGESTED_PROMPTS } from "./chatShared";
import { AssistantMarkdown, TypingDots } from "./ChatMessageBubble";

export function AdvisorFullChat({
  roadmapId,
  lifeStage,
  occupationTitle,
}: {
  roadmapId: string;
  lifeStage: LifeStage;
  occupationTitle: string;
}) {
  const [mode, setMode] = useState<ChatMode>("advisor");
  const [threads, setThreads] = useState<Record<ChatMode, Message[]>>({ advisor: [], mock_interview: [] });
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const scrollRef = useRef<HTMLDivElement>(null);

  const messages = threads[mode];

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, status]);

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
    <div className="flex h-[calc(100vh-3.5rem)] flex-col">
      <div className="flex flex-col gap-3 border-b border-border-subtle px-6 py-4 sm:flex-row sm:items-center sm:justify-between lg:px-8">
        <Link
          href={`/roadmap/${roadmapId}`}
          className="min-w-0 truncate text-sm text-foreground/50 transition-colors hover:text-foreground"
        >
          &larr; Toward {occupationTitle}
        </Link>
        <div className="flex shrink-0 gap-2">
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
      </div>

      <div ref={scrollRef} className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-4 overflow-y-auto px-6 py-8 lg:px-8">
        {messages.length === 0 && status !== "loading" && (
          <div className="flex flex-1 flex-col items-center justify-center gap-5 text-center">
            <p className="max-w-sm text-base text-foreground/50">{MODE_META[mode].empty}</p>
            {mode === "advisor" && (
              <div className="flex flex-wrap justify-center gap-2">
                {SUGGESTED_PROMPTS[lifeStage].map((p) => (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => setInput(p.fill)}
                    className="rounded-full border border-border-subtle bg-surface-2 px-3.5 py-1.5 text-sm font-medium text-foreground/70 transition-colors hover:border-accent hover:text-accent"
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
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className={`max-w-[80%] rounded-2xl px-5 py-3 leading-relaxed ${
                m.role === "user"
                  ? "self-end bg-accent text-[15px] text-white"
                  : "self-start bg-surface-2 text-foreground"
              }`}
            >
              {m.role === "assistant" ? <AssistantMarkdown content={m.content} /> : m.content}
            </motion.div>
          ))}
        {status === "loading" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="self-start rounded-2xl bg-surface-2 px-5 py-3 text-foreground/40"
          >
            <TypingDots />
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

      <div className="border-t border-border-subtle px-6 py-5 lg:px-8">
        {mode === "mock_interview" && messages.length === 0 ? (
          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            disabled={status === "loading"}
            onClick={startMockInterview}
            className="mx-auto flex rounded-full bg-accent px-6 py-2.5 text-sm font-medium text-white shadow-[0_0_20px_-6px_var(--accent)] disabled:opacity-50"
          >
            Start mock interview
          </motion.button>
        ) : (
          <form onSubmit={handleSubmit} className="mx-auto flex w-full max-w-3xl gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={MODE_META[mode].placeholder}
              autoFocus
              className="flex-1 rounded-full border border-border-subtle bg-surface px-5 py-3 text-sm text-foreground outline-none transition-colors focus:border-accent"
            />
            <motion.button
              type="submit"
              whileTap={{ scale: 0.94 }}
              disabled={status === "loading"}
              className="rounded-full bg-accent px-6 py-3 text-sm font-medium text-white shadow-[0_0_20px_-6px_var(--accent)] disabled:opacity-50 disabled:shadow-none"
            >
              Send
            </motion.button>
          </form>
        )}
      </div>
    </div>
  );
}
