import { ImageResponse } from "next/og";
import { VArrowMark } from "@/lib/vArrowMark";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
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
        <VArrowMark size={122} color="#f3f1fa" accentColor="#b7a9ff" />
      </div>
    ),
    size,
  );
}
