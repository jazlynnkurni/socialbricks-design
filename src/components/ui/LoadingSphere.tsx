import { useId } from "react";
import styles from "./LoadingSphere.module.css";

// The one processing motif for the app shell: a small teal sphere with a
// band of light that sweeps top to bottom in a loop. Pure SVG + CSS (the
// keyframes live in the CSS module). Use it only while a real process runs
// (parsing, saving); never for page loads or decoration.
//
// The bands are curved latitude slices, not flat stripes: each boundary
// bows by an amount tied to its width on the sphere (widest at the equator),
// so the light follows the curvature of the ball. The sphere is aria-hidden
// and always sits inside a role="status" wrapper with a text label. Under
// prefers-reduced-motion the sweep stops and the light rests on the middle.

interface LoadingSphereProps {
  /** What is happening, e.g. "Parsing document". Announced to screen readers. */
  label: string;
  /** Pixel size. 18 inline (default), 28 standalone. Crisp down to 16. */
  size?: number;
  /** Show the label text beside the sphere instead of sr-only. */
  showLabel?: boolean;
}

const R = 11;
const CY = 12;
const TILT = 0.17;
// Six horizontal boundaries make five latitude bands.
const BOUNDARIES = [1, 5.4, 9.8, 14.2, 18.6, 23];
const BAND_OPACITY = [0.5, 0.68, 0.82, 0.68, 0.5];
const MIDDLE_BAND = 2;

// Downward bow of a latitude line, proportional to its width on the sphere,
// so the equator curves most and the poles stay flat: this reads as a ball.
function bow(y: number): number {
  const dy = y - CY;
  const widthSquared = R * R - dy * dy;
  return widthSquared > 0 ? TILT * Math.sqrt(widthSquared) : 0;
}

function bandPath(topY: number, botY: number): string {
  const bt = topY + bow(topY);
  const bb = botY + bow(botY);
  return `M0 ${topY} Q12 ${bt} 24 ${topY} L24 ${botY} Q12 ${bb} 0 ${botY} Z`;
}

const BANDS = BAND_OPACITY.map((opacity, i) => ({
  d: bandPath(BOUNDARIES[i], BOUNDARIES[i + 1]),
  opacity,
}));

export function LoadingSphere({
  label,
  size = 18,
  showLabel = false,
}: LoadingSphereProps) {
  const clipId = useId();

  return (
    <span role="status" className="inline-flex items-center gap-2">
      <svg
        aria-hidden="true"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        className={`${styles.sphere} shrink-0`}
      >
        <defs>
          <clipPath id={clipId}>
            <circle cx="12" cy="12" r="11" />
          </clipPath>
        </defs>
        <g clipPath={`url(#${clipId})`}>
          {BANDS.map((band, i) => (
            <path
              key={`base-${i}`}
              d={band.d}
              fill="var(--brand-400)"
              opacity={band.opacity}
            />
          ))}
          {BANDS.map((band, i) => (
            <path
              key={`hi-${i}`}
              d={band.d}
              fill="var(--brand-200)"
              className={
                styles.hi + (i === MIDDLE_BAND ? ` ${styles.hiMid}` : "")
              }
              style={{ animationDelay: `${i * 0.24}s` }}
            />
          ))}
        </g>
      </svg>
      <span className={showLabel ? "text-xs font-medium" : "sr-only"}>
        {label}
      </span>
    </span>
  );
}
