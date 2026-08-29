"use client";

/**
 * Celebration — a lightweight, dependency-free confetti burst.
 *
 * Renders a fixed, click-through canvas that fires a one-shot confetti burst
 * whenever the `fire` prop changes to a new truthy key (e.g. a result id or a
 * simple counter). It:
 *   - uses the QCS brand palette (navy + gold) plus festive accents,
 *   - auto-stops after the particles fall (no infinite loop / CPU drain),
 *   - respects `prefers-reduced-motion` (renders nothing / no animation).
 *
 * No external libraries required.
 */

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rotation: number;
  vrot: number;
  shape: "rect" | "circle";
}

const COLORS = [
  "#1e3a5f", // primary navy
  "#d4a853", // accent gold
  "#e0bc72", // accent light
  "#2a4f7a", // primary light
  "#f5d98b",
  "#ffffff",
];

export default function Celebration({ fire }: { fire: string | number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Nothing to celebrate on the initial empty/zero state.
    if (!fire) return;

    // Respect reduced-motion: skip the animation entirely.
    if (
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const width = window.innerWidth;
    const height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    // Spawn particles from two lower corners + center-top, fountain style.
    const particles: Particle[] = [];
    const origins = [
      { x: width * 0.5, y: height * 0.28, spread: 1 }, // center burst near result
    ];
    const count = 140;

    for (const origin of origins) {
      for (let i = 0; i < count; i++) {
        const angle = Math.PI * 2 * Math.random();
        const speed = 6 + Math.random() * 8;
        particles.push({
          x: origin.x,
          y: origin.y,
          vx: Math.cos(angle) * speed * (0.6 + Math.random()),
          vy: Math.sin(angle) * speed - 4, // bias upward
          size: 6 + Math.random() * 6,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          rotation: Math.random() * Math.PI,
          vrot: (Math.random() - 0.5) * 0.3,
          shape: Math.random() > 0.5 ? "rect" : "circle",
        });
      }
    }

    const gravity = 0.22;
    const drag = 0.992;
    let frame = 0;
    const maxFrames = 200; // ~3.3s at 60fps, then auto-stop
    let raf = 0;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      frame++;

      // Fade particles out over the last third of the animation.
      const alpha =
        frame < maxFrames * 0.66
          ? 1
          : Math.max(0, 1 - (frame - maxFrames * 0.66) / (maxFrames * 0.34));

      for (const p of particles) {
        p.vx *= drag;
        p.vy = p.vy * drag + gravity;
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.vrot;

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;
        if (p.shape === "rect") {
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      if (frame < maxFrames) {
        raf = requestAnimationFrame(draw);
      } else {
        ctx.clearRect(0, 0, width, height);
      }
    };

    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      ctx.clearRect(0, 0, width, height);
    };
  }, [fire]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[60] h-full w-full"
    />
  );
}
