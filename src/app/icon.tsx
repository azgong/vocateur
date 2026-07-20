import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
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

export default async function Icon() {
  const fraunces = await loadFraunces(600);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#08070d",
          borderRadius: 14,
        }}
      >
        <div
          style={{
            fontSize: 40,
            fontWeight: 600,
            color: "#8b7bff",
            fontFamily: "Fraunces",
          }}
        >
          V
        </div>
      </div>
    ),
    { ...size, fonts: [{ name: "Fraunces", data: fraunces, weight: 600, style: "normal" }] },
  );
}
