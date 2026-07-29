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
          backgroundColor: "#1e1d21",
          backgroundImage: "radial-gradient(circle at 30% 20%, rgba(217,87,61,0.4), transparent 60%)",
        }}
      >
        <VCrystalMark size={348} color="#f1f0ee" accentColor="#f58f7c" />
      </div>
    ),
    { width: 512, height: 512 },
  );
}
