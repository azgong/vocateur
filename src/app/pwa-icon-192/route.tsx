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
        <div style={{ fontSize: 102, fontWeight: 700, color: "#f3f1fa", fontFamily: "Space Grotesk", lineHeight: 1 }}>V</div>
        <div
          style={{
            position: "absolute",
            top: 42,
            right: 45,
            width: 0,
            height: 0,
            borderLeft: "15px solid transparent",
            borderRight: "15px solid transparent",
            borderBottom: "24px solid #b7a9ff",
            transform: "rotate(45deg)",
          }}
        />
      </div>
    ),
    { width: 192, height: 192, fonts: [{ name: "Space Grotesk", data: spaceGrotesk, weight: 700, style: "normal" }] },
  );
}
