/**
 * Logomark "Titik Temu" — dua lingkaran beririsan; irisannya disorot
 * warna lebih terang (dua pihak berbagi satu ruang & waktu).
 * Lihat design_handoff_temu/Logo Temu.html (Konsep 01).
 */

let uid = 0;

export function LogoMark({
  size = 28,
  variant = "color",
  className,
}: {
  size?: number;
  variant?: "color" | "white";
  className?: string;
}) {
  // id unik agar beberapa clipPath di satu halaman tidak bentrok
  const clipId = `temu-clip-${uid++}`;

  if (variant === "white") {
    return (
      <svg
        viewBox="0 0 64 64"
        width={size}
        height={size}
        className={className}
        aria-hidden="true"
      >
        <clipPath id={clipId}>
          <circle cx="25" cy="32" r="15" />
        </clipPath>
        <circle cx="25" cy="32" r="15" fill="#fff" opacity="0.78" />
        <circle cx="39" cy="32" r="15" fill="#fff" opacity="0.48" />
        <g clipPath={`url(#${clipId})`}>
          <circle cx="39" cy="32" r="15" fill="#fff" />
        </g>
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
    >
      <clipPath id={clipId}>
        <circle cx="25" cy="32" r="15" />
      </clipPath>
      <circle cx="25" cy="32" r="15" fill="#a020f0" />
      <circle cx="39" cy="32" r="15" fill="#6a0ea6" />
      <g clipPath={`url(#${clipId})`}>
        <circle cx="39" cy="32" r="15" fill="#eed7fc" />
      </g>
    </svg>
  );
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={`font-extrabold tracking-tight ${className ?? ""}`}>
      Temu
    </span>
  );
}
