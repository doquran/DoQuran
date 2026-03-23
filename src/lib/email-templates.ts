import type { DailyVerse } from "@/lib/quran";

type DigestData = {
  displayName: string;
  verse: DailyVerse | null;
  topReflection: {
    author: string;
    snippet: string;
    seals: string[];
    score: number;
    href: string;
  } | null;
  userStats: {
    totalUpvotes: number;
    currentStreak: number;
    unreadNotifications: number;
  };
  baseUrl: string;
};

export function buildDailyDigestHtml(data: DigestData): string {
  const { displayName, verse, topReflection, userStats, baseUrl } = data;

  const verseBlock = verse
    ? `
      <tr><td style="padding:0 32px">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#f7f5f0;border-radius:12px;border:1px solid #e8e2d4;margin:24px 0">
          <tr><td style="padding:28px 24px;text-align:center">
            <p style="margin:0 0 4px;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#8b7d5e;font-family:'Helvetica Neue',Arial,sans-serif">Today&rsquo;s Verse &middot; ${verse.surahNumber}:${verse.ayahInSurah}</p>
            <p style="margin:0 0 2px;font-size:13px;color:#6b5e45;font-family:'Helvetica Neue',Arial,sans-serif">${verse.surahName}</p>
          </td></tr>
          <tr><td style="padding:0 24px 20px;text-align:center">
            <p style="margin:0;font-size:24px;line-height:2;direction:rtl;color:#1a3a2a;font-family:'Traditional Arabic','Scheherazade New',serif">${verse.arabic}</p>
          </td></tr>
          <tr><td style="padding:0 24px 28px;text-align:center;border-top:1px solid #e8e2d4">
            <p style="margin:16px 0 0;font-size:15px;line-height:1.7;color:#1a3a2a;font-family:Georgia,'Times New Roman',serif;font-style:italic">&ldquo;${verse.english}&rdquo;</p>
          </td></tr>
        </table>
      </td></tr>`
    : "";

  const reflectionBlock = topReflection
    ? `
      <tr><td style="padding:0 32px">
        <p style="margin:0 0 12px;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#8b7d5e;font-family:'Helvetica Neue',Arial,sans-serif">Yesterday&rsquo;s Top Reflection</p>
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;border:1px solid #e8e2d4;margin:0 0 24px">
          <tr><td style="padding:24px">
            <p style="margin:0 0 8px;font-size:13px;color:#6b5e45;font-family:'Helvetica Neue',Arial,sans-serif">
              <strong style="color:#1a3a2a">${topReflection.author}</strong>${topReflection.seals.length ? ` &middot; ${topReflection.seals.join(", ")}` : ""} &middot; +${topReflection.score}
            </p>
            <p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:#1a3a2a;font-family:Georgia,'Times New Roman',serif">&ldquo;${topReflection.snippet}&rdquo;</p>
            <a href="${topReflection.href}" style="display:inline-block;padding:10px 24px;background:#1a3a2a;color:#f0e9d8;font-size:13px;font-weight:700;letter-spacing:0.5px;text-decoration:none;border-radius:999px;font-family:'Helvetica Neue',Arial,sans-serif">Read full reflection &rarr;</a>
          </td></tr>
        </table>
      </td></tr>`
    : "";

  const statsBlock =
    userStats.totalUpvotes > 0 || userStats.currentStreak > 0
      ? `
      <tr><td style="padding:0 32px 24px">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td width="33%" style="text-align:center;padding:16px 8px;background:#f7f5f0;border-radius:8px">
              <p style="margin:0;font-size:22px;font-weight:700;color:#1a3a2a;font-family:'Helvetica Neue',Arial,sans-serif">${userStats.totalUpvotes}</p>
              <p style="margin:4px 0 0;font-size:10px;letter-spacing:1.5px;text-transform:uppercase;color:#8b7d5e;font-family:'Helvetica Neue',Arial,sans-serif">Upvotes</p>
            </td>
            <td width="6"></td>
            <td width="33%" style="text-align:center;padding:16px 8px;background:#f7f5f0;border-radius:8px">
              <p style="margin:0;font-size:22px;font-weight:700;color:#1a3a2a;font-family:'Helvetica Neue',Arial,sans-serif">${userStats.currentStreak}</p>
              <p style="margin:4px 0 0;font-size:10px;letter-spacing:1.5px;text-transform:uppercase;color:#8b7d5e;font-family:'Helvetica Neue',Arial,sans-serif">Day streak</p>
            </td>
            <td width="6"></td>
            <td width="33%" style="text-align:center;padding:16px 8px;background:#f7f5f0;border-radius:8px">
              <p style="margin:0;font-size:22px;font-weight:700;color:#1a3a2a;font-family:'Helvetica Neue',Arial,sans-serif">${userStats.unreadNotifications}</p>
              <p style="margin:4px 0 0;font-size:10px;letter-spacing:1.5px;text-transform:uppercase;color:#8b7d5e;font-family:'Helvetica Neue',Arial,sans-serif">New activity</p>
            </td>
          </tr>
        </table>
      </td></tr>`
      : "";

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f0ebe1;font-family:'Helvetica Neue',Arial,sans-serif">
<center>
<table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;background:#faf8f5;border-radius:16px;overflow:hidden;margin-top:32px;margin-bottom:32px;box-shadow:0 2px 16px rgba(0,0,0,0.06)">
  <!-- Header -->
  <tr><td style="padding:36px 32px 20px;text-align:center;border-bottom:1px solid #e8e2d4">
    <p style="margin:0 0 4px;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#8b7d5e">Daily Reflection</p>
    <h1 style="margin:0;font-size:28px;font-weight:600;color:#1a3a2a;font-family:Georgia,'Times New Roman',serif;letter-spacing:0.5px">DoQuran</h1>
  </td></tr>

  <!-- Quranic pull-quote -->
  <tr><td style="padding:28px 32px 0;text-align:center">
    <p style="margin:0;font-size:20px;line-height:2;direction:rtl;color:#1a3a2a;font-family:'Traditional Arabic','Scheherazade New',serif">إِنَّ فِى خَلْقِ ٱلسَّمَـٰوَٰتِ وَٱلْأَرْضِ وَٱخْتِلَـٰفِ ٱلَّيْلِ وَٱلنَّهَارِ لَءَايَـٰتٍۢ لِّأُو۟لِى ٱلْأَلْبَـٰبِ</p>
    <p style="margin:8px 0 0;font-size:13px;line-height:1.6;color:#8b7d5e;font-style:italic;font-family:Georgia,'Times New Roman',serif">&ldquo;Indeed, in the creation of the heavens and the earth and the alternation of the night and the day are signs for those of understanding.&rdquo; <span style="font-style:normal;color:#a89e8a">&mdash; 3:190, Sahih International</span></p>
  </td></tr>

  <!-- Greeting -->
  <tr><td style="padding:20px 32px 0">
    <p style="margin:0;font-size:16px;line-height:1.6;color:#1a3a2a;font-family:Georgia,'Times New Roman',serif">Salaam, <strong>${displayName}</strong>.</p>
    <p style="margin:8px 0 0;font-size:14px;line-height:1.6;color:#6b5e45;font-family:'Helvetica Neue',Arial,sans-serif">Here is your daily verse and a look at what the community shared.</p>
  </td></tr>

  ${verseBlock}
  ${reflectionBlock}
  ${statsBlock}

  <!-- CTA -->
  <tr><td style="padding:8px 32px 32px;text-align:center">
    <a href="${baseUrl}/contribute" style="display:inline-block;padding:14px 32px;background:#1a3a2a;color:#f0e9d8;font-size:14px;font-weight:700;letter-spacing:0.5px;text-decoration:none;border-radius:999px;font-family:'Helvetica Neue',Arial,sans-serif">Write today&rsquo;s reflection</a>
  </td></tr>

  <!-- Footer -->
  <tr><td style="padding:24px 32px;text-align:center;border-top:1px solid #e8e2d4;background:#f7f5f0">
    <p style="margin:0 0 8px;font-size:12px;color:#8b7d5e;font-family:'Helvetica Neue',Arial,sans-serif">
      <a href="${baseUrl}" style="color:#1a3a2a;text-decoration:underline">DoQuran</a> &middot;
      <a href="${baseUrl}/settings" style="color:#8b7d5e;text-decoration:underline">Settings</a> &middot;
      <a href="${baseUrl}/about" style="color:#8b7d5e;text-decoration:underline">About</a>
    </p>
    <p style="margin:0;font-size:11px;color:#a89e8a;font-family:'Helvetica Neue',Arial,sans-serif">Where the Qur&rsquo;an meets modern expertise.</p>
  </td></tr>
</table>
</center>
</body>
</html>`;
}
