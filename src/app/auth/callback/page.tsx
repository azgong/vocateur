"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function AuthCallbackPage() {
  const [failed, setFailed] = useState(false);
  const ran = useRef(false);

  useEffect(() => {
    // The code/tokens here are single-use: a second exchange attempt fails even
    // though the first already succeeded. Effects can fire more than once for a
    // given mount, so guard against re-running this and clobbering a real session
    // with a bogus "already used" failure.
    if (ran.current) return;
    ran.current = true;

    async function run() {
      const n = 1 + Number(sessionStorage.getItem("__cb_dbg_n") || "0");
      sessionStorage.setItem("__cb_dbg_n", String(n));
      sessionStorage.setItem(
        `__cb_dbg_${n}_start`,
        JSON.stringify({ href: window.location.href, t: Date.now() }),
      );

      const supabase = createClient();
      const params = new URLSearchParams(window.location.search);
      const next = params.get("next") ?? "/";

      // Implicit flow: Supabase can return the session directly in the URL fragment,
      // which never reaches the server; only client-side JS can see it.
      const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ""));
      const accessToken = hashParams.get("access_token");
      const refreshToken = hashParams.get("refresh_token");
      if (accessToken && refreshToken) {
        const { error } = await supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken });
        sessionStorage.setItem(`__cb_dbg_${n}_setSession`, JSON.stringify({ error: error?.message ?? null }));
        if (!error) {
          window.location.replace(next);
          return;
        }
      }

      // PKCE flow: a `code` query param the client exchanges for a session.
      const code = params.get("code");
      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        sessionStorage.setItem(
          `__cb_dbg_${n}_exchange`,
          JSON.stringify({ code, error: error?.message ?? null }),
        );
        if (!error) {
          window.location.replace(next);
          return;
        }
      }

      sessionStorage.setItem(`__cb_dbg_${n}_failed`, "true");
      setFailed(true);
    }
    run();
  }, []);

  useEffect(() => {
    if (failed) window.location.replace("/auth/error");
  }, [failed]);

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-24 text-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-border-strong border-t-accent" />
      <p className="text-foreground/60">Signing you in&hellip;</p>
    </main>
  );
}
