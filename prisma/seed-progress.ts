/**
 * Backfill SealProgress rows and streak data for all existing users.
 * Run with: npx tsx prisma/seed-progress.ts
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function sealTier(score: number): number {
  if (score >= 50) return 3;
  if (score >= 20) return 2;
  if (score >= 5) return 1;
  return 0;
}

async function main() {
  const users = await prisma.user.findMany({
    select: { id: true },
  });

  console.log(`Backfilling ${users.length} user(s)…`);

  for (const { id: userId } of users) {
    const submissions = await prisma.submission.findMany({
      where: { userId },
      select: {
        createdAt: true,
        votes: { select: { value: true } },
        submissionBadges: { select: { badge: { select: { slug: true } } } },
      },
      orderBy: { createdAt: "asc" },
    });

    // --- seal progress ---
    const sealScores = new Map<string, number>();
    for (const sub of submissions) {
      const subScore = sub.votes.reduce((s, v) => s + v.value, 0);
      for (const sb of sub.submissionBadges) {
        sealScores.set(
          sb.badge.slug,
          (sealScores.get(sb.badge.slug) ?? 0) + subScore,
        );
      }
    }

    for (const [slug, score] of sealScores) {
      await prisma.sealProgress.upsert({
        where: { userId_sealSlug: { userId, sealSlug: slug } },
        create: { userId, sealSlug: slug, score, level: sealTier(score) },
        update: { score, level: sealTier(score) },
      });
    }

    // --- streak ---
    const dates = submissions
      .map((s) => {
        const d = s.createdAt;
        return new Date(
          Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()),
        ).getTime();
      })
      .filter((v, i, a) => a.indexOf(v) === i)
      .sort((a, b) => a - b);

    let currentStreak = 0;
    let longestStreak = 0;
    let lastDate: number | null = null;
    let runStreak = 0;

    for (const d of dates) {
      if (lastDate === null || d - lastDate > 86_400_000) {
        runStreak = 1;
      } else if (d - lastDate === 86_400_000) {
        runStreak += 1;
      }
      longestStreak = Math.max(longestStreak, runStreak);
      lastDate = d;
    }

    if (lastDate !== null) {
      const todayUTC = new Date(
        Date.UTC(
          new Date().getUTCFullYear(),
          new Date().getUTCMonth(),
          new Date().getUTCDate(),
        ),
      ).getTime();
      const daysSinceLast = Math.round((todayUTC - lastDate) / 86_400_000);
      currentStreak = daysSinceLast <= 1 ? runStreak : 0;
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        currentStreak,
        longestStreak,
        lastActiveDate: lastDate ? new Date(lastDate) : null,
      },
    });

    console.log(
      `  ${userId}: ${sealScores.size} seal(s), streak ${currentStreak}/${longestStreak}`,
    );
  }

  console.log("Done.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => void prisma.$disconnect());
