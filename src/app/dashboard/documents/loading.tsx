/** Instant loading skeleton for the Documents page. */
export default function DocumentsLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="space-y-2">
        <div className="h-8 w-52 rounded bg-[var(--color-background-muted)]" />
        <div className="h-4 w-96 max-w-full rounded bg-[var(--color-background-muted)]" />
      </div>
      {Array.from({ length: 3 }).map((_, s) => (
        <div key={s} className="space-y-3">
          <div className="h-3 w-28 rounded bg-[var(--color-background-muted)]" />
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {Array.from({ length: 2 }).map((_, i) => (
              <div
                key={i}
                className="rounded-xl border border-[var(--color-border-light)] bg-white p-4 shadow-[var(--shadow-sm)]"
              >
                <div className="h-4 w-40 rounded bg-[var(--color-background-muted)]" />
                <div className="mt-3 h-9 w-full rounded-lg bg-[var(--color-background-muted)]" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
