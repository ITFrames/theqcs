/**
 * Instant loading skeleton for the dashboard overview. Streams in while the
 * page's server data resolves, so the user sees structure immediately.
 */
export default function DashboardLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="space-y-2">
        <div className="h-8 w-64 rounded bg-[var(--color-background-muted)]" />
        <div className="h-4 w-80 rounded bg-[var(--color-background-muted)]" />
      </div>
      <div className="rounded-2xl bg-white p-6 shadow-[var(--shadow-md)]">
        <div className="mb-5 h-5 w-40 rounded bg-[var(--color-background-muted)]" />
        <div className="mb-6 h-2 w-full rounded-full bg-[var(--color-background-muted)]" />
        <div className="grid grid-cols-4 gap-4 sm:grid-cols-8">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-[var(--color-background-muted)]" />
              <div className="h-2 w-10 rounded bg-[var(--color-background-muted)]" />
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-2xl border border-[var(--color-accent)]/30 bg-[#fdf8ef] p-6">
        <div className="h-4 w-24 rounded bg-white/60" />
        <div className="mt-3 h-6 w-72 rounded bg-white/60" />
        <div className="mt-2 h-4 w-full max-w-lg rounded bg-white/60" />
      </div>
    </div>
  );
}
