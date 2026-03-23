import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Why reflect?",
  description:
    "The Qur'an itself invites reflection. DoQuran is where modern professionals — scientists, engineers, physicians, scholars — answer that invitation together.",
};

type VerseSection = {
  arabic: string;
  english: string;
  ref: string;
  heading: string;
  body: string;
};

const sections: VerseSection[] = [
  {
    arabic: "أَفَلَا يَتَدَبَّرُونَ ٱلْقُرْءَانَ أَمْ عَلَىٰ قُلُوبٍ أَقْفَالُهَآ",
    english:
      "Do they not reflect upon the Qur\u2019an, or are there locks upon their hearts?",
    ref: "47:24",
    heading: "The invitation",
    body: "This is not a rhetorical flourish. It is a direct question from the Creator to every reader, in every century. The Qur\u2019an does not ask to be recited and shelved\u200a\u2014\u200ait asks to be engaged with, struggled with, understood. DoQuran exists because that question deserves a serious answer.",
  },
  {
    arabic:
      "كِتَـٰبٌ أَنزَلْنَـٰهُ إِلَيْكَ مُبَـٰرَكٌ لِّيَدَّبَّرُوٓا۟ ءَايَـٰتِهِۦ وَلِيَتَذَكَّرَ أُو۟لُوا۟ ٱلْأَلْبَـٰبِ",
    english:
      "A blessed Book We have revealed to you, that they might reflect upon its verses and that those of understanding would be reminded.",
    ref: "38:29",
    heading: "The promise",
    body: "Reflection is not merely encouraged\u200a\u2014\u200ait is the stated purpose of revelation. The phrase \u201cthose of understanding\u201d (\u0623\u064f\u0648\u0644\u064f\u0648\u0627\u200c \u0627\u0644\u0623\u0644\u0628\u0627\u0628) appears sixteen times in the Qur\u2019an, each time connecting intellect with spiritual depth. If you are a thinker, the Qur\u2019an is speaking directly to you.",
  },
  {
    arabic: "وَلَقَدْ يَسَّرْنَا ٱلْقُرْءَانَ لِلذِّكْرِ فَهَلْ مِن مُّدَّكِرٍ",
    english:
      "And We have certainly made the Qur\u2019an easy for remembrance, so is there any who will remember?",
    ref: "54:17",
    heading: "The accessibility",
    body: "This verse appears four times in S\u016brat al-Qamar\u200a\u2014\u200afour times. Reflection on the Qur\u2019an is not reserved for seminary graduates or Arabic linguists. It is a door held open for everyone: the physicist pondering the cosmos, the teacher shaping young minds, the physician witnessing the body\u2019s design. Your background is not a barrier. It is a lens.",
  },
  {
    arabic:
      "إِنَّ فِى خَلْقِ ٱلسَّمَـٰوَٰتِ وَٱلْأَرْضِ وَٱخْتِلَـٰفِ ٱلَّيْلِ وَٱلنَّهَارِ لَـَٔايَـٰتٍ لِّأُو۟لِى ٱلْأَلْبَـٰبِ",
    english:
      "Indeed, in the creation of the heavens and the earth and the alternation of the night and the day are signs for those of understanding.",
    ref: "3:190",
    heading: "The lenses",
    body: "The Qur\u2019an points to the natural world as evidence\u200a\u2014\u200athe stars, the seasons, the cycle of life. Who better to read these signs than those who study them for a living? A scientist\u2019s awe at molecular precision, an engineer\u2019s appreciation for structural elegance, a physician\u2019s wonder at the human body\u200a\u2014\u200athese are not secular reactions. They are exactly the reflection the Qur\u2019an invites.",
  },
  {
    arabic:
      "قُلْ هَلْ يَسْتَوِى ٱلَّذِينَ يَعْلَمُونَ وَٱلَّذِينَ لَا يَعْلَمُونَ",
    english:
      "Say, \u201cAre those who know equal to those who do not know?\u201d",
    ref: "39:9",
    heading: "The distinction",
    body: "Knowledge is honoured in the Qur\u2019an\u200a\u2014\u200anot as an abstract virtue, but as something that changes how you stand before God. DoQuran\u2019s recognition system (perspective seals, community votes, contributor tiers) is built on this principle: thoughtful engagement with the Qur\u2019an should be visible, celebrated, and shared. Your reflection matters, and the community will tell you when it helps them.",
  },
];

