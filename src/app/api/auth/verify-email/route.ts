import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { consumeToken } from "@/lib/tokens";
import { rateLimitOrResponse } from "@/lib/rate-limit";

const schema = z.object({ token: z.string().min(1) });

export async function POST(req: Request) {
  const limited = rateLimitOrResponse(req, "verify_email", 20);
  if (limited) return limited;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid token." }, { status: 400 });
  }

  const userId = await consumeToken(parsed.data.token, "email_verify");
  if (!userId) {
    return NextResponse.json(
      { error: "Token is invalid or has expired. Please request a new one." },
      { status: 400 },
    );
  }

  await prisma.user.update({
    where: { id: userId },
    data: { emailVerified: true },
  });

  return NextResponse.json({ ok: true });
}
