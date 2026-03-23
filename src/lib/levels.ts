/** Progression tiers for seal-level and overall contributor ranking. */

// -- Seal tiers (per-seal accumulated upvotes) --

export const SEAL_THRESHOLDS = [0, 5, 20, 50] as const;
export const SEAL_TIER_LABELS = [
  "Unranked",
  "Rising",
  "Established",
  "Distinguished",
] as const;

export type SealTier = 0 | 1 | 2 | 3;

export function sealTier(score: number): SealTier {
  if (score >= 50) return 3;
  if (score >= 20) return 2;
  if (score >= 5) return 1;
  return 0;
}

export function sealTierLabel(tier: SealTier): string {
  return SEAL_TIER_LABELS[tier];
}

/** Qualified label like "Rising Scientist". */
export function sealTierQualified(tier: SealTier, sealLabel: string): string {
  if (tier === 0) return sealLabel;
  return `${SEAL_TIER_LABELS[tier]} ${sealLabel}`;
}

// -- Overall tiers (total upvotes across all posts) --

export const OVERALL_THRESHOLDS = [0, 10, 30, 75, 150] as const;
export const OVERALL_TIER_LABELS = [
  "Newcomer",
  "Contributor",
  "Voice",
  "Luminary",
  "Pillar",
] as const;

export type OverallTier = 0 | 1 | 2 | 3 | 4;

export function overallTier(totalScore: number): OverallTier {
  if (totalScore >= 150) return 4;
  if (totalScore >= 75) return 3;
  if (totalScore >= 30) return 2;
  if (totalScore >= 10) return 1;
  return 0;
}

export function overallTierLabel(tier: OverallTier): string {
  return OVERALL_TIER_LABELS[tier];
}

// -- Progress helpers --

/** Returns 0–1 fraction toward the next tier threshold. */
export function sealTierProgress(score: number): number {
  const tier = sealTier(score);
  if (tier === 3) return 1;
  const floor = SEAL_THRESHOLDS[tier];
  const ceil = SEAL_THRESHOLDS[tier + 1];
  return Math.min(1, (score - floor) / (ceil - floor));
}

export function overallTierProgress(totalScore: number): number {
  const tier = overallTier(totalScore);
  if (tier === 4) return 1;
  const floor = OVERALL_THRESHOLDS[tier];
  const ceil = OVERALL_THRESHOLDS[tier + 1];
  return Math.min(1, (totalScore - floor) / (ceil - floor));
}

/** Points needed to reach the next tier, or 0 if max. */
export function sealPointsToNext(score: number): number {
  const tier = sealTier(score);
  if (tier === 3) return 0;
  return SEAL_THRESHOLDS[tier + 1] - score;
}

export function overallPointsToNext(totalScore: number): number {
  const tier = overallTier(totalScore);
  if (tier === 4) return 0;
  return OVERALL_THRESHOLDS[tier + 1] - totalScore;
}
