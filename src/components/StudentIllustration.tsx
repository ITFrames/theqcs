/**
 * StudentIllustration — a clean, professional, animated SVG of a student
 * holding books, sized for the homepage hero's right column.
 *
 * Built entirely in code (no image assets) using the brand palette (navy +
 * gold). Kept geometric and minimal to read as premium rather than clip-art.
 *
 * Subtle, tasteful motion:
 *   - The whole figure "breathes" with a gentle float.
 *   - A graduation cap tassel sways.
 *   - Orbiting accent badges (books/globe) rotate slowly around the figure.
 *   - Soft rings pulse behind for depth.
 *
 * Decorative, so the SVG is aria-hidden. Motion respects prefers-reduced-motion
 * via the shared classes in globals.css.
 *
 * To swap in a real photo later, replace this component with a Next.js
 * <Image> — the hero layout does not need to change.
 */

export default function StudentIllustration() {
  return (
    <div className="relative mx-auto w-full max-w-md" aria-hidden="true">
      {/* Soft backdrop rings */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="hero-orbit absolute h-[110%] w-[110%] rounded-full border border-[var(--color-primary)]/[0.08]" />
        <span
          className="hero-orbit absolute h-[85%] w-[85%] rounded-full border border-[var(--color-accent)]/[0.12]"
          style={{ animationDelay: "1.5s" }}
        />
        {/* Gradient blob behind the student */}
        <span className="absolute h-[70%] w-[70%] rounded-full bg-gradient-to-br from-[var(--color-primary)]/[0.10] to-[var(--color-accent)]/[0.12] blur-2xl" />
      </div>

      {/* Floating orbiting badges */}
      <div className="student-orbit absolute inset-0">
        <span className="absolute left-[6%] top-[18%] flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-xl shadow-lg ring-1 ring-black/5">
          📚
        </span>
        <span className="absolute right-[4%] top-[34%] flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-xl shadow-lg ring-1 ring-black/5">
          🌍
        </span>
        <span className="absolute bottom-[14%] left-[2%] flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-xl shadow-lg ring-1 ring-black/5">
          🎓
        </span>
      </div>

      {/* The student figure */}
      <svg
        viewBox="0 0 320 360"
        className="student-float relative z-10 w-full drop-shadow-xl"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="skin" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#e8b89a" />
            <stop offset="1" stopColor="#d9a582" />
          </linearGradient>
          <linearGradient id="shirt" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#2a4f7a" />
            <stop offset="1" stopColor="#1e3a5f" />
          </linearGradient>
          <linearGradient id="books" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#d4a853" />
            <stop offset="1" stopColor="#b8923f" />
          </linearGradient>
        </defs>

        {/* Base pedestal shadow */}
        <ellipse cx="160" cy="336" rx="96" ry="14" fill="#1e3a5f" opacity="0.08" />

        {/* Body / torso */}
        <path
          d="M96 336 C96 250 108 214 160 214 C212 214 224 250 224 336 Z"
          fill="url(#shirt)"
        />
        {/* Collar */}
        <path d="M142 218 L160 236 L178 218 Z" fill="#ffffff" opacity="0.9" />

        {/* Left arm hugging books */}
        <path
          d="M104 250 C86 262 82 292 96 300 L120 292 C112 280 114 264 122 258 Z"
          fill="url(#shirt)"
        />
        {/* Right arm */}
        <path
          d="M216 250 C234 262 238 292 224 300 L200 292 C208 280 206 264 198 258 Z"
          fill="url(#shirt)"
        />

        {/* Stack of books held in front */}
        <g>
          <rect x="108" y="286" width="104" height="20" rx="4" fill="url(#books)" />
          <rect x="114" y="304" width="92" height="18" rx="4" fill="#2a4f7a" />
          <rect x="120" y="320" width="80" height="16" rx="4" fill="#d4a853" />
          {/* Book page lines */}
          <line x1="108" y1="296" x2="212" y2="296" stroke="#ffffff" strokeOpacity="0.35" strokeWidth="1.5" />
          <line x1="114" y1="313" x2="206" y2="313" stroke="#ffffff" strokeOpacity="0.3" strokeWidth="1.5" />
        </g>

        {/* Hands over books */}
        <ellipse cx="116" cy="290" rx="10" ry="7" fill="url(#skin)" />
        <ellipse cx="204" cy="290" rx="10" ry="7" fill="url(#skin)" />

        {/* Neck */}
        <rect x="150" y="196" width="20" height="26" rx="8" fill="url(#skin)" />

        {/* Head */}
        <circle cx="160" cy="164" r="40" fill="url(#skin)" />
        {/* Hair */}
        <path
          d="M120 158 C120 120 200 120 200 158 C200 150 196 132 160 132 C124 132 120 150 120 158 Z"
          fill="#3a2b23"
        />
        {/* Face features */}
        <circle cx="146" cy="166" r="3.2" fill="#3a2b23" />
        <circle cx="174" cy="166" r="3.2" fill="#3a2b23" />
        <path d="M150 182 Q160 190 170 182" stroke="#a86b4e" strokeWidth="2.5" fill="none" strokeLinecap="round" />

        {/* Graduation cap */}
        <g>
          <path d="M110 132 L160 112 L210 132 L160 152 Z" fill="#1e3a5f" />
          <rect x="150" y="120" width="20" height="12" fill="#152a45" opacity="0.5" />
          {/* Tassel — sways */}
          <g className="student-tassel" style={{ transformOrigin: "200px 132px" }}>
            <line x1="200" y1="132" x2="204" y2="158" stroke="#d4a853" strokeWidth="2.5" />
            <circle cx="204" cy="162" r="4" fill="#d4a853" />
          </g>
        </g>
      </svg>
    </div>
  );
}
