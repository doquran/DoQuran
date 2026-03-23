import { getSessionUserId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/** Returns the user ID if the current session belongs to an admin, null otherwise. */
export async function requireAdmin(): Promise<string | null> {
  const userId = await getSessionUserId();
  if (!userId) return null;
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { isAdmin: true },
  });
  return user?.isAdmin ? userId : null;
}
