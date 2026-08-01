import { ImageResponse } from "next/og";
import { loadSpaceGrotesk } from "@/lib/ogFont";
import { createAdminClient } from "@/lib/supabase/admin";
import { rankMatches, Occupation } from "@/lib/assessment/matching";
import { ModuleLog, TraitVector } from "@/lib/assessment/types";
import { SkillScores } from "@/lib/assessment/games";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function ResultOpengraphImage({ params }: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = await params;
  const [spaceGrotesk700, spaceGrotesk500] = await Promise.all([loadSpaceGrotesk(700), loadSpaceGrotesk(500)]);

  const admin = createAdminClient();
  const [{ data: session }, { data: occupations }] = await Promise.all([
    admin.from("assessment_sessions").select("trait_vector, self_report").eq("id", sessionId).single(),
    admin.from("occupations").select("*"),
  ]);

  let title = "Vocateur";
  let fitScore: number | null = null;

  if (session && occupations) {
    const traitVector = session.trait_vector as TraitVector;
    const skillScores = (session.self_report?.skillScores ?? null) as SkillScores | null;
    const values = (session.self_report?.values ?? null) as string[] | null;
    const currentFocus = (session.self_report?.currentFocus ?? null) as string | null;
    const matches = rankMatches(traitVector, occupations as Occupation[], skillScores, values, currentFocus);
    if (matches[0]) {
      title = matches[0].occupation.title;
      fitScore = matches[0].fitScore;
    }
  }

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
          backgroundImage:
            "radial-gradient(circle at 20% 20%, rgba(139,123,255,0.32), transparent 55%), radial-gradient(circle at 82% 78%, rgba(255,107,138,0.2), transparent 50%)",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 20,
            fontWeight: 500,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: "#8b7bff",
            marginBottom: 22,
            fontFamily: "Space Grotesk",
          }}
        >
          My top career match
        </div>
        <div
          style={{
            display: "flex",
            fontSize: title.length > 22 ? 76 : 100,
            fontWeight: 700,
            color: "#f3f1fa",
            fontFamily: "Space Grotesk",
            lineHeight: 1.05,
            maxWidth: 980,
            textAlign: "center",
            justifyContent: "center",
          }}
        >
          {title}
        </div>
        {fitScore !== null && (
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: 10,
              marginTop: 34,
              padding: "14px 32px",
              borderRadius: 999,
              backgroundColor: "rgba(139,123,255,0.14)",
              border: "2px solid rgba(139,123,255,0.5)",
            }}
          >
            <div style={{ display: "flex", fontSize: 44, fontWeight: 700, color: "#b7a9ff", fontFamily: "Space Grotesk" }}>
              {fitScore}%
            </div>
            <div style={{ display: "flex", fontSize: 22, fontWeight: 500, color: "#b7a9ff", fontFamily: "Space Grotesk" }}>
              fit
            </div>
          </div>
        )}
        <div style={{ display: "flex", fontSize: 26, fontWeight: 500, color: "#7a7488", marginTop: 44, fontFamily: "Space Grotesk" }}>
          vocateur.app &middot; find the career that actually fits how you think
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Space Grotesk", data: spaceGrotesk700, weight: 700, style: "normal" },
        { name: "Space Grotesk", data: spaceGrotesk500, weight: 500, style: "normal" },
      ],
    },
  );
}
