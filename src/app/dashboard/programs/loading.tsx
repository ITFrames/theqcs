/** Instant loading skeleton for the Explore Programs page. */
export default function ProgramsLoading() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="space-y-2">
        <div className="h-8 w-56 rounded bg-[var(--color-background-muted)]" />
        <div className="h-4 w-96 max-w-full rounded bg-[var(--color-background-muted)]" />
      </div>
      <div className="h-10 w-64 rounded-lg bg-[var(--color-background-muted)]" />
      <div className="h-16 w-full rounded-xl bg-[var(--color-background-muted)]" />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl bg-white p-5 shadow-[var(--shadow-md)]"
          >
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-xl bg-[var(--color-background-muted)]" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-32 rounded bg-[var(--color-background-muted)]" />
                <div className="h-2 w-20 rounded bg-[var(--color-background-muted)]" />
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <div className="h-3 w-full rounded bg-[var(--color-background-muted)]" />
              <div className="h-3 w-3/4 rounded bg-[var(--color-background-muted)]" />
            </div>
            <div className="mt-4 h-8 w-full rounded-lg bg-[var(--color-background-muted)]" />
          </div>
        ))}
      </div>
    </div>
  );
}
