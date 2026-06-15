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

  // Logomark "Titik Temu": dua lingkaran putih translusen yang beririsan
  // pada latar ungu brand — irisannya jadi lebih terang (dua pihak bertemu).
  const circle = Math.round(innerSize * 0.5);
  const overlap = Math.round(circle * 0.32);

  return new ImageResponse(
    (
      <div
        style={{
          width: size,
          height: size,
          backgroundColor: "#8612d2",
          borderRadius: radius,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: circle,
              height: circle,
              borderRadius: "50%",
              backgroundColor: "rgba(255,255,255,0.82)",
              marginRight: -overlap,
            }}
          />
          <div
            style={{
              width: circle,
              height: circle,
              borderRadius: "50%",
              backgroundColor: "rgba(255,255,255,0.52)",
            }}
          />
        </div>
      </div>
    ),
    { width: size, height: size },
  );
}
