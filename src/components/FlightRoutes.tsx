"use client";

/**
 * FlightRoutes
 * Animated "global education network": a professionally-generated dotted world
 * map (via dotted-map, precomputed in scripts/generate-map.mjs) with the QCS
 * hub, destination flags, and animated dashed connection arcs flowing from the
 * hub to each destination.
 *
 * All layers share the map's native viewBox (VIEWBOX) and the geographically
 * projected pin coordinates (PIN_COORDS), so everything lines up exactly.
 */

import { MAP_DOTS, VIEWBOX, PIN_COORDS } from "./mapData";

interface Destination {
  code: keyof typeof PIN_COORDS;
  name: string;
  flag: string;
}

const destinations: Destination[] = [
  { code: "CA", name: "Canada", flag: "🇨🇦" },
  { code: "US", name: "USA", flag: "🇺🇸" },
  { code: "UK", name: "UK", flag: "🇬🇧" },
  { code: "AU", name: "Australia", flag: "🇦🇺" },
  { code: "NZ", name: "New Zealand", flag: "🇳🇿" },
  { code: "DE", name: "Germany", flag: "🇩🇪" },
  { code: "IE", name: "Ireland", flag: "🇮🇪" },
  { code: "FR", name: "France", flag: "🇫🇷" },
  { code: "NL", name: "Netherlands", flag: "🇳🇱" },
  { code: "IT", name: "Italy", flag: "🇮🇹" },
  { code: "ES", name: "Spain", flag: "🇪🇸" },
  { code: "SE", name: "Sweden", flag: "🇸🇪" },
  { code: "CH", name: "Switzerland", flag: "🇨🇭" },
  { code: "SG", name: "Singapore", flag: "🇸🇬" },
];

const HUB = PIN_COORDS.hub;

// The dotted map's native viewBox is VIEWBOX.width x VIEWBOX.height, but a few
// pins (e.g. New Zealand) sit slightly beyond the eastern edge. Pad the stage
// so every pin is fully visible.
const PAD_RIGHT = 6;
const STAGE_W = VIEWBOX.width + PAD_RIGHT;
const STAGE_H = VIEWBOX.height;

/**
 * The European destinations project to almost the same spot on the map, so
 * their flags would overlap. These small manual offsets (in viewBox units) fan
 * them out into a readable cluster while keeping them near their real location.
 */
const FLAG_OFFSETS: Partial<
  Record<keyof typeof PIN_COORDS, { dx: number; dy: number }>
> = {
  IE: { dx: -3.5, dy: -1.5 }, // Ireland — west
  UK: { dx: -1.5, dy: -3 }, //   UK — north-west
  NL: { dx: 1.5, dy: -3.5 }, //  Netherlands — north
  DE: { dx: 4, dy: -2.5 }, //    Germany — north-east
  SE: { dx: 5.5, dy: -5 }, //    Sweden — far north-east
  FR: { dx: -2.5, dy: 2 }, //    France — south-west
  CH: { dx: 1, dy: 3 }, //       Switzerland — south
  IT: { dx: 4, dy: 2.5 }, //     Italy — south-east
  ES: { dx: -5, dy: 3.5 }, //    Spain — far south-west
};

// Build a gentle arc (quadratic curve) from the hub to a destination, lifting
// the control point perpendicular to the line for a nice flight-path curve.
// Routes end at the (possibly offset) flag position so they line up visually.
function curvePath(code: keyof typeof PIN_COORDS): string {
  const base = PIN_COORDS[code];
  const offset = FLAG_OFFSETS[code] ?? { dx: 0, dy: 0 };
  const end = { x: base.x + offset.dx, y: base.y + offset.dy };
  const midX = (HUB.x + end.x) / 2;
  const midY = (HUB.y + end.y) / 2;
  // lift amount scales with distance for a natural arc
  const dist = Math.hypot(end.x - HUB.x, end.y - HUB.y);
  const lift = Math.min(dist * 0.28, 14);
  return `M ${HUB.x} ${HUB.y} Q ${midX} ${midY - lift} ${end.x} ${end.y}`;
}

// Convert map viewBox coords -> CSS % for HTML overlays (flags, hub)
const pctX = (x: number) => (x / STAGE_W) * 100;
const pctY = (y: number) => (y / STAGE_H) * 100;

