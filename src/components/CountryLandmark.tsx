/**
 * CountryLandmark — a lightweight, dependency-free SVG silhouette of an iconic
 * landmark/scene for each study destination. Used on blog country cards so they
 * show recognizable imagery rather than just a flag.
 *
 * Self-contained (no image assets / licensing), on-brand, and crisp at any size.
 * `currentColor` is used for the silhouette so the parent controls the tint.
 */

type LandmarkProps = { className?: string };

function Frame({ children }: { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 200 100"
      className="h-full w-full"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      preserveAspectRatio="xMidYMax meet"
    >
      {children}
    </svg>
  );
}

/* Each landmark draws in currentColor at the bottom of a 200x100 canvas. */

const Canada = () => (
  <Frame>
    {/* CN Tower */}
    <path d="M98 20 l2-6 2 6 -1 20 h-2 z" fill="currentColor" />
    <rect x="97" y="38" width="6" height="52" fill="currentColor" />
    <ellipse cx="100" cy="46" rx="10" ry="4" fill="currentColor" />
    {/* Maple leaf */}
    <path
      d="M150 40 l3 7 7-2 -3 6 6 3 -7 2 1 7 -6-4 -6 4 1-7 -7-2 6-3 -3-6 7 2z"
      fill="currentColor"
    />
    <rect x="20" y="70" width="160" height="20" fill="currentColor" opacity="0.35" />
  </Frame>
);

const USA = () => (
  <Frame>
    {/* Statue of Liberty (simplified) */}
    <circle cx="100" cy="26" r="6" fill="currentColor" />
    <path d="M94 20 l2-8 2 4 2-4 2 8z" fill="currentColor" />
    <path d="M97 32 l6 0 4 46 -14 0z" fill="currentColor" />
    <rect x="90" y="78" width="20" height="12" fill="currentColor" />
    <rect x="20" y="82" width="160" height="8" fill="currentColor" opacity="0.35" />
  </Frame>
);

const UK = () => (
  <Frame>
    {/* Big Ben */}
    <rect x="92" y="30" width="16" height="60" fill="currentColor" />
    <path d="M92 30 l8-14 8 14z" fill="currentColor" />
    <rect x="95" y="40" width="10" height="10" fill="currentColor" opacity="0.4" />
    <rect x="30" y="72" width="150" height="18" fill="currentColor" opacity="0.3" />
  </Frame>
);

const Australia = () => (
  <Frame>
    {/* Sydney Opera House shells */}
    <path d="M70 90 q6-40 22-30 q-8 8 -6 30z" fill="currentColor" />
    <path d="M92 90 q6-44 24-30 q-8 8 -6 30z" fill="currentColor" />
    <path d="M116 90 q6-40 22-28 q-8 8 -6 28z" fill="currentColor" />
    <rect x="20" y="84" width="160" height="6" fill="currentColor" opacity="0.4" />
  </Frame>
);

const NewZealand = () => (
  <Frame>
    {/* Mountains + fern */}
    <path d="M20 90 L60 40 L90 90 Z" fill="currentColor" />
    <path d="M75 90 L120 30 L165 90 Z" fill="currentColor" opacity="0.8" />
    <path d="M118 24 l3 6 -3 -1 -3 1z" fill="currentColor" />
  </Frame>
);

const Germany = () => (
  <Frame>
    {/* Brandenburg Gate */}
    <rect x="70" y="40" width="60" height="50" fill="currentColor" />
    {[74, 86, 98, 110, 122].map((x) => (
      <rect key={x} x={x} y="48" width="6" height="42" fill="#ffffff" opacity="0.25" />
    ))}
    <rect x="66" y="34" width="68" height="8" fill="currentColor" />
  </Frame>
);

const Ireland = () => (
  <Frame>
    {/* Rolling hills + shamrock */}
    <path d="M20 90 q40-24 80 0 q40-22 80 0 v0 h-160z" fill="currentColor" opacity="0.7" />
    <circle cx="100" cy="34" r="5" fill="currentColor" />
    <circle cx="92" cy="40" r="5" fill="currentColor" />
    <circle cx="108" cy="40" r="5" fill="currentColor" />
    <rect x="99" y="44" width="2" height="12" fill="currentColor" />
  </Frame>
);

