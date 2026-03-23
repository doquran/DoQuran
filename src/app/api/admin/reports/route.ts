import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const adminId = await requireAdmin();
  if (!adminId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const reports = await prisma.report.findMany({
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
    include: {
      reporter: { select: { id: true, email: true, name: true } },
      submission: {
        select: {
          id: true,
          reflection: true,
          userId: true,
          user: { select: { email: true, name: true } },
        },
      },
    },
  });

  return NextResponse.json({ reports });
}
