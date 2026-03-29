import Link from "next/link";
import { redirect } from "next/navigation";
import { ChangePasswordForm } from "@/components/ChangePasswordForm";
import { DeleteAccountForm } from "@/components/DeleteAccountForm";
import { ProfileEditForm } from "@/components/ProfileEditForm";
import { ResendVerificationButton } from "@/components/ResendVerificationButton";
import { getSessionUserId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Settings" };

export default async function SettingsPage() {
  const userId = await getSessionUserId();
  if (!userId) redirect("/login?next=/settings");

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      displayName: true,
      bio: true,
      avatarSeed: true,
      emailVerified: true,
    },
  });
  if (!user) redirect("/login");

  return (
    <main className="mx-auto max-w-lg px-5 py-14 sm:px-8 sm:py-16">
      <h1 className="font-display text-2xl font-semibold tracking-wide text-[var(--dq-ink)]">
        Settings
      </h1>
      <p className="mt-2 text-sm text-[var(--dq-muted)]">
        Signed in as{" "}
        <span className="font-medium text-[var(--dq-ink)]">{user.email}</span>
        {user.name ? (
          <>
            {" "}
            ({user.name})
          </>
        ) : null}
        <span className="mx-1.5 text-[var(--dq-border)]">·</span>
        <Link
          href={`/profile/${user.id}`}
          className="font-medium text-[var(--dq-primary)] underline decoration-[color-mix(in_srgb,var(--dq-gold)_35%,var(--dq-border))] underline-offset-[3px] transition hover:decoration-[var(--dq-gold)]"
        >
          View profile
        </Link>
      </p>

      {!user.emailVerified ? (
        <section className="mt-8 rounded-[var(--dq-radius-lg)] border border-amber-200/80 bg-amber-50/90 p-5 text-amber-950 dark:border-amber-900 dark:bg-amber-950/50 dark:text-amber-100">
          <p className="font-outfit text-sm font-semibold">
            Your email is not verified.
          </p>
          <p className="mt-1 text-sm opacity-90">
            You need to verify your email before you can contribute reflections.
          </p>
          <div className="mt-3">
            <ResendVerificationButton />
          </div>
        </section>
      ) : null}

      <section className="mt-10">
        <h2 className="font-display mb-5 text-lg font-semibold tracking-wide text-[var(--dq-ink)]">
          Profile
        </h2>
        <ProfileEditForm
          initialDisplayName={user.displayName ?? user.name ?? ""}
          initialBio={user.bio ?? ""}
          avatarSeed={user.avatarSeed}
        />
      </section>

      <section className="mt-14 border-t border-[color-mix(in_srgb,var(--dq-border)_85%,var(--dq-gold)_15%)] pt-10">
        <h2 className="font-display mb-5 text-lg font-semibold tracking-wide text-[var(--dq-ink)]">
          Security
        </h2>
        <ChangePasswordForm />
      </section>

      <section className="mt-14 border-t border-[color-mix(in_srgb,var(--dq-border)_85%,var(--dq-gold)_15%)] pt-10">
        <h2 className="font-display mb-5 text-lg font-semibold tracking-wide text-red-700 dark:text-red-400">
          Danger zone
        </h2>
        <DeleteAccountForm />
      </section>
    </main>
  );
}
