import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUserId } from "@/lib/auth";
import { scoreFromVotes } from "@/lib/submission-score";
import { badgeChipsFromSubmission } from "@/lib/badges";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  const userId = await getSessionUserId();

  const s = await prisma.submission.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, email: true, name: true } },
      verses: true,
      votes: { select: { value: true, userId: true } },
      submissionBadges: { include: { badge: true } },
    },
  });

  if (!s) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const myVote = userId
    ? s.votes.find((v) => v.userId === userId)?.value ?? null
    : null;

  return NextResponse.json({
    submission: {
      id: s.id,
      reflection: s.reflection,
      createdAt: s.createdAt.toISOString(),
      verses: s.verses.map((v) => ({ surah: v.surah, ayah: v.ayah })),
      author: {
        id: s.user.id,
        displayName: s.user.name?.trim() || s.user.email.split("@")[0],
      },
      score: scoreFromVotes(s.votes),
      voteCount: s.votes.length,
      myVote,
      badges: badgeChipsFromSubmission(s.submissionBadges),
    },
  });
}
