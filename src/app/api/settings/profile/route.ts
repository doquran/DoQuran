import { NextResponse } from "next/server";
import { z } from "zod";
import { getSessionUserId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { rateLimitOrResponse } from "@/lib/rate-limit";
import { createId } from "@paralleldrive/cuid2";

const updateSchema = z.object({
  displayName: z.string().max(40).optional(),
  bio: z.string().max(160).optional(),
  regenerateAvatar: z.boolean().optional(),
});

export async function PATCH(req: Request) {
  const limited = rateLimitOrResponse(req, "settings_profile", 30);
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

  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const data: Record<string, unknown> = {};
  if (parsed.data.displayName !== undefined) {
    data.displayName = parsed.data.displayName.trim() || null;
  }
  if (parsed.data.bio !== undefined) {
    data.bio = parsed.data.bio.trim() || null;
  }
  if (parsed.data.regenerateAvatar) {
    data.avatarSeed = createId();
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data,
    select: {
      displayName: true,
      bio: true,
      avatarSeed: true,
    },
  });

  return NextResponse.json({ user });
}
