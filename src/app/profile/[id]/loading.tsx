export default function ProfileLoading() {
  return (
    <main className="mx-auto max-w-4xl px-5 py-14 sm:px-8 sm:py-16">
      <div className="mb-10 h-10 w-32 animate-pulse rounded-full bg-[var(--dq-muted-bg)]" />

      {/* Identity card skeleton */}
      <div className="dq-card mb-12 p-8 sm:p-10">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
          <div className="h-24 w-24 shrink-0 animate-pulse rounded-full bg-[var(--dq-muted-bg)]" />
          <div className="flex-1 space-y-3">
            <div className="h-8 w-48 animate-pulse rounded bg-[var(--dq-muted-bg)]" />
            <div className="h-4 w-64 animate-pulse rounded bg-[var(--dq-muted-bg)]" />
            <div className="flex gap-3">
              <div className="h-7 w-24 animate-pulse rounded-full bg-[var(--dq-muted-bg)]" />
              <div className="h-7 w-20 animate-pulse rounded bg-[var(--dq-muted-bg)]" />
            </div>
          </div>
        </div>

        {/* Progress bar skeleton */}
        <div className="mt-8 border-t border-[var(--dq-border)] pt-6">
          <div className="flex items-center justify-between">
            <div className="h-4 w-28 animate-pulse rounded bg-[var(--dq-muted-bg)]" />
            <div className="h-3 w-32 animate-pulse rounded bg-[var(--dq-muted-bg)]" />
          </div>
          <div className="mt-2 h-2.5 animate-pulse rounded-full bg-[var(--dq-muted-bg)]" />
        </div>

        {/* Streak skeleton */}
        <div className="mt-6 flex gap-6 border-t border-[var(--dq-border)] pt-6">
          {[1, 2].map((i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="h-8 w-8 animate-pulse rounded-full bg-[var(--dq-muted-bg)]" />
              <div className="space-y-1">
                <div className="h-5 w-10 animate-pulse rounded bg-[var(--dq-muted-bg)]" />
                <div className="h-2.5 w-20 animate-pulse rounded bg-[var(--dq-muted-bg)]" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Seal progress skeleton */}
      <div className="mb-12">
        <div className="mb-6 h-6 w-52 animate-pulse rounded bg-[var(--dq-muted-bg)]" />
        <div className="grid gap-5 sm:grid-cols-2">
          {[1, 2].map((i) => (
            <div key={i} className="dq-card p-5 space-y-2">
              <div className="flex justify-between">
                <div className="h-4 w-32 animate-pulse rounded bg-[var(--dq-muted-bg)]" />
                <div className="h-3 w-20 animate-pulse rounded bg-[var(--dq-muted-bg)]" />
              </div>
              <div className="h-2 animate-pulse rounded-full bg-[var(--dq-muted-bg)]" />
              <div className="h-2.5 w-16 animate-pulse rounded bg-[var(--dq-muted-bg)]" />
            </div>
          ))}
        </div>
      </div>

      {/* Recent reflections skeleton */}
      <div>
        <div className="mb-6 h-6 w-44 animate-pulse rounded bg-[var(--dq-muted-bg)]" />
        <div className="grid gap-6 sm:grid-cols-2">
          {[1, 2].map((i) => (
            <div key={i} className="dq-card p-6">
              <div className="mb-4 flex items-center gap-2">
                <div className="h-5 w-16 animate-pulse rounded bg-[var(--dq-muted-bg)]" />
                <div className="h-4 w-20 animate-pulse rounded bg-[var(--dq-muted-bg)]" />
              </div>
              <div className="space-y-2">
                <div className="h-3 w-full animate-pulse rounded bg-[var(--dq-muted-bg)]" />
                <div className="h-3 w-[80%] animate-pulse rounded bg-[var(--dq-muted-bg)]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
