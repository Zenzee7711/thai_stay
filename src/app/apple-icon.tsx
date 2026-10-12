import { ImageResponse } from "next/og";

// The Home Screen icon, drawn in code: the jade accent with "TS" in white.
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0e7c66",
          color: "#ffffff",
          fontSize: 84,
          fontWeight: 600,
          letterSpacing: -4,
        }}
      >
        TS
      </div>
    ),
    { ...size },
  );
}
