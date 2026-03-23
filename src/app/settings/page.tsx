import { redirect } from "next/navigation";
import { DeleteAccountForm } from "@/components/DeleteAccountForm";
import { getSessionUserId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Settings" };

export default async function SettingsPage() {
  const userId = await getSessionUserId();
  if (!userId) redirect("/login?next=/settings");

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true, name: true },
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
      </p>
      <div className="mt-10">
        <DeleteAccountForm />
      </div>
    </main>
  );
}
