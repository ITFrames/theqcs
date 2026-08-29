/**
 * HeroImage — displays a real student photo in the homepage hero with a
 * polished animated backdrop (soft rings, gradient glow, orbiting accent
 * badges) and a gentle float on the photo itself.
 *
 * SETUP:
 *   1. Add your image at:  public/hero-student.png
 *      (A PNG or WebP with a transparent / clean background works best so it
 *       blends with the animated hero. ~800x900px or larger recommended.)
 *   2. That's it — this component references "/hero-student.png".
 *      To use a different filename, change HERO_IMAGE_SRC below.
 *
 * Motion respects prefers-reduced-motion via the shared classes in globals.css.
 */

import Image from "next/image";

const HERO_IMAGE_SRC = "/hero-student.png";

export default function HeroImage() {
  return (
    <div className="relative mx-auto w-full max-w-md" aria-hidden="false">
      {/* Animated backdrop */}
      <div className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
        <span className="hero-orbit absolute h-[108%] w-[108%] rounded-full border border-[var(--color-primary)]/[0.08]" />
        <span
          className="hero-orbit absolute h-[86%] w-[86%] rounded-full border border-[var(--color-accent)]/[0.12]"
          style={{ animationDelay: "1.5s" }}
        />
        <span className="absolute h-[74%] w-[74%] rounded-full bg-gradient-to-br from-[var(--color-primary)]/[0.12] to-[var(--color-accent)]/[0.14] blur-2xl" />
      </div>

      {/* Orbiting accent badges */}
      <div className="student-orbit absolute inset-0" aria-hidden="true">
        <span className="absolute left-[4%] top-[16%] flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-xl shadow-lg ring-1 ring-black/5">
          📚
        </span>
        <span className="absolute right-[2%] top-[38%] flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-xl shadow-lg ring-1 ring-black/5">
          🌍
        </span>
        <span className="absolute bottom-[10%] left-[0%] flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-xl shadow-lg ring-1 ring-black/5">
          🎓
        </span>
      </div>

      {/* The photo */}
      <div className="student-float relative z-10">
        <Image
          src={HERO_IMAGE_SRC}
          alt="A QCS ABROAD student ready to begin their study abroad journey"
          width={800}
          height={900}
          priority
          className="mx-auto h-auto w-full max-w-sm object-contain drop-shadow-2xl"
        />
      </div>
    </div>
  );
}
