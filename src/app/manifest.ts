import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Vocateur",
    short_name: "Vocateur",
    description: "Find the career that actually fits how you think.",
    start_url: "/",
    display: "standalone",
    background_color: "#1e1d21",
    theme_color: "#1e1d21",
    icons: [
      { src: "/pwa-icon-192", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/pwa-icon-192", sizes: "192x192", type: "image/png", purpose: "maskable" },
      { src: "/pwa-icon-512", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/pwa-icon-512", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
