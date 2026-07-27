import { ImageResponse } from "next/og";
import { VCrystalMark } from "@/lib/vCrystalMark";

export function GET() {
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
        <VCrystalMark size={348} color="#f3f1fa" accentColor="#b7a9ff" />
      </div>
    ),
    { width: 512, height: 512 },
  );
}
