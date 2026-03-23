type Props = {
  users: number;
  submissions: number;
  votes: number;
};

export function StatsStrip({ users, submissions, votes }: Props) {
  if (users === 0 && submissions === 0 && votes === 0) return null;

  const items = [
    { label: "Voices signed up", value: users },
    { label: "Reflections shared", value: submissions },
    { label: "Recognition votes", value: votes },
  ].filter((x) => x.value > 0);

  if (items.length === 0) return null;

  return (
    <div className="font-outfit mb-14 flex flex-wrap items-stretch justify-center gap-3 sm:mb-16 sm:gap-4">
      {items.map((item) => (
        <div
          key={item.label}
          className="min-w-[8.5rem] flex-1 rounded-[var(--dq-radius-lg)] border border-[color-mix(in_srgb,var(--dq-gold)_28%,var(--dq-border))] bg-[color-mix(in_srgb,var(--dq-surface)_88%,var(--dq-surface-muted))] px-5 py-4 text-center shadow-[var(--dq-shadow-sm)] ring-1 ring-[color-mix(in_srgb,var(--dq-gold)_8%,transparent)] sm:min-w-[10rem] sm:px-6 sm:py-5"
        >
          <p className="font-display text-2xl font-semibold tabular-nums text-[var(--dq-primary)] sm:text-3xl">
            {item.value.toLocaleString()}
          </p>
          <p className="mt-1 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-[var(--dq-muted)]">
            {item.label}
          </p>
        </div>
      ))}
    </div>
  );
}
