import Link from "next/link";

const pillars = [
  {
    title: "Scientist",
    blurb: "Hypotheses, wonder, and careful observation beside the text.",
    icon: (
      <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" aria-hidden>
        <circle
          cx="12"
          cy="12"
          r="3"
          className="stroke-[var(--dq-primary)]"
          strokeWidth="1.5"
        />
        <path
          className="stroke-[color-mix(in_srgb,var(--dq-gold)_70%,var(--dq-primary))]"
          strokeWidth="1.5"
          strokeLinecap="round"
          d="M12 5v2M12 17v2M5 12h2M17 12h2M6.34 6.34l1.42 1.42M16.24 16.24l1.42 1.42M6.34 17.66l1.42-1.42M16.24 7.76l1.42-1.42"
        />
      </svg>
    ),
    accent:
      "from-[color-mix(in_srgb,#0e7490_18%,transparent)] to-[color-mix(in_srgb,var(--dq-surface)_95%,var(--dq-surface-muted))]",
  },
  {
    title: "Engineer",
    blurb: "Structure, coherence, and systems thinking applied to meaning.",
    icon: (
      <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          className="stroke-[var(--dq-accent)]"
          strokeWidth="1.5"
          strokeLinejoin="round"
          d="M4 19h16M6 19V9l6-4 6 4v10"
        />
        <path
          className="stroke-[color-mix(in_srgb,var(--dq-gold)_65%,var(--dq-accent))]"
          strokeWidth="1.5"
          d="M9 14h6M9 17h4"
        />
      </svg>
    ),
    accent:
      "from-[color-mix(in_srgb,var(--dq-accent)_16%,transparent)] to-[color-mix(in_srgb,var(--dq-surface)_95%,var(--dq-surface-muted))]",
  },
  {
    title: "Physician",
    blurb: "Compassion, the body, and healing language where it meets revelation.",
    icon: (
      <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          className="stroke-[#15803d]"
          strokeWidth="1.5"
          strokeLinecap="round"
          d="M12 21a8 8 0 01-8-8c0-4 4-7 8-7s8 3 8 7a8 8 0 01-8 8z"
        />
        <path
          className="stroke-[color-mix(in_srgb,#15803d_80%,var(--dq-gold))]"
          strokeWidth="1.5"
          strokeLinecap="round"
          d="M12 11v6M9 14h6"
        />
      </svg>
    ),
    accent:
      "from-[color-mix(in_srgb,#15803d_14%,transparent)] to-[color-mix(in_srgb,var(--dq-surface)_95%,var(--dq-surface-muted))]",
  },
  {
    title: "Educator",
    blurb: "Clarity for classrooms, podcasts, and dinner-table conversations.",
    icon: (
      <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          className="stroke-[var(--dq-gold-muted)]"
          strokeWidth="1.5"
          strokeLinejoin="round"
          d="M4 6h16v11H4zM8 17v3M16 17v3"
        />
        <path
          className="stroke-[var(--dq-primary)]"
          strokeWidth="1.5"
          d="M8 9h8M8 12h5"
        />
      </svg>
    ),
    accent:
      "from-[color-mix(in_srgb,var(--dq-gold)_22%,transparent)] to-[color-mix(in_srgb,var(--dq-surface)_95%,var(--dq-surface-muted))]",
  },
  {
    title: "Scholar",
    blurb: "Textual depth, adab, and classical tools—without gatekeeping tone.",
    icon: (
      <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          className="stroke-[var(--dq-primary)]"
          strokeWidth="1.5"
          strokeLinejoin="round"
          d="M6 4h9l3 3v13a1 1 0 01-1 1H6a1 1 0 01-1-1V5a1 1 0 011-1z"
        />
        <path
          className="stroke-[color-mix(in_srgb,var(--dq-gold)_55%,var(--dq-primary))]"
          strokeWidth="1.5"
          d="M8 8h8M8 11h6"
        />
      </svg>
    ),
    accent:
      "from-[color-mix(in_srgb,var(--dq-primary)_12%,transparent)] to-[color-mix(in_srgb,var(--dq-surface)_95%,var(--dq-surface-muted))]",
  },
  {
    title: "Seeker",
    blurb: "Honest first-person notes—spiritual R&D in public.",
    icon: (
      <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          className="stroke-[var(--dq-muted)]"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 3a7 7 0 00-7 7c0 5 7 11 7 11s7-6 7-11a7 7 0 00-7-7z"
        />
        <circle
          cx="12"
          cy="10"
          r="2"
          className="stroke-[var(--dq-gold)]"
          strokeWidth="1.5"
        />
      </svg>
    ),
    accent:
      "from-[color-mix(in_srgb,var(--dq-muted)_12%,transparent)] to-[color-mix(in_srgb,var(--dq-surface)_95%,var(--dq-surface-muted))]",
  },
];

