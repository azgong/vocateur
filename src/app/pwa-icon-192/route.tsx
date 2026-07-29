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
          backgroundColor: "#141118",
          backgroundImage: "radial-gradient(circle at 30% 20%, rgba(124,58,237,0.4), transparent 60%)",
        }}
      >
        <VCrystalMark size={131} color="#ffffff" accentColor="#a78bfa" />
      </div>
    ),
    { width: 192, height: 192 },
  );
}
