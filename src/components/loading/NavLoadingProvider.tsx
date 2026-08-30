"use client";

/**
 * Global navigation loading indicator for QCS ABROAD.
 *
 * Provides a thin top progress bar that appears during route transitions and
 * explicit async actions. This fixes the "nothing happens for a few seconds"
 * gap when a navigation triggers a server render (e.g. after OTP verify, the
 * dashboard layout runs an auth check + DB queries before painting).
 *
 * Usage:
 *   const { start } = useNavLoading();
 *   start();                 // show the bar
 *   router.push("/dashboard"); // bar auto-completes when the pathname changes
 *
 * The bar also auto-starts on <Link> clicks via the exported <NavLink>, and
 * completes automatically whenever the pathname changes.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { usePathname } from "next/navigation";

interface NavLoadingValue {
  /** Begin showing the progress bar. */
  start: () => void;
  /** Force-hide the progress bar. */
  done: () => void;
  active: boolean;
}

const NavLoadingContext = createContext<NavLoadingValue | null>(null);

export function NavLoadingProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [active, setActive] = useState(false);
  const [progress, setProgress] = useState(0);
  const timers = useRef<ReturnType<typeof setInterval>[]>([]);
  const prevPath = useRef(pathname);

  const clearTimers = () => {
    timers.current.forEach(clearInterval);
    timers.current = [];
  };

  const start = useCallback(() => {
    clearTimers();
    setActive(true);
    setProgress(8);
    // Creep towards ~90% while we wait for the destination to render.
    const id = setInterval(() => {
      setProgress((p) => (p < 90 ? p + Math.max(1, (90 - p) * 0.12) : p));
    }, 200);
    timers.current.push(id);
  }, []);

  const done = useCallback(() => {
    clearTimers();
    setProgress(100);
    // Let the 100% state paint briefly, then fade out.
    const id = setTimeout(() => {
      setActive(false);
      setProgress(0);
    }, 250);
    timers.current.push(id as unknown as ReturnType<typeof setInterval>);
  }, []);

  // When the pathname actually changes, the destination has rendered — finish.
  useEffect(() => {
    if (prevPath.current !== pathname) {
      prevPath.current = pathname;
      done();
    }
  }, [pathname, done]);

  // Safety: never leave the bar hanging forever.
  useEffect(() => {
    if (!active) return;
    const failsafe = setTimeout(() => done(), 12000);
    return () => clearTimeout(failsafe);
  }, [active, done]);

  // Auto-start on internal link clicks so every navigation shows the bar,
  // without having to wrap every <Link> manually.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      // Ignore modified clicks / non-left buttons (open-in-new-tab, etc.).
      if (
        e.defaultPrevented ||
        e.button !== 0 ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey
      )
        return;
      const el = (e.target as HTMLElement | null)?.closest("a");
      if (!el) return;
      const href = el.getAttribute("href");
      const target = el.getAttribute("target");
      if (
        !href ||
        target === "_blank" ||
        href.startsWith("#") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        el.hasAttribute("download")
      )
        return;
      // Only same-origin, and only if the path actually changes.
      try {
        const url = new URL(href, window.location.href);
        if (url.origin !== window.location.origin) return;
        if (url.pathname === window.location.pathname) return;
      } catch {
        return;
      }
      start();
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [start]);

  useEffect(() => () => clearTimers(), []);

  return (
    <NavLoadingContext.Provider value={{ start, done, active }}>
      {/* Top progress bar */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 top-0 z-[100] h-0.5"
        style={{ opacity: active ? 1 : 0, transition: "opacity 200ms ease" }}
      >
        <div
          className="h-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)]"
          style={{
            width: `${progress}%`,
            transition: "width 200ms ease",
            boxShadow: "0 0 8px rgba(212,168,83,0.6)",
          }}
        />
      </div>
      {children}
    </NavLoadingContext.Provider>
  );
}

export function useNavLoading(): NavLoadingValue {
  const ctx = useContext(NavLoadingContext);
  if (!ctx) {
    throw new Error("useNavLoading must be used within a NavLoadingProvider");
  }
  return ctx;
}
