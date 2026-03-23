import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSessionUserId } from "@/lib/auth";
import { sealTier } from "@/lib/levels";
import { scoreFromVotes } from "@/lib/submission-score";
import { rateLimitOrResponse } from "@/lib/rate-limit";

const schema = z.object({
  value: z.union([z.literal(1), z.literal(-1)]),
});

type Ctx = { params: Promise<{ id: string }> };

export async function POST(req: Request, ctx: Ctx) {
  const limited = rateLimitOrResponse(req, "vote", 120);
  if (limited) return limited;

  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  const { id: submissionId } = await ctx.params;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "value must be 1 or -1" }, { status: 400 });
  }
  const { value } = parsed.data;

  const submission = await prisma.submission.findUnique({
    where: { id: submissionId },
    select: {
      id: true,
      userId: true,
      submissionBadges: { select: { badge: { select: { slug: true } } } },
    },
  });
  if (!submission) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  if (submission.userId === userId) {
    return NextResponse.json(
      { error: "You cannot vote on your own post." },
      { status: 403 }
    );
  }

  const existing = await prisma.vote.findUnique({
    where: {
      userId_submissionId: { userId, submissionId },
    },
  });

  if (existing && existing.value === value) {
    await prisma.vote.delete({
      where: { id: existing.id },
    });
  } else if (existing) {
    await prisma.vote.update({
      where: { id: existing.id },
      data: { value },
    });
  } else {
    await prisma.vote.create({
      data: { userId, submissionId, value },
    });
  }

  const votes = await prisma.vote.findMany({
    where: { submissionId },
    select: { value: true, userId: true },
  });

  const myVote = votes.find((v) => v.userId === userId)?.value ?? null;

  // --- recalculate SealProgress for the submission's author ---
  const sealSlugs = submission.submissionBadges.map((sb) => sb.badge.slug);
  const levelChanges: { sealSlug: string; oldLevel: number; newLevel: number }[] = [];

  for (const slug of sealSlugs) {
    const authorPostsWithSeal = await prisma.submission.findMany({
      where: {
        userId: submission.userId,
        submissionBadges: { some: { badge: { slug } } },
      },
      select: { votes: { select: { value: true } } },
    });
    const totalScore = authorPostsWithSeal.reduce(
      (sum, s) => sum + s.votes.reduce((vs, v) => vs + v.value, 0),
      0,
    );
    const newLevel = sealTier(totalScore);

    const existing = await prisma.sealProgress.findUnique({
      where: { userId_sealSlug: { userId: submission.userId, sealSlug: slug } },
    });
    const oldLevel = existing?.level ?? 0;

    await prisma.sealProgress.upsert({
      where: { userId_sealSlug: { userId: submission.userId, sealSlug: slug } },
      create: { userId: submission.userId, sealSlug: slug, score: totalScore, level: newLevel },
      update: { score: totalScore, level: newLevel },
    });

    if (newLevel > oldLevel) {
      levelChanges.push({ sealSlug: slug, oldLevel, newLevel });
    }
  }

  return NextResponse.json({
    score: scoreFromVotes(votes),
    voteCount: votes.length,
    myVote,
    levelChanges: levelChanges.length > 0 ? levelChanges : undefined,
    authorId: submission.userId,
  });
}
