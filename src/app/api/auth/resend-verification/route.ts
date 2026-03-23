import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUserId } from "@/lib/auth";
import { createToken, invalidateTokens } from "@/lib/tokens";
import { sendMail } from "@/lib/mail";
import { baseUrl } from "@/lib/url";
import { rateLimitOrResponse } from "@/lib/rate-limit";

export async function POST(req: Request) {
  const limited = rateLimitOrResponse(req, "resend_verify", 5);
  if (limited) return limited;

  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true, emailVerified: true },
  });
  if (!user) {
    return NextResponse.json({ error: "User not found." }, { status: 404 });
  }
  if (user.emailVerified) {
    return NextResponse.json({ error: "Email already verified." }, { status: 400 });
  }

  await invalidateTokens(userId, "email_verify");
  const raw = await createToken(userId, "email_verify");
  const link = `${baseUrl()}/verify-email?token=${raw}`;

  await sendMail(
    user.email,
    "Verify your DoQuran email",
    `<p>Salaam! Please verify your email by clicking the link below:</p>
     <p><a href="${link}">${link}</a></p>
     <p>This link expires in 24 hours.</p>
     <p>— DoQuran</p>`,
  );

  return NextResponse.json({ ok: true });
}
