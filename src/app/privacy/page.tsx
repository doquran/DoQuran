import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy",
  description: "How DoQuran handles your data.",
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-2xl px-5 py-14 sm:px-8 sm:py-16">
      <h1 className="font-display text-3xl font-semibold text-[var(--dq-ink)]">
        Privacy policy
      </h1>
      <p className="mt-4 text-sm leading-relaxed text-[var(--dq-muted)]">
        <strong className="text-[var(--dq-ink)]">Summary.</strong> This page is a
        starter template for a small community app. Have it reviewed by qualified
        counsel before you operate commercially or at scale.
      </p>
      <div className="mt-10 space-y-6 text-sm leading-relaxed text-[var(--dq-ink)]">
        <section>
          <h2 className="font-display text-lg font-semibold text-[var(--dq-ink)]">
            What we collect
          </h2>
          <p className="mt-2 text-[var(--dq-muted)]">
            Account email, optional display name, password hash, session cookie,
            content you post (verse references and reflections), and votes you
            cast. Reports you file are stored for moderation.
          </p>
        </section>
        <section>
          <h2 className="font-display text-lg font-semibold text-[var(--dq-ink)]">
            How we use it
          </h2>
          <p className="mt-2 text-[var(--dq-muted)]">
            To run the site: authentication, showing posts and scores, and
            responding to abuse reports. Quranic text is fetched from Al Quran
            Cloud as described in the footer.
          </p>
        </section>
        <section>
          <h2 className="font-display text-lg font-semibold text-[var(--dq-ink)]">
            Retention & deletion
          </h2>
          <p className="mt-2 text-[var(--dq-muted)]">
            You can delete your account from Settings. That removes your user
            record and related posts and votes per database rules. Backups, if
            any, are your infrastructure provider&apos;s policy.
          </p>
        </section>
        <section>
          <h2 className="font-display text-lg font-semibold text-[var(--dq-ink)]">
            Contact
          </h2>
          <p className="mt-2 text-[var(--dq-muted)]">
            Add a support email or form before launch. Replace this section when
            you do.
          </p>
        </section>
      </div>
      <p className="mt-12 text-center text-sm text-[var(--dq-muted)]">
        <Link href="/" className="text-[var(--dq-primary)] underline">
          Home
        </Link>
      </p>
    </main>
  );
}