const France = () => (
  <Frame>
    {/* Eiffel Tower */}
    <path d="M100 14 L112 90 L88 90 Z" fill="currentColor" />
    <path d="M92 60 h16 M86 78 h28" stroke="#ffffff" strokeOpacity="0.3" strokeWidth="3" />
    <path d="M94 44 h12" stroke="#ffffff" strokeOpacity="0.3" strokeWidth="2" />
  </Frame>
);

const Netherlands = () => (
  <Frame>
    {/* Windmill */}
    <rect x="94" y="46" width="12" height="44" fill="currentColor" />
    <path d="M100 46 l-24-14 4-4 22 16z" fill="currentColor" />
    <path d="M100 46 l24 14 -4 4 -22-16z" fill="currentColor" />
    <path d="M100 46 l14-24 4 4 -16 22z" fill="currentColor" />
    <path d="M100 46 l-14 24 -4-4 16-22z" fill="currentColor" />
    <circle cx="100" cy="46" r="4" fill="currentColor" />
  </Frame>
);

const Italy = () => (
  <Frame>
    {/* Leaning Tower of Pisa + Colosseum arches */}
    <g transform="rotate(-8 70 90)">
      <rect x="60" y="34" width="16" height="56" fill="currentColor" />
    </g>
    <path d="M110 60 a26 26 0 0 1 52 0 v30 h-52z" fill="currentColor" />
    {[120, 134, 148].map((x) => (
      <rect key={x} x={x} y="66" width="6" height="16" rx="3" fill="#ffffff" opacity="0.25" />
    ))}
  </Frame>
);

const Spain = () => (
  <Frame>
    {/* Sagrada Familia spires */}
    {[80, 92, 104, 116].map((x, i) => (
      <path key={x} d={`M${x} 90 L${x + 4} ${34 + i * 4} L${x + 8} 90 Z`} fill="currentColor" />
    ))}
    <rect x="30" y="82" width="150" height="8" fill="currentColor" opacity="0.35" />
  </Frame>
);

const Sweden = () => (
  <Frame>
    {/* Gamla Stan rooftops */}
    <path d="M60 90 v-30 l10-10 10 10 v30z" fill="currentColor" />
    <path d="M84 90 v-38 l12-12 12 12 v38z" fill="currentColor" opacity="0.85" />
    <path d="M112 90 v-30 l10-10 10 10 v30z" fill="currentColor" />
  </Frame>
);

const Switzerland = () => (
  <Frame>
    {/* Alps */}
    <path d="M20 90 L64 34 L100 90 Z" fill="currentColor" />
    <path d="M62 90 L108 28 L154 90 Z" fill="currentColor" opacity="0.85" />
    <path d="M96 46 l12 0 -6-8z" fill="#ffffff" opacity="0.5" />
  </Frame>
);

const Singapore = () => (
  <Frame>
    {/* Marina Bay Sands */}
    <rect x="72" y="52" width="8" height="38" fill="currentColor" />
    <rect x="96" y="46" width="8" height="44" fill="currentColor" />
    <rect x="120" y="52" width="8" height="38" fill="currentColor" />
    <path d="M64 46 q36-14 72 0 l0 6 q-36-12 -72 0z" fill="currentColor" />
  </Frame>
);

const LANDMARKS: Record<string, () => React.ReactElement> = {
  "study-in-canada": Canada,
  "study-in-usa": USA,
  "study-in-uk": UK,
  "study-in-australia": Australia,
  "study-in-new-zealand": NewZealand,
  "study-in-germany": Germany,
  "study-in-ireland": Ireland,
  "study-in-france": France,
  "study-in-netherlands": Netherlands,
  "study-in-italy": Italy,
  "study-in-spain": Spain,
  "study-in-sweden": Sweden,
  "study-in-switzerland": Switzerland,
  "study-in-singapore": Singapore,
};

export default function CountryLandmark({
  slug,
  className,
}: LandmarkProps & { slug: string }) {
  const Landmark = LANDMARKS[slug];
  if (!Landmark) return null;
  return (
    <div className={className}>
      <Landmark />
    </div>
  );
}

export function hasLandmark(slug: string): boolean {
  return slug in LANDMARKS;
}
