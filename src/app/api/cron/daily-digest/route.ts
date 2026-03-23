import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getDailyVerse } from "@/lib/quran";
import { sendMail } from "@/lib/mail";
import { buildDailyDigestHtml } from "@/lib/email-templates";
import { scoreFromVotes } from "@/lib/submission-score";
import { baseUrl } from "@/lib/url";

/**
 * Daily digest cron endpoint.
 * On Vercel, add a cron job in vercel.json: { "crons": [{ "path": "/api/cron/daily-digest", "schedule": "0 6 * * *" }] }
 * Protected by CRON_SECRET to prevent unauthorized triggers.
 */
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = req.headers.get("authorization");
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const verse = await getDailyVerse();
  const base = baseUrl();

  // Yesterday's top reflection
  const yesterday = new Date(new Date().getTime() - 86_400_000);
  const startOfYesterday = new Date(yesterday);
  startOfYesterday.setUTCHours(0, 0, 0, 0);
  const endOfYesterday = new Date(yesterday);
  endOfYesterday.setUTCHours(23, 59, 59, 999);

  const yesterdaySubs = await prisma.submission.findMany({
    where: {
      createdAt: { gte: startOfYesterday, lte: endOfYesterday },
    },
    include: {
      user: { select: { name: true, email: true } },
      votes: { select: { value: true } },
      submissionBadges: { select: { badge: { select: { label: true } } } },
    },
    take: 50,
  });

  let topReflection: {
    author: string;
    snippet: string;
    seals: string[];
    score: number;
    href: string;
  } | null = null;

  if (yesterdaySubs.length > 0) {
    const sorted = yesterdaySubs
      .map((s) => ({ ...s, score: scoreFromVotes(s.votes) }))
      .sort((a, b) => b.score - a.score);
    const best = sorted[0];
    topReflection = {
      author: best.user.name?.trim() || best.user.email.split("@")[0],
      snippet:
        best.reflection.length > 180
          ? `${best.reflection.slice(0, 177)}...`
          : best.reflection,
      seals: best.submissionBadges.map((sb) => sb.badge.label),
      score: best.score,
      href: `${base}/submissions/${best.id}`,
    };
  }

  // Send to all verified users
  const users = await prisma.user.findMany({
    where: { emailVerified: true },
    select: {
      id: true,
      email: true,
      displayName: true,
      name: true,
      currentStreak: true,
      sealProgress: { select: { score: true } },
    },
  });

  let sent = 0;
  for (const user of users) {
    const displayName =
      user.displayName?.trim() || user.name?.trim() || user.email.split("@")[0];
    const totalUpvotes = user.sealProgress.reduce((s, p) => s + p.score, 0);
    const unreadNotifications = await prisma.notification.count({
      where: { userId: user.id, read: false },
    });

    const html = buildDailyDigestHtml({
      displayName,
      verse,
      topReflection,
      userStats: {
        totalUpvotes,
        currentStreak: user.currentStreak,
        unreadNotifications,
      },
      baseUrl: base,
    });

    try {
      await sendMail(user.email, "Your daily verse — DoQuran", html);
      sent++;
    } catch (err) {
      console.error(`[digest] Failed to send to ${user.email}:`, err);
    }
  }

  return NextResponse.json({ ok: true, sent, total: users.length });
}
