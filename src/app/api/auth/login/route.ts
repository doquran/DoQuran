import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import {
  setSessionCookie,
  signSessionToken,
  verifyPassword,
} from "@/lib/auth";
import { rateLimitOrResponse } from "@/lib/rate-limit";

const schema = z.object({
  email: z.string().email().max(320),
  password: z.string().min(1).max(128),
});

export async function POST(req: Request) {
  const limited = rateLimitOrResponse(req, "auth_login", 30);
  if (limited) return limited;

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
  const { email, password } = parsed.data;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    return NextResponse.json(
      { error: "Invalid email or password." },
      { status: 401 }
    );
  }
  const token = await signSessionToken(user.id);
  await setSessionCookie(token);
  return NextResponse.json({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
    },
  });
}