export default function FlightRoutes() {
  return (
    <section
      className="relative overflow-hidden bg-gradient-to-b from-[#0f2440] via-[#1e3a5f] to-[#152a45] py-16 md:py-20"
      aria-label="Global education network"
    >
      <div className="container-narrow relative z-10">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <p className="mb-2 text-sm font-semibold tracking-widest text-[var(--color-accent)] uppercase">
            Your World Awaits
          </p>
          <h2 className="text-3xl font-bold text-white md:text-4xl">
            One Network, Endless Destinations
          </h2>
          <p className="mt-4 text-white/70">
            From our hub to campuses across the globe — QCS ABROAD connects you
            to world-class education wherever your ambitions take you.
          </p>
        </div>

        {/* Stage: aspect ratio matches the padded map viewBox */}
        <div
          className="relative mx-auto w-full max-w-5xl"
          style={{ aspectRatio: `${STAGE_W} / ${STAGE_H}` }}
        >
          {/* ===== Dotted world map (precomputed) ===== */}
          <svg
            viewBox={`0 0 ${STAGE_W} ${STAGE_H}`}
            preserveAspectRatio="xMidYMid meet"
            className="absolute inset-0 h-full w-full opacity-40"
            aria-hidden="true"
            dangerouslySetInnerHTML={{ __html: MAP_DOTS }}
          />

          {/* ===== Highlight glows under each destination ===== */}
          <svg
            viewBox={`0 0 ${STAGE_W} ${STAGE_H}`}
            preserveAspectRatio="xMidYMid meet"
            className="absolute inset-0 h-full w-full"
            aria-hidden="true"
          >
            {destinations.map((dest) => {
              const base = PIN_COORDS[dest.code];
              const offset = FLAG_OFFSETS[dest.code] ?? { dx: 0, dy: 0 };
              const cx = base.x + offset.dx;
              const cy = base.y + offset.dy;
              return (
                <g key={`hl-${dest.code}`}>
                  <circle
                    cx={cx}
                    cy={cy}
                    r="2.4"
                    fill="var(--color-accent)"
                    fillOpacity="0.25"
                  />
                  <circle
                    cx={cx}
                    cy={cy}
                    r="1.3"
                    fill="var(--color-accent)"
                    fillOpacity="0.5"
                  />
                </g>
              );
            })}

            {/* Animated dotted flight-path connections */}
            {destinations.map((dest) => (
              <path
                key={`path-${dest.code}`}
                d={curvePath(dest.code)}
                fill="none"
                stroke="#ffffff"
                strokeWidth="1.6"
                strokeOpacity="1"
                strokeLinecap="round"
                className="flight-path"
                vectorEffect="non-scaling-stroke"
                style={{
                  filter:
                    "drop-shadow(0 0 3px #ffffff) drop-shadow(0 0 6px rgba(255,255,255,0.8))",
                }}
              />
            ))}
          </svg>

          {/* ===== Central hub ===== */}
          <div
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${pctX(HUB.x)}%`, top: `${pctY(HUB.y)}%` }}
          >
            <div className="relative flex items-center justify-center">
              <span className="pulse-ring absolute h-10 w-10 rounded-full bg-[var(--color-accent)]/40" />
              <span className="relative flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-lg ring-4 ring-[var(--color-accent)]/30 md:h-12 md:w-12">
                <span className="text-[9px] leading-tight font-bold text-[var(--color-primary)]">
                  QCS
                </span>
              </span>
            </div>
          </div>

          {/* ===== Destination flag pins (flags only) ===== */}
          {destinations.map((dest) => {
            const p = PIN_COORDS[dest.code];
            const offset = FLAG_OFFSETS[dest.code] ?? { dx: 0, dy: 0 };
            return (
              <div
                key={`node-${dest.code}`}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: `${pctX(p.x + offset.dx)}%`,
                  top: `${pctY(p.y + offset.dy)}%`,
                }}
                title={dest.name}
              >
                <div className="flag-bob">
                  <span className="block text-lg leading-none drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)] transition-transform duration-200 hover:scale-125 md:text-xl">
                    {dest.flag}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
