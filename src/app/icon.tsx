import { ImageResponse } from "next/og";
import { VCrystalMark } from "@/lib/vCrystalMark";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
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
          backgroundColor: "#131315",
          backgroundImage: "radial-gradient(circle at 30% 20%, rgba(156,122,26,0.4), transparent 60%)",
          borderRadius: 14,
        }}
      >
        <VCrystalMark size={44} color="#f3efe6" accentColor="#d4af37" />
      </div>
    ),
    size,
  );
}
