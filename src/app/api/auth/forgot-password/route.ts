import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { sendMail } from "@/lib/mail";
import { rateLimitOrResponse } from "@/lib/rate-limit";
import { createToken, invalidateTokens } from "@/lib/tokens";
import { baseUrl } from "@/lib/url";

const schema = z.object({ email: z.string().email().max(320) });

export async function POST(req: Request) {
  const limited = rateLimitOrResponse(req, "forgot_password", 5);
  if (limited) return limited;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid email." }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { email: parsed.data.email },
    select: { id: true, email: true },
  });

  // Always return success to prevent email enumeration
  if (!user) {
    return NextResponse.json({ ok: true });
  }

  await invalidateTokens(user.id, "password_reset");
  const raw = await createToken(user.id, "password_reset");
  const link = `${baseUrl()}/reset-password?token=${raw}`;

  await sendMail(
    user.email,
    "Reset your DoQuran password",
    `<p>Salaam! Someone requested a password reset for your DoQuran account.</p>
     <p><a href="${link}">Click here to set a new password</a></p>
     <p>This link expires in 1 hour. If you did not request this, you can safely ignore this email.</p>
     <p>— DoQuran</p>`,
  );

  return NextResponse.json({ ok: true });
}
