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
          backgroundColor: "#ffffff",
          backgroundImage:
            "radial-gradient(circle at 20% 30%, rgba(76,29,149,0.16), transparent 55%), radial-gradient(circle at 80% 75%, rgba(124,58,237,0.14), transparent 50%)",
        }}
      >
        <div
          style={{
            fontSize: 22,
            fontWeight: 500,
            letterSpacing: 8,
            textTransform: "uppercase",
            color: "#4c1d95",
            marginBottom: 28,
            fontFamily: "Space Grotesk",
          }}
        >
          You deserve better than a guess.
        </div>
        <div
          style={{
            fontSize: 128,
            fontWeight: 700,
            color: "#131015",
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
            color: "#4c1d95",
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
