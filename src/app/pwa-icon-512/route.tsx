import { ImageResponse } from "next/og";
import { loadSpaceGrotesk } from "@/lib/ogFont";
import { ArrowMark } from "@/lib/arrowMark";

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
        <ArrowMark size={92} top={92} right={143} rotate={22} color="#b7a9ff" />
      </div>
    ),
    { width: 512, height: 512, fonts: [{ name: "Space Grotesk", data: spaceGrotesk, weight: 700, style: "normal" }] },
  );
}
