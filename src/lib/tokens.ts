import crypto from "crypto";
import { prisma } from "@/lib/prisma";

export type TokenType = "email_verify" | "password_reset";

const TOKEN_EXPIRY: Record<TokenType, number> = {
  email_verify: 24 * 60 * 60 * 1000, // 24 hours
  password_reset: 60 * 60 * 1000, // 1 hour
};

/** Create a token, store its SHA-256 hash, and return the raw token for the email link. */
export async function createToken(userId: string, type: TokenType) {
  const raw = crypto.randomBytes(32).toString("base64url");
  const hash = crypto.createHash("sha256").update(raw).digest("hex");

  await prisma.token.create({
    data: {
      userId,
      hash,
      type,
      expiresAt: new Date(Date.now() + TOKEN_EXPIRY[type]),
    },
  });

  return raw;
}

/** Verify a raw token. Returns the userId if valid, null otherwise. Marks as used. */
export async function consumeToken(raw: string, type: TokenType) {
  const hash = crypto.createHash("sha256").update(raw).digest("hex");

  const token = await prisma.token.findFirst({
    where: {
      hash,
      type,
      usedAt: null,
      expiresAt: { gt: new Date() },
    },
  });

  if (!token) return null;

  await prisma.token.update({
    where: { id: token.id },
    data: { usedAt: new Date() },
  });

  return token.userId;
}

/** Invalidate all unused tokens of a type for a user (e.g. after password change). */
export async function invalidateTokens(userId: string, type: TokenType) {
  await prisma.token.updateMany({
    where: { userId, type, usedAt: null },
    data: { usedAt: new Date() },
  });
}
