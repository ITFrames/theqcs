/**
 * HeroBackground — a clean, professional, abstract animation for the homepage
 * hero. No emoji or literal imagery; instead it uses subtle geometric motion
 * that reads as premium and understated:
 *
 *   1. Drifting dot field — soft specks that slowly rise and fade for depth.
 *   2. Concentric "orbit" rings — faint expanding circles that suggest global
 *      reach without being literal.
 *   3. A subtle fine grid overlay for structure.
 *
 * Purely decorative (aria-hidden), non-interactive (pointer-events-none), and
 * fully disabled under `prefers-reduced-motion` (see globals.css). Server
 * component — pure CSS, deterministic values (no hydration drift).
 */

// Drifting dot field — soft specks at varied positions/sizes.
const DOTS = [
  { top: "20%", left: "18%", size: 6, delay: "0s", duration: "12s" },
  { top: "68%", left: "28%", size: 4, delay: "1s", duration: "14s" },
  { top: "34%", left: "72%", size: 5, delay: "2s", duration: "13s" },
  { top: "78%", left: "66%", size: 4, delay: "0.5s", duration: "15s" },
  { top: "48%", left: "12%", size: 5, delay: "1.5s", duration: "11s" },
  { top: "26%", left: "44%", size: 3, delay: "2.5s", duration: "16s" },
  { top: "60%", left: "86%", size: 6, delay: "0.8s", duration: "13s" },
  { top: "14%", left: "80%", size: 4, delay: "1.8s", duration: "14s" },
  { top: "84%", left: "48%", size: 3, delay: "2.2s", duration: "17s" },
];

export default function HeroBackground() {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      {/* Fine grid overlay for subtle structure */}
      <div
        className="absolute inset-0 opacity-[0.4]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(30,58,95,0.035) 1px, transparent 1px), linear-gradient(to bottom, rgba(30,58,95,0.035) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage:
            "radial-gradient(ellipse 80% 70% at 50% 45%, black, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 70% at 50% 45%, black, transparent 75%)",
        }}
      />

      {/* Concentric orbit rings — faint, slowly pulsing */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="hero-orbit absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[var(--color-primary)]/[0.06]"
            style={{
              width: `${420 + i * 220}px`,
              height: `${420 + i * 220}px`,
              animationDelay: `${i * 1.6}s`,
            }}
          />
        ))}
      </div>

      {/* Drifting dot field */}
      {DOTS.map((d, i) => (
        <span
          key={`dot-${i}`}
          className="hero-dot absolute rounded-full bg-[var(--color-accent)]"
          style={{
            top: d.top,
            left: d.left,
            width: `${d.size}px`,
            height: `${d.size}px`,
            animationDelay: d.delay,
            animationDuration: d.duration,
          }}
        />
      ))}
    </div>
  );
}
