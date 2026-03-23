export default function HomeLoading() {
  return (
    <main className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-16">
      {/* Hero skeleton */}
      <div className="mb-14 flex flex-col items-center gap-4 text-center sm:mb-16">
        <div className="h-8 w-48 animate-pulse rounded-full bg-[var(--dq-muted-bg)]" />
        <div className="h-12 w-[80%] max-w-lg animate-pulse rounded-lg bg-[var(--dq-muted-bg)]" />
        <div className="h-5 w-[60%] max-w-md animate-pulse rounded bg-[var(--dq-muted-bg)]" />
        <div className="mt-4 flex gap-3">
          <div className="h-11 w-28 animate-pulse rounded-full bg-[var(--dq-muted-bg)]" />
          <div className="h-11 w-36 animate-pulse rounded-full bg-[var(--dq-muted-bg)]" />
        </div>
      </div>

      {/* Stats strip skeleton */}
      <div className="mb-14 flex justify-center gap-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex flex-col items-center gap-2">
            <div className="h-8 w-16 animate-pulse rounded bg-[var(--dq-muted-bg)]" />
            <div className="h-3 w-20 animate-pulse rounded bg-[var(--dq-muted-bg)]" />
          </div>
        ))}
      </div>

      {/* Verse card skeleton */}
      <div className="dq-card mb-16 p-8 sm:mb-20 sm:p-12">
        <div className="mx-auto max-w-3xl space-y-6">
          <div className="h-4 w-32 animate-pulse rounded bg-[var(--dq-muted-bg)]" />
          <div className="h-24 animate-pulse rounded-lg bg-[var(--dq-muted-bg)]" />
          <div className="h-16 animate-pulse rounded-lg bg-[var(--dq-muted-bg)]" />
        </div>
      </div>

      {/* Submission cards skeleton */}
      <div className="grid gap-6 sm:grid-cols-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="dq-card p-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-5 w-16 animate-pulse rounded bg-[var(--dq-muted-bg)]" />
                <div className="h-5 w-5 animate-pulse rounded-full bg-[var(--dq-muted-bg)]" />
                <div className="h-4 w-20 animate-pulse rounded bg-[var(--dq-muted-bg)]" />
              </div>
              <div className="h-5 w-10 animate-pulse rounded-full bg-[var(--dq-muted-bg)]" />
            </div>
            <div className="space-y-2">
              <div className="h-3 w-full animate-pulse rounded bg-[var(--dq-muted-bg)]" />
              <div className="h-3 w-[85%] animate-pulse rounded bg-[var(--dq-muted-bg)]" />
              <div className="h-3 w-[70%] animate-pulse rounded bg-[var(--dq-muted-bg)]" />
            </div>
            <div className="mt-5 h-10 w-24 animate-pulse rounded-full bg-[var(--dq-muted-bg)]" />
          </div>
        ))}
      </div>
    </main>
  );
}
