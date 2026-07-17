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
    <div className="flex flex-col gap-4 rounded-2xl border border-border-subtle bg-surface p-6 print:hidden">
      <div>
        <h3 className="font-[family-name:var(--font-display)] text-xl font-medium tracking-tight">
          Ask about your results
        </h3>
        <p className="text-sm text-foreground/50">
          Questions about this conversation aren&rsquo;t saved after you leave the page.
        </p>
      </div>

      <div className="flex max-h-80 flex-col gap-3 overflow-y-auto">
        {messages.map((m, i) => (
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
            Thinking…
          </motion.div>
        )}
        {status === "error" && (
          <div className="self-start text-sm text-quadrant-c">
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
    </div>
  );
}
