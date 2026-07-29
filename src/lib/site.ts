/**
 * The origin every step of a client-side auth journey must share. OAuth's
 * PKCE flow stores a code verifier in localStorage on whatever origin the
 * flow starts from, then reads it back on whatever origin the callback
 * lands on; if those differ, the exchange fails outright ("that link
 * didn't work"). Some networks block the bare apex domain outright but
 * never www, so www is the one origin guaranteed to work everywhere.
 * Localhost passes through unchanged for local dev.
 */
export function authSafeOrigin(): string {
  if (typeof window === "undefined") return "https://www.vocateur.app";
  return window.location.hostname === "localhost" ? window.location.origin : "https://www.vocateur.app";
}

/**
 * Guards the post-auth `next` redirect target against open-redirect payloads.
 * A leading "/" alone isn't enough: "//evil.com" and "/\evil.com" both start
 * with "/" but browsers resolve them as protocol-relative URLs to another
 * host. Only a single-slash, same-origin relative path is allowed.
 */
export function safeNextPath(next: string | null | undefined): string {
  return next && /^\/(?!\/|\\)/.test(next) ? next : "/";
}
