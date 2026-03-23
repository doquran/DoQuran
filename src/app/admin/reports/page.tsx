import { redirect } from "next/navigation";
import { AdminReportsClient } from "@/components/AdminReportsClient";
import { requireAdmin } from "@/lib/admin";

export const metadata = { title: "Admin — Reports" };

export default async function AdminReportsPage() {
  const adminId = await requireAdmin();
  if (!adminId) redirect("/");

  return (
    <main className="mx-auto max-w-5xl px-5 py-14 sm:px-8 sm:py-16">
      <h1 className="font-display text-2xl font-semibold tracking-wide text-[var(--dq-ink)]">
        Moderation queue
      </h1>
      <p className="mt-2 text-sm text-[var(--dq-muted)]">
        Review user reports and take action on flagged content.
      </p>
      <div className="mt-8">
        <AdminReportsClient />
      </div>
    </main>
  );
}
