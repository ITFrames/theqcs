/**
 * Reusable loading primitives.
 *   <Spinner />         — inline SVG spinner (inherits currentColor).
 *   <LoadingOverlay />  — full-screen dimmed overlay with a spinner + message,
 *                         for blocking async actions (e.g. finishing signup).
 */

export function Spinner({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      className={`animate-spin ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

export function LoadingOverlay({ message = "Loading…" }: { message?: string }) {
  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-white/70 backdrop-blur-sm"
      role="status"
      aria-live="polite"
    >
      <div className="flex flex-col items-center gap-3 rounded-2xl bg-white px-8 py-6 shadow-lg">
        <span className="text-[var(--color-primary)]">
          <Spinner className="h-7 w-7" />
        </span>
        <p className="text-sm font-medium text-[var(--color-foreground-muted)]">
          {message}
        </p>
      </div>
    </div>
  );
}
