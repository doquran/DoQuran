import { ayahCountForSurah } from "@/lib/verse-meta";

/** Maximum distinct verses linked to one contribution. */
export const MAX_VERSES_PER_CONTRIBUTION = 20;

/** Parse lines like "2:255", "2:255, 3:1", with optional spaces. */
export function parseVerseRefs(input: string): { surah: number; ayah: number }[] {
  const raw = input
    .split(/[\n,]+/)
    .map((s) => s.trim())
    .filter(Boolean);
  const out: { surah: number; ayah: number }[] = [];
  const seen = new Set<string>();

  for (const part of raw) {
    const m = /^(\d{1,3})\s*:\s*(\d{1,3})$/.exec(part);
    if (!m) {
      throw new Error(
        `Invalid verse reference: "${part}". Use surah:ayah (e.g. 2:255).`
      );
    }
    const surah = Number(m[1]);
    const ayah = Number(m[2]);
    if (surah < 1 || surah > 114 || ayah < 1) {
      throw new Error(`Out of range: ${surah}:${ayah}. Surah must be 1–114.`);
    }
    const maxAyah = ayahCountForSurah(surah);
    if (ayah > maxAyah) {
      throw new Error(
        `Surah ${surah} has only ${maxAyah} verses; āyah ${ayah} does not exist.`
      );
    }
    const key = `${surah}:${ayah}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({ surah, ayah });
  }

  if (out.length === 0) {
    throw new Error("Add at least one verse in the form surah:ayah.");
  }
  if (out.length > MAX_VERSES_PER_CONTRIBUTION) {
    throw new Error(
      `At most ${MAX_VERSES_PER_CONTRIBUTION} verses per contribution.`
    );
  }
  return out;
}

export function tryParseVerseRefs(
  input: string
):
  | { ok: true; refs: { surah: number; ayah: number }[] }
  | { ok: false; error: string } {
  try {
    return { ok: true, refs: parseVerseRefs(input) };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Invalid verse references.",
    };
  }
}
