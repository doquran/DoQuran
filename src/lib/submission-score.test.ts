import { describe, expect, it } from "vitest";
import { scoreFromVotes } from "./submission-score";

describe("scoreFromVotes", () => {
  it("sums positive votes", () => {
    expect(scoreFromVotes([{ value: 1 }, { value: 1 }, { value: 1 }])).toBe(3);
  });

  it("handles mixed votes", () => {
    expect(
      scoreFromVotes([{ value: 1 }, { value: -1 }, { value: 1 }, { value: -1 }]),
    ).toBe(0);
  });

  it("returns 0 for empty array", () => {
    expect(scoreFromVotes([])).toBe(0);
  });

  it("handles all downvotes", () => {
    expect(scoreFromVotes([{ value: -1 }, { value: -1 }])).toBe(-2);
  });
});
