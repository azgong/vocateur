import { ImageResponse } from "next/og";
import { loadSpaceGrotesk } from "@/lib/ogFont";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const [spaceGrotesk700, spaceGrotesk500] = await Promise.all([loadSpaceGrotesk(700), loadSpaceGrotesk(500)]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#08070d",
          backgroundImage:
            "radial-gradient(circle at 20% 30%, rgba(139,123,255,0.35), transparent 55%), radial-gradient(circle at 80% 75%, rgba(255,107,138,0.22), transparent 50%)",
        }}
      >
        <div
          style={{
            fontSize: 22,
            fontWeight: 500,
            letterSpacing: 8,
            textTransform: "uppercase",
            color: "#8b7bff",
            marginBottom: 28,
            fontFamily: "Space Grotesk",
          }}
        >
          Built from what you do, not what you say
        </div>
        <div
          style={{
            fontSize: 128,
            fontWeight: 700,
            color: "#f3f1fa",
            fontFamily: "Space Grotesk",
            textTransform: "uppercase",
            lineHeight: 1,
          }}
        >
          Vocateur
        </div>
        <div
          style={{
            fontSize: 30,
            fontWeight: 500,
            color: "#b7a9ff",
            fontFamily: "Space Grotesk",
            marginTop: 26,
          }}
        >
          Find the career that actually fits how you think
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Space Grotesk", data: spaceGrotesk700, weight: 700, style: "normal" },
        { name: "Space Grotesk", data: spaceGrotesk500, weight: 500, style: "normal" },
      ],
    },
  );
}
