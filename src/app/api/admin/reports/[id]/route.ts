import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  action: z.enum(["dismiss", "remove_submission"]),
  adminNote: z.string().max(500).optional(),
});

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, ctx: Ctx) {
  const adminId = await requireAdmin();
  if (!adminId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await ctx.params;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input." }, { status: 400 });
  }

  const report = await prisma.report.findUnique({
    where: { id },
    select: { id: true, submissionId: true, status: true },
  });
  if (!report) {
    return NextResponse.json({ error: "Report not found." }, { status: 404 });
  }

  const now = new Date();

  if (parsed.data.action === "dismiss") {
    await prisma.report.update({
      where: { id },
      data: {
        status: "dismissed",
        adminNote: parsed.data.adminNote || null,
        resolvedAt: now,
      },
    });
  } else if (parsed.data.action === "remove_submission") {
    // Delete the submission (cascades to votes, badges, reports, verses)
    await prisma.submission.delete({
      where: { id: report.submissionId },
    });
    // Mark all reports for this submission as actioned
    await prisma.report.updateMany({
      where: { submissionId: report.submissionId },
      data: {
        status: "actioned",
        adminNote: parsed.data.adminNote || "Submission removed by admin.",
        resolvedAt: now,
      },
    }).catch(() => {
      // Reports may have been cascade-deleted with the submission
    });
  }

  return NextResponse.json({ ok: true });
}
