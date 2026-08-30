/**
 * HeroImage — homepage hero illustration.
 *
 * The artwork is a self-contained, on-brand illustration (navy + gold, with a
 * student, passport, luggage and world landmarks). It already includes its own
 * background, so we render it cleanly with a soft gradient blend and a gentle
 * float rather than surrounding it with extra decoration.
 *
 * To swap the image, replace `public/hero-student.webp` (keep it optimized).
 * Motion respects prefers-reduced-motion via the shared classes in globals.css.
 */

import Image from "next/image";

const HERO_IMAGE_SRC = "/hero-student.webp";

export default function HeroImage() {
  return (
    <div className="relative mx-auto w-full">
      {/* Soft glow behind the artwork so it melts into the hero gradient */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 scale-110 rounded-[2rem] bg-gradient-to-br from-[var(--color-primary)]/[0.06] to-[var(--color-accent)]/[0.10] blur-2xl"
      />
      <div className="student-float relative">
        <Image
          src={HERO_IMAGE_SRC}
          alt="A QCS ABROAD student ready to begin their study abroad journey"
          width={1672}
          height={941}
          priority
          sizes="(min-width: 1024px) 40rem, 100vw"
          className="h-auto w-full rounded-2xl"
          style={{
            // Fade the left edge slightly so it blends toward the hero copy.
            maskImage:
              "linear-gradient(to right, transparent 0%, black 8%, black 100%)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent 0%, black 8%, black 100%)",
          }}
        />
      </div>
    </div>
  );
}
