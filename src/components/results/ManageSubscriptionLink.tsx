"use client";

import { useState } from "react";

export function ManageSubscriptionLink() {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    const res = await fetch("/api/stripe/portal", { method: "POST" });
    const data = await res.json();
    if (res.ok && data.url) {
      window.location.href = data.url;
    } else {
      setLoading(false);
    }
  }

  return (
    <button onClick={handleClick} disabled={loading} className="text-sm text-zinc-400 underline disabled:opacity-60">
      {loading ? "Loading…" : "Manage subscription"}
    </button>
  );
}
