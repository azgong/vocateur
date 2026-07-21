import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

async function loadSpaceGrotesk(weight: number) {
  const css = await (
    await fetch(`https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@${weight}&display=swap`)
  ).text();
  const match = css.match(/src: url\(([^)]+)\) format\('(opentype|truetype)'\)/);
  const url = match?.[1];
  if (!url) throw new Error("Could not resolve Space Grotesk font URL");
  return fetch(url).then((res) => res.arrayBuffer());
}

export default async function AppleIcon() {
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
        }}
      >
        <div
          style={{
            fontSize: 94,
            fontWeight: 700,
            color: "#f3f1fa",
            fontFamily: "Space Grotesk",
            lineHeight: 1,
          }}
        >
          V
        </div>
        <div
          style={{
            position: "absolute",
            top: 40,
            right: 43,
            width: 0,
            height: 0,
            borderLeft: "14px solid transparent",
            borderRight: "14px solid transparent",
            borderBottom: "23px solid #b7a9ff",
            transform: "rotate(45deg)",
          }}
        />
      </div>
    ),
    { ...size, fonts: [{ name: "Space Grotesk", data: spaceGrotesk, weight: 700, style: "normal" }] },
  );
}
