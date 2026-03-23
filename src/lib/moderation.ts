import OpenAI from "openai";

export type ModerationResult = {
  allowed: boolean;
  flagged: boolean;
  categories: string[];
  /** When flagged but not auto-rejected, the content is published but queued for review. */
  needsReview: boolean;
};

const HIGH_SEVERITY_CATEGORIES = [
  "sexual",
  "hate",
  "violence",
  "self-harm",
  "sexual/minors",
  "hate/threatening",
  "violence/graphic",
  "self-harm/intent",
  "self-harm/instructions",
];

const REVIEW_THRESHOLD = 0.4;
const REJECT_THRESHOLD = 0.8;

function getClient(): OpenAI | null {
  const key = process.env.OPENAI_API_KEY;
  if (!key) return null;
  return new OpenAI({ apiKey: key });
}

/**
 * Check content against OpenAI's moderation endpoint.
 * Free to use (no token cost). Returns in ~200ms.
 *
 * When OPENAI_API_KEY is not set, all content is allowed (local dev).
 */
export async function moderateContent(text: string): Promise<ModerationResult> {
  const client = getClient();
  if (!client) {
    return { allowed: true, flagged: false, categories: [], needsReview: false };
  }

  try {
    const response = await client.moderations.create({ input: text });
    const result = response.results[0];

    if (!result.flagged) {
      return { allowed: true, flagged: false, categories: [], needsReview: false };
    }

    const flaggedCategories: string[] = [];
    let maxScore = 0;

    for (const [category, flagged] of Object.entries(result.categories)) {
      if (flagged) {
        flaggedCategories.push(category);
        const score =
          result.category_scores[
            category as keyof typeof result.category_scores
          ];
        if (typeof score === "number" && score > maxScore) maxScore = score;
      }
    }

    const isHighSeverity = flaggedCategories.some((c) =>
      HIGH_SEVERITY_CATEGORIES.includes(c),
    );

    if (isHighSeverity && maxScore >= REJECT_THRESHOLD) {
      return {
        allowed: false,
        flagged: true,
        categories: flaggedCategories,
        needsReview: false,
      };
    }

    return {
      allowed: true,
      flagged: true,
      categories: flaggedCategories,
      needsReview: maxScore >= REVIEW_THRESHOLD,
    };
  } catch (error) {
    console.error("[moderation] OpenAI API error:", error);
    return { allowed: true, flagged: false, categories: [], needsReview: false };
  }
}
