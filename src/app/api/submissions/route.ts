import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSessionUserId } from "@/lib/auth";
import { parseVerseRefs } from "@/lib/verse-parse";
import { scoreFromVotes } from "@/lib/submission-score";
import { rateLimitOrResponse } from "@/lib/rate-limit";

const createSchema = z.object({
  versesRaw: z.string().min(1).max(4000),
  reflection: z.string().min(1).max(65_000),
});

function includeSubmission() {
  return {
    user: { select: { id: true, email: true, name: true } },
    verses: true,
    votes: { select: { value: true, userId: true } },
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

  const submission = await prisma.submission.create({
    data: {
      userId,
      reflection: parsed.data.reflection.trim(),
      verses: {
        create: refs.map((r) => ({ surah: r.surah, ayah: r.ayah })),
      },
    },
    include: includeSubmission(),
  });

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
    },
  });
}
