import { NextResponse } from "next/server";
import { fetchVerseBySurahAyah } from "@/lib/quran";
import { parseVerseRefs } from "@/lib/verse-parse";
import { rateLimitOrResponse } from "@/lib/rate-limit";

export async function POST(req: Request) {
  const limited = rateLimitOrResponse(req, "quran_preview", 40);
  if (limited) return limited;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const versesRaw =
    typeof (body as { versesRaw?: unknown }).versesRaw === "string"
      ? (body as { versesRaw: string }).versesRaw
      : "";

  let refs: { surah: number; ayah: number }[];
  try {
    refs = parseVerseRefs(versesRaw);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Invalid verses.";
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  const verses: {
    surah: number;
    ayah: number;
    surahName: string;
    arabic: string;
    english: string;
  }[] = [];

  for (const r of refs) {
    const v = await fetchVerseBySurahAyah(r.surah, r.ayah);
    if (!v) {
      return NextResponse.json(
        {
          error: `Could not load ${r.surah}:${r.ayah} from the Quran API. Try again.`,
        },
        { status: 502 }
      );
    }
    verses.push({
      surah: v.surah,
      ayah: v.ayah,
      surahName: v.surahName,
      arabic: v.arabic,
      english: v.english,
    });
  }

  return NextResponse.json({ verses });
}
