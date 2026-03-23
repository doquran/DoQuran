import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import {
  clearSessionCookie,
  getSessionUserId,
  verifyPassword,
} from "@/lib/auth";
import { rateLimitOrResponse } from "@/lib/rate-limit";

const schema = z.object({
  password: z.string().min(1).max(128),
});

export async function DELETE(req: Request) {
  const limited = rateLimitOrResponse(req, "account_delete", 5);
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
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const ok = await verifyPassword(parsed.data.password, user.passwordHash);
  if (!ok) {
    return NextResponse.json({ error: "Incorrect password." }, { status: 403 });
  }

  await prisma.user.delete({ where: { id: userId } });
  await clearSessionCookie();
  return NextResponse.json({ ok: true });
}
