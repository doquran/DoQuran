import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import { rateLimitOrResponse } from "@/lib/rate-limit";
import { consumeToken, invalidateTokens } from "@/lib/tokens";

const schema = z.object({
  token: z.string().min(1),
  password: z.string().min(8).max(128),
});

export async function POST(req: Request) {
  const limited = rateLimitOrResponse(req, "reset_password", 10);
  if (limited) return limited;

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

  const userId = await consumeToken(parsed.data.token, "password_reset");
  if (!userId) {
    return NextResponse.json(
      { error: "Token is invalid or has expired. Please request a new link." },
      { status: 400 },
    );
  }

  const passwordHash = await hashPassword(parsed.data.password);
  await prisma.user.update({
    where: { id: userId },
    data: { passwordHash },
  });

  // Invalidate any remaining reset tokens for this user
  await invalidateTokens(userId, "password_reset");

  return NextResponse.json({ ok: true });
}
