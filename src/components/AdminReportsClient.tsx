"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Report = {
  id: string;
  reason: string;
  status: string;
  adminNote: string | null;
  createdAt: string;
  resolvedAt: string | null;
  reporter: { id: string; email: string; name: string | null };
  submission: {
    id: string;
    reflection: string;
    userId: string;
    user: { email: string; name: string | null };
  } | null;
};

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    open: "border-amber-300 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-200",
    dismissed:
      "border-[var(--dq-border)] bg-[var(--dq-surface-muted)] text-[var(--dq-muted)]",
    actioned:
      "border-red-300 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-950/40 dark:text-red-200",
  };
  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-0.5 text-[0.7rem] font-bold uppercase tracking-[0.12em] ${colors[status] ?? colors.open}`}
    >
      {status}
    </span>
  );
}

export function AdminReportsClient() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [actioningId, setActioningId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/reports")
      .then((r) => r.json())
      .then((d: { reports: Report[] }) => setReports(d.reports))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function handleAction(
    reportId: string,
    action: "dismiss" | "remove_submission",
  ) {
    setActioningId(reportId);
    try {
      const res = await fetch(`/api/admin/reports/${reportId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      if (res.ok) {
        setReports((prev) =>
          prev.map((r) =>
            r.id === reportId
              ? {
                  ...r,
                  status: action === "dismiss" ? "dismissed" : "actioned",
                  resolvedAt: new Date().toISOString(),
                }
              : action === "remove_submission"
                ? r.submission?.id === prev.find((rr) => rr.id === reportId)?.submission?.id
                  ? { ...r, status: "actioned", resolvedAt: new Date().toISOString(), submission: null }
                  : r
                : r,
          ),
        );
      }
    } catch {
      /* network error */
    } finally {
      setActioningId(null);
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-32 animate-pulse rounded-xl bg-[var(--dq-muted-bg)]"
          />
        ))}
      </div>
    );
  }

  if (reports.length === 0) {
    return (
      <div className="dq-card border-dashed p-10 text-center">
        <p className="font-outfit text-sm text-[var(--dq-muted)]">
          No reports yet. The community is behaving well.
        </p>
      </div>
    );
  }

  const open = reports.filter((r) => r.status === "open");
  const resolved = reports.filter((r) => r.status !== "open");

  return (
    <div className="space-y-10">
      {open.length > 0 ? (
        <section>
          <h2 className="font-outfit mb-4 text-sm font-bold uppercase tracking-[0.14em] text-amber-700 dark:text-amber-400">
            Open reports ({open.length})
          </h2>
          <div className="space-y-4">
            {open.map((r) => (
              <ReportCard
                key={r.id}
                report={r}
                actioning={actioningId === r.id}
                onAction={handleAction}
              />
            ))}
          </div>
        </section>
      ) : null}

      {resolved.length > 0 ? (
        <section>
          <h2 className="font-outfit mb-4 text-sm font-bold uppercase tracking-[0.14em] text-[var(--dq-muted)]">
            Resolved ({resolved.length})
          </h2>
          <div className="space-y-4">
            {resolved.map((r) => (
              <ReportCard
                key={r.id}
                report={r}
                actioning={false}
                onAction={handleAction}
              />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}

function ReportCard({
  report,
  actioning,
  onAction,
}: {
  report: Report;
  actioning: boolean;
  onAction: (id: string, action: "dismiss" | "remove_submission") => void;
}) {
  const snippet = report.submission
    ? report.submission.reflection.length > 300
      ? `${report.submission.reflection.slice(0, 300)}…`
      : report.submission.reflection
    : null;

  return (
    <div className="dq-card p-5 sm:p-6">
      <div className="mb-3 flex flex-wrap items-center gap-2 text-xs">
        <StatusBadge status={report.status} />
        <span className="text-[var(--dq-muted)]">
          Reported by{" "}
          <strong className="text-[var(--dq-ink)]">
            {report.reporter.name || report.reporter.email.split("@")[0]}
          </strong>
        </span>
        <span className="text-[var(--dq-border)]">·</span>
        <time className="text-[var(--dq-muted)]">
          {new Date(report.createdAt).toLocaleDateString(undefined, {
            dateStyle: "medium",
          })}
        </time>
      </div>

      <p className="font-outfit mb-2 text-sm font-semibold text-[var(--dq-ink)]">
        Reason: <span className="font-normal">{report.reason}</span>
      </p>

      {report.submission ? (
        <div className="mb-4 rounded-lg border border-[var(--dq-border)] bg-[var(--dq-surface-muted)] p-4">
          <p className="mb-1 text-xs text-[var(--dq-muted)]">
            Post by{" "}
            <strong>
              {report.submission.user.name ||
                report.submission.user.email.split("@")[0]}
            </strong>
          </p>
          <p className="text-sm leading-relaxed text-[var(--dq-ink)]">
            {snippet}
          </p>
          <Link
            href={`/submissions/${report.submission.id}`}
            className="mt-2 inline-block text-xs font-medium text-[var(--dq-primary)] underline underline-offset-2"
          >
            View full post
          </Link>
        </div>
      ) : (
        <p className="mb-4 text-xs italic text-[var(--dq-muted)]">
          Submission has been removed.
        </p>
      )}

      {report.adminNote ? (
        <p className="mb-3 text-xs text-[var(--dq-muted)]">
          Admin note: {report.adminNote}
        </p>
      ) : null}

      {report.status === "open" ? (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={actioning}
            onClick={() => onAction(report.id, "dismiss")}
            className="font-outfit rounded-full border border-[var(--dq-border)] bg-[var(--dq-surface)] px-4 py-2 text-xs font-bold tracking-wide text-[var(--dq-ink)] shadow-sm transition hover:bg-[var(--dq-muted-bg)] disabled:opacity-50"
          >
            Dismiss
          </button>
          {report.submission ? (
            <button
              type="button"
              disabled={actioning}
              onClick={() => onAction(report.id, "remove_submission")}
              className="font-outfit rounded-full border border-red-300 bg-red-50 px-4 py-2 text-xs font-bold tracking-wide text-red-800 shadow-sm transition hover:bg-red-100 disabled:opacity-50 dark:border-red-800 dark:bg-red-950/40 dark:text-red-200 dark:hover:bg-red-950/60"
            >
              Remove post
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
