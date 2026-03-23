export const TOTAL_AYAH = 6236;

/** Stable daily pick: same UTC calendar day maps to the same global āyah (1–6236). */
export function getDailyAyahNumber(date = new Date()): number {
  const days = Math.floor(date.getTime() / 86_400_000);
  return (days % TOTAL_AYAH) + 1;
}

export type DailyVerse = {
  globalNumber: number;
  surahNumber: number;
  surahName: string;
  ayahInSurah: number;
  arabic: string;
  english: string;
};

type EditionRow = {
  text: string;
  number: number;
  numberInSurah: number;
  surah: { number: number; englishName: string };
  edition: { identifier: string; englishName: string };
};

export async function fetchVerseByGlobalNumber(
  n: number
): Promise<DailyVerse | null> {
  const url = `https://api.alquran.cloud/v1/ayah/${n}/editions/quran-uthmani,en.sahih`;
  const res = await fetch(url, { next: { revalidate: 86_400 } });
  if (!res.ok) return null;
  const json = (await res.json()) as {
    code: number;
    data?: EditionRow[];
  };
  if (json.code !== 200 || !json.data?.length) return null;
  const arabic =
    json.data.find((e) => e.edition.identifier === "quran-uthmani")?.text ??
    "";
  const english =
    json.data.find((e) => e.edition.identifier === "en.sahih")?.text ?? "";
  const meta = json.data[0];
  return {
    globalNumber: meta.number,
    surahNumber: meta.surah.number,
    surahName: meta.surah.englishName,
    ayahInSurah: meta.numberInSurah,
    arabic,
    english,
  };
}

export async function getDailyVerse(date = new Date()) {
  const num = getDailyAyahNumber(date);
  const verse = await fetchVerseByGlobalNumber(num);
  return verse;
}

export type SurahAyahVerse = {
  surah: number;
  ayah: number;
  surahName: string;
  arabic: string;
  english: string;
};

/** Fetch Arabic + English for a surah:ayah pair (Al Quran Cloud). */
export async function fetchVerseBySurahAyah(
  surah: number,
  ayah: number
): Promise<SurahAyahVerse | null> {
  const url = `https://api.alquran.cloud/v1/ayah/${surah}:${ayah}/editions/quran-uthmani,en.sahih`;
  const res = await fetch(url, { next: { revalidate: 86_400 } });
  if (!res.ok) return null;
  const json = (await res.json()) as {
    code: number;
    data?: EditionRow[];
  };
  if (json.code !== 200 || !json.data?.length) return null;
  const arabic =
    json.data.find((e) => e.edition.identifier === "quran-uthmani")?.text ??
    "";
  const english =
    json.data.find((e) => e.edition.identifier === "en.sahih")?.text ?? "";
  const meta = json.data[0];
  return {
    surah: meta.surah.number,
    ayah: meta.numberInSurah,
    surahName: meta.surah.englishName,
    arabic,
    english,
  };
}
