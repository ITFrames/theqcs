import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_ALT = "QCS ABROAD - Your Gateway to Global Education";
export const OG_CONTENT_TYPE = "image/png";

/**
 * Renders the shared branded 1200x630 social share card used by both the
 * Open Graph and Twitter image routes.
 */
export async function renderOgImage() {
  let logoDataUri = "";
  try {
    const logo = await readFile(join(process.cwd(), "public", "og-logo.png"));
    logoDataUri = `data:image/png;base64,${logo.toString("base64")}`;
  } catch {
    logoDataUri = "";
  }

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(135deg, #152a45 0%, #1e3a5f 55%, #2a4f7a 100%)",
          position: "relative",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 12,
            background: "#d4a853",
          }}
        />

        {logoDataUri ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(255,255,255,0.96)",
              borderRadius: 28,
              padding: "28px 48px",
              marginBottom: 44,
              boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={logoDataUri} alt="QCS ABROAD" width={412} height={200} />
          </div>
        ) : null}

        <div
          style={{
            display: "flex",
            fontSize: 62,
            fontWeight: 800,
            color: "#ffffff",
            letterSpacing: -1,
          }}
        >
          QCS ABROAD
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 16,
            fontSize: 32,
            color: "#e0bc72",
            fontWeight: 600,
          }}
        >
          Your Gateway to Global Education
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 24,
            fontSize: 24,
            color: "rgba(255,255,255,0.82)",
            maxWidth: 900,
            textAlign: "center",
          }}
        >
          Admissions • Student Visas • Career Counseling
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 40,
            display: "flex",
            fontSize: 24,
            color: "rgba(255,255,255,0.7)",
          }}
        >
          www.theqcs.ca
        </div>
      </div>
    ),
    { ...OG_SIZE },
  );
}
