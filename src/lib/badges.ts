/** Lenses contributors attach to a reflection — modern voices beside classical tafsīr. */

export type BadgeVariant =
  | "sapphire"
  | "copper"
  | "healer"
  | "aurum"
  | "sage"
  | "ink";

export type BadgeChip = {
  slug: string;
  label: string;
  tagline: string;
  variant: BadgeVariant;
};

export type PerspectiveBadgeDef = {
  slug: string;
  label: string;
  tagline: string;
  variant: BadgeVariant;
  sortOrder: number;
};

export const PERSPECTIVE_BADGES: readonly PerspectiveBadgeDef[] = [
  {
    slug: "scientist",
    label: "Scientist",
    tagline: "Empirical & analytical lens",
    variant: "sapphire",
    sortOrder: 10,
  },
  {
    slug: "engineer",
    label: "Engineer",
    tagline: "Systems, order & design",
    variant: "copper",
    sortOrder: 20,
  },
  {
    slug: "physician",
    label: "Physician",
    tagline: "Body, care & healing",
    variant: "healer",
    sortOrder: 30,
  },
  {
    slug: "educator",
    label: "Educator",
    tagline: "Teaching & clarity",
    variant: "aurum",
    sortOrder: 40,
  },
  {
    slug: "scholar",
    label: "Scholar",
    tagline: "Textual & classical depth",
    variant: "sage",
    sortOrder: 50,
  },
  {
    slug: "seeker",
    label: "Seeker",
    tagline: "Personal spiritual note",
    variant: "ink",
    sortOrder: 60,
  },
] as const;

const SLUG_SET = new Set(PERSPECTIVE_BADGES.map((b) => b.slug));

export const MAX_BADGES_PER_SUBMISSION = 3;

/** Dedupe, keep only known slugs, cap count. */
export function normalizeBadgeSlugs(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  const out: string[] = [];
  const seen = new Set<string>();
  for (const x of raw) {
    if (typeof x !== "string") continue;
    const s = x.trim().toLowerCase();
    if (!SLUG_SET.has(s) || seen.has(s)) continue;
    seen.add(s);
    out.push(s);
    if (out.length >= MAX_BADGES_PER_SUBMISSION) break;
  }
  return out;
}

export function badgeDefBySlug(slug: string): PerspectiveBadgeDef | undefined {
  return PERSPECTIVE_BADGES.find((b) => b.slug === slug);
}

export function badgeChipsFromSubmission(
  submissionBadges: {
    badge: {
      slug: string;
      label: string;
      tagline: string;
      variant: string;
      sortOrder: number;
    };
  }[]
): BadgeChip[] {
  return [...submissionBadges]
    .sort((a, b) => a.badge.sortOrder - b.badge.sortOrder)
    .map((x) => ({
      slug: x.badge.slug,
      label: x.badge.label,
      tagline: x.badge.tagline,
      variant: x.badge.variant as BadgeVariant,
    }));
}

/** Premium pill styles (light + dark). */
export function perspectiveBadgeClasses(variant: BadgeVariant): string {
  const base =
    "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[0.6875rem] font-semibold uppercase tracking-[0.12em] shadow-[var(--dq-shadow-sm)] ring-1 ring-[color-mix(in_srgb,var(--dq-gold)_12%,transparent)] sm:text-[0.7rem]";
  const map: Record<BadgeVariant, string> = {
    sapphire:
      "border-[color-mix(in_srgb,#0e7490_35%,var(--dq-border))] bg-[color-mix(in_srgb,#0e7490_12%,var(--dq-surface))] text-[color-mix(in_srgb,#0f766e_92%,var(--dq-ink))] dark:border-cyan-700/40 dark:bg-cyan-950/35 dark:text-cyan-100/95",
    copper:
      "border-[color-mix(in_srgb,var(--dq-accent)_45%,var(--dq-border))] bg-[color-mix(in_srgb,var(--dq-accent)_14%,var(--dq-surface))] text-[color-mix(in_srgb,var(--dq-accent)_95%,var(--dq-ink))] dark:border-amber-800/45 dark:bg-amber-950/30 dark:text-amber-100/90",
    healer:
      "border-[color-mix(in_srgb,#15803d_38%,var(--dq-border))] bg-[color-mix(in_srgb,#15803d_11%,var(--dq-surface))] text-[color-mix(in_srgb,#166534_95%,var(--dq-ink))] dark:border-emerald-700/40 dark:bg-emerald-950/35 dark:text-emerald-100/90",
    aurum:
      "border-[color-mix(in_srgb,var(--dq-gold)_55%,var(--dq-border))] bg-[color-mix(in_srgb,var(--dq-gold)_16%,var(--dq-surface))] text-[color-mix(in_srgb,var(--dq-gold-muted)_98%,var(--dq-ink))] dark:border-[color-mix(in_srgb,var(--dq-gold)_40%,var(--dq-border))] dark:bg-[color-mix(in_srgb,var(--dq-gold)_12%,var(--dq-surface-muted))] dark:text-[var(--dq-gold)]",
    sage:
      "border-[color-mix(in_srgb,var(--dq-primary)_40%,var(--dq-border))] bg-[color-mix(in_srgb,var(--dq-primary)_10%,var(--dq-surface))] text-[var(--dq-primary)] dark:border-[color-mix(in_srgb,var(--dq-primary)_35%,var(--dq-border))] dark:bg-[color-mix(in_srgb,var(--dq-primary)_14%,var(--dq-surface-muted))] dark:text-[var(--dq-primary)]",
    ink:
      "border-[color-mix(in_srgb,var(--dq-border)_90%,var(--dq-gold)_10%)] bg-[var(--dq-surface-muted)] text-[var(--dq-ink)] dark:border-[var(--dq-border)] dark:bg-[color-mix(in_srgb,var(--dq-surface-muted)_80%,var(--dq-surface))] dark:text-[var(--dq-ink)]",
  };
  return `${base} ${map[variant]}`;
}
