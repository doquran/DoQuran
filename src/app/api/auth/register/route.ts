import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { hashPassword, setSessionCookie, signSessionToken } from "@/lib/auth";
import { rateLimitOrResponse } from "@/lib/rate-limit";

const schema = z.object({
  email: z.string().email().max(320),
  password: z.string().min(8).max(128),
  name: z.string().trim().max(80).optional(),
});

export async function POST(req: Request) {
  const limited = rateLimitOrResponse(req, "auth_register", 10);
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
      { status: 400 }
    );
  }
  const { email, password, name } = parsed.data;
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json(
      { error: "An account with this email already exists." },
      { status: 409 }
    );
  }
  const passwordHash = await hashPassword(password);
  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      name: name || null,
    },
  });
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
