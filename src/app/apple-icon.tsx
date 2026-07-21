import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

async function loadFraunces(weight: number) {
  const css = await (
    await fetch(`https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,${weight}&display=swap`)
  ).text();
  const match = css.match(/src: url\(([^)]+)\) format\('(opentype|truetype)'\)/);
  const url = match?.[1];
  if (!url) throw new Error("Could not resolve Fraunces font URL");
  return fetch(url).then((res) => res.arrayBuffer());
}

export default async function AppleIcon() {
  const fraunces = await loadFraunces(700);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#08070d",
          backgroundImage: "radial-gradient(circle at 30% 20%, rgba(139,123,255,0.4), transparent 60%)",
        }}
      >
        <div
          style={{
            fontSize: 96,
            fontWeight: 700,
            color: "#f3f1fa",
            fontFamily: "Fraunces",
            lineHeight: 1,
            marginTop: -6,
          }}
        >
          V
        </div>
        <div style={{ display: "flex", gap: 9, marginTop: 10 }}>
          <div style={{ width: 16, height: 16, borderRadius: 8, backgroundColor: "#4f9dff" }} />
          <div style={{ width: 16, height: 16, borderRadius: 8, backgroundColor: "#35d69b" }} />
          <div style={{ width: 16, height: 16, borderRadius: 8, backgroundColor: "#ff6b8a" }} />
          <div style={{ width: 16, height: 16, borderRadius: 8, backgroundColor: "#ffc24b" }} />
        </div>
      </div>
    ),
    { ...size, fonts: [{ name: "Fraunces", data: fraunces, weight: 700, style: "normal" }] },
  );
}
