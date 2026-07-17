"use client";

import { useState } from "react";
import { motion } from "framer-motion";

type Message = { role: "user" | "assistant"; content: string };

export function ChatPanel({ roadmapId }: { roadmapId: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");

  async function sendMessage(history: Message[]) {
    setStatus("loading");
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roadmapId, messages: history }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus("error");
        return;
      }
      setMessages([...history, { role: "assistant", content: data.reply }]);
      setStatus("idle");
    } catch {
      setStatus("error");
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || status === "loading") return;
    const next: Message[] = [...messages, { role: "user", content: input.trim() }];
    setMessages(next);
    setInput("");
    sendMessage(next);
  }

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-zinc-200 p-6 dark:border-zinc-800 print:hidden">
      <div>
        <h3 className="text-lg font-semibold tracking-tight">Ask about your results</h3>
        <p className="text-sm text-zinc-500">
          Questions about this conversation aren&rsquo;t saved after you leave the page.
        </p>
      </div>

      <div className="flex max-h-80 flex-col gap-3 overflow-y-auto">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm ${
              m.role === "user"
                ? "self-end bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                : "self-start bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200"
            }`}
          >
            {m.content}
          </div>
        ))}
        {status === "loading" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="self-start rounded-2xl bg-zinc-100 px-4 py-2 text-sm text-zinc-400 dark:bg-zinc-800"
          >
            Thinking…
          </motion.div>
        )}
        {status === "error" && (
          <div className="self-start text-sm text-red-500">
            Message failed.{" "}
            <button className="underline" onClick={() => sendMessage(messages)}>
              Try again
            </button>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Why didn't nursing rank higher for me?"
          className="flex-1 rounded-full border border-zinc-300 px-4 py-2 text-sm outline-none focus:border-zinc-900 dark:border-zinc-700 dark:focus:border-zinc-100"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="rounded-full bg-zinc-900 px-5 py-2 text-sm font-medium text-white disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
        >
          Send
        </button>
      </form>
    </div>
  );
}
