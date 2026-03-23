import type { Vote } from "@prisma/client";

export function scoreFromVotes(votes: Pick<Vote, "value">[]) {
  return votes.reduce((s, v) => s + v.value, 0);
}
