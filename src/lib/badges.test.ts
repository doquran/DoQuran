import { describe, expect, it } from "vitest";
import {
  normalizeBadgeSlugs,
  MAX_BADGES_PER_SUBMISSION,
  badgeDefBySlug,
  PERSPECTIVE_BADGES,
} from "./badges";

describe("normalizeBadgeSlugs", () => {
  it("filters unknown slugs", () => {
    expect(normalizeBadgeSlugs(["scientist", "unknown", "engineer"])).toEqual([
      "scientist",
      "engineer",
    ]);
  });

  it("deduplicates", () => {
    expect(normalizeBadgeSlugs(["scientist", "scientist"])).toEqual([
      "scientist",
    ]);
  });

  it("caps at MAX_BADGES_PER_SUBMISSION", () => {
    const all = PERSPECTIVE_BADGES.map((b) => b.slug);
    expect(normalizeBadgeSlugs(all).length).toBe(MAX_BADGES_PER_SUBMISSION);
  });

  it("returns empty for non-array input", () => {
    expect(normalizeBadgeSlugs(null)).toEqual([]);
    expect(normalizeBadgeSlugs("scientist")).toEqual([]);
    expect(normalizeBadgeSlugs(42)).toEqual([]);
  });

  it("normalizes case and trims", () => {
    expect(normalizeBadgeSlugs(["  Scientist  ", "ENGINEER"])).toEqual([
      "scientist",
      "engineer",
    ]);
  });
});

describe("badgeDefBySlug", () => {
  it("finds known badge", () => {
    const b = badgeDefBySlug("scientist");
    expect(b).toBeDefined();
    expect(b?.label).toBe("Scientist");
  });

  it("returns undefined for unknown slug", () => {
    expect(badgeDefBySlug("wizard")).toBeUndefined();
  });
});
