import { ImageResponse } from "next/og";

export const runtime = "nodejs";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ filename: string }> },
) {
  const { filename } = await params;
  const size = filename.includes("192") ? 192 : 512;
  const maskable = filename.includes("maskable");

  // Maskable icons need safe zone padding (inner 80%)
  const pad = maskable ? Math.round(size * 0.1) : 0;
  const innerSize = size - pad * 2;
  const radius = maskable ? 0 : Math.round(size * 0.18);
  const fontSize = Math.round(innerSize * 0.43);

  return new ImageResponse(
    (
      <div
        style={{
          width: size,
          height: size,
          backgroundColor: "#0d9488",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: innerSize,
            height: innerSize,
            backgroundColor: "#0d9488",
            borderRadius: radius,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span
            style={{
              color: "white",
              fontSize,
              fontWeight: 700,
              fontFamily: "sans-serif",
              letterSpacing: "-0.02em",
            }}
          >
            DK
          </span>
        </div>
      </div>
    ),
    { width: size, height: size },
  );
}
