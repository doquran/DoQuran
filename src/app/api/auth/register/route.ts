import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { hashPassword, setSessionCookie, signSessionToken } from "@/lib/auth";
import { sendMail } from "@/lib/mail";
import { rateLimitOrResponse } from "@/lib/rate-limit";
import { createToken } from "@/lib/tokens";
import { baseUrl } from "@/lib/url";

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
  const sessionToken = await signSessionToken(user.id);
  await setSessionCookie(sessionToken);

  // Send verification email
  const verifyToken = await createToken(user.id, "email_verify");
  const link = `${baseUrl()}/verify-email?token=${verifyToken}`;
  await sendMail(
    email,
    "Verify your DoQuran email",
    `<p>Salaam! Welcome to DoQuran. Please verify your email by clicking the link below:</p>
     <p><a href="${link}">${link}</a></p>
     <p>This link expires in 24 hours.</p>
     <p>— DoQuran</p>`,
  );

  return NextResponse.json({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      emailVerified: false,
    },
  });
}
