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
          backgroundColor: "#1e1d21",
          backgroundImage: "radial-gradient(circle at 30% 20%, rgba(217,87,61,0.4), transparent 60%)",
          borderRadius: 14,
        }}
      >
        <VCrystalMark size={44} color="#f1f0ee" accentColor="#f58f7c" />
      </div>
    ),
    size,
  );
}
