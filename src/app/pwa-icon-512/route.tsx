import { ImageResponse } from "next/og";
import { loadSpaceGrotesk } from "@/lib/ogFont";

export async function GET() {
  const spaceGrotesk = await loadSpaceGrotesk(700);

  return new ImageResponse(
    (
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#08070d",
          backgroundImage: "radial-gradient(circle at 30% 20%, rgba(139,123,255,0.4), transparent 60%)",
        }}
      >
        <div style={{ fontSize: 272, fontWeight: 700, color: "#f3f1fa", fontFamily: "Space Grotesk", lineHeight: 1 }}>V</div>
        <svg
          style={{ position: "absolute", top: 82, right: 82, width: 154, height: 154 }}
          viewBox="0 0 24 24"
          fill="#b7a9ff"
        >
          <path d="M12 20.5s-8.5-5.13-8.5-11A5 5 0 0 1 12 6.36 5 5 0 0 1 20.5 9.5c0 5.87-8.5 11-8.5 11Z" />
        </svg>
      </div>
    ),
    { width: 512, height: 512, fonts: [{ name: "Space Grotesk", data: spaceGrotesk, weight: 700, style: "normal" }] },
  );
}
