import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The bare apex and www are two separate cookie origins, so a PKCE code-verifier
  // cookie set on one is invisible to the other. Auth always finishes on www (see
  // authSafeOrigin), so every request must land there from the start or the magic-link
  // exchange fails whenever someone begins on the bare domain.
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "vocateur.app" }],
        destination: "https://www.vocateur.app/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
