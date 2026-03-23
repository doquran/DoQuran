import Link from "next/link";
import { notFound } from "next/navigation";
import { ReportSubmission } from "@/components/ReportSubmission";
import { VotePanel } from "@/components/VotePanel";
import { getSessionUserId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { scoreFromVotes } from "@/lib/submission-score";

export const metadata = { title: "Contribution" };

type PageProps = { params: Promise<{ id: string }> };

function verseLabel(v: { surah: number; ayah: number }) {
  return `${v.surah}:${v.ayah}`;
}

export default async function SubmissionPage({ params }: PageProps) {
  const { id } = await params;
  const userId = await getSessionUserId();

  const s = await prisma.submission.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, name: true, email: true } },
      verses: true,
      votes: true,
    },
  });

  if (!s) notFound();

  const score = scoreFromVotes(s.votes);
  const myVote = userId
    ? (s.votes.find((v) => v.userId === userId)?.value ?? null)
    : null;
  const refs = s.verses.map(verseLabel).join(", ");
  const author = s.user.name?.trim() || s.user.email.split("@")[0];
  const isOwner = userId === s.user.id;
  const voteDisabledReason = isOwner
    ? "You cannot vote on your own post."
    : null;

  return (
    <main className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-16">
      <Link
        href="/"
        className="mb-10 inline-flex items-center gap-2 rounded-full border border-[color-mix(in_srgb,var(--dq-border)_85%,var(--dq-gold)_15%)] bg-[var(--dq-surface)] px-4 py-2 text-sm font-medium tracking-wide text-[var(--dq-muted)] shadow-[var(--dq-shadow-sm)] transition hover:border-[color-mix(in_srgb,var(--dq-primary)_22%,var(--dq-border))] hover:text-[var(--dq-primary)]"
      >
        <span aria-hidden>←</span> Back to home
      </Link>
      <div className="flex flex-col gap-10 sm:flex-row sm:items-start sm:justify-center">
        <div className="flex justify-center sm:justify-start">
          <VotePanel
            submissionId={s.id}
            initialScore={score}
            initialMyVote={myVote}
            voteDisabledReason={voteDisabledReason}
          />
        </div>
        <article className="dq-card min-w-0 max-w-3xl flex-1 p-7 sm:p-10">
          <header className="mb-8 border-b border-[color-mix(in_srgb,var(--dq-border)_88%,var(--dq-gold)_12%)] pb-8 text-center sm:text-left">
            <p className="mb-2 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-[var(--dq-gold-muted)]">
              Verses
            </p>
            <p className="font-mono text-xl font-semibold tracking-wide text-[var(--dq-ink)] sm:text-2xl">
              {refs}
            </p>
            <p className="mt-4 text-sm tracking-wide text-[var(--dq-muted)]">
              <span className="font-medium text-[var(--dq-ink)]">{author}</span>
              <span className="mx-2 text-[var(--dq-border)]">·</span>
              {s.createdAt.toLocaleDateString(undefined, {
                dateStyle: "long",
              })}
            </p>
          </header>
          <section>
            <h2 className="mb-4 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-[var(--dq-gold-muted)]">
              Thoughts
            </h2>
            <p className="whitespace-pre-wrap text-base leading-[1.8] text-[var(--dq-ink)]">
              {s.reflection}
            </p>
          </section>
        </article>
      </div>
      <div className="mt-12 space-y-4">
        <p className="text-center text-xs tracking-wide text-[var(--dq-muted)]">
          Click the same arrow again to retract your vote.
        </p>
        {userId && !isOwner ? (
          <ReportSubmission submissionId={s.id} />
        ) : !userId ? (
          <p className="text-center text-xs text-[var(--dq-muted)]">
            <Link
              href={`/login?next=/submissions/${s.id}`}
              className="text-[var(--dq-primary)] underline underline-offset-2"
            >
              Sign in
            </Link>{" "}
            to report a problem with this post.
          </p>
        ) : null}
      </div>
    </main>
  );
}
