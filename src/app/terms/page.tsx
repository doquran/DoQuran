import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms",
  description: "Terms of use for DoQuran.",
};

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-2xl px-5 py-14 sm:px-8 sm:py-16">
      <h1 className="font-display text-3xl font-semibold text-[var(--dq-ink)]">
        Terms of use
      </h1>
      <p className="mt-4 text-sm leading-relaxed text-[var(--dq-muted)]">
        <strong className="text-[var(--dq-ink)]">Summary.</strong> Boilerplate
        for a hobby or early-stage product. Not legal advice — obtain proper
        terms for your jurisdiction and business model.
      </p>
      <div className="mt-10 space-y-6 text-sm leading-relaxed text-[var(--dq-ink)]">
        <section>
          <h2 className="font-display text-lg font-semibold text-[var(--dq-ink)]">
            The service
          </h2>
          <p className="mt-2 text-[var(--dq-muted)]">
            DoQuran offers daily Quranic text (via a third-party API) and a space
            for registered users to post reflections and vote. It is provided
            &quot;as is&quot; without warranties.
          </p>
        </section>
        <section>
          <h2 className="font-display text-lg font-semibold text-[var(--dq-ink)]">
            Your content
          </h2>
          <p className="mt-2 text-[var(--dq-muted)]">
            You are responsible for what you post. Do not post unlawful,
            harassing, or infringing material. You grant the site permission to
            host and display your submissions in connection with operating the
            service (adjust as needed for your product).
          </p>
        </section>
        <section>
          <h2 className="font-display text-lg font-semibold text-[var(--dq-ink)]">
            Moderation
          </h2>
          <p className="mt-2 text-[var(--dq-muted)]">
            Reports may be reviewed manually. You may remove or restrict content
            or accounts that violate these terms or harm the community.
          </p>
        </section>
        <section>
          <h2 className="font-display text-lg font-semibold text-[var(--dq-ink)]">
            Liability
          </h2>
          <p className="mt-2 text-[var(--dq-muted)]">
            Limit liability and disclaim religious scholarship appropriately for
            your app — a lawyer should tailor this section.
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
