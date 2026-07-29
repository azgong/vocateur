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
          backgroundColor: "#0b0a08",
          backgroundImage: "radial-gradient(circle at 30% 20%, rgba(156,122,26,0.4), transparent 60%)",
        }}
      >
        <VCrystalMark size={131} color="#f3efe6" accentColor="#d4af37" />
      </div>
    ),
    { width: 192, height: 192 },
  );
}
