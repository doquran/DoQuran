import { describe, expect, it } from "vitest";
import {
  sealTier,
  sealTierLabel,
  sealTierProgress,
  sealPointsToNext,
  sealTierQualified,
  overallTier,
  overallTierLabel,
  overallTierProgress,
  overallPointsToNext,
} from "./levels";

describe("sealTier", () => {
  it("returns 0 for scores below 5", () => {
    expect(sealTier(0)).toBe(0);
    expect(sealTier(4)).toBe(0);
  });

  it("returns 1 (Rising) for 5-19", () => {
    expect(sealTier(5)).toBe(1);
    expect(sealTier(19)).toBe(1);
  });

  it("returns 2 (Established) for 20-49", () => {
    expect(sealTier(20)).toBe(2);
    expect(sealTier(49)).toBe(2);
  });

  it("returns 3 (Distinguished) for 50+", () => {
    expect(sealTier(50)).toBe(3);
    expect(sealTier(999)).toBe(3);
  });
});

describe("sealTierLabel", () => {
  it("maps tiers to correct labels", () => {
    expect(sealTierLabel(0)).toBe("Unranked");
    expect(sealTierLabel(1)).toBe("Rising");
    expect(sealTierLabel(2)).toBe("Established");
    expect(sealTierLabel(3)).toBe("Distinguished");
  });
});

describe("sealTierQualified", () => {
  it("returns just the seal name for unranked", () => {
    expect(sealTierQualified(0, "Scientist")).toBe("Scientist");
  });

  it("prefixes tier name for ranked seals", () => {
    expect(sealTierQualified(1, "Scientist")).toBe("Rising Scientist");
    expect(sealTierQualified(3, "Engineer")).toBe("Distinguished Engineer");
  });
});

describe("sealTierProgress", () => {
  it("returns 0 at the start of a tier", () => {
    expect(sealTierProgress(0)).toBe(0);
    expect(sealTierProgress(5)).toBe(0);
  });

  it("returns 1 at max tier", () => {
    expect(sealTierProgress(50)).toBe(1);
    expect(sealTierProgress(100)).toBe(1);
  });

  it("returns fraction mid-tier", () => {
    // tier 0: 0-4, next at 5 → score 2 = 2/5 = 0.4
    expect(sealTierProgress(2)).toBeCloseTo(0.4);
    // tier 1: 5-19, next at 20 → score 10 = (10-5)/(20-5) = 5/15 ≈ 0.333
    expect(sealTierProgress(10)).toBeCloseTo(1 / 3);
  });
});

describe("sealPointsToNext", () => {
  it("returns correct gap", () => {
    expect(sealPointsToNext(0)).toBe(5);
    expect(sealPointsToNext(3)).toBe(2);
    expect(sealPointsToNext(18)).toBe(2);
  });

  it("returns 0 at max", () => {
    expect(sealPointsToNext(50)).toBe(0);
    expect(sealPointsToNext(200)).toBe(0);
  });
});

describe("overallTier", () => {
  it("maps scores to correct tiers", () => {
    expect(overallTier(0)).toBe(0);
    expect(overallTier(9)).toBe(0);
    expect(overallTier(10)).toBe(1);
    expect(overallTier(29)).toBe(1);
    expect(overallTier(30)).toBe(2);
    expect(overallTier(74)).toBe(2);
    expect(overallTier(75)).toBe(3);
    expect(overallTier(149)).toBe(3);
    expect(overallTier(150)).toBe(4);
    expect(overallTier(1000)).toBe(4);
  });
});

describe("overallTierLabel", () => {
  it("maps tiers to labels", () => {
    expect(overallTierLabel(0)).toBe("Newcomer");
    expect(overallTierLabel(4)).toBe("Pillar");
  });
});

describe("overallTierProgress", () => {
  it("returns 1 at max tier", () => {
    expect(overallTierProgress(150)).toBe(1);
  });

  it("returns 0 at tier boundary", () => {
    expect(overallTierProgress(0)).toBe(0);
    expect(overallTierProgress(10)).toBe(0);
  });
});

describe("overallPointsToNext", () => {
  it("returns 0 at max", () => {
    expect(overallPointsToNext(150)).toBe(0);
  });

  it("returns correct gap", () => {
    expect(overallPointsToNext(0)).toBe(10);
    expect(overallPointsToNext(25)).toBe(5);
  });
});
