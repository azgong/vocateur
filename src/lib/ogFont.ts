// Fetches a Google Font's raw font file for use with next/og's ImageResponse
// (Satori), which needs actual font bytes rather than a CSS @font-face rule.
export async function loadSpaceGrotesk(weight: number): Promise<ArrayBuffer> {
  const css = await (
    await fetch(`https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@${weight}&display=swap`)
  ).text();
  const match = css.match(/src: url\(([^)]+)\) format\('(opentype|truetype)'\)/);
  const url = match?.[1];
  if (!url) throw new Error("Could not resolve Space Grotesk font URL");
  return fetch(url).then((res) => res.arrayBuffer());
}
