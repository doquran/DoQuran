import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSessionUserId } from "@/lib/auth";
import { rateLimitOrResponse } from "@/lib/rate-limit";

const schema = z.object({
  reason: z.string().trim().min(1).max(2000),
});

type Ctx = { params: Promise<{ id: string }> };

export async function POST(req: Request, ctx: Ctx) {
  const limited = rateLimitOrResponse(req, "submission_report", 20);
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
    return NextResponse.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const submission = await prisma.submission.findUnique({
    where: { id: submissionId },
    select: { id: true, userId: true },
  });
  if (!submission) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  if (submission.userId === userId) {
    return NextResponse.json(
      { error: "You cannot report your own post." },
      { status: 403 }
    );
  }

  await prisma.report.upsert({
    where: {
      submissionId_reporterId: { submissionId, reporterId: userId },
    },
    create: {
      submissionId,
      reporterId: userId,
      reason: parsed.data.reason,
    },
    update: { reason: parsed.data.reason },
  });

  return NextResponse.json({ ok: true });
}
