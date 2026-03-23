import { NextResponse } from "next/server";
import { z } from "zod";
import { getSessionUserId, hashPassword, verifyPassword } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { rateLimitOrResponse } from "@/lib/rate-limit";

const schema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8).max(128),
});

export async function POST(req: Request) {
  const limited = rateLimitOrResponse(req, "change_password", 10);
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

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { passwordHash: true },
  });
  if (!user) {
    return NextResponse.json({ error: "User not found." }, { status: 404 });
  }

  const valid = await verifyPassword(
    parsed.data.currentPassword,
    user.passwordHash,
  );
  if (!valid) {
    return NextResponse.json(
      { error: "Current password is incorrect." },
      { status: 403 },
    );
  }

  const newHash = await hashPassword(parsed.data.newPassword);
  await prisma.user.update({
    where: { id: userId },
    data: { passwordHash: newHash },
  });

  return NextResponse.json({ ok: true });
}
