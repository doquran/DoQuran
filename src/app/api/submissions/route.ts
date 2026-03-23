import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSessionUserId } from "@/lib/auth";
import { parseVerseRefs } from "@/lib/verse-parse";
import { scoreFromVotes } from "@/lib/submission-score";
import { rateLimitOrResponse } from "@/lib/rate-limit";
import { badgeChipsFromSubmission, normalizeBadgeSlugs } from "@/lib/badges";
import { moderateContent } from "@/lib/moderation";

const createSchema = z.object({
  versesRaw: z.string().min(1).max(4000),
  reflection: z.string().min(1).max(65_000),
  badgeSlugs: z.array(z.string()).max(12).optional(),
});

function includeSubmission() {
  return {
    user: { select: { id: true, email: true, name: true } },
    verses: true,
    votes: { select: { value: true, userId: true } },
    submissionBadges: { include: { badge: true } },
  } as const;
}

export async function GET(req: Request) {
  const limited = rateLimitOrResponse(req, "submissions_get", 200);
  if (limited) return limited;

  const { searchParams } = new URL(req.url);
  const surah = searchParams.get("surah");
  const ayah = searchParams.get("ayah");
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const limit = Math.min(
    50,
    Math.max(1, Number(searchParams.get("limit")) || 20)
  );
  const skip = (page - 1) * limit;

  const where =
    surah && ayah
      ? {
          verses: {
            some: {
              surah: Number(surah),
              ayah: Number(ayah),
            },
          },
        }
      : {};

  const [list, total] = await Promise.all([
    prisma.submission.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      include: includeSubmission(),
    }),
    prisma.submission.count({ where }),
  ]);

  return NextResponse.json({
    submissions: list.map((s) => ({
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
      badges: badgeChipsFromSubmission(s.submissionBadges),
    })),
    page,
    limit,
    total,
    hasMore: skip + list.length < total,
  });
}

export async function POST(req: Request) {
  const limited = rateLimitOrResponse(req, "submissions_post", 15);
  if (limited) return limited;

  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  const currentUser = await prisma.user.findUnique({
    where: { id: userId },
    select: { emailVerified: true },
  });
  if (currentUser && !currentUser.emailVerified) {
    return NextResponse.json(
      { error: "Please verify your email before contributing." },
      { status: 403 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  let refs: { surah: number; ayah: number }[];
  try {
    refs = parseVerseRefs(parsed.data.versesRaw);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Invalid verses.";
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  // --- LLM content moderation ---
  const modResult = await moderateContent(parsed.data.reflection);
  if (!modResult.allowed) {
    return NextResponse.json(
      {
        error:
          "Your reflection was flagged for content that violates our guidelines (" +
          modResult.categories.join(", ") +
          "). Please revise and try again.",
      },
      { status: 422 },
    );
  }

  const badgeSlugs = normalizeBadgeSlugs(parsed.data.badgeSlugs);
  const badgeRows =
    badgeSlugs.length > 0
      ? await prisma.badge.findMany({
          where: { slug: { in: badgeSlugs } },
        })
      : [];

  const submission = await prisma.submission.create({
    data: {
      userId,
      reflection: parsed.data.reflection.trim(),
      verses: {
        create: refs.map((r) => ({ surah: r.surah, ayah: r.ayah })),
      },
      submissionBadges:
        badgeRows.length > 0
          ? {
              create: badgeRows.map((b) => ({ badgeId: b.id })),
            }
          : undefined,
    },
    include: includeSubmission(),
  });

  // --- streak tracking ---
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { lastActiveDate: true, currentStreak: true, longestStreak: true },
  });
  if (user) {
    const todayUTC = new Date(
      Date.UTC(
        new Date().getUTCFullYear(),
        new Date().getUTCMonth(),
        new Date().getUTCDate(),
      ),
    );
    let newStreak = 1;
    if (user.lastActiveDate) {
      const lastUTC = new Date(
        Date.UTC(
          user.lastActiveDate.getUTCFullYear(),
          user.lastActiveDate.getUTCMonth(),
          user.lastActiveDate.getUTCDate(),
        ),
      );
      const diffDays = Math.round(
        (todayUTC.getTime() - lastUTC.getTime()) / 86_400_000,
      );
      if (diffDays === 0) {
        newStreak = user.currentStreak;
      } else if (diffDays === 1) {
        newStreak = user.currentStreak + 1;
      }
    }
    await prisma.user.update({
      where: { id: userId },
      data: {
        currentStreak: newStreak,
        longestStreak: Math.max(newStreak, user.longestStreak),
        lastActiveDate: todayUTC,
      },
    });
  }

  return NextResponse.json({
    submission: {
      id: submission.id,
      reflection: submission.reflection,
      createdAt: submission.createdAt.toISOString(),
      verses: submission.verses.map((v) => ({ surah: v.surah, ayah: v.ayah })),
      author: {
        id: submission.user.id,
        displayName:
          submission.user.name?.trim() ||
          submission.user.email.split("@")[0],
      },
      score: 0,
      voteCount: 0,
      badges: badgeChipsFromSubmission(submission.submissionBadges),
    },
  });
}
