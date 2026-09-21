import { ImageResponse } from "next/og";

// `next/og` ships with Next — no new dependency. Rendered at build time into a
// static PNG, so it costs nothing per request.
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "OasisXVII — built for the void";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          background: "#0F0F14",
          padding: "80px",
          borderTop: "12px solid #4A0F27",
        }}
      >
        <div
          style={{
            fontSize: 150,
            fontWeight: 900,
            color: "#E4E1E9",
            letterSpacing: "-6px",
            lineHeight: 1,
            textTransform: "uppercase",
          }}
        >
          OasisXVII
        </div>
        <div
          style={{
            marginTop: 28,
            fontSize: 34,
            fontWeight: 700,
            color: "#FFB2BD",
            letterSpacing: "12px",
            textTransform: "uppercase",
          }}
        >
          Built for the void
        </div>
      </div>
    ),
    size,
  );
}
