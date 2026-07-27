import { ImageResponse } from "next/og";
import { loadSpaceGrotesk } from "@/lib/ogFont";
import { ArrowMark } from "@/lib/arrowMark";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default async function Icon() {
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
          borderRadius: 14,
        }}
      >
        <div
          style={{
            fontSize: 34,
            fontWeight: 700,
            color: "#f3f1fa",
            fontFamily: "Space Grotesk",
            lineHeight: 1,
          }}
        >
          V
        </div>
        <ArrowMark size={9} top={18} right={22} rotate={22} color="#b7a9ff" />
      </div>
    ),
    { ...size, fonts: [{ name: "Space Grotesk", data: spaceGrotesk, weight: 700, style: "normal" }] },
  );
}
