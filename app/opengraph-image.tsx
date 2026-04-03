import { ImageResponse } from "next/og";
import { GAME_NAME, SITE_NAME } from "@/lib/seo";

export const dynamic = "force-static";

export const alt = `${GAME_NAME} social preview`;
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background:
            "radial-gradient(circle at top left, rgba(83,224,255,0.18), transparent 28%), radial-gradient(circle at 85% 15%, rgba(255,91,134,0.18), transparent 26%), linear-gradient(180deg, #08101d 0%, #04070f 100%)",
          color: "#e9f5ff",
          padding: "56px 64px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: 22,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "1px solid rgba(160,217,255,0.28)",
                background: "linear-gradient(135deg, rgba(83,224,255,0.28), rgba(174,135,255,0.26))",
                fontSize: 32,
                fontWeight: 700,
              }}
            >
              FB
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: 34, fontWeight: 700 }}>{SITE_NAME}</span>
              <span style={{ fontSize: 18, color: "#8ca7bc" }}>{GAME_NAME}</span>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              borderRadius: 999,
              border: "1px solid rgba(160,217,255,0.17)",
              background: "rgba(10, 18, 30, 0.72)",
              padding: "14px 20px",
              fontSize: 18,
              color: "#8ca7bc",
            }}
          >
            Static-first. AI validation game.
          </div>
        </div>

        <div style={{ display: "flex", gap: 28, alignItems: "stretch" }}>
          <div
            style={{
              flex: 1.15,
              display: "flex",
              flexDirection: "column",
              borderRadius: 34,
              padding: 34,
              border: "1px solid rgba(160,217,255,0.17)",
              background: "rgba(10, 19, 33, 0.82)",
            }}
          >
            <span style={{ fontSize: 20, letterSpacing: 3, color: "#8ca7bc", textTransform: "uppercase" }}>
              AI Hallucination Game
            </span>
            <div
              style={{
                marginTop: 18,
                display: "flex",
                flexDirection: "column",
                fontSize: 82,
                lineHeight: 0.94,
                fontWeight: 800,
                letterSpacing: -4,
              }}
            >
              <span>Catch bad AI</span>
              <span style={{ color: "#53e0ff" }}>before it ships.</span>
            </div>
            <p style={{ marginTop: 22, fontSize: 28, lineHeight: 1.45, color: "#c3d9e9" }}>
              Learn prompt validation, debugging verification, SQL review, regex testing, and safer commit writing.
            </p>
          </div>

          <div
            style={{
              flex: 0.85,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              borderRadius: 34,
              padding: 34,
              border: "1px solid rgba(160,217,255,0.17)",
              background: "rgba(10, 19, 33, 0.82)",
            }}
          >
            {[
              "Docs: force structure and examples",
              "Debug: verify evidence, not confidence",
              "SQL: validate assumptions and joins",
              "Regex: test edge cases",
            ].map((item) => (
              <div
                key={item}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  fontSize: 24,
                  color: "#e9f5ff",
                }}
              >
                <div
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: 999,
                    background: "#6bffb8",
                  }}
                />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    size
  );
}