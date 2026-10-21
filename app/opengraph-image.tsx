import { ImageResponse } from "next/og";
import { SITE_DESCRIPTION, SITE_TITLE } from "@/lib/site";

export const alt = SITE_TITLE;
export const size = { width: 1200, height: 630 };
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
          backgroundColor: "#1a1a1a",
          color: "#f8f8f8",
          padding: "72px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 22,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "#d4af37",
          }}
        >
          Portfolio
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 68, fontWeight: 600, lineHeight: 1.05 }}>
            Abdalrhmn Anwar
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 18,
              fontSize: 32,
              color: "#d4af37",
            }}
          >
            Full-Stack Developer · Baghdad
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 28,
              maxWidth: 860,
              fontSize: 24,
              lineHeight: 1.4,
              color: "#a3a3a3",
            }}
          >
            {SITE_DESCRIPTION}
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 22, color: "#8f8f8f" }}>
          Next.js · Node.js · PostgreSQL
        </div>
      </div>
    ),
    { ...size },
  );
}