export function TalentPillars() {
  return (
    <section className="relative mb-16 sm:mb-24">
      <div
        className="pointer-events-none absolute -inset-x-4 -top-6 bottom-0 -z-10 rounded-[var(--dq-radius-lg)] bg-[color-mix(in_srgb,var(--dq-primary)_4%,transparent)] opacity-80 dark:bg-[color-mix(in_srgb,var(--dq-primary)_8%,transparent)] sm:-inset-x-8"
        aria-hidden
      />
      <p className="font-outfit mb-2 text-center text-[0.7rem] font-bold uppercase tracking-[0.28em] text-[var(--dq-gold-muted)]">
        Built for modern minds
      </p>
      <h2 className="font-display mx-auto mb-3 max-w-3xl text-center text-2xl font-semibold tracking-wide text-[var(--dq-ink)] sm:text-3xl">
        Your degree is a lens—not a wall
      </h2>
      <p className="font-outfit mx-auto mb-10 max-w-2xl text-center text-sm leading-relaxed text-[var(--dq-muted)] sm:text-base">
        Classical tafsīr stays sacred. Here we add{" "}
        <span className="font-semibold text-[var(--dq-ink)]">
          contemporary, discipline-aware readings
        </span>{" "}
        so engineers, clinicians, researchers, and teachers can contribute with
        pride—and be recognized when the community votes.
      </p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {pillars.map((p) => (
          <article
            key={p.title}
            className={`group relative overflow-hidden rounded-[var(--dq-radius-lg)] border border-[color-mix(in_srgb,var(--dq-border)_82%,var(--dq-gold)_18%)] bg-gradient-to-br ${p.accent} p-5 shadow-[var(--dq-shadow-md)] ring-1 ring-[color-mix(in_srgb,var(--dq-gold)_10%,transparent)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[var(--dq-shadow-lg)]`}
          >
            <div className="mb-3 flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-[color-mix(in_srgb,var(--dq-border)_75%,var(--dq-gold)_25%)] bg-[var(--dq-surface)] shadow-[var(--dq-shadow-sm)]">
                {p.icon}
              </span>
              <h3 className="font-display text-lg font-semibold text-[var(--dq-ink)]">
                {p.title}
              </h3>
            </div>
            <p className="font-outfit text-sm leading-relaxed text-[var(--dq-muted)]">
              {p.blurb}
            </p>
          </article>
        ))}
      </div>
      <p className="font-outfit mt-8 text-center text-sm text-[var(--dq-muted)]">
        Tag your post with up to three{" "}
        <strong className="text-[var(--dq-ink)]">perspective seals</strong> when
        you{" "}
        <Link
          href="/contribute"
          className="font-semibold text-[var(--dq-primary)] underline decoration-[var(--dq-gold)] underline-offset-2 transition hover:decoration-[var(--dq-primary)]"
        >
          contribute
        </Link>
        .
      </p>
    </section>
  );
}