function SectionDivider() {
  return (
    <div className="dq-ornament my-12 justify-center sm:my-16">
      <span className="dq-ornament__line max-w-[2.5rem]" aria-hidden />
      <span className="dq-ornament__dot" aria-hidden />
      <span
        className="dq-ornament__line dq-ornament__line--r max-w-[2.5rem]"
        aria-hidden
      />
    </div>
  );
}

export default function WhyReflectPage() {
  return (
    <main className="mx-auto max-w-3xl px-5 py-14 sm:px-8 sm:py-20">
      {/* Header */}
      <div className="mb-16 text-center sm:mb-20">
        <p className="font-outfit mb-4 text-[0.65rem] font-bold uppercase tracking-[0.28em] text-[var(--dq-gold-muted)]">
          A question from the Creator
        </p>
        <h1 className="font-display text-[clamp(2.2rem,6vw,3.5rem)] font-semibold leading-[1.1] tracking-wide text-[var(--dq-ink)]">
          Why reflect?
        </h1>
        <p className="font-outfit mx-auto mt-5 max-w-xl text-base leading-[1.8] text-[var(--dq-muted)] sm:text-lg">
          The Qur&apos;an does not only ask to be read. It asks to be
          understood. These are its own words on why.
        </p>
      </div>

      {/* Verse sections */}
      {sections.map((s, i) => (
        <div key={s.ref}>
          {i > 0 ? <SectionDivider /> : null}
          <section className="text-center">
            <p className="font-outfit mb-6 text-[0.65rem] font-bold uppercase tracking-[0.22em] text-[var(--dq-gold-muted)]">
              {s.heading}
            </p>

            {/* Arabic verse */}
            <div className="mx-auto max-w-2xl rounded-[var(--dq-radius-lg)] border border-[color-mix(in_srgb,var(--dq-border)_80%,var(--dq-gold)_20%)] bg-[color-mix(in_srgb,var(--dq-primary)_4%,var(--dq-surface-muted))] px-6 py-8 sm:px-10 sm:py-10">
              <p
                className="font-quran text-[clamp(1.4rem,3.5vw,2rem)] leading-[2.1] text-[var(--dq-ink)]"
                dir="rtl"
              >
                {s.arabic}
              </p>
            </div>

            {/* English translation */}
            <blockquote className="mx-auto mt-6 max-w-xl">
              <p className="font-display text-lg font-medium italic leading-[1.7] text-[var(--dq-ink)] sm:text-xl">
                &ldquo;{s.english}&rdquo;
              </p>
              <p className="mt-2 text-sm font-medium text-[var(--dq-gold-muted)]">
                — {s.ref}
              </p>
            </blockquote>

            {/* Commentary */}
            <p className="font-outfit mx-auto mt-6 max-w-xl text-base leading-[1.85] text-[var(--dq-muted)]">
              {s.body}
            </p>
          </section>
        </div>
      ))}

      {/* Closing CTA */}
      <SectionDivider />
      <section className="text-center">
        <h2 className="font-display text-2xl font-semibold tracking-wide text-[var(--dq-ink)] sm:text-3xl">
          Begin reflecting
        </h2>
        <p className="font-outfit mx-auto mt-4 max-w-lg text-base leading-[1.8] text-[var(--dq-muted)]">
          DoQuran brings a new verse every day and a community of scientists,
          engineers, physicians, educators, and scholars who take that verse
          seriously. Your perspective is needed.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/register"
            className="font-outfit inline-flex min-h-11 items-center justify-center rounded-full bg-[var(--dq-primary)] px-8 py-3 text-sm font-bold tracking-wide text-[color-mix(in_srgb,white_95%,var(--dq-gold))] shadow-[var(--dq-shadow-primary)] ring-1 ring-[color-mix(in_srgb,var(--dq-gold)_30%,transparent)] transition duration-200 hover:brightness-110 active:scale-[0.98]"
          >
            Join the community
          </Link>
          <Link
            href="/"
            className="font-outfit inline-flex min-h-11 items-center justify-center rounded-full border border-[color-mix(in_srgb,var(--dq-border)_85%,var(--dq-gold)_15%)] bg-[var(--dq-surface)] px-6 py-3 text-sm font-bold tracking-wide text-[var(--dq-ink)] shadow-[var(--dq-shadow-sm)] transition hover:bg-[var(--dq-muted-bg)]"
          >
            See today&apos;s verse
          </Link>
        </div>
      </section>
    </main>
  );
}
